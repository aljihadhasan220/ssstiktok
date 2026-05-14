import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;
  const filename = req.query.filename as string || "download";

  if (!targetUrl) {
    return res.status(400).send("URL is required");
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(targetUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': '*/*'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch from source: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/[^\x20-\x7E]/g, '').replace(/"/g, '')}"`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (contentLength && contentLength !== "0") {
      res.setHeader("Content-Length", contentLength);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    // Stream to Vercel response
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      res.end();
    }
  } catch (error: any) {
    console.error("Vercel Proxy error:", error);
    if (!res.headersSent) {
      res.status(500).send("Error downloading content");
    }
  }
}
