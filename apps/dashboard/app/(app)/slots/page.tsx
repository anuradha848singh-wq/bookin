"use client";

import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon, ClockIcon, UserIcon, InfoIcon } from "lucide-react";

export default function SlotTesterPage() {
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [tenant, setTenant] = useState("");
  
  const [selectedService, setSelectedService] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/catalog/services").then(r => r.json()),
      fetch("/api/v1/staff").then(r => r.json()),
      fetch("/api/auth/session").then(r => r.json())
    ]).then(([srvRes, staffRes, sessionRes]) => {
      if (srvRes.success) setServices(srvRes.services);
      if (staffRes.success) setStaff(staffRes.staff);
    });
  }, []);

  const fetchAvailability = async () => {
    if (!selectedService || !selectedDate) {
      setError("Please select a service and a date.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSlots([]);

    try {
      const url = new URL(window.location.origin + "/api/v1/availability");
      url.searchParams.append("service_id", selectedService);
      url.searchParams.append("date", selectedDate);
      url.searchParams.append("tenant", "demo"); 
      
      if (selectedStaff) {
        url.searchParams.append("staff_id", selectedStaff);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch slots");
      setSlots(data.slots || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Availability Engine Tester</h1>
        <p className="text-gray-500 mt-2">Test the Phase 6 interval-intersection slot generator end-to-end.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Service (Required)</label>
          <select 
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 border bg-white"
          >
            <option value="">-- Select Service --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes}m)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Staff (Optional)</label>
          <select 
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 border bg-white"
          >
            <option value="">Any Available Staff</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
        </div>
        
        <div className="col-span-1 md:col-span-3 flex justify-end">
          <button 
            onClick={fetchAvailability}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Slots"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" /> Generated Time Slots
        </h3>
        
        {slots.length === 0 && !loading && !error ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center">
            <InfoIcon className="w-12 h-12 text-gray-300 mb-3" />
            <p>No available slots found for this configuration.</p>
            <p className="text-sm mt-1">Check staff working hours, date overrides, and existing bookings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot, idx) => {
              const start = new Date(slot.starts_at);
              return (
                <button key={idx} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                    {format(start, "h:mm a")}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 flex items-center">
                    <UserIcon className="w-3 h-3 mr-1" /> Staff: {slot.staff_id.substring(0,6)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
