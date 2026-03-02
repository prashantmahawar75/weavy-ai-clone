import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

// POST /api/upload - upload a file via Transloadit (returns CDN URL)
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit check
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`upload:${clientIp}`, RATE_LIMITS.upload);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-m4v',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Transloadit upload
    const authKey = process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY;
    if (!authKey) {
      return NextResponse.json(
        { error: 'Transloadit is not configured. Add NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY in your environment.' },
        { status: 500 }
      );
    }

    const isImage = file.type.startsWith('image/');

    // Build Transloadit assembly params: optimise images, pass-through videos
    const assemblyParams = {
      auth: { key: authKey },
      steps: isImage
        ? {
            optimized: {
              robot: '/image/optimize',
              use: ':original',
              progressive: true,
            },
          }
        : {
            optimized: {
              robot: '/video/encode',
              use: ':original',
              preset: 'empty', // pass-through, no re-encoding
              ffmpeg_stack: 'v6.0.0',
            },
          },
    };

    // Build multipart form for Transloadit
    const transloaditForm = new FormData();
    transloaditForm.set('params', JSON.stringify(assemblyParams));
    transloaditForm.set('file', file, file.name);

    const assemblyRes = await fetch('https://api2.transloadit.com/assemblies', {
      method: 'POST',
      body: transloaditForm,
    });

    if (!assemblyRes.ok) {
      const text = await assemblyRes.text();
      console.error('Transloadit assembly creation failed:', text);
      return NextResponse.json(
        { error: 'File upload failed. Please try again.' },
        { status: 502 }
      );
    }

    let assembly = await assemblyRes.json();

    if (assembly.error) {
      console.error('Transloadit assembly error:', assembly.error);
      return NextResponse.json(
        { error: `Upload processing failed: ${assembly.error}` },
        { status: 502 }
      );
    }

    // Poll for assembly completion (Transloadit processes asynchronously)
    const assemblyUrl = assembly.assembly_ssl_url || assembly.assembly_url;
    if (assemblyUrl && assembly.ok !== 'ASSEMBLY_COMPLETED') {
      for (let i = 0; i < 60; i++) {
        if (assembly.ok === 'ASSEMBLY_COMPLETED') break;
        if (assembly.ok === 'REQUEST_ABORTED' || assembly.error) {
          return NextResponse.json(
            { error: `Upload processing failed: ${assembly.error || assembly.ok}` },
            { status: 502 }
          );
        }
        await new Promise((r) => setTimeout(r, 1000));
        const pollRes = await fetch(assemblyUrl);
        assembly = await pollRes.json();
      }
    }

    // Extract the CDN URL from results
    const resultUrl =
      assembly.results?.optimized?.[0]?.ssl_url ||
      assembly.uploads?.[0]?.ssl_url ||
      '';

    if (!resultUrl) {
      return NextResponse.json(
        { error: 'Upload completed but no URL returned.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: resultUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
