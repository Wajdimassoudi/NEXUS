import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Nexus Server is running" });
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

  // RapidAPI Proxy (Example: Crypto Market Data)
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
