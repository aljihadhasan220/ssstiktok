import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Generic proxy handler to stream content from TikTok CDNs
  const handleProxy = async (req: express.Request, res: express.Response) => {
    const targetUrl = req.query.url as string;
    const filename = req.query.filename as string || "download";

    if (!targetUrl) {
      return res.status(400).send("URL is required");
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

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
        console.error(`Fetch failed for ${targetUrl}: ${response.status} ${response.statusText}`);
        return res.status(response.status).send(`Failed to fetch from source: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const contentLength = response.headers.get("content-length");
      
      // Clear any default headers that might interfere with downloads
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      
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

      // Robust streaming compatible with both Node and Web Streams
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
      console.error("Proxy error:", error);
      if (!res.headersSent) {
        res.status(500).send("Error downloading content");
      }
    }
  };

  // Explicit Proxy endpoints to avoid routing ambiguities in production
  app.get("/api/proxy", handleProxy);
  app.get("/api/proxy-image", handleProxy);
  app.get("/api/proxy-video", handleProxy);

  // API placeholders
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      version: "1.0.2",
      timestamp: new Date().toISOString()
    });
  });

  // Production: serve static files and handle SPA fallback
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static files from dist
    app.use(express.static(distPath, {
      maxAge: '1d',
      index: 'index.html'
    }));
    
    // SPA Fallback - Only for non-API routes
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found', path: req.path });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running and enforcing HTTPS on port ${PORT}`);
  });
}

startServer();
