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
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://www.tiktok.com/',
          'Accept': '*/* -'
        }
      });
      
      if (!response.ok) {
        console.error(`Fetch failed for ${targetUrl}: ${response.status} ${response.statusText}`);
        return res.status(response.status).send(`Failed to fetch from source: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const contentLength = response.headers.get("content-length");
      
      // Clear any default headers
      res.removeHeader('X-Frame-Options');
      
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/"/g, '')}"`);
      res.setHeader("Access-Control-Allow-Origin", "*");
      
      if (contentLength && contentLength !== "0") {
        res.setHeader("Content-Length", contentLength);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Stream the response
      // @ts-ignore
      Readable.fromWeb(response.body).pipe(res);

    } catch (error) {
      console.error("Proxy error:", error);
      if (!res.headersSent) {
        res.status(500).send("Error downloading content");
      }
    }
  };

  // Unified Proxy endpoints to prevent 404s
  app.get("/api/proxy", handleProxy);
  app.get("/api/proxy-image", handleProxy);
  app.get("/api/proxy-video", handleProxy);

  // API placeholders
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // HTTPS Redirect middleware (for production)
  if (process.env.NODE_ENV === "production") {
    app.enable('trust proxy');
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.hostname + req.originalUrl);
      }
      next();
    });
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files and handle SPA fallback
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running and enforcing HTTPS on port ${PORT}`);
  });
}

startServer();
