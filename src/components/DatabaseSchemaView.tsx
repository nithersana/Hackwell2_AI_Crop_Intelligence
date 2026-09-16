import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Table
} from 'lucide-react';
import { SQL_DATABASE_SCHEMA } from '../data/architectureData';

export const DatabaseSchemaView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSchemaTable, setActiveSchemaTable] = useState<string>('sensor_telemetry');

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_DATABASE_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tables = [
    {
      name: 'crops',
      tag: 'Relational Core',
      description: 'Master taxonomy of agricultural crops, growth cycles, and optimal microclimate thresholds.',
      pk: 'crop_id (UUID)',
      fields: ['crop_name', 'scientific_name', 'optimal_temp_range', 'optimal_humidity', 'critical_vpd_threshold']
    },
    {
      name: 'field_zones',
      tag: 'PostGIS Spatial',
      description: 'Geospatial polygon boundaries of farm blocks, soil types, and installed irrigation hardware.',
      pk: 'zone_id (UUID)',
      fields: ['farm_id', 'crop_id (FK)', 'boundary_geom (Polygon)', 'soil_type', 'irrigation_type', 'planting_date']
    },
    {
      name: 'iot_devices',
      tag: 'Hardware Nodes',
      description: 'Physical solar-harvesting LoRaWAN sensor pods deployed across field canopies.',
      pk: 'device_id (VARCHAR)',
      fields: ['zone_id (FK)', 'hardware_model', 'battery_level', 'sensor_types[]', 'reporting_interval']
    },
    {
      name: 'sensor_telemetry',
      tag: 'TimescaleDB Hypertable',
      description: 'Partitioned 7-day chunks of high-frequency environmental microclimate readings.',
      pk: 'recorded_at (TIMESTAMPTZ) + device_id',
      fields: ['soil_moisture_percent', 'ambient_temp_c', 'canopy_temp_c', 'relative_humidity', 'vpd_kpa', 'leaf_wetness_minutes', 'nitrogen_ppm']
    },
    {
      name: 'disease_detections',
      tag: 'Computer Vision Logs',
      description: 'Drone & mobile foliar inference results with JSONB bounding boxes and severity grades.',
      pk: 'detection_id (UUID)',
      fields: ['zone_id (FK)', 'capture_source', 'image_s3_uri', 'disease_name', 'confidence_score', 'bounding_boxes (JSONB)']
    },
    {
      name: 'recommendations_history',
      tag: 'Adaptive Prescriptions',
      description: 'Audit trail of multi-modal synthesized chemical, biological, and irrigation actions.',
      pk: 'recommendation_id (UUID)',
      fields: ['zone_id (FK)', 'detection_id (FK)', 'composite_risk_score', 'alert_level', 'recommended_actions (JSONB)', 'status']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-lab flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="label">Database Infrastructure</div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
            Enterprise PostgreSQL + TimescaleDB Schema
          </h2>
          <p className="text-xs text-[#1a1a1a]/70 max-w-3xl leading-relaxed mt-1">
            Architected to store millions of high-frequency microclimate sensor readings in chunked hypertables 
            with continuous materialization, combined with spatial plot geometries and JSONB bounding-box detection logs.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="btn-lab flex items-center space-x-2 shrink-0 shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
          <span>{copied ? 'Copied SQL DDL' : 'Copy Complete SQL DDL'}</span>
        </button>
      </div>

      {/* Relational Table Cards */}
      <div className="space-y-3">
        <div className="label">
          Core Tables & Hypertables
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono">
          {tables.map((tbl) => {
            const isSelected = activeSchemaTable === tbl.name;
            return (
              <button
                key={tbl.name}
                onClick={() => setActiveSchemaTable(tbl.name)}
                className={`p-3 rounded-xs border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#166534] bg-[#166534]/5 ring-1 ring-[#166534]'
                    : 'border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.2)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Table className={`w-3.5 h-3.5 ${isSelected ? 'text-[#166534]' : 'text-[#1a1a1a]/50'}`} />
                  <span className="tag text-[8px] uppercase">
                    {tbl.tag}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#1a1a1a] truncate">
                  {tbl.name}
                </div>
                <div className="text-[10px] text-[#1a1a1a]/60 line-clamp-2 mt-1 font-sans">
                  {tbl.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Table Deep Dive Card */}
      {(() => {
        const current = tables.find((t) => t.name === activeSchemaTable) || tables[3];
        return (
          <div className="p-4 bg-white border border-[rgba(0,0,0,0.08)] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="space-y-1">
              <div className="font-bold text-[#1a1a1a] flex items-center space-x-2">
                <span className="text-[#166534] text-sm">{current.name}</span>
                <span className="tag text-[9px]">
                  PK: {current.pk}
                </span>
              </div>
              <p className="text-[#1a1a1a]/70 text-xs font-sans">{current.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.fields.map((f, i) => (
                <span key={i} className="tag text-[10px]">
                  {f}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Full SQL DDL Code View */}
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xs overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-[#fafafa]">
          <div className="flex items-center space-x-2 font-mono">
            <Database className="w-4 h-4 text-[#166534]" />
            <span className="text-xs text-[#1a1a1a]/80 font-medium">schema.sql (PostgreSQL 16 + TimescaleDB DDL)</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-[#1a1a1a]/70 hover:text-[#1a1a1a] flex items-center space-x-1.5 font-mono cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        <div className="p-5 overflow-x-auto max-h-[500px] text-xs font-mono leading-relaxed text-[#166534] bg-[#fdfdfd] selection:bg-[#166534]/15">
          <pre>{SQL_DATABASE_SCHEMA}</pre>
        </div>
      </div>
    </div>
  );
};
