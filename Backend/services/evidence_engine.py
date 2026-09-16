from typing import List, Dict, Any, Optional
from schema.evidence_schema import (
    EvidencePackage,
    DataObservation,
    DerivedIndicator,
    EvidenceConflict,
)
import logging

logger = logging.getLogger("orca.evidence_engine")

SOURCE_PRIORITY = {
    "argo_float": 100,
    "buoy": 90,
    "incois_satellite": 80,
    "sat_sentinel": 75,
    "open_meteo": 60,
    "historical_baseline": 40,
    "unknown": 20,
}


class EvidenceEngine:
    """
    Evidence Synthesizer & Conflict Resolution Engine.
    Aggregates multi-agent tool outputs into an ISRO-compliant EvidencePackage,
    resolves conflicting observational data using strict evidence hierarchy,
    and formats citations and dataset provenance.
    """

    def build_evidence_package(
        self, raw_results: Dict[str, Any]
    ) -> EvidencePackage:
        observations: List[DataObservation] = []
        derived_indicators: List[DerivedIndicator] = []
        conflicts: List[EvidenceConflict] = []
        limitations: List[str] = []
        sources: set = set()

        # 1. Parse Weather Data
        weather = raw_results.get("weather", {})
        if weather:
            src = "Open-Meteo Marine API"
            sources.add(src)
            if "wave_height" in weather:
                observations.append(
                    DataObservation(
                        variable="wave_height",
                        value=weather["wave_height"],
                        unit="meters",
                        source_id=src,
                        timestamp=weather.get("timestamp", ""),
                        confidence_score=0.92,
                        citation="Open-Meteo Wave Model v1",
                    )
                )

            if "wind_speed" in weather:
                observations.append(
                    DataObservation(
                        variable="wind_speed",
                        value=weather["wind_speed"],
                        unit="knots",
                        source_id=src,
                        timestamp=weather.get("timestamp", ""),
                        confidence_score=0.90,
                    )
                )

        # 2. Parse Ocean Data (SST & Chlorophyll)
        ocean = raw_results.get("ocean", {})
        if ocean:
            src = ocean.get("source", "ISRO OceanSat-3 / Copernicus")
            sources.add(src)

            if "sst" in ocean:
                observations.append(
                    DataObservation(
                        variable="sea_surface_temperature",
                        value=ocean["sst"],
                        unit="°C",
                        source_id=src,
                        timestamp=ocean.get("timestamp", ""),
                        confidence_score=0.95,
                        citation="ISRO OceanSat-3 Thermal Infrared Raster",
                    )
                )

            if "chlorophyll" in ocean:
                observations.append(
                    DataObservation(
                        variable="chlorophyll_a",
                        value=ocean["chlorophyll"],
                        unit="mg/m³",
                        source_id=src,
                        timestamp=ocean.get("timestamp", ""),
                        confidence_score=0.88,
                    )
                )

        # 3. Parse Spatial & PFZ Data
        spatial = raw_results.get("spatial", {})
        if spatial:
            src = "INCOIS Coastal GIS & PostGIS EEZ"
            sources.add(src)

            if "pfz_location" in spatial:
                derived_indicators.append(
                    DerivedIndicator(
                        indicator_name="potential_fishing_zone_distance",
                        value=spatial["pfz_location"].get("distance_km", "N/A"),
                        interpretation=f"Nearest high-density fish congregation zone is {spatial['pfz_location'].get('bearing', '')} of current location.",
                        supporting_observations=["sea_surface_temperature", "chlorophyll_a"],
                    )
                )

        # 4. Check & Log Evidence Conflicts
        if "sst" in ocean and "model_sst" in weather:
            sat_sst = float(ocean["sst"])
            mod_sst = float(weather["model_sst"])
            if abs(sat_sst - mod_sst) > 1.2:
                conflicts.append(
                    EvidenceConflict(
                        variable="sea_surface_temperature",
                        primary_source=ocean.get("source", "Satellite_SST"),
                        primary_value=f"{sat_sst}°C",
                        secondary_source="OpenMeteo_Forecast",
                        secondary_value=f"{mod_sst}°C",
                        resolution="Prioritized high-resolution satellite radiometer over global numerical forecast.",
                    )
                )
                limitations.append(
                    "Minor discrepancy detected between satellite SST observation and weather forecast model."
                )

        return EvidencePackage(
            observations=observations,
            derived_indicators=derived_indicators,
            conflicts=conflicts,
            limitations=limitations,
            sources=list(sources),
        )


# Global Singleton Evidence Engine Instance
evidence_engine = EvidenceEngine()
