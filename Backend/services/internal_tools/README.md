# 🛠️ Orca Domain Tools & Sub-Agents (`services/internal_tools/`)

This directory contains domain-specific AI sub-agents and tool integrations for marine meteorology, ocean forecasting, spatial EEZ boundary lookup, and Potential Fishing Zone (PFZ) advisory fetching.

---

## 📂 Tool Modules

### 1. 🌦️ Meteorology Sub-Agent (`execute_meteorology_agent.py`)
- **Primary Function**: `call_meteorology_agent(prompt: str, role: str)`
- **Role**: Dedicated sub-agent specialized in marine weather interpretation.
- **Tools Available**: `get_marine_weather_forecast` (`open_meteo.py`).

### 2. 🗺️ Spatial Sub-Agent (`execute_spatial_agent.py`)
- **Primary Function**: `call_spatial_agent(prompt: str, role: str)`
- **Role**: Dedicated sub-agent specialized in geographical queries, fishery zone detection, and EEZ boundary status.
- **Tools Available**: `get_pfz_by_location` (`pfz_service.py`).

### 3. 🌊 Marine Weather Forecast Tool (`open_meteo.py`)
- **Primary Function**: `get_marine_weather_forecast(lat: float, long: float)`
- **Integration**: Fetches live marine weather data from Open-Meteo REST API (`https://marine-api.open-meteo.com/v1/marine`).
- **Data Returned**:
  - `wave_height`: Wave height in meters
  - `wave_direction`: Wave direction in degrees
  - `ocean_current_velocity`: Ocean current velocity in m/s
  - `sea_surface_temperature`: SST in °C

### 4. 🐟 Potential Fishing Zone Service (`pfz_service.py`)
- **Functions**: `get_pfz()`, `get_pfz_by_location()`, `_scrape_pfz_sync()`
- **Role**: Scrapes government INCOIS PFZ bulletins and spatial advisories.
- **Concurrency**: Runs CPU/IO sync scraping via `asyncio.to_thread(_scrape_pfz_sync)` to ensure non-blocking operation.

### 5. 🚢 EEZ Boundaries Service (`eez_boundaries_service.py`)
- **Primary Function**: `get_eez_boundaries(lat: float, long: float)`
- **Role**: Executes PostGIS spatial queries (`ST_Contains`, `ST_Within`) against PostgreSQL database containing EEZ spatial shapefiles.
- **Returns**: Territorial waters information, country EEZ metadata, and distance to international boundary.
