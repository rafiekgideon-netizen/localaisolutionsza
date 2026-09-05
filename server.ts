import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import { blueprintText } from "./serverBlueprint.js";

// Catch uncaught exceptions and rejections so the server process doesn't terminate abruptly
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception in server:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
});

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const CONSULTATIONS_FILE = path.join(DATA_DIR, "consultations.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists or created
  }
}

async function saveLead(leadData: any) {
  await ensureDataDir();
  let existingLeads: any[] = [];
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    existingLeads = JSON.parse(raw);
    if (!Array.isArray(existingLeads)) existingLeads = [];
  } catch {
    existingLeads = [];
  }
  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...leadData,
    receivedAt: new Date().toISOString()
  };
  existingLeads.unshift(newLead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(existingLeads, null, 2), "utf-8");
  return newLead;
}

async function saveConsultation(consultationData: any) {
  await ensureDataDir();
  let existingConsultations: any[] = [];
  try {
    const raw = await fs.readFile(CONSULTATIONS_FILE, "utf-8");
    existingConsultations = JSON.parse(raw);
    if (!Array.isArray(existingConsultations)) existingConsultations = [];
  } catch {
    existingConsultations = [];
  }
  const newBooking = {
    id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...consultationData,
    bookedAt: new Date().toISOString()
  };
  existingConsultations.unshift(newBooking);
  await fs.writeFile(CONSULTATIONS_FILE, JSON.stringify(existingConsultations, null, 2), "utf-8");
  return newBooking;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware for API parsing
  app.use(express.json());

  // Health check routes for container runtime and ingress
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Helper function to create DeepSeek client safely
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
      
      const systemInstruction = `You are an AI assistant for Local AI Solutions (LAIS), a Cape Town-based AI automation agency. 
You must act as an expert on their master blueprint context. Your goal is to help visitors understand how LAIS can recover their revenue through 24/7 lead capture and automation.
Be direct, tactile, confident, local, practical, and not hype. Answer visitors' questions in short, concise responses. Use South African context when appropriate.
Here is the LAIS blueprint knowledge base:\n${blueprintText}`;

      const client = getOpenAIClient();
      if (!client) {
        return res.json({
          text: "At Local AI Solutions (LAIS), we help South African businesses plug revenue leaks 24/7 by deploying automated WhatsApp lead capture, instant AI receptionists, and smart CRM routing. Book a Free Strategy Audit or connect with us on WhatsApp (+27 68 226 5793) to get started!"
        });
      }

      const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemInstruction },
          ...(Array.isArray(messages) ? messages : [])
        ],
        temperature: 0.7,
      });

      const reply = response.choices?.[0]?.message?.content || "We can help you capture every lead. Book a free audit on our page or message us on WhatsApp.";
      res.json({ text: reply });
    } catch (error: any) {
      console.error("DeepSeek API Error:", error?.message || error);
      // Return a helpful contextual fallback based on LAIS capabilities if external API key is invalid or rate limited
      res.json({
        text: "Local AI Solutions (LAIS) recovers revenue for local businesses by automating missed call text-backs, WhatsApp lead qualification, and scheduling 24/7. Connect directly via WhatsApp or book a free audit right here on the page."
      });
    }
  });

  // Questionnaire / Audit Submission API endpoint
  app.post(["/api/questionnaire", "/api/leads"], async (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid request payload. Expected JSON body." });
      }

      // Basic validation
      const businessName = (data.businessName || "").trim();
      const phone = (data.phone || "").trim();
      const email = (data.email || "").trim();

      if (!businessName) {
        return res.status(400).json({ error: "Business name is required." });
      }
      if (!phone && !email) {
        return res.status(400).json({ error: "At least one contact method (WhatsApp/Phone or Email) is required." });
      }

      const saved = await saveLead(data);
      console.log(`[LAIS Lead Saved] ${saved.businessName} (${saved.location || "SA"}) - Contact: ${phone || email}`);

      res.status(200).json({
        success: true,
        leadId: saved.id,
        message: "Audit questionnaire received successfully.",
        timestamp: saved.receivedAt
      });
    } catch (err: any) {
      console.error("Error processing questionnaire submission:", err);
      res.status(500).json({
        error: "Failed to store audit questionnaire.",
        details: err?.message || String(err)
      });
    }
  });

  // Consultations Booking API endpoint
  app.post("/api/consultations", async (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid request body." });
      }
      const saved = await saveConsultation(data);
      console.log(`[LAIS Consultation Booked] ${saved.businessName || "Client"} on ${saved.formattedDate || saved.date || "Date TBD"} at ${saved.formattedTime || saved.timeSlot || "Time TBD"}`);

      res.status(200).json({
        success: true,
        bookingId: saved.id,
        message: "Consultation booked successfully."
      });
    } catch (err: any) {
      console.error("Error booking consultation:", err);
      res.status(500).json({
        error: "Failed to record consultation.",
        details: err?.message || String(err)
      });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      await ensureDataDir();
      const raw = await fs.readFile(LEADS_FILE, "utf-8").catch(() => "[]");
      const leads = JSON.parse(raw);
      res.json({ total: leads.length, leads });
    } catch (_err: any) {
      res.json({ total: 0, leads: [] });
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
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Global express error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    process.stdout.write(`Server running on http://0.0.0.0:${PORT}\n`);
  });
}

startServer();
