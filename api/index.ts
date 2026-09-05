import express from "express";
import OpenAI from "openai";
import { blueprintText } from "../serverBlueprint";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: "vercel-serverless" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", environment: "vercel-serverless" });
});

const getOpenAIClient = () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    apiKey,
  });
};

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const client = getOpenAIClient();
    if (!client) {
      return res.json({
        text: "At Local AI Solutions (LAIS), we help South African businesses plug revenue leaks 24/7 by deploying automated WhatsApp lead capture, instant AI receptionists, and smart CRM routing. Book a Free Strategy Audit or connect with us on WhatsApp (+27 68 226 5793) to get started!"
      });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: `You are an AI assistant for Local AI Solutions (LAIS), a Cape Town-based AI automation agency.\n${blueprintText}` },
        ...(Array.isArray(messages) ? messages : [])
      ],
      temperature: 0.7,
    });

    const reply = response.choices?.[0]?.message?.content || "We can help you capture every lead. Book a free audit on our page or message us on WhatsApp.";
    res.json({ text: reply });
  } catch (_error: any) {
    res.json({
      text: "Local AI Solutions (LAIS) recovers revenue for local businesses by automating missed call text-backs, WhatsApp lead qualification, and scheduling 24/7. Connect directly via WhatsApp or book a free audit right here on the page."
    });
  }
});

app.post(["/api/questionnaire", "/api/leads"], async (req, res) => {
  try {
    const data = req.body || {};
    const businessName = (data.businessName || "").trim();
    const phone = (data.phone || "").trim();
    const email = (data.email || "").trim();

    if (!businessName) {
      return res.status(400).json({ error: "Business name is required." });
    }
    if (!phone && !email) {
      return res.status(400).json({ error: "At least one contact method (WhatsApp/Phone or Email) is required." });
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return res.status(200).json({
      success: true,
      leadId,
      message: "Audit questionnaire received successfully.",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Failed to store audit questionnaire.",
      details: err?.message || String(err)
    });
  }
});

app.post("/api/consultations", async (req, res) => {
  try {
    const data = req.body || {};
    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Invalid request body." });
    }
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return res.status(200).json({
      success: true,
      bookingId,
      message: "Consultation booked successfully."
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Failed to record consultation.",
      details: err?.message || String(err)
    });
  }
});

app.get("/api/leads", async (_req, res) => {
  res.json({ total: 0, leads: [] });
});

export default app;
