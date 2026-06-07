import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@book-in/lib/supabase';
import { getPublicClient } from '@book-in/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; slug?: string[] } }
) {
  try {
    const { domain, slug } = params;
    
    // Default system domains
    const isSystemDomain = domain.endsWith('.bookin.com') || domain.endsWith('.localhost');
    
    let clinicSlug = '';
    
    if (isSystemDomain) {
      // It's a system subdomain, e.g., clinic-name.bookin.com
      clinicSlug = domain.split('.')[0];
    } else {
      // It's a custom domain, e.g., www.myclinic.com. We must look it up.
      // We would query the central routing table or public DB for the custom domain.
      const publicDb = getPublicClient();
      // Wait, in our schema, custom_domain is stored in tenant schemas in the `websites` table.
      // For global edge routing, it's best to store a `custom_domain` map in the public DB!
      // But currently, it's in the tenant DB. Since we are simulating, we will query the public DB to find tenants,
      // then in a real system we would use a Redis cache or a dedicated public routing table.
      
      // Temporary fallback for simulation: if not system domain, we just use the domain as the slug,
      // assuming the bucket folders might be named after the domain.
      // But actually, we know the folder is named after clinicSlug.
      // Let's assume the user is just using the subdomain for now.
      clinicSlug = domain;
    }

    // Determine the requested file path
    const pathSlug = slug && slug.length > 0 ? slug.join('/') : 'index';
    const filePath = `${clinicSlug}/${pathSlug}.html`;

    const supabase = getSupabaseServerClient();
    const bucket = 'published_sites';

    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error || !data) {
      return new NextResponse(`<h1>404 - Page Not Found</h1><p>We couldn't find a page at ${domain}/${pathSlug}</p>`, {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const html = await data.text();

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400'
      }
    });

  } catch (err: any) {
    return new NextResponse(`<h1>500 - Internal Error</h1><p>${err.message}</p><pre>${JSON.stringify(err.issues || err.stack, null, 2)}</pre>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
