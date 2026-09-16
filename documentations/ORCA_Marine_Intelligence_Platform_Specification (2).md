# ORCA --- Universal Marine Intelligence Platform

## Product, Data, AI, Architecture, Governance, and Implementation Specification

**Problem Statement:** 26176 --- ORCA Marine EcOsystem Reasoning with
Collaborative Agents\
**Organization:** Indian Space Research Organisation (ISRO)\
**Theme:** Disaster Management\
**Document Status:** Product and Technical Baseline\
**Version:** 1.0\
**Date:** 2026-08-29

------------------------------------------------------------------------

# 1. Executive Summary

ORCA is a universal marine intelligence platform that converts
heterogeneous marine, environmental, geospatial, fisheries,
meteorological, regulatory, and observational data into contextual,
evidence-backed intelligence for different classes of marine
stakeholders.

The central product principle is:

> **ORCA recommends based on evidence; the human makes the final
> decision.**

ORCA is not intended to be a generic chatbot, a dashboard that exposes
raw numbers, or an autonomous system that decides what fishermen,
researchers, regulators, or operators should do.

It acts as an intelligence layer between complex marine data and human
decision-making.

The same underlying marine intelligence can support different users:

-   Small-scale fishermen and coastal communities
-   Marine biologists and oceanographers
-   Fisheries and marine researchers
-   Conservation organizations
-   Aquaculture operators
-   Shipping and maritime operators
-   Government regulators
-   Disaster-management and coastal authorities
-   Other future marine stakeholders

The platform should interpret natural-language or voice queries,
identify the user's context, retrieve appropriate evidence, perform
spatial-temporal reasoning, correlate heterogeneous sources, explain the
resulting inference, and provide a recommendation appropriate to the
user's role.

ORCA should not optimize for an arbitrary global objective such as
maximum catch, maximum economic value, or minimum cost. Instead, it
should expose relevant evidence and derived intelligence so the user can
make an informed decision.

------------------------------------------------------------------------

# 2. Product Vision

## 2.1 Vision

Build a unified marine intelligence layer capable of answering:

> **What is happening in the marine environment, why is it happening,
> what does the available evidence imply, and what should the user
> consider doing?**

without taking the decision away from the user.

## 2.2 Product Philosophy

ORCA follows six principles:

1.  **Evidence before recommendation**
2.  **Human decision authority**
3.  **Context-specific reasoning**
4.  **Progressive disclosure of complexity**
5.  **Explicit uncertainty and evidence conflicts**
6.  **Traceable and auditable intelligence**

## 2.3 What ORCA Is Not

ORCA is not:

-   A replacement for professional scientific analysis
-   An autonomous captain
-   A system that guarantees fish catch
-   A system that guarantees safety
-   A generic LLM wrapper
-   A raw-data dashboard
-   An optimizer that silently chooses economic or ecological objectives
-   A system that treats every data source as equally trustworthy
-   A system that blindly learns from user feedback

------------------------------------------------------------------------

# 3. Core Product Definition

## 3.1 Core Statement

> **ORCA gives marine stakeholders a unified way to understand marine
> conditions and make evidence-backed decisions by combining
> heterogeneous environmental, oceanographic, geospatial, fisheries,
> observational, and regulatory data into contextual marine
> intelligence.**

## 3.2 The Intelligence Chain

ORCA should transform:

``` text
Raw Data
   ↓
Data Quality / Provenance
   ↓
Observation
   ↓
Derived Indicator
   ↓
Cross-source Correlation
   ↓
Contextual Interpretation
   ↓
Evidence-backed Recommendation
   ↓
Human Decision
```

The system should stop at the recommendation layer.

It should not automatically execute the user's real-world decision.

------------------------------------------------------------------------

# 4. User Segmentation

ORCA should use a shared marine intelligence foundation with
user-specific reasoning and presentation.

## 4.1 Fishermen / Coastal Communities

### Primary needs

-   Where are currently favorable fishing areas?
-   Are sea conditions suitable for departure?
-   Which areas should be avoided?
-   Which route appears appropriate based on current and forecast
    conditions?
-   How do environmental conditions compare across nearby areas?

### Example

User:

> Where should I consider fishing tomorrow morning?

ORCA:

> **Area A currently shows more favorable fishing indicators than Area
> B.**
>
> Evidence: - SST is within the favorable observed range. - Chlorophyll
> concentration is elevated. - Current sea-state forecast is
> acceptable. - No active hazard intersects the area.
>
> Conditions are forecast to deteriorate after 14:00.
>
> **Recommendation:** Area A is currently the stronger candidate based
> on available evidence.
>
> **Decision:** You should assess the conditions and decide whether to
> proceed.

The user can ask:

> Why Area A?

The system then exposes deeper evidence.

### Deliberately out of core scope

The initial fisherman experience should not focus on:

-   Gear selection
-   Selling strategy
-   Market optimization
-   Business optimization
-   Fishing technique instruction
-   Catch guarantees

------------------------------------------------------------------------

# 5. Researcher Experience

Researchers should have substantially deeper access to evidence.

Example:

> Why has productivity changed in this coastal region?

ORCA can provide:

1.  Observed changes
2.  Historical comparison
3.  SST anomalies
4.  Chlorophyll trends
5.  Current patterns
6.  Relevant biological/environmental datasets
7.  Correlations
8.  Data gaps
9.  Conflicting evidence
10. Methodological explanation

Researchers should be able to progressively inspect the evidence behind
an answer.

### Research mode

``` text
Natural Language Query
        ↓
Research Intent
        ↓
Dataset Discovery
        ↓
Temporal / Spatial Alignment
        ↓
Statistical / Geospatial Analysis
        ↓
Evidence Graph
        ↓
Interpretation
        ↓
Visualization
        ↓
Research Answer
```

------------------------------------------------------------------------

# 6. Policymaker / Regulator Experience

The platform should support scenario analysis rather than simply saying:

> "Do X."

Example:

> What could happen if fishing restrictions are introduced in this
> region?

ORCA should be capable of presenting:

-   affected geographic regions
-   observed fishing activity
-   ecological indicators
-   historical trends
-   potentially affected stakeholders
-   scenario assumptions
-   evidence supporting each conclusion
-   trade-offs
-   uncertainties

The final regulatory decision remains human.

------------------------------------------------------------------------

# 7. Conservation Organization Experience

Potential use cases:

-   ecosystem stress detection
-   protected-area monitoring
-   fishing-pressure analysis
-   habitat change
-   environmental anomalies
-   marine biodiversity indicators
-   conflict between ecological zones and human activity

The system should not automatically assume conservation objectives are
always superior to livelihood objectives.

It should expose evidence and competing effects.

------------------------------------------------------------------------

# 8. Aquaculture Experience

Potential intelligence:

-   water-quality trends
-   temperature anomalies
-   harmful algal bloom indicators
-   disease-risk indicators
-   weather events
-   coastal water conditions
-   environmental suitability

Recommendations must remain evidence-based and should distinguish
environmental indicators from confirmed disease diagnoses.

------------------------------------------------------------------------

# 9. Maritime / Shipping Experience

Potential intelligence:

-   sea-state conditions
-   weather hazards
-   route context
-   restricted areas
-   maritime boundaries
-   forecast conditions
-   hazard avoidance
-   operational planning

Shipping functionality should remain a specialized context over the same
marine intelligence foundation rather than turning ORCA into a generic
logistics optimizer.

------------------------------------------------------------------------

# 10. Shared Intelligence, Localized Experience

ORCA should not build completely independent systems for every persona.

Instead:

``` text
                  ORCA Core Intelligence
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Fisherman        Researcher       Regulator
        │                │                │
   Simple answer     Deep analysis    Scenarios
   Local language    Statistics       Evidence
   Voice             Data access      Policy context
```

The underlying data and evidence layer are shared.

The reasoning context, presentation, terminology, permissions, and
response depth are specialized.

------------------------------------------------------------------------

# 11. Universal vs Local Architecture

## Universal

-   Marine data model
-   Spatial reasoning
-   Temporal reasoning
-   Evidence model
-   Provenance
-   Dataset discovery
-   Agent/tool framework
-   Analytical primitives
-   Conversational context
-   Auditability

## Localized

-   Language
-   Local terminology
-   Fishing vocabulary
-   Species names
-   State-specific regulations
-   Coastal advisories
-   Local hazards
-   Local datasets
-   Local fishing practices
-   Geographic context
-   Communication style

A Tamil Nadu fisherman should not simply receive an English answer
translated into Tamil.

The system should understand local marine terminology and context.

------------------------------------------------------------------------

# 12. Language and Voice

ORCA should support:

-   Text input
-   Voice input
-   Text output
-   Voice output
-   Indian regional languages

Sarvam APIs should be integrated for Indian-language speech and language
capabilities where appropriate.

## Interaction pipeline

``` text
Voice
 ↓
Speech Recognition
 ↓
Language Identification
 ↓
Marine Intent + Entity Extraction
 ↓
Canonical ORCA Query
 ↓
Reasoning
 ↓
Localized Response Generation
 ↓
Speech Synthesis
```

The internal representation should be language-neutral.

Example:

``` json
{
  "intent": "fishing_area_suitability",
  "location": {
    "type": "user_location"
  },
  "time_window": {
    "start": "...",
    "end": "..."
  },
  "language": "ta-IN"
}
```

This prevents the reasoning layer from becoming tightly coupled to a
particular language.

------------------------------------------------------------------------

# 13. Progressive Disclosure

ORCA should not expose the same amount of technical information to every
user.

## Level 1 --- Simple intelligence

> Area A currently appears more favorable.

## Level 2 --- Why

> SST and chlorophyll conditions are favorable.

## Level 3 --- Evidence

> SST: X\
> Chlorophyll: Y\
> Wave height: Z\
> Forecast: ...

## Level 4 --- Scientific detail

> Dataset provenance, temporal windows, statistical relationship,
> anomalies, methodology.

## Level 5 --- Raw data

Researchers can access the underlying datasets and analytical outputs.

This prevents technical complexity from becoming a usability barrier.

------------------------------------------------------------------------

# 14. Recommendation Philosophy

ORCA should use a four-level evidence hierarchy.

## Level 1 --- Observation

Directly measured or retrieved value.

Example:

> SST = 28.1°C.

## Level 2 --- Derived indicator

Computed from observations.

Example:

> SST anomaly = +1.2°C.

## Level 3 --- Correlation

Relationship identified across datasets.

Example:

> Similar environmental patterns historically corresponded with
> increased productivity.

## Level 4 --- Recommendation

Actionable interpretation.

Example:

> Region A currently appears more suitable for investigation based on
> the available evidence.

## Level 5 --- Human decision

Outside ORCA's authority.

Example:

> Go fishing in Region A.

ORCA should not make Level 5 decisions.

------------------------------------------------------------------------

# 15. Evidence and Uncertainty

ORCA should not hide uncertainty.

However, it should also avoid meaningless disclaimers.

Bad:

> Maybe this area could potentially be good.

Better:

> **Area A currently shows stronger fishing indicators than nearby Area
> B.**

Then explain:

> This assessment is based on SST, chlorophyll, and environmental
> conditions. Direct catch observations are not available for this
> period.

The system should be decisive about evidence while being honest about
evidence limitations.

------------------------------------------------------------------------

# 16. Evidence Conflict

Different sources may disagree.

Example:

``` text
Satellite-derived indicator → Favorable
Historical catch data        → Mixed
Fisher observations         → Poor
```

ORCA should not silently choose one.

It should surface:

> **Evidence is conflicting.**

Then explain:

-   what each source indicates
-   source reliability
-   observation period
-   spatial coverage
-   possible reasons for disagreement

The user should be able to inspect the disagreement.

------------------------------------------------------------------------

# 17. Evidence Hierarchy

A proposed hierarchy:

``` text
Direct authoritative observation
        ↓
Validated scientific dataset
        ↓
Derived analytical product
        ↓
Model prediction
        ↓
Verified user observation
        ↓
Unverified user report
```

This is not a permanent ranking of truth.

A direct observation can be stale.

A model can be more informative over a large region.

The system should consider:

-   recency
-   spatial resolution
-   temporal resolution
-   measurement quality
-   source authority
-   validation status
-   coverage

rather than blindly trusting source type.

------------------------------------------------------------------------

# 18. User Feedback

User feedback is valuable but should not directly train the model.

## Proposed pipeline

``` text
User Observation
      ↓
Validation / Quality Checks
      ↓
Evidence Record
      ↓
Cross-source Comparison
      ↓
Confidence / Reliability Assessment
      ↓
Approved Knowledge
      ↓
Model / Dataset Improvement
```

Example:

> Fisher: "No fish were found here."

The system records:

-   location
-   time
-   user
-   fishing context if voluntarily provided
-   species if known
-   observation
-   supporting conditions

It should then compare the observation against other data.

------------------------------------------------------------------------

# 19. Feedback Conflict

If:

``` text
Satellite → favorable
Model → favorable
Historical observations → favorable
Users → poor
```

ORCA should not simply overwrite the model.

It should flag the discrepancy.

Potential explanation:

> Current user observations do not align with the environmental
> indicators used by the prediction.

This creates an opportunity for:

-   model evaluation
-   dataset-gap detection
-   anomaly discovery
-   scientific investigation

------------------------------------------------------------------------

# 20. Data Strategy

ORCA does not depend on a single fixed dataset.

The data layer should be designed around categories of information and
then populated with authoritative datasets.

Potential data families include:

## Earth Observation

-   SST
-   Chlorophyll-a
-   ocean colour
-   ocean productivity indicators
-   satellite-derived environmental products

## Oceanographic

-   temperature
-   salinity
-   currents
-   waves
-   sea level
-   Argo observations
-   ocean model outputs

## Meteorological

-   wind
-   rainfall
-   pressure
-   lightning
-   storms
-   cyclone tracks
-   forecasts

## Fisheries

-   PFZ products
-   fisheries statistics
-   catch observations
-   species distribution
-   habitat models

## Vessel / Maritime

-   AIS where legally and technically available
-   vessel activity
-   maritime traffic
-   route information

## Geospatial

-   coastlines
-   bathymetry
-   maritime boundaries
-   EEZ
-   marine protected areas
-   restricted areas
-   ecological zones
-   ports

## Socioeconomic

Potential future sources:

-   market prices
-   landing data
-   fisheries economics

These should not be required for the core fisherman experience.

## Regulatory / Advisory

-   fishing restrictions
-   seasonal closures
-   marine advisories
-   cyclone advisories
-   government notifications
-   protected-area rules

------------------------------------------------------------------------

# 21. Data Source Strategy

Prioritize:

1.  Indian government / ISRO / official sources
2.  NOAA and other national oceanographic agencies
3.  NASA Earth observation sources
4.  Copernicus Marine
5.  International scientific organizations
6.  Open research datasets
7.  Carefully validated third-party datasets
8.  Kaggle and similar repositories primarily for experimentation,
    benchmarking, or historical research---not as the default
    authoritative operational source

Every production dataset should have metadata:

``` json
{
  "dataset_id": "...",
  "provider": "...",
  "product": "...",
  "variables": [],
  "spatial_resolution": "...",
  "temporal_resolution": "...",
  "coverage": "...",
  "update_frequency": "...",
  "license": "...",
  "provenance": "...",
  "quality_status": "...",
  "last_ingested": "..."
}
```

------------------------------------------------------------------------

# 22. Data Architecture

ORCA should separate ingestion from intelligence.

``` text
External Sources
      │
      ▼
Data Connectors
      │
      ▼
Raw Data Lake
      │
      ▼
Normalization / Quality
      │
      ▼
Canonical Marine Data Layer
      │
      ├── Spatial Index
      ├── Temporal Index
      ├── Metadata Catalog
      └── Provenance Graph
              │
              ▼
       Intelligence Layer
```

------------------------------------------------------------------------

# 23. Canonical Marine Data Model

The platform needs a common representation across datasets.

Core entities:

``` text
Observation
Dataset
Location
Geometry
TimeWindow
EnvironmentalVariable
Species
Vessel
Hazard
Advisory
Regulation
Prediction
DerivedIndicator
Evidence
Recommendation
UserObservation
```

An observation should conceptually contain:

``` json
{
  "variable": "sea_surface_temperature",
  "value": 28.1,
  "unit": "degC",
  "geometry": "...",
  "timestamp": "...",
  "source": "...",
  "quality": "...",
  "provenance": "..."
}
```

------------------------------------------------------------------------

# 24. Spatial Intelligence

Spatial reasoning is fundamental to ORCA.

The platform must support:

-   point queries
-   radius queries
-   polygon queries
-   nearest-area analysis
-   intersection
-   containment
-   proximity
-   route corridors
-   geofencing
-   raster extraction
-   spatial aggregation

Example:

``` text
User Location
      ↓
Generate Search Region
      ↓
Retrieve Environmental Layers
      ↓
Intersect Hazards
      ↓
Intersect Restricted Areas
      ↓
Evaluate Candidate Regions
      ↓
Rank / Compare Evidence
```

------------------------------------------------------------------------

# 25. Temporal Intelligence

Marine data changes continuously.

Queries must understand:

-   now
-   today
-   tomorrow
-   tomorrow morning
-   last week
-   historical period
-   seasonal patterns
-   forecast windows
-   anomalies

Every result should retain temporal provenance.

Example:

``` text
Observation:
2026-08-29 08:00

Forecast:
2026-08-30 06:00–12:00

Historical comparison:
2016–2025
```

------------------------------------------------------------------------

# 26. Geofencing

Geofencing is a core safety/context capability.

Potential boundaries:

-   EEZ
-   international maritime boundaries
-   restricted waters
-   marine protected areas
-   ecological zones
-   seasonal closures
-   port exclusion zones
-   other operational boundaries

The system should distinguish:

``` text
Environmental suitability
        +
Safety status
        +
Regulatory/geospatial status
```

A region can be environmentally favorable but legally restricted.

The recommendation layer must not hide this.

------------------------------------------------------------------------

# 27. Offline / Limited Connectivity

Offline capability is important for at-sea users.

The first offline scope should retain:

-   maps
-   saved routes
-   previous conversations
-   previously retrieved intelligence
-   previously received alerts/advisories

Cached information must visibly show:

-   source
-   retrieval timestamp
-   validity period
-   LIVE / CACHED status
-   forecast period
-   age of information

Never present stale information as live information.

Example:

``` text
STATUS: CACHED
Retrieved: 29 Aug 2026 08:30
Forecast period: 29 Aug 12:00–18:00
Source: Official forecast provider
```

Safety-critical information should be conservative when stale.

------------------------------------------------------------------------

# 28. Agentic Architecture

The platform should use agents where autonomous reasoning and tool
selection provide real value.

It should NOT turn every API call into an agent.

A useful architecture is:

``` text
                    User
                     │
                     ▼
             Conversation Layer
                     │
                     ▼
              Intent / Context
                     │
                     ▼
                Planner Agent
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
 Marine Data     Geospatial     Risk /
 Discovery       Reasoning      Safety
 Agent           Agent          Agent
        │            │            │
        └────────────┼────────────┘
                     ▼
              Analysis Layer
                     │
                     ▼
             Evidence Synthesizer
                     │
                     ▼
             Recommendation Agent
                     │
                     ▼
             Response Generator
                     │
                     ▼
          Localized Text / Voice
```

------------------------------------------------------------------------

# 29. Agent Responsibilities

## Planner Agent

Responsible for:

-   understanding the request
-   decomposing complex tasks
-   identifying required evidence
-   selecting appropriate tools/agents
-   maintaining execution state

It should not perform every analytical task itself.

## Data Discovery Agent

Finds:

-   relevant datasets
-   APIs
-   time windows
-   spatial coverage
-   variable availability
-   dataset quality

## Ocean Intelligence Agent

Handles:

-   SST
-   chlorophyll
-   currents
-   waves
-   oceanographic variables
-   derived ocean indicators

## Weather Intelligence Agent

Handles:

-   wind
-   rainfall
-   storms
-   lightning
-   cyclone conditions
-   weather forecasts

## Geospatial Agent

Handles:

-   coordinates
-   spatial filtering
-   geofencing
-   distance
-   route corridors
-   intersections
-   protected areas

## Risk Agent

Combines:

-   hazards
-   sea state
-   weather
-   geofences
-   forecast conditions

It should explain risk factors rather than output an unexplained risk
score.

## Analysis Agent

Performs:

-   statistical analysis
-   trend analysis
-   anomaly detection
-   comparison
-   spatial analysis
-   temporal analysis

This becomes especially important for researchers.

## Evidence Synthesizer

Creates an evidence package:

``` json
{
  "observations": [],
  "derived_indicators": [],
  "correlations": [],
  "conflicts": [],
  "limitations": [],
  "sources": []
}
```

## Recommendation Agent

Converts evidence into contextual recommendations.

It must respect:

-   user persona
-   location
-   time
-   constraints
-   evidence quality
-   conflicts

## Response Agent

Produces:

-   concise answer
-   reasoning
-   evidence
-   maps
-   charts
-   citations/provenance
-   localized language

------------------------------------------------------------------------

# 30. Standard RAG vs Agentic RAG

ORCA should support both.

## Standard RAG

Best for:

-   regulations
-   advisories
-   documentation
-   scientific descriptions
-   static knowledge
-   dataset documentation

``` text
Query
 ↓
Retrieve
 ↓
Rank
 ↓
Generate
```

## Agentic RAG

Best for:

-   complex multi-source queries
-   spatial-temporal analysis
-   dynamic data
-   multi-step reasoning
-   scenario analysis

``` text
Query
 ↓
Planner
 ↓
Dataset discovery
 ↓
Tool selection
 ↓
Retrieval
 ↓
Analysis
 ↓
Cross-source reasoning
 ↓
Evidence synthesis
 ↓
Response
```

The system should select the simpler approach when sufficient.

------------------------------------------------------------------------

# 31. Tool Layer

Agents should operate through deterministic tools.

Examples:

``` text
get_sst()
get_chlorophyll()
get_wave_forecast()
get_wind_forecast()
get_cyclone_alerts()
get_lightning()
get_tides()
get_pfzs()
query_vessel_activity()
query_mpa()
query_maritime_boundary()
query_regulations()
spatial_intersection()
calculate_distance()
extract_raster()
aggregate_timeseries()
run_statistical_analysis()
generate_map()
generate_chart()
```

The tool layer should be deterministic and testable.

The LLM should decide **which tool to use**, not replace the tool.

------------------------------------------------------------------------

# 32. Why This Matters

Bad architecture:

``` text
LLM → "reason" about SST
```

Better:

``` text
LLM
 ↓
Calls SST tool
 ↓
Receives structured data
 ↓
Analysis tool computes result
 ↓
LLM interprets evidence
```

This reduces hallucination and improves reproducibility.

------------------------------------------------------------------------

# 33. Proposed System Architecture

``` text
                         ┌──────────────────┐
                         │   Web / Mobile   │
                         │ Text + Voice + UI │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ API / Gateway    │
                         └────────┬─────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
          Conversation Service             Authentication
                  │
                  ▼
          Context / Session Store
                  │
                  ▼
             Agent Runtime
                  │
       ┌──────────┼───────────┐
       ▼          ▼           ▼
    Planner     Data       Geospatial
      Agent     Agent        Agent
       │          │           │
       └──────────┼───────────┘
                  ▼
             Analysis
                  │
                  ▼
           Evidence Layer
                  │
                  ▼
          Recommendation
                  │
                  ▼
          Response / Voice
                  │
                  ▼
                 User
```

Data plane:

``` text
External Sources
      ↓
Connectors / Ingestion
      ↓
Raw Data Lake
      ↓
Processing / ETL
      ↓
Canonical Marine Data Store
      ↓
Spatial + Temporal Indexes
      ↓
Agent Tools
```

------------------------------------------------------------------------

# 34. Recommended Technology Direction

Technology should remain replaceable.

A practical initial stack:

## Frontend

-   Next.js
-   TypeScript
-   MapLibre GL / compatible geospatial map stack
-   WebSocket or Server-Sent Events for streaming
-   PWA capabilities for offline caching
-   Voice UI

## Backend

-   Python
-   FastAPI
-   Pydantic
-   asynchronous workers
-   event-driven processing where appropriate

## AI

-   LLM provider abstraction
-   Agent orchestration framework only where useful
-   embedding model abstraction
-   multilingual model/API integration
-   Sarvam for Indian-language voice/language workflows

## Data

Object storage / data lake:

-   S3-compatible storage

Metadata/catalog:

-   PostgreSQL

Geospatial:

-   PostGIS

Large-scale analytics:

-   DuckDB / distributed analytical engine as scale requires

Raster / scientific data:

-   xarray
-   Zarr
-   GDAL/raster tooling

Vector search:

-   pgvector initially
-   dedicated vector infrastructure only when required

## Messaging

Potential:

-   SQS
-   Kafka
-   managed event streaming

Use the simplest system that meets throughput requirements.

------------------------------------------------------------------------

# 35. Cloud Architecture Direction

AWS is a natural deployment target if the project requires
production-scale cloud infrastructure.

Conceptually:

``` text
CloudFront
    │
    ▼
Web Application
    │
    ▼
API Gateway / ALB
    │
    ▼
FastAPI Services
    │
 ┌──┼──────────────┐
 ▼  ▼              ▼
RDS  S3        Agent Workers
 │   │              │
 │   └──────┬───────┘
 │          ▼
 │      Data Processing
 │          │
 └──────────┘
```

For larger ingestion workloads:

``` text
External APIs
    ↓
Scheduled/Event Ingestion
    ↓
S3 Raw Zone
    ↓
Processing
    ↓
S3 Curated Zone
    ↓
PostGIS / Analytics
    ↓
ORCA Tools
```

------------------------------------------------------------------------

# 36. Data Lake Zones

## Raw

Exact source data.

Never overwrite.

## Clean

Validated, normalized data.

## Curated

Canonical ORCA-compatible products.

## Analytical

Derived products:

-   anomalies
-   trends
-   correlations
-   suitability indicators
-   risk layers

## Evidence

Evidence packages used in recommendations.

This makes the system auditable.

------------------------------------------------------------------------

# 37. Provenance

Every important answer should be traceable.

Conceptually:

``` text
Recommendation
    ↓
Reasoning
    ↓
Derived Indicators
    ↓
Observations
    ↓
Dataset
    ↓
Source Provider
```

A response should be able to answer:

-   Which datasets were used?
-   What timestamp?
-   Which geographic region?
-   Which model?
-   Which calculations?
-   Which assumptions?
-   What evidence conflicted?
-   What information was unavailable?

------------------------------------------------------------------------

# 38. Example Evidence Object

``` json
{
  "claim": "Region A has favorable environmental indicators",
  "evidence": [
    {
      "dataset": "SST",
      "observation": "...",
      "timestamp": "...",
      "source": "..."
    },
    {
      "dataset": "Chlorophyll",
      "observation": "...",
      "timestamp": "...",
      "source": "..."
    }
  ],
  "limitations": [
    "No direct catch observations available"
  ],
  "conflicts": [],
  "method": "multi-factor environmental assessment"
}
```

------------------------------------------------------------------------

# 39. Conversation Architecture

Conversation state should contain:

``` text
User identity
Persona
Location
Preferred language
Current query
Previous queries
Relevant entities
Time window
Spatial context
Previous evidence
Previous recommendations
User feedback
```

Example:

User:

> What about tomorrow?

The system should resolve:

``` text
tomorrow
+
previously discussed location
+
previously discussed activity
```

rather than treating it as a standalone question.

------------------------------------------------------------------------

# 40. Intent Model

Potential intents:

``` text
FISHING_AREA_SUITABILITY
DEPARTURE_CONDITIONS
HAZARD_AVOIDANCE
ROUTE_CONTEXT
MARINE_CONDITIONS
PFZ_DISCOVERY
HISTORICAL_ANALYSIS
TREND_ANALYSIS
SPECIES_ANALYSIS
ECOSYSTEM_ANALYSIS
POLICY_SCENARIO
REGULATORY_LOOKUP
AQUACULTURE_RISK
VESSEL_OPERATION
DATASET_DISCOVERY
EXPLANATION
COMPARE_REGIONS
```

Intent classification should not rely exclusively on an LLM.

Use structured validation after LLM classification.

------------------------------------------------------------------------

# 41. Response Contract

The backend should produce structured intelligence before rendering it.

Example:

``` json
{
  "answer": "...",
  "recommendation": "...",
  "evidence": [],
  "hazards": [],
  "geofences": [],
  "maps": [],
  "charts": [],
  "sources": [],
  "limitations": [],
  "conflicts": [],
  "freshness": {},
  "language": "ta-IN"
}
```

This allows the frontend to render:

-   conversational answer
-   evidence cards
-   maps
-   charts
-   warnings
-   source information

without parsing arbitrary LLM text.

------------------------------------------------------------------------

# 42. Safety Model

Safety-related answers require stricter rules.

For:

> Is it safe to go to sea tomorrow?

ORCA should never return a binary guarantee.

Instead:

``` text
Current conditions
+
Forecast conditions
+
Hazards
+
Warnings
+
Data freshness
+
Known limitations
```

Then produce an evidence-based assessment.

Example:

> **Conditions currently appear favorable, but wave height is forecast
> to increase after 14:00. No active cyclone warning intersects the
> area. Check the latest official advisory before departure.**

------------------------------------------------------------------------

# 43. Hazard Pipeline

``` text
Cyclone
Lightning
Wind
Wave
Rain
Storm Surge
Other Alerts
      │
      ▼
Normalize
      │
      ▼
Spatial Intersection
      │
      ▼
Temporal Intersection
      │
      ▼
User Location / Route
      │
      ▼
Hazard Assessment
      │
      ▼
Alert / Recommendation
```

------------------------------------------------------------------------

# 44. Maps

Maps should be a first-class output rather than decoration.

Potential layers:

-   SST
-   chlorophyll
-   PFZ
-   wave height
-   wind
-   currents
-   cyclone track
-   lightning
-   vessel activity
-   MPA
-   boundaries
-   restricted zones
-   fishing suitability
-   route context

Map layers should carry:

-   timestamp
-   source
-   resolution
-   freshness

------------------------------------------------------------------------

# 45. Route Intelligence

ORCA should initially provide **route context**, not autonomous
navigation.

Example:

> Route A is shorter but crosses an area with deteriorating wave
> conditions.

> Route B is longer but avoids the forecast hazard region.

This presents evidence and trade-offs.

The user chooses.

A future autonomous navigation capability should be treated as a
separate safety-critical product scope.

------------------------------------------------------------------------

# 46. Security and Access Control

Different users may have different access rights.

Potential roles:

``` text
PUBLIC_USER
FISHERMAN
RESEARCHER
NGO
AQUACULTURE_OPERATOR
MARITIME_OPERATOR
REGULATOR
ADMIN
DATA_PROVIDER
```

Sensitive datasets should not automatically become public.

Examples:

-   private vessel data
-   personally identifiable information
-   commercially sensitive catch data
-   restricted government datasets

Access should be enforced at the data/tool layer, not merely the UI.

------------------------------------------------------------------------

# 47. Governance

ORCA needs governance because recommendations can affect:

-   livelihoods
-   safety
-   fishing pressure
-   biodiversity
-   regulatory decisions
-   commercial operations

Required principles:

-   provenance
-   audit logs
-   source attribution
-   model versioning
-   evidence traceability
-   data-quality metadata
-   conflict visibility
-   human decision authority
-   feedback verification

------------------------------------------------------------------------

# 48. Bias

Potential biases:

## Geographic bias

More data in one region can cause better recommendations there.

## Vessel bias

AIS-heavy datasets can represent commercial vessels more strongly than
small-scale fishermen.

## Seasonal bias

Training data from certain seasons may not generalize.

## Species bias

Well-studied species can receive better predictions.

## Language bias

English queries may initially receive better NLP performance than
local-language queries.

## User feedback bias

Highly active users can disproportionately influence the feedback
system.

ORCA should expose relevant data gaps rather than hiding them.

------------------------------------------------------------------------

# 49. Data Quality

Each dataset should have quality metadata.

Example:

``` text
Freshness
Coverage
Resolution
Completeness
Validation status
Source authority
Known limitations
```

A recommendation should degrade gracefully when evidence is weak.

------------------------------------------------------------------------

# 50. No Mock/Fallback Production Data

The previous architecture contained mock alert data and placeholder PFZ
data.

These should be completely removed from the new architecture.

Development environments may use explicitly labeled synthetic fixtures
for automated tests, but:

> **No mock or fabricated data should ever be presented as real marine
> information.**

Production must use real data sources.

------------------------------------------------------------------------

# 51. Testing Strategy

Testing must cover more than software correctness.

## Unit tests

-   geospatial calculations
-   temporal calculations
-   unit conversion
-   data normalization
-   hazard intersection

## Integration tests

-   external APIs
-   ingestion pipelines
-   agent tools
-   database
-   map generation

## AI evaluation

-   intent accuracy
-   tool selection
-   grounding
-   hallucination
-   evidence completeness
-   recommendation consistency
-   multilingual performance

## Scientific validation

Where ground truth is available:

-   precision
-   recall
-   RMSE
-   correlation
-   calibration
-   spatial accuracy

Where ground truth is unavailable:

-   provenance validation
-   expert review
-   cross-source consistency
-   methodological correctness

------------------------------------------------------------------------

# 52. Evaluation Framework

ORCA should not use a single "AI accuracy" score.

Evaluate separately:

### Data

-   freshness
-   coverage
-   correctness

### Retrieval

-   relevant datasets retrieved
-   irrelevant datasets avoided

### Reasoning

-   spatial correctness
-   temporal correctness
-   cross-source consistency

### Recommendation

-   evidence grounding
-   useful interpretation
-   appropriate persona adaptation

### Safety

-   hazard detection
-   stale-data handling
-   conflict surfacing

### UX

-   response clarity
-   latency
-   voice comprehension
-   local-language quality

------------------------------------------------------------------------

# 53. Implementation Phases

The implementation should proceed from data and product foundations
rather than starting with agents.

## Phase 0 --- Product Contract

Define:

-   personas
-   supported queries
-   recommendation boundaries
-   evidence requirements
-   localization requirements
-   safety requirements
-   data governance

Deliverable:

``` text
ORCA Product Requirements Document
```

------------------------------------------------------------------------

## Phase 1 --- Data Foundation

Build:

-   source catalog
-   ingestion framework
-   raw storage
-   normalized storage
-   metadata
-   provenance
-   data-quality system

Start with a carefully selected subset of authoritative sources.

Deliverable:

> Reliable marine data platform.

------------------------------------------------------------------------

## Phase 2 --- Marine Intelligence Tools

Build deterministic tools:

-   SST query
-   chlorophyll query
-   weather query
-   wave query
-   hazard query
-   PFZ query
-   geofence query
-   spatial analysis
-   temporal analysis

Deliverable:

> Tool-based marine intelligence layer.

------------------------------------------------------------------------

## Phase 3 --- Evidence Engine

Build:

-   evidence objects
-   provenance
-   source ranking
-   conflict detection
-   freshness
-   limitations

Deliverable:

> Every important answer can be explained.

------------------------------------------------------------------------

## Phase 4 --- Conversational Intelligence

Build:

-   intent classification
-   conversation context
-   standard RAG
-   structured response generation
-   source-aware answers

Deliverable:

> Conversational marine intelligence.

------------------------------------------------------------------------

## Phase 5 --- Agentic Reasoning

Add:

-   planner
-   data discovery
-   analysis
-   geospatial
-   risk
-   recommendation
-   evidence synthesis

Only use agents where they provide meaningful autonomy.

Deliverable:

> Multi-agent ORCA reasoning system.

------------------------------------------------------------------------

## Phase 6 --- Fisherman Experience

Build:

-   simple UI
-   maps
-   voice
-   local languages
-   location-aware recommendations
-   hazards
-   route context
-   offline cache

Deliverable:

> Field-oriented fisherman intelligence experience.

------------------------------------------------------------------------

## Phase 7 --- Research Experience

Add:

-   deep analysis
-   charts
-   historical comparisons
-   statistical reasoning
-   dataset inspection
-   methodology explanations
-   exportable evidence

Deliverable:

> Marine research workspace.

------------------------------------------------------------------------

## Phase 8 --- Governance + Feedback

Build:

-   feedback collection
-   verification
-   disagreement handling
-   audit
-   model/data evaluation
-   expert review

Deliverable:

> Trustworthy learning/evidence ecosystem.

------------------------------------------------------------------------

# 54. Example End-to-End Query

User:

> Where should I consider fishing tomorrow morning?

## Step 1 --- Intent

``` text
FISHING_AREA_SUITABILITY
```

## Step 2 --- Context

``` text
User location
User language
Tomorrow morning
Relevant coastal region
```

## Step 3 --- Planner

Determine required evidence:

``` text
PFZ
SST
Chlorophyll
Wave
Wind
Weather
Cyclone
Lightning
Geofences
```

## Step 4 --- Data retrieval

Agents call deterministic tools.

## Step 5 --- Spatial alignment

All datasets are aligned to the relevant geographic region.

## Step 6 --- Temporal alignment

Only appropriate current/forecast periods are used.

## Step 7 --- Evidence analysis

``` text
Region A
SST: favorable
Chlorophyll: favorable
Wave: acceptable
Hazards: none
Regulatory: permitted
```

## Step 8 --- Recommendation

> Region A currently shows stronger favorable indicators.

## Step 9 --- Explanation

Show the evidence.

## Step 10 --- Localization

Return the response in the user's preferred/local language.

## Step 11 --- Visualization

Render the region on the map.

------------------------------------------------------------------------

# 55. Example Research Query

> Compare productivity changes in Region A and Region B over the last
> five years.

Planner:

``` text
Historical SST
Historical chlorophyll
Current patterns
Anomalies
Relevant productivity indicators
```

Analysis:

``` text
Temporal alignment
Spatial aggregation
Trend analysis
Comparison
Anomaly detection
```

Response:

``` text
Finding
Evidence
Charts
Map
Method
Limitations
Data gaps
```

The researcher can inspect the underlying data.

------------------------------------------------------------------------

# 56. Example Safety Query

> Is it suitable to go to sea tomorrow morning?

ORCA evaluates:

``` text
Current weather
Forecast weather
Wind
Wave height
Wave direction
Lightning
Cyclone
Marine advisories
User location
Route
Data freshness
```

Response:

> Conditions currently appear favorable for the requested period. Wave
> height is forecast to increase later in the day. No active cyclone
> intersects the selected region. The latest official marine advisory
> should be checked before departure.

This is intentionally different from:

> "Yes, it is safe."

------------------------------------------------------------------------

# 57. Example Conflict

Suppose:

``` text
Environmental model → Favorable
Historical catch → Favorable
Recent user observations → Poor
```

ORCA:

> **Evidence is conflicting.**
>
> Environmental indicators currently suggest favorable conditions, while
> recent user observations report poor catches in the same area. The
> observations should be considered when interpreting the current
> prediction.

This is preferable to silently overriding either source.

------------------------------------------------------------------------

# 58. Recommended Frontend Information Architecture

## Home

-   Ask ORCA
-   current location
-   major alerts
-   relevant marine conditions

## Map

-   interactive layers
-   fishing suitability
-   hazards
-   routes
-   boundaries

## Conversation

-   text
-   voice
-   follow-up questions
-   evidence expansion

## Evidence

-   sources
-   timestamps
-   methodology
-   conflicts

## Saved

-   routes
-   conversations
-   maps
-   previous intelligence

## Research Workspace

For advanced users:

-   datasets
-   analysis
-   charts
-   comparisons
-   exports

------------------------------------------------------------------------

# 59. What Should Not Be Built Yet

Avoid premature scope expansion.

Do not initially build:

-   autonomous vessel control
-   guaranteed fish predictions
-   market optimization
-   automated fishing gear selection
-   fully autonomous navigation
-   unrestricted model training from user feedback
-   every possible marine dataset
-   every possible user persona
-   complex multi-agent behavior for simple queries

The first objective is:

> **Reliable marine evidence → contextual intelligence → explainable
> recommendation.**

------------------------------------------------------------------------

# 60. Current Product North Star

ORCA succeeds when a user can ask a complicated marine question in
natural language and receive:

``` text
A useful answer
+
Relevant evidence
+
Correct geographic context
+
Correct temporal context
+
Clear reasoning
+
Visible limitations/conflicts
+
Useful visualization
+
Appropriate local language
```

without needing to manually search across multiple marine data portals.

------------------------------------------------------------------------

# 61. Architecture Principle

The strongest architectural rule for ORCA is:

> **Agents reason; deterministic tools calculate; authoritative datasets
> provide evidence; the evidence layer explains; humans decide.**

This prevents the system from becoming an LLM wrapper while preserving
the benefits of agentic AI.

------------------------------------------------------------------------

# 62. Final Target Architecture

``` text
                         ┌─────────────────────┐
                         │     ORCA USERS       │
                         │                     │
                         │ Fishermen            │
                         │ Researchers          │
                         │ NGOs                 │
                         │ Aquaculture          │
                         │ Maritime Operators   │
                         │ Regulators           │
                         └──────────┬──────────┘
                                    │
                         Text / Voice / Maps
                                    │
                                    ▼
                    ┌──────────────────────────┐
                    │  Conversation Interface  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Context + Intent Engine  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Planner Agent       │
                    └────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
 ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
 │ Data Discovery │    │ Geospatial     │    │ Risk / Weather │
 │ Agent          │    │ Agent          │    │ Agent          │
 └───────┬────────┘    └───────┬────────┘    └───────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                ▼
                     ┌──────────────────────┐
                     │ Deterministic Tools  │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Marine Data Layer  │
                     └──────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
     Earth Obs.            Oceanography          Meteorology
     Fisheries             Geospatial            Advisories
     Vessel Data           Regulations            Research Data
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
                     ┌──────────────────────┐
                     │   Evidence Engine    │
                     │                      │
                     │ Provenance           │
                     │ Quality              │
                     │ Conflicts            │
                     │ Freshness            │
                     │ Limitations          │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Analysis / Reasoning │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Recommendation Layer │
                     └──────────┬───────────┘
                                │
                                ▼
              ┌────────────────────────────────────┐
              │ Localized Response + Visualization │
              │                                    │
              │ Text | Voice | Maps | Charts      │
              └────────────────┬───────────────────┘
                               │
                               ▼
                              USER
                               │
                               ▼
                       Verified Feedback
                               │
                               ▼
                      Evidence / Evaluation
```

------------------------------------------------------------------------

# 63. The Fundamental ORCA Loop

The complete product can ultimately be understood as:

``` text
OBSERVE
   ↓
UNDERSTAND
   ↓
CORRELATE
   ↓
REASON
   ↓
EXPLAIN
   ↓
RECOMMEND
   ↓
HUMAN DECIDES
   ↓
OBSERVE OUTCOME
   ↓
VERIFY FEEDBACK
   ↓
IMPROVE EVIDENCE
```

That loop is the foundation of ORCA.

The next engineering work should therefore begin with the
**data/evidence contract and canonical marine data model**, not with
implementing individual agents.
