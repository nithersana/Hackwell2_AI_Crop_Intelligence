export interface ArchitectureLayer {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  components: {
    title: string;
    tech: string;
    description: string;
    protocols: string;
  }[];
}

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'edge',
    name: '1. Edge Sensing & Aerial Capture',
    subtitle: 'Data acquisition at the microclimate & foliar level',
    color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900',
    components: [
      {
        title: 'Agricultural Drone Multispectral & RGB',
        tech: 'DJI Mavic 3 Enterprise / Custom PX4 Drone (Sony RX100 VII Sensor)',
        description: 'Autonomous waypoint flight scanning 100 hectares in 40 mins. Captures 4K RGB + NDVI (Normalized Difference Vegetation Index) for canopy chlorosis maps.',
        protocols: 'MAVLink / RTK-GPS / Wi-Fi 6 Direct'
      },
      {
        title: 'Microclimate IoT Sensor Pods',
        tech: 'ESP32 / Nordic nRF52840 + SHT40 (RH/Temp) + Teros 12 (Soil Moisture/EC/Temp)',
        description: 'Solar-harvesting ultra-low-power field nodes installed at 3 canopy heights (root zone, mid-canopy, upper boundary layer) sampling every 60 seconds.',
        protocols: 'LoRaWAN 868/915 MHz / MQTT-SN / NB-IoT'
      },
      {
        title: 'Field Scout Mobile Client',
        tech: 'React Native / Flutter with ONNX Runtime Mobile & CameraX',
        description: 'Agronomist mobile app supporting offline quantized inference for instant field scouting in low-connectivity areas.',
        protocols: 'HTTPS / gRPC / Local SQLite cache'
      }
    ]
  },
  {
    id: 'ingestion',
    name: '2. Real-Time Ingestion & Event Streaming',
    subtitle: 'High-throughput telemetry ingestion & image queuing',
    color: 'border-cyan-500 bg-cyan-50/40 text-cyan-900',
    components: [
      {
        title: 'IoT Gateway & Message Broker',
        tech: 'EMQX Enterprise / Apache Kafka Cluster',
        description: 'Handles 50,000+ concurrent sensor telemetry events/sec with strict QoS-1 delivery, topic partitioning by `farm_id/zone_id/sensor_type`.',
        protocols: 'MQTT 5.0 / WebSockets / Kafka Wire Protocol'
      },
      {
        title: 'Image & Payload Storage',
        tech: 'MinIO S3 Compatible Object Storage + Cloudflare R2 / AWS S3',
        description: 'Stores raw high-res drone orthomosaics and scout photos. Emits S3 `ObjectCreated` events to message queues.',
        protocols: 'S3 REST API / Presigned URLs'
      },
      {
        title: 'Microservices Gateway',
        tech: 'FastAPI (Python 3.12) / Envoy Proxy + Celery Task Queue',
        description: 'Asynchronous event validation, telemetry schema sanitization (Pydantic v2), and heavy inferencing dispatch to GPU workers.',
        protocols: 'HTTP/2 REST / OpenAPI 3.1 / Celery Redis Broker'
      }
    ]
  },
  {
    id: 'ml-pipeline',
    name: '3. Machine Learning & Predictive Intelligence',
    subtitle: 'Dual-path vision classification & environmental time-series forecasting',
    color: 'border-violet-500 bg-violet-50/40 text-violet-900',
    components: [
      {
        title: 'Computer Vision Disease Detection',
        tech: 'YOLOv11-OBB (Oriented Bounding Boxes) + ConvNeXt-V2 / ResNet-50 Dual-Head',
        description: 'Stage 1: YOLOv11 locates and segments infected leaf regions. Stage 2: Fine-tuned classifier identifies 38+ specific fungal/bacterial/viral taxa and calculates necrotic surface area %.',
        protocols: 'Triton Inference Server / PyTorch / TensorRT FP16'
      },
      {
        title: 'Predictive Outbreak Model',
        tech: 'Temporal Fusion Transformer (TFT) + XGBoost Spore Dispersal Classifier',
        description: 'Combines 14-day rolling microclimate features (VPD, Leaf Wetness Duration hours, heat sum Growing Degree Days) with historical pathogen lifecycles to predict 72-hour spore outbreaks.',
        protocols: 'ONNX Runtime / Ray Serve / MLflow Model Registry'
      },
      {
        title: 'Multi-Modal Reasoning Agent',
        tech: 'Gemini 3.8 Flash / Google GenAI SDK (Server-Side)',
        description: 'Ingests CV structured vision metadata + multi-depth sensor metrics + crop growth stage to reason over complex co-morbidities (e.g. drought stress masking fungal blight).',
        protocols: 'Structured JSON Generation / Google GenAI SDK'
      }
    ]
  },
  {
    id: 'persistence',
    name: '4. Storage & Historical Persistence',
    subtitle: 'Relational crop metadata & time-series sensor hypertable',
    color: 'border-amber-500 bg-amber-50/40 text-amber-900',
    components: [
      {
        title: 'Relational Metadata DB',
        tech: 'PostgreSQL 16 (Relational Metadata & GeoJSON Zones)',
        description: 'Holds farm boundaries, crop types, pesticide formulation registries, user accounts, and action audit logs.',
        protocols: 'PostgreSQL Wire / PostGIS Spatial Extensions'
      },
      {
        title: 'Time-Series Sensor Hypertable',
        tech: 'TimescaleDB (Hypertables with continuous aggregates)',
        description: 'Stores raw sensor telemetry partitioned by 7-day chunks. Automatically calculates hourly and daily min/max/VPD aggregates.',
        protocols: 'TimescaleDB Continuous Aggregates / Compression'
      },
      {
        title: 'Vector Knowledge Base',
        tech: 'pgvector / Qdrant',
        description: 'Agronomic textbooks, pesticide safety data sheets (MSDS), and regional crop protection guides embedded for RAG retrieval.',
        protocols: 'HNSW Index / Cosine Similarity'
      }
    ]
  },
  {
    id: 'recommendation',
    name: '5. Adaptive Recommendation Engine & Actuation',
    subtitle: 'Dynamic agronomic prescription & IoT automated actuators',
    color: 'border-rose-500 bg-rose-50/40 text-rose-900',
    components: [
      {
        title: 'Agronomic Rules & Formulation Engine',
        tech: 'Deterministic Expert System + Dynamic AI Optimization',
        description: 'Validates maximum chemical application rates, legal withholding periods (PHI - Pre-Harvest Interval), and prioritizes biological controls (Trichoderma, Bacillus subtilis).',
        protocols: 'Python Rule Engine / Schemas'
      },
      {
        title: 'Automated Irrigation & Fertigation Actuators',
        tech: 'BACnet / Modbus TCP / MQTT Smart Valve Solenoids',
        description: 'Automatically throttles or shifts irrigation timing (e.g., switches overhead sprinkler to night drip to eliminate leaf wetness windows).',
        protocols: 'Modbus TCP / MQTT Relay Control'
      }
    ]
  }
];

export const SQL_DATABASE_SCHEMA = `-- ============================================================================
-- ADAPTIVE AI CROP INTELLIGENCE PLATFORM
-- PRODUCTION POSTGRESQL + TIMESCALEDB SCHEMA
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";       -- Spatial crop plot geometry
CREATE EXTENSION IF NOT EXISTS "timescaledb";   -- High performance IoT time-series

-- 2. Enumerated Domain Types
CREATE TYPE pathogen_class AS ENUM ('fungal', 'bacterial', 'viral', 'pest', 'deficiency', 'healthy');
CREATE TYPE severity_grade AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE recommendation_category AS ENUM ('chemical', 'biological', 'irrigation', 'soil_amendment', 'cultural');
CREATE TYPE execution_status AS ENUM ('pending', 'in_progress', 'completed', 'dismissed');

-- 3. Crops Registry Table
CREATE TABLE crops (
    crop_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(150),
    growth_cycle_days INT NOT NULL,
    optimal_temp_min_c NUMERIC(4, 1) NOT NULL,
    optimal_temp_max_c NUMERIC(4, 1) NOT NULL,
    optimal_humidity_min NUMERIC(4, 1) NOT NULL,
    optimal_humidity_max NUMERIC(4, 1) NOT NULL,
    optimal_soil_moisture_min NUMERIC(4, 1) NOT NULL,
    optimal_soil_moisture_max NUMERIC(4, 1) NOT NULL,
    critical_vpd_threshold_kpa NUMERIC(4, 2) NOT NULL DEFAULT 0.40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Farm Field Plots / Zones
CREATE TABLE field_zones (
    zone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL,
    crop_id UUID REFERENCES crops(crop_id) ON DELETE RESTRICT,
    zone_name VARCHAR(120) NOT NULL,
    area_hectares NUMERIC(6, 2) NOT NULL,
    boundary_geom GEOMETRY(Polygon, 4326),
    soil_type VARCHAR(80),
    irrigation_type VARCHAR(80),
    planting_date DATE NOT NULL,
    estimated_harvest_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. IoT Sensor Devices
CREATE TABLE iot_devices (
    device_id VARCHAR(64) PRIMARY KEY,
    zone_id UUID REFERENCES field_zones(zone_id) ON DELETE CASCADE,
    device_hardware_model VARCHAR(100),
    firmware_version VARCHAR(32),
    battery_level_percent NUMERIC(4, 1),
    sensor_types TEXT[] NOT NULL, -- e.g. ARRAY['soil_moisture', 'canopy_temp', 'humidity', 'npk']
    reporting_interval_seconds INT DEFAULT 60,
    last_heartbeat TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'online'
);

-- 6. Time-Series Environmental Sensor Telemetry (TimescaleDB Hypertable)
CREATE TABLE sensor_telemetry (
    recorded_at TIMESTAMPTZ NOT NULL,
    device_id VARCHAR(64) NOT NULL,
    zone_id UUID NOT NULL,
    soil_moisture_percent NUMERIC(5, 2),
    ambient_temp_c NUMERIC(5, 2),
    canopy_temp_c NUMERIC(5, 2),
    relative_humidity_percent NUMERIC(5, 2),
    vpd_kpa NUMERIC(5, 3),                     -- Vapor Pressure Deficit
    dew_point_c NUMERIC(5, 2),
    leaf_wetness_minutes INT DEFAULT 0,
    solar_radiation_lux NUMERIC(8, 2),
    soil_ec_ds_m NUMERIC(5, 2),                -- Electrical Conductivity
    soil_ph NUMERIC(4, 2),
    nitrogen_ppm NUMERIC(6, 2),
    phosphorus_ppm NUMERIC(6, 2),
    potassium_ppm NUMERIC(6, 2)
);

-- Convert sensor_telemetry to hypertable partitioned by time (7-day intervals)
SELECT create_hypertable('sensor_telemetry', 'recorded_at', chunk_time_interval => INTERVAL '7 days');

-- Create compound index for hyper-fast zone telemetry retrieval
CREATE INDEX idx_sensor_zone_time ON sensor_telemetry (zone_id, recorded_at DESC);
CREATE INDEX idx_sensor_device_time ON sensor_telemetry (device_id, recorded_at DESC);

-- 7. Disease Detection Logs (Computer Vision Inference)
CREATE TABLE disease_detections (
    detection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES field_zones(zone_id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(crop_id),
    capture_timestamp TIMESTAMPTZ DEFAULT NOW(),
    capture_source VARCHAR(40) NOT NULL, -- 'drone_orthomosaic', 'field_scout_mobile', 'fixed_trap_camera'
    image_s3_uri VARCHAR(512) NOT NULL,
    pathogen_type pathogen_class NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(150),
    confidence_score NUMERIC(5, 4) NOT NULL,
    severity severity_grade NOT NULL,
    affected_surface_area_percent NUMERIC(5, 2),
    bounding_boxes JSONB NOT NULL,       -- Array of [{x, y, w, h, label, score}]
    inference_latency_ms INT,
    model_version VARCHAR(64) NOT NULL,
    verified_by_agronomist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_detections_zone_time ON disease_detections (zone_id, capture_timestamp DESC);
CREATE INDEX idx_detections_disease ON disease_detections (disease_name, severity);

-- 8. Predictive Outbreak Risk Logs
CREATE TABLE outbreak_predictions (
    prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES field_zones(zone_id) ON DELETE CASCADE,
    prediction_generated_at TIMESTAMPTZ DEFAULT NOW(),
    forecast_horizon_hours INT DEFAULT 72,
    predicted_outbreak_risk_score NUMERIC(5, 2) NOT NULL, -- 0.00 to 100.00
    risk_level severity_grade NOT NULL,
    dominant_weather_trigger TEXT,
    spore_germination_index NUMERIC(5, 3),
    feature_importances JSONB,           -- Shapley values / model inputs
    model_version VARCHAR(64) NOT NULL
);

-- 9. Adaptive Recommendations History
CREATE TABLE recommendations_history (
    recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES field_zones(zone_id) ON DELETE CASCADE,
    detection_id UUID REFERENCES disease_detections(detection_id),
    composite_risk_score NUMERIC(5, 2) NOT NULL,
    alert_level severity_grade NOT NULL,
    symptom_summary TEXT NOT NULL,
    environmental_rationale TEXT NOT NULL,
    recommended_actions JSONB NOT NULL,   -- Array of structured actions
    irrigation_adjustment JSONB NOT NULL,-- {action, flow_mod_pct, schedule}
    quarantine_protocol JSONB,           -- {required, radius_m, foliar_spray}
    status execution_status DEFAULT 'pending',
    executed_at TIMESTAMPTZ,
    operator_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Continuous Aggregate View: Hourly Zone Microclimate Index
CREATE MATERIALIZED VIEW hourly_zone_microclimate
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', recorded_at) AS bucket,
    zone_id,
    AVG(ambient_temp_c) AS avg_temp,
    MAX(ambient_temp_c) AS max_temp,
    AVG(relative_humidity_percent) AS avg_humidity,
    MAX(relative_humidity_percent) AS max_humidity,
    AVG(soil_moisture_percent) AS avg_soil_moisture,
    AVG(vpd_kpa) AS avg_vpd,
    SUM(leaf_wetness_minutes) AS total_wetness_mins
FROM sensor_telemetry
GROUP BY bucket, zone_id;
`;

export const IMPLEMENTATION_ROADMAP = [
  {
    phase: 'Phase 1: Data Collection, Sensor Topology & Annotation Engine',
    duration: 'Weeks 1 – 6',
    objectives: [
      'Deploy 10+ Multi-depth IoT LoRaWAN sensor pods across pilot crop plots (canopy temp, RH, soil moisture, leaf wetness).',
      'Aggregate 45,000+ labeled leaf images across 8 target crops via PlantVillage, PlantDoc, and high-res DJI drone scouting flights.',
      'Implement active learning annotation pipeline (Roboflow / CVAT) with agricultural pathologist verification.',
      'Configure TimescaleDB time-series database and EMQX MQTT message broker.'
    ],
    deliverables: [
      'Cleaned, augmented dataset (rotations, sunlight glare, wet leaf specular reflections).',
      'Benchmarked IoT telemetry ingestion pipeline with <200ms latency.'
    ],
    milestoneTag: 'Dataset & Ingestion Ready'
  },
  {
    phase: 'Phase 2: Deep Learning Vision Pipeline & Edge Quantization',
    duration: 'Weeks 7 – 12',
    objectives: [
      'Train YOLOv11-OBB for oriented leaf lesion detection and bounding box localization.',
      'Train dual-head ConvNeXt-V2 backbone for fine-grained 38-class plant disease classification.',
      'Quantize weights to INT8 and FP16 using TensorRT and ONNX Runtime for edge drone/mobile inferencing.',
      'Achieve target accuracy: >94.5% mAP@50 and <45ms inference latency per frame.'
    ],
    deliverables: [
      'Production Docker container hosting Triton Inference Server.',
      'Mobile-optimized TFLite / ONNX models for offline agronomy field app.'
    ],
    milestoneTag: 'CV Vision Engine Deployed'
  },
  {
    phase: 'Phase 3: Environmental Outbreak & Spore Dispersal Modeling',
    duration: 'Weeks 13 – 18',
    objectives: [
      'Train Temporal Fusion Transformer (TFT) on 14-day rolling microclimate sliding windows.',
      'Incorporate epidemiological spore germination models (Mills Infection Period for Scab, Wallin Model for Blight).',
      'Compute continuous Vapor Pressure Deficit (VPD) and Leaf Wetness Duration (LWD) from sensor telemetry.',
      'Backtest outbreak forecast against historical crop infection field logs with >88% precision.'
    ],
    deliverables: [
      'Real-time Outbreak Risk Microservice predicting 72-hour pathogen danger index.',
      'Automated danger alerts dispatched via SMS, Webhook, and Push Notifications.'
    ],
    milestoneTag: 'Predictive Model Validated'
  },
  {
    phase: 'Phase 4: Multi-Modal Adaptive Recommendation Engine',
    duration: 'Weeks 19 – 24',
    objectives: [
      'Develop rule-based expert agronomic engine cross-referencing pest biology, chemical mode-of-action (FRAC groups), and legal withholding periods.',
      'Integrate LLM reasoning agent (Gemini 3.8 Flash) to synthesize complex co-morbidities into step-by-step actionable protocols.',
      'Build Modbus/MQTT actuation bridges to center pivot and drip irrigation solenoids for automatic flow adjustment.',
      'Implement multi-tenant farm dashboard with GIS field polygon maps and live spatial heatmaps.'
    ],
    deliverables: [
      'Adaptive recommendation API generating biological, chemical, and irrigation prescriptions.',
      'Automated actuator triggers for connected irrigation systems.'
    ],
    milestoneTag: 'Adaptive Engine Live'
  },
  {
    phase: 'Phase 5: Field Pilot, Agronomist Validation & Scale Deployment',
    duration: 'Weeks 25 – 30',
    objectives: [
      'Deploy system across 500 hectares of commercial tomato, corn, and orchard test sites.',
      'Conduct randomized controlled trial (RCT) comparing AI-guided preventive spraying vs conventional calendar spraying.',
      'Target performance KPI: 25% reduction in chemical fungicide usage, 18% water savings, and zero missed outbreaks.',
      'Finalize SOC2 compliance, ISO 14001 agricultural environmental audits, and global cloud deployment.'
    ],
    deliverables: [
      'Field efficacy report signed off by agricultural extension officers.',
      'Full CI/CD automated deployment pipeline on Kubernetes (EKS / GKE).'
    ],
    milestoneTag: 'Commercial Production Scale'
  }
];
