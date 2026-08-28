# 🐝 Bee Device Health

> **"Know Your Device. Protect Your Data."**  
> Professional cross-platform hardware diagnostics, real-time subsystem telemetry, and technician fleet management workstation.

---

## 📋 Overview

**Bee Device Health** is a precision hardware diagnostics and servicing workstation. It combines deterministic hardware telemetry probes, interactive peripheral actuator testing, technician repair ticket logging, and AI-grounded remediation assistance powered by Gemini.

Designed for IT technicians, computer service centers, system administrators, and power users, Bee Device Health evaluates system health, isolates failing components (NVMe wear, battery degradation, thermal throttling, RAM limits), and provides verifiable pre- and post-repair baseline reports.

---

## ⚡ Key Features

### 🔍 1. Subsystem Hardware Diagnostics & Probing
- **Storage & Drive Health**: Evaluates NVMe / SSD SMART indicators, spare blocks, TBW wear estimation, and free volume capacity.
- **Battery & ACPI Telemetry**: Computes wear levels, design vs. full-charge capacity (mWh), and charge cycle counts.
- **CPU & Performance Benchmarking**: Real-time logical core detection, concurrency limits, and in-browser deterministic math and multi-core throughput testing.
- **RAM & Memory Usage**: Evaluates JS heap memory limits, allocation pressure, and system total RAM headroom.
- **GPU & Graphics Adapter**: Queries WebGL 2.0 / WebGPU renderers, vendor profiles, max texture dimensions, and hardware acceleration status.
- **Thermal & Throttling Status**: Monitors thermal sensors and active throttling flags against configurable temperature warning thresholds.
- **Firmware & Security**: Validates TPM 2.0, Secure Boot state, and BitLocker encryption compliance flags.

### 🎮 2. Interactive Peripheral Actuator Testing Suite
- **Keyboard Matrix**: Real-time visual key actuated grid with keycode logging and sticky switch detection.
- **Display & Dead-Pixel Checker**: Fullscreen calibrated color cycling (White, Black, Red, Green, Blue) to inspect sub-pixel anomalies.
- **Audio DAC & Mic Meter**: Calibrated sine-wave oscillator tones (250Hz Bass, 1kHz Mid, 4kHz Treble) and live microphone ADC peak meter.
- **Mouse & HID Precision**: Left/Middle/Right microswitch actuation counters and scrollwheel delta tracking.
- **Optical Webcam Sensor**: Live camera feed capture with sensor resolution and FPS verification.

### 🛠️ 3. Enterprise Technician Fleet Management
- **Fleet Inventory**: Multi-device tracking with serial number redaction, customer profiles, and technician assignment.
- **Pre / Post Repair Baseline Comparison**: Track diagnostic health score improvements before and after hardware servicing (e.g., thermal paste repaste, battery replacement, SSD upgrade).
- **Service Action Logging**: Record parts replaced, technician certification IDs, and service notes.

### 🤖 4. AI-Powered Diagnostic Remediation (Gemini 3.7 Flash)
- **Grounded Telemetry Analysis**: Diagnostic conclusions strictly derived from verified sensor metrics with zero hallucination.
- **Actionable Remediation Playbooks**: Provides executable PowerShell commands, Windows DISM/SFC utilities, and physical servicing instructions.
- **Bi-lingual Diagnostic Engine**: Supports English and Bengali (বাংলা) diagnostic explanations.

### 📄 5. Multi-Format Report Generation
- **Printable PDF Inspection Certificate**: Print-ready diagnostic sheet with technician signature block, hardware health grades, and component scores.
- **CSV & JSON Exports**: Machine-readable diagnostic snapshots for integration into IT asset management systems.

### 🎨 6. High-Density Technical Workstation UI
- High-density dark slate theme (`#0F111A` canvas with `#161B22` technical panels).
- Compact tabular layouts, monospace telemetry registers, and low-latency interaction states.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Animation** | Motion (`motion/react`) |
| **Backend Proxy & Server** | Express.js, Node.js (ESM / bundled CJS for production) |
| **AI Diagnostics** | Google Gen AI SDK (`@google/genai` with Gemini 3.7 Flash) |
| **Browser Hardware APIs** | WebGL 2.0, Web Audio API, MediaDevices API, Performance Memory API, Battery Status API |

---

## 📁 Project Directory Structure

```text
├── src/
│   ├── components/
│   │   ├── AiRemediationModal.tsx     # Gemini-powered diagnostic advisor modal
│   │   ├── ComponentDetailView.tsx    # Subsystem telemetry register inspector & CPU benchmark
│   │   ├── Dashboard.tsx              # Main overview cards, quick actions & hardware specs
│   │   ├── Header.tsx                 # App header with language toggle, mode switch & actions
│   │   ├── HistoryView.tsx            # Historical scan timeline & degradation trends
│   │   ├── PeripheralTester.tsx       # Interactive keyboard, display, audio, mouse & camera tests
│   │   ├── ReportViewModal.tsx        # Printable PDF / CSV / JSON report generator
│   │   ├── ScanModal.tsx              # Animated live diagnostic scan sequence modal
│   │   ├── SettingsModal.tsx          # Privacy settings, alert thresholds & technician profile
│   │   └── TechnicianDashboard.tsx    # Fleet management & Pre/Post repair comparisons
│   ├── i18n/
│   │   └── translations.ts            # English & Bengali localized string dictionaries
│   ├── services/
│   │   ├── diagnosticEngine.ts        # Health score calculation & deterministic rule engine
│   │   ├── hardwareProbes.ts          # Browser & system hardware sensor probes
│   │   └── reportGenerator.ts         # PDF printing, CSV & JSON export utilities
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces, types & data schemas
│   ├── App.tsx                        # Main application container & view router
│   ├── main.tsx                       # React application entrypoint
│   └── index.css                      # Global Tailwind CSS imports & styles
├── server.ts                          # Express backend proxy for Gemini API & static serving
├── metadata.json                      # AI Studio application metadata & frame permissions
├── package.json                       # Scripts and project dependencies
├── .env.example                       # Environment variable definitions
└── README.md                          # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Gemini API Key**: For enabling the AI Diagnostic Remediation Assistant.

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Populate your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Development Server
Start the development server (runs on `http://localhost:3000`):
```bash
npm run dev
```

### 4. Production Build & Execution
Build the client and bundle the backend server:
```bash
npm run build
npm start
```

---

## 🔒 Privacy & Data Handling Rules

1. **Deterministic Rule Grounding**: Unsupported hardware registers (such as certain thermal probes in restricted browser sandboxes) are explicitly labeled as `UNSUPPORTED` rather than fabricated.
2. **Serial Number Redaction**: An integrated privacy toggle allows masking motherboards and drive serial numbers in public reports.
3. **Local-First Execution**: Hardware benchmark math and peripheral actuator checks execute entirely client-side on the host device.

---

## 📄 License
This project is open-source and available under standard development licensing.
