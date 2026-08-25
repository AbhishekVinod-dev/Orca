// lib/mock/chatResponses.ts
// Mock ORCA AI responses with agent reasoning traces
// TODO: replace with streaming call to /api/chat (LLM + agents backend)

export interface AgentStep {
  agent: 'Planner' | 'DataAgent' | 'RiskAgent' | 'ResponseAgent';
  status: 'pending' | 'running' | 'done';
  action: string;
  detail: string;
  duration_ms: number;
  sources?: string[];
}

export interface ChatResponse {
  id: string;
  queryPatterns: string[];
  response: string;
  agentTrace: AgentStep[];
  relatedData?: {
    pfzZones?: string[];
    alerts?: string[];
    coordinates?: [number, number];
    chartData?: { label: string; value: number }[];
  };
}

export const mockChatResponses: ChatResponse[] = [
  {
    id: 'R-001',
    queryPatterns: ['pfz', 'fishing zone', 'where to fish', 'fishing today', 'catch'],
    response: `🎯 **Potential Fishing Zones — August 25, 2026**

Based on latest **MODIS Aqua** and **Sentinel-3 OLCI** satellite data processed 4 hours ago, I've identified **3 high-confidence PFZ zones** near your location:

---

**🟢 Zone 1: Rameswaram Offshore (91% confidence)**
- Distance: ~68 nm from Rameswaram harbor
- Target species: Seer Fish, Pomfret, Red Snapper
- SST: 27.5–29°C | Chlorophyll: 1.2–3.4 mg/m³
- Best window: **0500–1000 IST** (before sea state worsens)

**🟡 Zone 2: Chennai Offshore (87% confidence)**
- Distance: ~45 nm from Chennai coast
- Target species: Indian Mackerel, Tuna
- SST: 28.2–29.8°C | Chlorophyll: 0.8–2.1 mg/m³
- Note: Monitor ALT-001 cyclone track before departing

**🟡 Zone 3: Vizhinjam Offshore (72% confidence)**
- Distance: ~90 nm from Vizhinjam port
- Target species: Sardine, Anchovy, Mackerel
- Check high-wave advisory (ALT-002) before venturing

⚠️ **Active Alert**: Cyclone warning in Bay of Bengal — Tamil Nadu fishermen should prioritize Zone 3 (Arabian Sea side) today.

Want me to calculate a safe route to any of these zones?`,
    agentTrace: [
      { agent: 'Planner', status: 'done', action: 'Intent classification', detail: 'Detected: PFZ_QUERY with location context', duration_ms: 120, sources: [] },
      { agent: 'DataAgent', status: 'done', action: 'Fetching satellite data', detail: 'Retrieved MODIS + Sentinel-3 L2 products (2026-08-25T02:00Z)', duration_ms: 890, sources: ['INCOIS ERDDAP', 'NASA OceanColor'] },
      { agent: 'DataAgent', status: 'done', action: 'Computing PFZ algorithm', detail: 'Applied SST gradient + chlorophyll bloom detection (Cayula-Cornillon method)', duration_ms: 340, sources: ['IMD NWP Model'] },
      { agent: 'RiskAgent', status: 'done', action: 'Cross-referencing alerts', detail: 'Checked ALT-001 (cyclone) and ALT-002 (waves) against zone locations', duration_ms: 210, sources: ['IMD Real-time Feed'] },
      { agent: 'ResponseAgent', status: 'done', action: 'Generating response', detail: 'Ranked zones by confidence + safety, formatted for fishermen', duration_ms: 180, sources: [] },
    ],
    relatedData: {
      pfzZones: ['PFZ-001', 'PFZ-002', 'PFZ-003'],
      alerts: ['ALT-001', 'ALT-002'],
      chartData: [
        { label: 'Rameswaram', value: 91 },
        { label: 'Chennai', value: 87 },
        { label: 'Vizhinjam', value: 72 },
        { label: 'Veraval', value: 68 },
        { label: 'Paradip', value: 54 },
      ],
    },
  },
  {
    id: 'R-002',
    queryPatterns: ['safe', 'safety', 'weather', 'tomorrow', 'conditions', 'sea state'],
    response: `🌊 **Sea Safety Assessment — August 25–26, 2026**

**Current Conditions (1800 IST):**

| Parameter | Bay of Bengal | Arabian Sea |
|-----------|---------------|-------------|
| Wave Height | 3.5–8.5 m 🔴 | 2.0–3.5 m 🟡 |
| Wind Speed | 65–120 km/h 🔴 | 25–45 km/h 🟡 |
| Visibility | 8–12 km | 10–20 km |
| Swell Period | 12–18 s | 8–12 s |

**Tomorrow's Forecast (August 26):**
- Bay of Bengal remains **UNSAFE** — cyclone MICHAUNG intensifying
- Arabian Sea: Moderate conditions, small vessels should exercise caution
- Gulf of Mannar: **Safe windows** 0600–1000 IST and 1700–2000 IST

**My Recommendation:**
> 🔴 Do NOT venture into Bay of Bengal for the next 48 hours. Arabian Sea side (Kerala, Karnataka, Goa) has acceptable conditions for larger vessels in morning hours only.

Safe return deadline from any current voyage: **Before 2200 IST today**`,
    agentTrace: [
      { agent: 'Planner', status: 'done', action: 'Intent classification', detail: 'Detected: SAFETY_QUERY with temporal context (tomorrow)', duration_ms: 95, sources: [] },
      { agent: 'DataAgent', status: 'done', action: 'Fetching NWP forecast', detail: 'Retrieved IMD NCUM 24h forecast + ECMWF wave model data', duration_ms: 720, sources: ['IMD NWP', 'ECMWF'] },
      { agent: 'RiskAgent', status: 'done', action: 'Safety scoring', detail: 'Computed composite risk index from wind + wave + cyclone proximity factors', duration_ms: 290, sources: ['Coast Guard SOPs'] },
      { agent: 'ResponseAgent', status: 'done', action: 'Generating bilingual response', detail: 'Formatted with safe/unsafe classification and time windows', duration_ms: 155, sources: [] },
    ],
    relatedData: {
      alerts: ['ALT-001', 'ALT-002', 'ALT-003'],
      chartData: [
        { label: 'Bay of Bengal', value: 8.5 },
        { label: 'Arabian Sea', value: 3.5 },
        { label: 'Gulf of Mannar', value: 2.1 },
        { label: 'Lakshadweep Sea', value: 2.8 },
      ],
    },
  },
  {
    id: 'R-003',
    queryPatterns: ['cyclone', 'storm', 'hurricane', 'michaung', 'tropical'],
    response: `🌀 **Cyclone MICHAUNG — Latest Update (1800 IST, Aug 25)**

**Current Position:** 13.5°N, 82.1°E (Bay of Bengal)
**Category:** Severe Cyclonic Storm
**Maximum Sustained Winds:** 120 km/h, gusts to 145 km/h
**Central Pressure:** 978 hPa
**Movement:** NNW at 12 km/h

**Predicted Track (IMD):**
- 24h: 15.2°N, 80.9°E — landfall near Bapatla, Andhra Pradesh likely
- 48h: Weakening over land (60 km/h)

**Danger Zones (Next 48 hrs):**
- 🔴 North Tamil Nadu coast (Chennai to Nellore)
- 🔴 Southern Andhra Pradesh (Ongole to Machilipatnam)
- 🟡 Odisha southern coast
- 🟡 Yanam, Puducherry

**Fishermen Alert:**
All fishing vessels currently at sea in Bay of Bengal must return to port **IMMEDIATELY**. Seek shelter. Do not attempt to outrun the storm.

**Evacuation Zones:** Coastal areas within 5 km of Bay of Bengal — contact District Disaster Management Authority.`,
    agentTrace: [
      { agent: 'Planner', status: 'done', action: 'Intent classification', detail: 'Detected: CYCLONE_QUERY — high priority routing', duration_ms: 88, sources: [] },
      { agent: 'DataAgent', status: 'done', action: 'Pulling cyclone track data', detail: 'Retrieved IMD Best Track data + NHC vortex messages (last update: 1500 IST)', duration_ms: 540, sources: ['IMD Cyclone Warning Division', 'RSMC New Delhi'] },
      { agent: 'RiskAgent', status: 'done', action: 'Impact assessment', detail: 'Computed wind radii, storm surge height, coastal vulnerability index', duration_ms: 410, sources: ['NDMA Coastal Risk Atlas', 'IMD Storm Surge Model'] },
      { agent: 'ResponseAgent', status: 'done', action: 'Emergency advisory generation', detail: 'Generated zone-specific safety advisories with evacuation guidance', duration_ms: 200, sources: [] },
    ],
    relatedData: {
      alerts: ['ALT-001'],
      coordinates: [13.5, 82.1],
    },
  },
  {
    id: 'R-004',
    queryPatterns: ['chlorophyll', 'sst', 'temperature', 'sea surface', 'hotspot'],
    response: `🔬 **Ocean Intelligence Briefing — SST & Chlorophyll Analysis**

**Sea Surface Temperature (August 25):**
- Arabian Sea avg: **27.8°C** (0.3°C above seasonal mean)
- Bay of Bengal avg: **29.1°C** (0.8°C above seasonal mean — anomalously warm, feeding cyclone)
- Gulf of Mannar: **28.5°C** — optimal for target species

**Chlorophyll-a Concentration (MODIS):**
- High bloom detected: **Rameswaram–Gulf of Mannar** (3.4–4.1 mg/m³)
- Moderate: Chennai offshore (0.8–1.5 mg/m³)
- Low: Deep Arabian Sea open ocean (0.3–0.6 mg/m³)

**Upwelling Activity:**
Active coastal upwelling detected off **Kerala** and **Karnataka** coasts — nutrient-rich waters surfacing, ideal for pelagic fish aggregation.

**Hotspot Summary:**
🟢 Rameswaram area — highest productivity this week
🟡 Vizhinjam offshore — moderate productivity, improving trend
🔴 Bay of Bengal — high SST suppressing primary productivity due to cyclone mixing`,
    agentTrace: [
      { agent: 'Planner', status: 'done', action: 'Intent classification', detail: 'Detected: OCEANOGRAPHY_QUERY — SST + chlorophyll analysis', duration_ms: 110, sources: [] },
      { agent: 'DataAgent', status: 'done', action: 'Processing satellite imagery', detail: 'Retrieved 4km MODIS SST L3 + 300m Sentinel-3 Chl-a products', duration_ms: 1100, sources: ['NASA OBPG', 'ESA EUMETSAT', 'INCOIS ERDDAP'] },
      { agent: 'DataAgent', status: 'done', action: 'Upwelling detection', detail: 'Applied SST gradient algorithm to identify coastal upwelling signatures', duration_ms: 380, sources: ['INCOIS OIS'] },
      { agent: 'RiskAgent', status: 'done', action: 'Fisheries correlation', detail: 'Cross-referenced SST/Chl hotspots with historical catch data', duration_ms: 240, sources: ['CMFRI Historical Catch DB'] },
      { agent: 'ResponseAgent', status: 'done', action: 'Generating briefing', detail: 'Synthesized multi-layer oceanographic intelligence', duration_ms: 190, sources: [] },
    ],
    relatedData: {
      chartData: [
        { label: 'Rameswaram', value: 4.1 },
        { label: 'Vizhinjam', value: 1.8 },
        { label: 'Chennai', value: 1.2 },
        { label: 'Veraval', value: 0.8 },
        { label: 'Bay (open)', value: 0.4 },
      ],
    },
  },
  {
    id: 'R-DEFAULT',
    queryPatterns: [],
    response: `👋 **Hello! I'm ORCA.**

I'm your AI-powered marine intelligence assistant. I can help you with:

- 🐟 **Potential Fishing Zones** — satellite-based PFZ with species predictions
- 🌊 **Sea Safety Assessment** — wave height, wind, sea state forecasts
- 🌀 **Cyclone & Storm Alerts** — real-time tracking and advisories
- 🗺️ **Safe Vessel Routes** — AI-optimized routing avoiding hazards
- 🔬 **Ocean Data** — SST, chlorophyll, upwelling analysis
- ⚠️ **Geofence Alerts** — maritime boundary proximity warnings

What would you like to know about the sea today?`,
    agentTrace: [],
    relatedData: {},
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getMockResponse(query: string): Promise<ChatResponse> {
  await delay(1500 + Math.random() * 1000);
  // TODO: replace with streaming call to /api/chat
  const lower = query.toLowerCase();
  const match = mockChatResponses.find(r =>
    r.queryPatterns.some(p => lower.includes(p))
  );
  return match || mockChatResponses[mockChatResponses.length - 1];
}
