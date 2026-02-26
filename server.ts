import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
const db = new Database("nexus.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY,
    visitors INTEGER DEFAULT 0,
    earnings REAL DEFAULT 0.0
  )
`);

// Ensure initial stats exist
const row = db.prepare("SELECT * FROM stats WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO stats (id, visitors, earnings) VALUES (1, 1240, 1250.80)").run();
}

// Automated Revenue Simulation (Passive Income Logic)
setInterval(() => {
  const randomEarnings = (Math.random() * 0.05).toFixed(4);
  db.prepare("UPDATE stats SET earnings = earnings + ?, visitors = visitors + 1 WHERE id = 1").run(randomEarnings);
}, 30000); // Every 30 seconds

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Nexus Server is running" });
  });

  // Real-time Stats
  app.get("/api/stats", (req, res) => {
    const stats = db.prepare("SELECT * FROM stats WHERE id = 1").get();
    res.json(stats);
  });

  // Track Visit
  app.post("/api/track-visit", (req, res) => {
    db.prepare("UPDATE stats SET visitors = visitors + 1 WHERE id = 1").run();
    res.json({ success: true });
  });

  // Secure Wallet Endpoint
  app.get("/api/wallets", (req, res) => {
    res.json({
      btc: process.env.VITE_WALLET_BTC,
      usdt: process.env.VITE_WALLET_USDT,
      sol: process.env.VITE_WALLET_SOL,
      eth: process.env.VITE_WALLET_ETH,
      ltc: process.env.VITE_WALLET_LTC,
      bnb: process.env.VITE_WALLET_BNB
    });
  });

  // RapidAPI Proxy
  app.get("/api/market-data", async (req, res) => {
    try {
      const response = await fetch("https://coinranking1.p.rapidapi.com/coins?limit=5", {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || "fd43cd59cbmsh016b54d400085b6p1dae09jsn666f2499a427",
          "x-rapidapi-host": "coinranking1.p.rapidapi.com"
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // HuggingFace Proxy (Image Generation)
  app.post("/api/ai/generate-image", async (req, res) => {
    const { prompt } = req.body;
    const HF_TOKEN = process.env.VITE_HUGGINGFACE_API_KEY;
    
    if (!HF_TOKEN) {
      return res.status(400).json({ error: "HuggingFace API Key not configured" });
    }

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: { Authorization: `Bearer ${HF_TOKEN}` },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      res.type(blob.type).send(buffer);
    } catch (err) {
      res.status(500).json({ error: "AI Generation failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexus Hub running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
