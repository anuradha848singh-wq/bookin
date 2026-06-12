import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/analytics
 * Comprehensive analytics endpoint for the dashboard.
 * 
 * Query params:
 *   - period: 7d | 30d | 90d | 12m | custom (default: 30d)
 *   - from: ISO date string (for custom)
 *   - to: ISO date string (for custom)
 */
export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    // Compute date range
    let fromDate: Date;
    let toDate = new Date();
    let prevFromDate: Date;
    let prevToDate: Date;

    if (period === "custom" && fromParam && toParam) {
      fromDate = new Date(fromParam);
      toDate = new Date(toParam);
    } else {
      const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "12m" ? 365 : 30;
      fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    }

    // Previous period for comparison (same length, before fromDate)
    const periodLength = toDate.getTime() - fromDate.getTime();
    prevFromDate = new Date(fromDate.getTime() - periodLength);
    prevToDate = fromDate;

    // ─── Run all queries in parallel ───────────────────────────────────────────

    const [
      currentPeriodStats,
      previousPeriodStats,
      bookingsByDay,
      bookingsByStatus,
      topServices,
      topStaff,
      clientAcquisition,
      revenueByDay,
      clientRetention,
      recentBookings,
    ] = await Promise.all([

      // Current period: core KPIs
      tenantDb.$queryRaw<any[]>`
        SELECT
          COUNT(*) as total_bookings,
          COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_bookings,
          COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled_bookings,
          COUNT(*) FILTER (WHERE status = 'NO_SHOW') as no_show_bookings,
          COUNT(*) FILTER (WHERE status = 'PENDING') as pending_bookings,
          COALESCE(SUM(price) FILTER (WHERE status NOT IN ('CANCELLED')), 0) as gross_revenue,
          COALESCE(SUM(total_paid), 0) as collected_revenue,
          COALESCE(AVG(price) FILTER (WHERE status NOT IN ('CANCELLED')), 0) as avg_booking_value,
          COUNT(DISTINCT client_id) as unique_clients
        FROM bookings
        WHERE starts_at >= ${fromDate} AND starts_at < ${toDate};
      `,

      // Previous period: same KPIs for trend comparison
      tenantDb.$queryRaw<any[]>`
        SELECT
          COUNT(*) as total_bookings,
          COALESCE(SUM(price) FILTER (WHERE status NOT IN ('CANCELLED')), 0) as gross_revenue,
          COUNT(DISTINCT client_id) as unique_clients
        FROM bookings
        WHERE starts_at >= ${prevFromDate} AND starts_at < ${prevToDate};
      `,

      // Bookings per day (for line chart)
      tenantDb.$queryRaw<any[]>`
        SELECT
          DATE(starts_at AT TIME ZONE 'UTC') as date,
          COUNT(*) as bookings,
          COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
          COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled
        FROM bookings
        WHERE starts_at >= ${fromDate} AND starts_at < ${toDate}
        GROUP BY DATE(starts_at AT TIME ZONE 'UTC')
        ORDER BY date ASC;
      `,

      // Status breakdown (for pie/donut chart)
      tenantDb.$queryRaw<any[]>`
        SELECT status, COUNT(*) as count
        FROM bookings
        WHERE starts_at >= ${fromDate} AND starts_at < ${toDate}
        GROUP BY status
        ORDER BY count DESC;
      `,

      // Top services by bookings and revenue
      tenantDb.$queryRaw<any[]>`
        SELECT
          s.name as service_name,
          s.price as unit_price,
          COUNT(b.id) as booking_count,
          COALESCE(SUM(b.price) FILTER (WHERE b.status NOT IN ('CANCELLED')), 0) as revenue,
          ROUND(AVG(b.price), 2) as avg_price,
          COUNT(b.id) FILTER (WHERE b.status = 'COMPLETED') as completed_count
        FROM bookings b
        INNER JOIN services s ON b.service_id = s.id
        WHERE b.starts_at >= ${fromDate} AND b.starts_at < ${toDate}
        GROUP BY s.id, s.name, s.price
        ORDER BY booking_count DESC
        LIMIT 8;
      `,

      // Top staff by bookings
      tenantDb.$queryRaw<any[]>`
        SELECT
          COALESCE(st.first_name || ' ' || st.last_name, 'Unassigned') as staff_name,
          COUNT(b.id) as booking_count,
          COALESCE(SUM(b.price) FILTER (WHERE b.status NOT IN ('CANCELLED')), 0) as revenue,
          COUNT(b.id) FILTER (WHERE b.status = 'COMPLETED') as completed_count,
          COUNT(b.id) FILTER (WHERE b.status = 'NO_SHOW') as no_show_count,
          ROUND(
            100.0 * COUNT(b.id) FILTER (WHERE b.status = 'COMPLETED') / NULLIF(COUNT(b.id), 0), 1
          ) as completion_rate
        FROM bookings b
        LEFT JOIN staff st ON b.staff_id = st.id
        WHERE b.starts_at >= ${fromDate} AND b.starts_at < ${toDate}
        GROUP BY st.id, st.first_name, st.last_name
        ORDER BY booking_count DESC
        LIMIT 8;
      `,

      // New vs returning clients
      tenantDb.$queryRaw<any[]>`
        SELECT
          DATE(c.created_at AT TIME ZONE 'UTC') as date,
          COUNT(*) as new_clients
        FROM clients c
        WHERE c.created_at >= ${fromDate} AND c.created_at < ${toDate}
          AND c.deleted_at IS NULL
        GROUP BY DATE(c.created_at AT TIME ZONE 'UTC')
        ORDER BY date ASC;
      `,

      // Revenue per day (for area chart)
      tenantDb.$queryRaw<any[]>`
        SELECT
          DATE(starts_at AT TIME ZONE 'UTC') as date,
          COALESCE(SUM(price) FILTER (WHERE status NOT IN ('CANCELLED')), 0) as gross_revenue,
          COALESCE(SUM(total_paid), 0) as collected_revenue
        FROM bookings
        WHERE starts_at >= ${fromDate} AND starts_at < ${toDate}
        GROUP BY DATE(starts_at AT TIME ZONE 'UTC')
        ORDER BY date ASC;
      `,

      // Client retention: how many clients booked more than once
      tenantDb.$queryRaw<any[]>`
        SELECT
          COUNT(*) FILTER (WHERE booking_count = 1) as first_time_clients,
          COUNT(*) FILTER (WHERE booking_count > 1) as returning_clients,
          COUNT(*) FILTER (WHERE booking_count >= 5) as loyal_clients,
          ROUND(AVG(booking_count), 1) as avg_bookings_per_client,
          MAX(booking_count) as max_bookings_per_client
        FROM (
          SELECT client_id, COUNT(*) as booking_count
          FROM bookings
          WHERE status NOT IN ('CANCELLED')
          GROUP BY client_id
        ) client_stats;
      `,

      // Recent bookings list
      tenantDb.$queryRaw<any[]>`
        SELECT
          b.id, b.reference_number, b.status, b.payment_status,
          b.starts_at, b.ends_at, b.price, b.total_paid,
          c.first_name as client_first_name, c.last_name as client_last_name, c.email as client_email,
          s.name as service_name, s.duration_minutes,
          COALESCE(st.first_name || ' ' || st.last_name, 'TBD') as staff_name
        FROM bookings b
        LEFT JOIN clients c ON b.client_id = c.id
        LEFT JOIN services s ON b.service_id = s.id
        LEFT JOIN staff st ON b.staff_id = st.id
        WHERE b.starts_at >= ${fromDate}
        ORDER BY b.starts_at DESC
        LIMIT 20;
      `,
    ]);

    // Calculate trends (percentage change vs previous period)
    const current = currentPeriodStats[0] || {};
    const previous = previousPeriodStats[0] || {};

    const calcTrend = (curr: number, prev: number): number => {
      if (!prev || prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const bookingsTrend = calcTrend(Number(current.total_bookings), Number(previous.total_bookings));
    const revenueTrend = calcTrend(Number(current.gross_revenue), Number(previous.gross_revenue));
    const clientsTrend = calcTrend(Number(current.unique_clients), Number(previous.unique_clients));

    return NextResponse.json({
      success: true,
      period: { from: fromDate.toISOString(), to: toDate.toISOString() },
      kpis: {
        totalBookings: Number(current.total_bookings || 0),
        completedBookings: Number(current.completed_bookings || 0),
        cancelledBookings: Number(current.cancelled_bookings || 0),
        noShowBookings: Number(current.no_show_bookings || 0),
        pendingBookings: Number(current.pending_bookings || 0),
        grossRevenue: Number(current.gross_revenue || 0),
        collectedRevenue: Number(current.collected_revenue || 0),
        avgBookingValue: Number(current.avg_booking_value || 0),
        uniqueClients: Number(current.unique_clients || 0),
        completionRate: current.total_bookings > 0
          ? Math.round((Number(current.completed_bookings) / Number(current.total_bookings)) * 100)
          : 0,
        trends: {
          bookings: bookingsTrend,
          revenue: revenueTrend,
          clients: clientsTrend,
        },
      },
      charts: {
        bookingsByDay: bookingsByDay.map((r: any) => ({
          date: r.date,
          bookings: Number(r.bookings),
          completed: Number(r.completed),
          cancelled: Number(r.cancelled),
        })),
        revenueByDay: revenueByDay.map((r: any) => ({
          date: r.date,
          gross: Number(r.gross_revenue),
          collected: Number(r.collected_revenue),
        })),
        bookingsByStatus: bookingsByStatus.map((r: any) => ({
          status: r.status,
          count: Number(r.count),
        })),
        clientAcquisition: clientAcquisition.map((r: any) => ({
          date: r.date,
          newClients: Number(r.new_clients),
        })),
      },
      tables: {
        topServices: topServices.map((r: any) => ({
          name: r.service_name,
          bookings: Number(r.booking_count),
          revenue: Number(r.revenue),
          avgPrice: Number(r.avg_price),
          completed: Number(r.completed_count),
        })),
        topStaff: topStaff.map((r: any) => ({
          name: r.staff_name,
          bookings: Number(r.booking_count),
          revenue: Number(r.revenue),
          completed: Number(r.completed_count),
          noShows: Number(r.no_show_count),
          completionRate: Number(r.completion_rate || 0),
        })),
        recentBookings: recentBookings.map((r: any) => ({
          id: r.id,
          reference: r.reference_number,
          clientName: `${r.client_first_name || ""} ${r.client_last_name || ""}`.trim(),
          clientEmail: r.client_email,
          service: r.service_name,
          duration: r.duration_minutes,
          staffName: r.staff_name,
          startsAt: r.starts_at,
          status: r.status,
          paymentStatus: r.payment_status,
          price: Number(r.price || 0),
          paid: Number(r.total_paid || 0),
        })),
      },
      retention: clientRetention[0] ? {
        firstTimeClients: Number(clientRetention[0].first_time_clients || 0),
        returningClients: Number(clientRetention[0].returning_clients || 0),
        loyalClients: Number(clientRetention[0].loyal_clients || 0),
        avgBookingsPerClient: Number(clientRetention[0].avg_bookings_per_client || 0),
      } : null,
    });
  } catch (error: any) {
    console.error("[GET_ANALYTICS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
});
