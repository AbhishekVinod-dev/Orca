from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger("orca.safety_engine")


class SafetyEngine:
    """
    Deterministic Safety & Hazard Evaluation Engine.
    Evaluates weather parameters, marine hazards, and spatial boundary rules
    BEFORE LLM inference to issue non-negotiable safety overrides when severe hazards are present.
    """

    # Hazard Threshold Definitions (ISRO Standard)
    MAX_WAVE_HEIGHT_METERS = 2.5
    MAX_WIND_SPEED_KNOTS = 25.0
    EXTREME_SWELL_PERIOD_SECONDS = 14.0

    def evaluate_safety(
        self,
        lat: float,
        long: float,
        weather_data: Optional[Dict[str, Any]] = None,
        spatial_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        warnings: List[str] = []
        status = "CLEAR"  # CLEAR | CAUTION | DANGER
        hazard_codes: List[str] = []

        if weather_data:
            # 1. Wave Height Check
            wave_height = weather_data.get("wave_height")
            if wave_height is not None and float(wave_height) >= self.MAX_WAVE_HEIGHT_METERS:
                status = "DANGER"
                hazard_codes.append("HIGH_SWELL_HAZARD")
                warnings.append(
                    f"🛑 SEVERE WAVE HAZARD: Significant wave height is {wave_height}m (Exceeds safety threshold of {self.MAX_WAVE_HEIGHT_METERS}m). Sailing is strongly discouraged."
                )

            # 2. Wind Speed Check
            wind_speed = weather_data.get("wind_speed")
            if wind_speed is not None and float(wind_speed) >= self.MAX_WIND_SPEED_KNOTS:
                status = "DANGER"
                hazard_codes.append("EXTREME_WIND_HAZARD")
                warnings.append(
                    f"🛑 EXTREME WIND WARNING: Wind speed is {wind_speed} knots (Exceeds threshold of {self.MAX_WIND_SPEED_KNOTS} kts). Risk of vessel capsize."
                )

            # 3. Cyclone Advisory Check
            if weather_data.get("cyclone_alert_active"):
                status = "DANGER"
                hazard_codes.append("CYCLONE_ALERT")
                warnings.append(
                    "🛑 CYCLONE WARNING ACTIVE: Official maritime storm warning in effect. Return to port immediately."
                )

        if spatial_data:
            # 4. MPA / Border Trespass Check
            if spatial_data.get("in_marine_protected_area"):
                if status != "DANGER":
                    status = "CAUTION"
                hazard_codes.append("MPA_RESTRICTED_ZONE")
                warnings.append(
                    "⚠️ RESTRICTED MARITIME ZONE: You are in or near a Marine Protected Area (MPA). Commercial fishing is illegal in this zone."
                )

            if spatial_data.get("near_international_boundary"):
                if status != "DANGER":
                    status = "CAUTION"
                hazard_codes.append("INTERNATIONAL_BORDER_PROXIMITY")
                warnings.append(
                    "⚠️ MARITIME BORDER PROXIMITY: Location is near the Exclusive Economic Zone (EEZ) international boundary line."
                )

        result = {
            "status": status,
            "has_hazard": status == "DANGER",
            "hazard_codes": hazard_codes,
            "warnings": warnings,
            "hard_override": status == "DANGER",
        }

        if status != "CLEAR":
            logger.warning(f"Safety Engine triggered [{status}]: {hazard_codes}")

        return result


# Global Singleton Safety Engine
safety_engine = SafetyEngine()
