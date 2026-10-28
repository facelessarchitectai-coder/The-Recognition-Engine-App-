import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

import { createApiApp } from "./api";

async function startServer() {
  const app = createApiApp();
  const PORT = 3000;


  // Handle building versus dev mode with Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0:3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server loaded on port ${PORT}`);
  });
}

startServer();
