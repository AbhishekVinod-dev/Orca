# 🎨 ORCA — Frontend UX Information Architecture & API Specification

This document details the **API Endpoint Evolution (Old vs. New)**, **Payload Data Contracts**, and **Frontend Information Architecture (UI/UX Guide)** for building a world-class, responsive, role-based user interface for the **ORCA Marine Intelligence Platform**.

---

## 📡 1. API Endpoints Comparison: Old vs. New

To maintain backward compatibility while introducing the ISRO baseline features, all existing endpoints are preserved and enhanced with optional headers and extended fields.

### 🔄 Endpoint Mapping Summary

| HTTP Method | Route Endpoint | Status | Old Behavior | New Upgraded Behavior |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/v1/agent` | **UPDATED** | Simple SSE stream with basic `thought` and text `final`. | **Multi-Persona SSE Stream**: Supports 5 roles (`fisherman`, `oceanographer`, `policymaker`, `aquaculture`, `shipping`), 5 progressive disclosure levels, A2A trace steps, hazard overrides, and structured evidence. |
| `POST` | `/api/v1/speech` | **UPDATED** | Transcribes audio to English/Hindi. | **Multilingual Speech & Voice Engine**: Transcribes audio in regional languages (Tamil, Malayalam, Telugu, Hindi) and returns optional speech synthesis URL. |
| `POST` | `/api/v1/auth` | **UNCHANGED** | User login & token generation. | Authenticates user and returns assigned default persona role & preferred language. |
| `POST` | `/api/v1/internal_tools/eez_boundaries` | **UPDATED** | Simple lat/long PostGIS spatial lookup. | **Spatial Geofencing Suite**: Returns EEZ boundary status, 12 NM territorial water distance, and Marine Protected Area (MPA) proximity. |
| `POST` | `/api/v1/internal_tools/pfz` | **UPDATED** | Synchronous INCOIS PFZ web scraper. | **PFZ & Fish Abundance Service**: Returns PFZ coordinates, bearing, estimated distance, target fish species, and confidence score. |
| `GET` | `/api/v1/internal_tools/ocean` | **NEW** | N/A | **Oceanographic Data Service**: Returns SST (°C), Chlorophyll-a ($mg/m^3$), salinity profiles, and Argo float observations. |
| `GET` | `/api/v1/internal_tools/meteo` | **NEW** | N/A | **Marine Weather & Hazards**: Returns wave height, swell period, wind speed/direction, lightning alerts, and cyclone advisories. |
| `POST` | `/api/v1/feedback` | **NEW** | N/A | **User Catch & Ground-Truth Logging**: Allows fishermen/researchers to submit ground-truth catch observations to refine PFZ models. |
| `GET` | `/api/v1/offline/sync` | **NEW** | N/A | **Low-Bandwidth Delta Sync**: Downloads compressed offline spatial tiles and 48h advisory cache. |

---

## 📝 2. Detailed API Request & Response Contracts

### A. Main Agent Endpoint (`POST /api/v1/agent`)

#### Request Header & Body:
```json
{
  "prompt": "Is it safe to set sail for fishing near Chennai coast today?",
  "role": "fisherman",
  "lang": "ta",
  "lat": 13.0827,
  "long": 80.2707,
  "disclosure_level": 2,
  "bandwidth_mode": "normal"
}
```

- `role`: `"fisherman"` | `"oceanographer"` | `"policymaker"` | `"aquaculture"` | `"shipping"`
- `disclosure_level`: `1` (Simple) | `2` (Why) | `3` (Evidence) | `4` (Scientific) | `5` (Raw Data)
- `bandwidth_mode`: `"normal"` | `"low"` (Compressed text for offshore 2G/GPRS)

#### SSE Stream Event Pipeline (`text/event-stream`):

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8

data: {"type": "hazard_alert", "name": "safety_engine", "content": {"status": "CLEAR", "hazard_warnings": []}}

data: {"type": "thought", "name": "planner_agent", "content": "Decomposing task: fetching marine weather and spatial PFZ for Chennai coast..."}

data: {"type": "a2a_step", "sender": "planner_agent", "target": "weather_intelligence_agent", "intent": "get_marine_weather"}

data: {"type": "evidence", "name": "evidence_synthesizer", "content": {"observations": [{"variable": "wave_height", "value": "1.1m", "source": "Open-Meteo"}], "conflicts": []}}

data: {"type": "persona_response", "role": "fisherman", "disclosure_level": 2, "content": "இன்று சென்னை கடற்பகுதியில் பயணம் செய்வது பாதுகாப்பானது. அலை உயரம் 1.1 மீட்டராக உள்ளது."}

data: {"type": "final", "name": "orchestrator", "content": "இன்று சென்னை கடற்பகுதியில் பயணம் செய்வது பாதுகாப்பானது. அலை உயரம் 1.1 மீட்டராக உள்ளது."}
```

---

## 🖥️ 3. Frontend Information Architecture & Role-Based UI Plan

ORCA's frontend is designed around a **Modular, Spatial, Glassmorphism Dashboard** that adapts dynamically to the user's role.

### 🎨 Design System & Visual Aesthetics
- **Theme**: Ultra-dark ocean aesthetics (`#0a0f1d` background, `#141e36` cards, `#00f2fe` cyan primary accents, `#ff0055` emergency alert red).
- **Typography**: Inter / Outfit (Google Fonts).
- **Micro-Animations**: Smooth glass blur transitions, floating spatial map overlays, pulse safety indicators.

---

### 🧩 4. Layout Wireframe & Global Navigation Structure

```mermaid
graph TD
    App[ORCA Universal Web / Mobile App] --> TopNav[Top Header Bar]
    TopNav --> RoleSelector[Persona Switcher: Fisherman | Oceanographer | Policymaker | Aquaculture | Shipping]
    TopNav --> LangSelector[Language Switcher: English | தமிழ் | हिंदी | తెలుగు | മലയാളം]
    TopNav --> DisclosureSlider[Progressive Disclosure Level 1 - 5 Slider]
    TopNav --> OfflineToggle[Offline / Low-Bandwidth Mode Switch]

    App --> MainLayout[Main Workspace Grid]

    subgraph "Role-Specific Views"
        MainLayout --> FishermanTab[🎣 Fisherman Dashboard]
        MainLayout --> OceanographerTab[🔬 Oceanographer Dashboard]
        MainLayout --> PolicymakerTab[🏛️ Policymaker Dashboard]
        MainLayout --> AquaTab[🌊 Aquaculture Dashboard]
        MainLayout --> ShippingTab[🚢 Shipping Dashboard]
    end

    MainLayout --> SpatialMap[Interactive Leaflet / Mapbox Marine GIS Map]
    MainLayout --> VoiceFloatingButton[Floating Voice Mic & Conversational SSE Panel]
```

---

## 🎛️ 5. Tab & Component Breakdown by User Persona

### 🎣 1. Fisherman View (`/fisherman`)
Designed for **simplicity, high outdoor visibility, and voice-first interaction**.

#### Key UI Components:
1. **Safety Status Banner (Hero Widget)**:
   - Large colored indicator: `✅ SAFE TO SAIL` (Green) | `⚠️ CAUTION HIGH SWELL` (Yellow) | `🛑 DANGER: DO NOT SAIL` (Red).
   - High-contrast text: *"Wave height is knee-high (1.1m). Wind is gentle from East."*
2. **Floating Voice Assistant Button**:
   - One-tap push-to-talk mic button powered by Sarvam AI speech transcription.
   - Plays audio advisories back in regional language.
3. **PFZ Quick Fishing Zone Cards**:
   - Nearest Potential Fishing Zones with bearing (*"12 km North-East"*), target fish (*"Sardinella / Mackerel"*), and GPS coordinates.
   - One-tap "Navigate to Zone" button.
4. **Offline Advisory Cache Indicator**:
   - Shows sync status (*"Updated 20 mins ago • Available Offline"*).

---

### 🔬 2. Oceanographer & Researcher View (`/oceanographer`)
Designed for **scientific rigor, multi-layer GIS mapping, Argo profile analysis, and raw data export**.

#### Key UI Components:
1. **Interactive Multi-Layered Marine Map**:
   - Toggles for Sea Surface Temperature (SST) heatmaps, Chlorophyll-a concentration layers, wave vectors, and ocean currents.
2. **Argo Float Salinity & Depth Profile Chart**:
   - Interactive Recharts line graph displaying temperature/salinity profiles vs depth (0m to 2000m).
3. **Evidence & Conflict Inspector Panel**:
   - Side-by-side comparison of satellite vs in-situ buoy data.
   - Displays statistical confidence intervals, sensor IDs, and satellite pass timestamps.
4. **Data Exporter & Citation Drawer**:
   - One-click export to CSV / GeoJSON / NetCDF.
   - Auto-generated BibTeX and APA citations for ISRO research papers.

---

### 🏛️ 3. Policymaker & Regulator View (`/policymaker`)
Designed for **executive briefings, EEZ jurisdiction compliance, and environmental risk assessment**.

#### Key UI Components:
1. **Executive Briefing Card**:
   - 3-bullet executive summary with policy recommendations.
2. **EEZ & MPA Jurisdiction Map**:
   - Highlights 12 NM Territorial Water limits, 200 NM EEZ lines, and Marine Protected Areas (MPAs).
   - Real-time alert feed for vessel proximity to international boundary lines.
3. **Environmental & Illegal Fishing (IUU) Risk Heatmap**:
   - Visual risk gauges for coastal erosion, overfishing threat index, and cyclone risk corridors.
4. **Policy Report Generator**:
   - Generates downloadable PDF executive briefing reports for government meetings.

---

### 🌊 4. Aquaculture View (`/aquaculture`)
Designed for **coastal fish farm owners and water quality monitoring**.

#### Key UI Components:
1. **Water Quality & Health Dashboard**:
   - Gauges for Water Temperature (°C), Salinity (PSU), Dissolved Oxygen, and pH levels.
2. **Harmful Algal Bloom (HAB) Alert Widget**:
   - Satellite Chlorophyll-a anomaly detector warning of potential toxic algae blooms.
3. **Storm & Wave Impact Forecast**:
   - 48-hour wave impact predictions for fish cages and farm infrastructure.

---

### 🚢 5. Shipping & Maritime View (`/shipping`)
Designed for **vessel operators, port authorities, and maritime route planning**.

#### Key UI Components:
1. **Safe Route Corridor Planner**:
   - Calculates optimal navigation routes avoiding high swell corridors and cyclone threat zones.
2. **Sea State & Wave Spectrum Chart**:
   - Wave period, significant wave height ($H_s$), and wind wave vs swell separation.
3. **Port Entrance & Draft Advisory Widget**:
   - Tidal height predictions and water depth allowances for cargo vessels.

---

## 🛠️ 6. Implementation Checklist for Frontend Developers

To begin building the frontend in parallel with the backend:

- [ ] **Step 1**: Set up Next.js 15 / Vite React project with Tailwind CSS or Vanilla CSS Glassmorphism design system tokens.
- [ ] **Step 2**: Create reusable SSE streaming hook (`useEventSource`) supporting `hazard_alert`, `thought`, `evidence`, `persona_response`, and `final` event types.
- [ ] **Step 3**: Build global Navigation Header with Role Selector (`fisherman`, `oceanographer`, `policymaker`, `aquaculture`, `shipping`) and Progressive Disclosure Level Slider (1–5).
- [ ] **Step 4**: Integrate Leaflet / Mapbox GL JS for spatial marine maps (overlaying PFZ points, EEZ polygon boundaries, and SST rasters).
- [ ] **Step 5**: Build Sarvam AI Voice Interface component with mic capture and audio playback.
