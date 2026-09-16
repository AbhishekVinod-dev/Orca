from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict


class DataObservation(BaseModel):
    variable: str = Field(..., description="Name of the marine or meteorological variable (e.g. sea_surface_temperature, wave_height)")
    value: Any = Field(..., description="Value of the observation (numeric, string, or object)")
    unit: Optional[str] = Field(None, description="Measurement unit (e.g. °C, meters, m/s)")
    source_id: str = Field(..., description="Source dataset or API identifier (e.g. Open-Meteo, Argo_Float_29014, INCOIS_PFZ)")
    timestamp: str = Field(..., description="Observation ISO timestamp")
    confidence_score: float = Field(default=1.0, ge=0.0, le=1.0, description="Data reliability confidence score")
    citation: Optional[str] = Field(None, description="Academic or institutional provenance citation")


class DerivedIndicator(BaseModel):
    indicator_name: str = Field(..., description="Derived metric (e.g. wave_steepness_index, fish_abundance_index, iuu_risk_score)")
    value: Any = Field(..., description="Calculated value")
    interpretation: str = Field(..., description="Plain language explanation of the indicator")
    supporting_observations: List[str] = Field(default_factory=list, description="Variables used in calculation")


class EvidenceConflict(BaseModel):
    variable: str = Field(..., description="Conflicting variable name")
    primary_source: str = Field(..., description="High-priority source identifier")
    primary_value: Any = Field(..., description="Value from primary source")
    secondary_source: str = Field(..., description="Lower-priority source identifier")
    secondary_value: Any = Field(..., description="Value from secondary source")
    resolution: str = Field(..., description="Explanation of why primary source was selected")


class EvidencePackage(BaseModel):
    observations: List[DataObservation] = Field(default_factory=list, description="Raw and derived observations")
    derived_indicators: List[DerivedIndicator] = Field(default_factory=list, description="Computed marine indicators")
    correlations: List[str] = Field(default_factory=list, description="Cross-variable correlations")
    conflicts: List[EvidenceConflict] = Field(default_factory=list, description="Identified data discrepancies")
    limitations: List[str] = Field(default_factory=list, description="Data freshness, coverage, or accuracy limitations")
    sources: List[str] = Field(default_factory=list, description="Unique data source citations")
