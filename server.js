require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static frontend
app.use(express.static(path.join(__dirname, "public")));

// GET / — serve the single-page dashboard
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST /api/refresh — proxy the n8n webhook and return its JSON
app.post("/api/refresh", async (_req, res) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return res
      .status(500)
      .json({ error: "N8N_WEBHOOK_URL is not configured on the server." });
  }

  try {
    const response = await axios.get(webhookUrl, { timeout: 60000 });
    return res.json(response.data);
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Unknown error from n8n";
    console.error("[/api/refresh] n8n call failed:", message);
    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`recon-dashboard running on http://localhost:${PORT}`);
});
