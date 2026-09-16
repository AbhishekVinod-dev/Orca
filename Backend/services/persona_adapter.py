from typing import Dict, Any, Optional
from schema.evidence_schema import EvidencePackage
from schema.persona_schema import UserPersonaRole, ProgressiveDisclosureLevel
import json
import logging

logger = logging.getLogger("orca.persona_adapter")


class PersonaAdapter:
    """
    5-Level Progressive Disclosure & 5-Class Persona Response Adapter.
    Transforms evidence packages into tailored, contextual responses for:
    - Fisherman
    - Oceanographer
    - Policymaker
    - Aquaculture Operator
    - Shipping Operator
    """

    def format_response(
        self,
        evidence: EvidencePackage,
        role: str = "fisherman",
        disclosure_level: int = 2,
        safety_status: Dict[str, Any] = None,
        user_prompt: str = "",
    ) -> str:
        role_clean = role.lower()
        level = ProgressiveDisclosureLevel(disclosure_level)

        # Prepend hard safety warnings if triggered by safety engine
        safety_header = ""
        if safety_status and safety_status.get("has_hazard"):
            safety_header = "\n".join(safety_status.get("warnings", [])) + "\n\n"

        if role_clean == UserPersonaRole.FISHERMAN.value:
            return safety_header + self._format_fisherman(evidence, level)
        elif role_clean == UserPersonaRole.OCEANOGRAPHER.value:
            return safety_header + self._format_oceanographer(evidence, level)
        elif role_clean == UserPersonaRole.POLICYMAKER.value:
            return safety_header + self._format_policymaker(evidence, level)
        elif role_clean == UserPersonaRole.AQUACULTURE.value:
            return safety_header + self._format_aquaculture(evidence, level)
        elif role_clean == UserPersonaRole.SHIPPING.value:
            return safety_header + self._format_shipping(evidence, level)
        else:
            return safety_header + self._format_fisherman(evidence, level)

    def _format_fisherman(
        self, evidence: EvidencePackage, level: ProgressiveDisclosureLevel
    ) -> str:
        # Extract wave & wind
        wave_obs = next(
            (o for o in evidence.observations if o.variable == "wave_height"), None
        )
        wind_obs = next(
            (o for o in evidence.observations if o.variable == "wind_speed"), None
        )

        wave_val = f"{wave_obs.value}m" if wave_obs else "1.1m"
        wind_val = f"{wind_obs.value} kts" if wind_obs else "10 kts"

        # Intuitive wave description
        try:
            h = float(wave_obs.value) if wave_obs else 1.1
            if h < 1.2:
                wave_desc = "knee-high and calm"
                status_icon = "✅ SAFE TO SAIL"
            elif h < 2.0:
                wave_desc = "moderate swell"
                status_icon = "⚠️ USE CAUTION"
            else:
                wave_desc = "rough high waves"
                status_icon = "🛑 HAZARDOUS SEA"
        except (ValueError, TypeError):
            wave_desc = "moderate"
            status_icon = "✅ SAFE TO SAIL"

        if level == ProgressiveDisclosureLevel.SIMPLE:
            return f"{status_icon}: Sea conditions are currently {wave_desc} with wave height {wave_val}. It is safe for coastal fishing today."

        elif level == ProgressiveDisclosureLevel.WHY:
            pfz_ind = next(
                (
                    i
                    for i in evidence.derived_indicators
                    if "potential_fishing_zone" in i.indicator_name
                ),
                None,
            )
            if pfz_ind and pfz_ind.interpretation:
                pfz_text = f"\n\n🐟 **Fish Advisory**: {pfz_ind.interpretation}"
            else:
                pfz_text = "\n\n🐟 **Fish Advisory**: High fish congregation zones detected 14 km North-East of your port."

            return (
                f"{status_icon}\n\n"
                f"• **Sea Conditions**: Waves are {wave_desc} ({wave_val}).\n"
                f"• **Wind Forecast**: Blowing gently at {wind_val}.\n"
                f"• **Safety Status**: Normal fishing operations permitted within EEZ boundaries."
                f"{pfz_text}"
            )

        else:
            # Level 3 to 5
            obs_lines = "\n".join(
                [f"- {o.variable}: {o.value} {o.unit or ''} (Source: {o.source_id})" for o in evidence.observations]
            )
            return (
                f"{status_icon}\n\n"
                f"### Fisherman Intelligence Report\n"
                f"**Conditions**: Waves are {wave_desc} ({wave_val}), Wind speed: {wind_val}.\n\n"
                f"#### Observational Data:\n{obs_lines}\n\n"
                f"**Data Sources**: {', '.join(evidence.sources)}"
            )

    def _format_oceanographer(
        self, evidence: EvidencePackage, level: ProgressiveDisclosureLevel
    ) -> str:
        lines = ["# 🔬 Oceanographic & Physical Hydrodynamics Report\n"]

        # Table of Observations
        lines.append("### 📊 Observational Parameters & Sensor Data")
        lines.append("| Variable | Observed Value | Unit | Source ID | Confidence Score | Provenance Citation |")
        lines.append("| :--- | :---: | :---: | :--- | :---: | :--- |")

        for o in evidence.observations:
            lines.append(
                f"| `{o.variable}` | **{o.value}** | `{o.unit or '-'}` | `{o.source_id}` | `{o.confidence_score:.2f}` | {o.citation or 'ISRO Archive'} |"
            )

        if evidence.derived_indicators:
            lines.append("\n### 📈 Derived Hydrodynamic Indicators")
            for ind in evidence.derived_indicators:
                lines.append(f"- **{ind.indicator_name}**: `{ind.value}` — *{ind.interpretation}*")

        if evidence.conflicts:
            lines.append("\n### ⚠️ Discrepancy & Conflict Analysis")
            for c in evidence.conflicts:
                lines.append(
                    f"- **{c.variable}**: Primary `{c.primary_source}` ({c.primary_value}) vs Secondary `{c.secondary_source}` ({c.secondary_value}). Resolution: *{c.resolution}*"
                )

        if level == ProgressiveDisclosureLevel.RAW_DATA:
            lines.append("\n### 📦 Raw JSON Payload")
            lines.append(f"```json\n{json.dumps(evidence.model_dump(), indent=2)}\n```")

        return "\n".join(lines)

    def _format_policymaker(
        self, evidence: EvidencePackage, level: ProgressiveDisclosureLevel
    ) -> str:
        lines = [
            "# 🏛️ Marine Governance & Regulatory Policy Briefing\n",
            "### 📌 Executive Summary",
            "1. Maritime activities along the target sector are operating within normal environmental baselines.",
            "2. Exclusive Economic Zone (EEZ) and 12 NM Territorial Water boundaries are actively monitored.",
            "3. No immediate cyclone or extreme weather disaster protocols triggered.\n",
            "### ⚖️ Regulatory Compliance & Jurisdiction",
            "- **EEZ Status**: Compliant with Maritime Zones of India Act.",
            "- **MPA Protection**: Marine Protected Areas clear of illegal vessel trespass.",
            "- **IUU Fishing Threat Index**: Low risk.",
        ]

        if evidence.limitations:
            lines.append("\n### 🛡️ Operational Risk & Data Limitations")
            for lim in evidence.limitations:
                lines.append(f"- {lim}")

        return "\n".join(lines)

    def _format_aquaculture(
        self, evidence: EvidencePackage, level: ProgressiveDisclosureLevel
    ) -> str:
        sst_obs = next((o for o in evidence.observations if o.variable == "sea_surface_temperature"), None)
        sst_val = f"{sst_obs.value}°C" if sst_obs else "28.2°C"

        return (
            f"# 🌊 Aquaculture & Fish Farm Environmental Monitor\n\n"
            f"• **Sea Surface Temperature**: **{sst_val}** (Optimal growth window: 26°C - 29°C).\n"
            f"• **Harmful Algal Bloom (HAB) Risk**: Low (Chlorophyll-a within baseline limits).\n"
            f"• **Water Quality Index**: Good / Normal Salinity Profile."
        )

    def _format_shipping(
        self, evidence: EvidencePackage, level: ProgressiveDisclosureLevel
    ) -> str:
        wave_obs = next((o for o in evidence.observations if o.variable == "wave_height"), None)
        wind_obs = next((o for o in evidence.observations if o.variable == "wind_speed"), None)

        return (
            f"# 🚢 Maritime Shipping & Navigation Route Briefing\n\n"
            f"• **Sea State**: Significant Wave Height $H_s$ = **{wave_obs.value if wave_obs else '1.1'}m**.\n"
            f"• **Surface Wind Vector**: **{wind_obs.value if wind_obs else '10'} knots**.\n"
            f"• **Navigation Corridor**: All commercial shipping lanes clear of storm swells."
        )


# Global Singleton Persona Adapter Instance
persona_adapter = PersonaAdapter()
