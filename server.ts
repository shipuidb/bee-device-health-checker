import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // In-memory fleet and scan session cache for mock enterprise technician sync
  const fleetDatabase: Array<any> = [
    {
      id: "DEV-WIN11-8842",
      deviceName: "Workstation-Alpha (ThinkPad P16 Gen 2)",
      manufacturer: "Lenovo",
      model: "21FA001KUS",
      serialNumber: "PF-3X992A",
      os: "Windows 11 Pro 64-bit (Build 22631.3880)",
      customerName: "Acme Corp Tech Ops",
      technician: "Alex Rivera (Lead Cert #8821)",
      lastScanDate: new Date(Date.now() - 3600000 * 18).toISOString(),
      healthScore: 92,
      status: "SUCCESS",
      criticalIssuesCount: 0,
      warningsCount: 1,
    },
    {
      id: "DEV-WIN10-4109",
      deviceName: "Field-Laptop-04 (Dell Latitude 5430)",
      manufacturer: "Dell Inc.",
      model: "Latitude 5430 Rugged",
      serialNumber: "8HQ7XZ2",
      os: "Windows 10 Enterprise (Build 19045.4651)",
      customerName: "Logistics Field Dept",
      technician: "Sarah Chen (Hardware Specialist)",
      lastScanDate: new Date(Date.now() - 3600000 * 4).toISOString(),
      healthScore: 54,
      status: "WARNING",
      criticalIssuesCount: 0,
      warningsCount: 3,
    },
    {
      id: "DEV-SRV-9011",
      deviceName: "CAD-Rendering-Rig (Custom ASUS ROG)",
      manufacturer: "ASUSTeK COMPUTER INC.",
      model: "ROG MAXIMUS Z790 HERO",
      serialNumber: "SN-2024-ASUS-991",
      os: "Windows 11 Pro for Workstations",
      customerName: "Design Studio X",
      technician: "Alex Rivera (Lead Cert #8821)",
      lastScanDate: new Date(Date.now() - 3600000 * 1).toISOString(),
      healthScore: 35,
      status: "CRITICAL",
      criticalIssuesCount: 2,
      warningsCount: 2,
    }
  ];

  const scanSessions: Array<any> = [];

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Bee Device Health Engine",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Fleet Device Registry API
  app.get("/api/fleet", (_req, res) => {
    res.json({ success: true, count: fleetDatabase.length, devices: fleetDatabase });
  });

  app.post("/api/fleet", (req, res) => {
    const device = {
      id: req.body.id || `DEV-${Date.now().toString(36).toUpperCase()}`,
      ...req.body,
      lastScanDate: new Date().toISOString(),
    };
    fleetDatabase.unshift(device);
    res.json({ success: true, device });
  });

  // Scan Results Persistence API
  app.get("/api/scans", (_req, res) => {
    res.json({ success: true, count: scanSessions.length, scans: scanSessions });
  });

  app.post("/api/scans", (req, res) => {
    const scanRecord = {
      scanId: req.body.scanId || `SCAN-${Date.now().toString(36).toUpperCase()}`,
      savedAt: new Date().toISOString(),
      ...req.body,
    };
    scanSessions.unshift(scanRecord);
    // Keep max 50 recent scans
    if (scanSessions.length > 50) scanSessions.pop();
    res.json({ success: true, scan: scanRecord });
  });

  // AI Hardware Diagnostic Analysis Route (Gemini 3.7 Flash)
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const client = getGeminiClient();
      if (!client) {
        return res.status(503).json({
          success: false,
          error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets settings.",
        });
      }

      const { scanResult, query, language } = req.body;
      if (!scanResult) {
        return res.status(400).json({ success: false, error: "scanResult payload is required" });
      }

      const langInstruction = language === "bn" ? "Respond in Bengali (বাংলা)." : "Respond in English.";

      const systemPrompt = `You are the AI Senior Hardware Diagnostics Specialist for BEE DEVICE HEALTH ("Know Your Device. Protect Your Data.").
CRITICAL RULES:
1. NEVER fabricate hardware metrics or hallucinate sensor readings not present in the provided diagnostic data.
2. Ground all diagnoses strictly in the provided scan data (CPU, RAM, Storage SMART attributes, Battery wear/cycles, GPU, Thermals, Security, Peripherals).
3. If an issue is marked UNSUPPORTED or NOT_AVAILABLE, clearly explain why operating systems or firmware policies may withhold it, and do not treat it as a hardware defect.
4. Provide structured, actionable engineering recommendations with exact PowerShell / Windows utility commands or technician repair steps when applicable.
5. ${langInstruction}`;

      const prompt = `Analyze this verified diagnostic scan data and produce an expert diagnosis & remediation plan:

Device: ${scanResult.deviceInfo?.manufacturer || "Unknown"} ${scanResult.deviceInfo?.model || "PC"} (${scanResult.deviceInfo?.os || "Windows"})
Overall Health Score: ${scanResult.healthScore}/100 [Grade: ${scanResult.grade}]
Overall Status: ${scanResult.overallStatus}

Critical Issues (${scanResult.criticalIssues?.length || 0}):
${(scanResult.criticalIssues || []).map((i: any) => `- [${i.component.toUpperCase()}] ${i.title}: ${i.message}`).join("\n") || "None detected."}

Warnings (${scanResult.warnings?.length || 0}):
${(scanResult.warnings || []).map((w: any) => `- [${w.component.toUpperCase()}] ${w.title}: ${w.message}`).join("\n") || "None detected."}

Component Summaries:
- Storage: ${JSON.stringify(scanResult.components?.storage?.metrics || {})}
- Battery: ${JSON.stringify(scanResult.components?.battery?.metrics || {})}
- CPU: ${JSON.stringify(scanResult.components?.cpu?.metrics || {})}
- RAM: ${JSON.stringify(scanResult.components?.ram?.metrics || {})}
- GPU: ${JSON.stringify(scanResult.components?.gpu?.metrics || {})}
- Thermal: ${JSON.stringify(scanResult.components?.thermal?.metrics || {})}
- Security: ${JSON.stringify(scanResult.components?.security?.metrics || {})}

User Specific Question/Goal: "${query || "Provide a comprehensive hardware health diagnosis, risk assessment, and specific step-by-step remediation guide for the technician."}"

Please provide your response in clean Markdown with:
1. Executive Summary & Hardware Verdict
2. Immediate Risks & Severity Breakdown
3. Step-by-Step Remediation Playbook (including exact Windows cmd/powershell commands or physical inspection tasks)
4. Long-Term Maintenance & Upgrade Advice`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });

      const analysisText = response.text || "No analysis could be generated.";
      res.json({ success: true, analysis: analysisText });
    } catch (err: any) {
      console.error("Gemini Diagnostic Analysis Error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to generate AI diagnostic analysis",
      });
    }
  });

  // Vite middleware in development or static dist serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🐝 Bee Device Health Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
