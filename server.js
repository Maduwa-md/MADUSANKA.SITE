require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));

// Serve your website
app.use(express.static(path.join(__dirname)));

// AI Proxy
app.post("/api/ai", async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "Message is required."
      });
    }

    if (text.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "Message is too long."
      });
    }

    const apiKey = process.env.ZANTA_API_KEY;

    if (!apiKey) {
      console.error("ZANTA_API_KEY is missing.");
      return res.status(500).json({
        success: false,
        error: "AI service is not configured."
      });
    }

    const apiUrl =
      "https://api.zanta-mini.store/api/deepchat" +
      "?apiKey=" +
      encodeURIComponent(apiKey) +
      "&text=" +
      encodeURIComponent(text);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    const rawText = await response.text();

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        success: response.ok,
        response: rawText
      };
    }

    if (!response.ok) {
      console.error("Zanta API error:", response.status, data);

      return res.status(502).json({
        success: false,
        error: "AI service temporarily unavailable."
      });
    }

    // Try common response fields
    const answer =
      data?.response ??
      data?.answer ??
      data?.message ??
      data?.text ??
      data?.result ??
      data?.data?.response ??
      data?.data?.answer ??
      data?.data?.message ??
      data?.data?.text ??
      data?.data ??
      rawText;

    return res.json({
      success: true,
      answer: String(answer)
    });

  } catch (error) {
    console.error("AI proxy error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again."
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "online"
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Website running on port ${PORT}`);
});
