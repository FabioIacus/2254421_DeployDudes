"use client"

import { useState, useEffect, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// ============================================================================
// ICONS
// ============================================================================

function CpuIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  )
}

function RadioIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
  )
}

function ThermometerIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  )
}

function DropletsIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  )
}

function CloudFogIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 17H7" /><path d="M17 21H9" />
    </svg>
  )
}

function FlaskConicalIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" />
    </svg>
  )
}

function WavesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}

function GaugeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}

function WindIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}

function ActivityIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  )
}

function ZapIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  )
}

function LeafIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function ThermometerSunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 9a4 4 0 0 0-2 7.5" /><path d="M12 3v2" /><path d="m6.6 18.4-1.4 1.4" /><path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /><path d="M4 13H2" /><path d="M6.34 7.34 4.93 5.93" />
    </svg>
  )
}

function DoorOpenIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 4h3a2 2 0 0 1 2 2v14" /><path d="M2 20h3" /><path d="M13 20h9" /><path d="M10 12v.01" /><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
    </svg>
  )
}

function FanIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z" /><path d="M12 12v.01" />
    </svg>
  )
}

function FlameIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  )
}

function Trash2Icon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

function TerminalIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )
}

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================

function MarsLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] bg-grid">
      <div className="relative flex items-center justify-center">
        {/* Glow behind the planet */}
        <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl animate-pulse-slow"></div>

        {/* Orbit ring */}
        <div className="absolute h-48 w-48 rounded-full border border-[#2a3040]/50 animate-[spin_10s_linear_infinite]">
          <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-400 glow-cyan"></div>
        </div>

        {/* Mars Planet SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-32 w-32 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
          <circle cx="50" cy="50" r="45" fill="#f97316" className="animate-pulse-slow" />
          <path d="M 20 60 Q 40 40 70 70 Q 50 80 20 60" fill="#ea580c" opacity="0.6" />
          <path d="M 40 20 Q 60 10 80 40 Q 60 40 40 20" fill="#ea580c" opacity="0.6" />
          <circle cx="65" cy="35" r="8" fill="#c2410c" opacity="0.8" />
          <circle cx="35" cy="55" r="12" fill="#c2410c" opacity="0.8" />
          <circle cx="55" cy="70" r="6" fill="#c2410c" opacity="0.8" />

          {/* Surface detailing lines */}
          <path d="M 15 45 Q 30 35 45 40" stroke="#c2410c" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M 60 80 Q 75 75 85 60" stroke="#c2410c" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <h2 className="font-mono text-xl font-bold tracking-widest text-[#ea580c] text-neon-orange">
          ESTABLISHING UPLINK
        </h2>

        {/* Loading Bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-[#151b2b]">
          <div className="h-full w-full origin-left bg-orange-500 animate-[pulse-scan_2s_ease-in-out_infinite]"></div>
        </div>

        <p className="font-mono text-xs tracking-widest text-gray-500">
          WAITING FOR MARS TELEMETRY...
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header({ logs = [] }) {
  const [time, setTime] = useState("")
  const [systemStatus, setSystemStatus] = useState("Connecting...")

  useEffect(() => {
    if (logs.length > 0) {
      const latestStatusLog = logs.find(log =>
        log.message.includes("Mars System is online") ||
        log.message.includes("System shutting down")
      )

      if (latestStatusLog) {
        setSystemStatus(latestStatusLog.message.includes("online") ? "OK" : "Offline")
      } else {
        // If we missed the init log but are receiving logs, assume OK
        setSystemStatus(prev => prev === "Connecting..." ? "OK" : prev)
      }
    } else {
      setSystemStatus("Connecting...")
    }
  }, [logs])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-[#2a3040] bg-[#0F1423] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[rgba(249,115,22,0.1)] border border-orange-500/30 flex items-center justify-center text-orange-500">
          <div className="h-4 w-4 rounded-full border-2 border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </div>
        <h1 className="text-lg font-semibold tracking-wide text-gray-100 tracking-widest">
          MARS OPS <span className="text-gray-500">|</span> HABITAT CONTROL
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md border border-[#2a3040] bg-[#151b2b] border-[#2a3040] px-3 py-1.5">
          <CpuIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-cyan-400 font-mono tracking-wide">System: {systemStatus}</span>
        </div>
        <div className="rounded-md border border-[#2a3040] bg-orange-500 border-orange-400 glow-orange px-4 py-1.5">
          <span className="font-mono text-sm font-semibold text-black">{time || "00:00:00"}</span>
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// SENSOR GRID COMPONENT
// ============================================================================

const sensorConfigs = [
  { id: "greenhouse_temperature", label: "Greenhouse Temp", value: "24.7", unit: "°C", Icon: ThermometerIcon },
  { id: "entrance_humidity", label: "Entrance Humidity", value: "45", unit: "%", Icon: DropletsIcon },
  { id: "co2_hall", label: "CO₂ Hall", value: "892", unit: "ppm", Icon: CloudFogIcon },
  { id: "hydroponic_ph", label: "Hydroponic pH", value: "6.4", unit: "pH", Icon: FlaskConicalIcon },
  { id: "water_tank_level", label: "Water Tank Level", value: "78", unit: "%", Icon: WavesIcon },
  { id: "corridor_pressure", label: "Corridor Pressure", value: "1013", unit: "hPa", Icon: GaugeIcon },
  { id: "air_quality_pm25", label: "Air Quality PM2.5", value: "12", unit: "µg/m³", Icon: WindIcon },
  { id: "air_quality_voc", label: "Air Quality VOC", value: "0.3", unit: "ppm", Icon: ActivityIcon },
]

function SensorGrid({ sensorData }) {
  // Store previous values to detect changes
  const [prevData, setPrevData] = useState({});
  // Track which sensors are currently animating
  const [animatingSensors, setAnimatingSensors] = useState({});

  useEffect(() => {
    if (!sensorData) return;

    const newAnimating = { ...animatingSensors };
    let hasChanges = false;

    // Check each sensor for changes
    sensorConfigs.forEach(sensor => {
      const currentVal = sensorData[sensor.id];
      const prevVal = prevData[sensor.id];

      // If value exists and is different from previous (and it's not the first load)
      // Comparing as strings to avoid type-mismatch false negatives
      if (currentVal !== undefined && prevVal !== undefined && String(currentVal) !== String(prevVal)) {
        newAnimating[sensor.id] = true;
        hasChanges = true;

        // Remove animation class after 500ms
        setTimeout(() => {
          setAnimatingSensors(current => ({
            ...current,
            [sensor.id]: false
          }));
        }, 500);
      }
    });

    if (hasChanges) {
      setAnimatingSensors(newAnimating);
    }

    // Update previous data for next comparison
    setPrevData(sensorData);
  }, [sensorData]);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#0B0F19] bg-grid text-gray-2000" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Sensor Grid — REST Polling
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sensorConfigs.map((sensor) => (
          <div
            key={sensor.id}
            className="rounded-md card-beveled transition-all duration-500 ease-out hover:border-orange-500/50 hover:shadow-md"
            style={{
              ...(animatingSensors[sensor.id]
                ? {
                  borderColor: 'rgba(249, 115, 22, 1)',
                  boxShadow: 'inset 0 1px 0 rgba(249, 115, 22, 0.2)'
                } : {
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
                })
            }}
          >
            <div className="flex items-center justify-between p-4 pb-2">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {sensor.label}
              </span>
              <sensor.Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-100 font-mono">{sensorData && sensorData[sensor.id] !== undefined ? sensorData[sensor.id] : '--'}</span>
                <span className="text-sm font-medium text-gray-500">{sensor.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// TELEMETRY PANEL COMPONENT
// ============================================================================

const tabConfigs = [
  {
    id: "solar_array",
    label: "Solar Array",
    Icon: ZapIcon,
    yAxisLabel: "Power",
    yDomain: ["auto", "auto"],
  },
  {
    id: "power_bus",
    label: "Power Bus",
    Icon: ZapIcon,
    yAxisLabel: "Value",
    yDomain: ["auto", "auto"],
  },
  {
    id: "power_consumption",
    label: "Consumption",
    Icon: ZapIcon,
    yAxisLabel: "Value",
    yDomain: ["auto", "auto"],
  },
  {
    id: "radiation",
    label: "Radiation",
    Icon: ActivityIcon,
    yAxisLabel: "Value",
    yDomain: ["auto", "auto"],
  },
  {
    id: "life_support",
    label: "Life Support",
    Icon: LeafIcon,
    yAxisLabel: "Value",
    yDomain: ["auto", "auto"],
  },
  {
    id: "thermal_loop",
    label: "Thermal",
    Icon: ThermometerSunIcon,
    yAxisLabel: "Value",
    yDomain: ["auto", "auto"],
  },
  {
    id: "airlock",
    label: "Airlock",
    Icon: DoorOpenIcon,
    yAxisLabel: "Value",
    yDomain: ["auto", "auto"],
  },
]


const strokeColors = ["#f97316", "#22d3ee", "#a8a29e"]


function CustomTooltip({ active, payload, label, tabId, rawData }) {
  if (!active || !payload || !payload.length) return null

  const currentItem = rawData?.find(item => item.time === label) || {};

  const formatValue = (key) => {
    const data = currentItem[key];
    if (data && data.value !== undefined) {
      const val = typeof data.value === 'number' ? Number(data.value).toFixed(2) : data.value;
      const unit = data.unit ? ` ${data.unit}` : '';
      return `${val}${unit}`;
    }
    return '';
  }

  // Get all keys present in the current timestamp (even non-plotted ones)
  const allKeys = Object.keys(currentItem).filter(k => k !== 'time');

  return (
    <div className="rounded-md card-beveled transition-all duration-300 hover:border-orange-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] px-3 py-2 shadow-lg">
      <div className="mb-1 border-b border-[#2a3040] pb-1 text-xs text-gray-500">
        Timestamp: {label}
      </div>
      {allKeys.map((key, index) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: strokeColors[index % strokeColors.length] }}
          />

          <span className="text-gray-500">{key.replace(/_/g, ' ').toUpperCase()}:</span>
          <span className="font-semibold text-gray-100 tracking-widest">
            {formatValue(key)}
          </span>
        </div>
      ))}
    </div>
  )
}

function TelemetryPanel({ telemetry }) {
  const [activeTab, setActiveTab] = useState("solar_array")

  const activeConfig = tabConfigs.find((t) => t.id === activeTab)
  const activeData = telemetry ? telemetry[activeTab] : []

  // Flatten active data for chart rendering (only use numeric values)
  const chartData = useMemo(() => {
    return activeData.map(item => {
      const flat = { time: item.time };
      Object.keys(item).forEach(k => {
        if (k !== 'time' && k !== 'cumulative_energy' && item[k] && typeof item[k].value === 'number') {
          flat[k] = item[k].value;
        }
      });
      return flat;
    });
  }, [activeData]);

  const numericDataKeys = useMemo(() => {
    if (!activeData || activeData.length === 0) return [];
    const keys = new Set();
    activeData.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== 'time' && k !== 'cumulative_energy' && item[k] && typeof item[k].value === 'number') {
          keys.add(k);
        }
      });
    });
    return Array.from(keys);
  }, [activeData]);

  const formatYAxisTick = (value) => {
    return value.toString()
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#0B0F19] bg-grid text-gray-2000" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Interactive Telemetry Panel — Stream
        </h2>
      </div>
      <div className="rounded-md card-beveled transition-all duration-300 hover:border-orange-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-100 tracking-widest">
              Live Telemetry Data
            </span>
            <div className="flex flex-wrap gap-1">
              {tabConfigs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                    ? "bg-orange-500 border-orange-400 glow-orange text-black"
                    : "bg-[#151b2b] border-[#2a3040] text-gray-500 hover:bg-[#1A2235] border border-[#2a3040] hover:text-orange-400 font-mono tracking-wide"
                    }`}
                >
                  <tab.Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 pt-6">
          <div className="h-72 w-full rounded-lg border border-[#2a3040] bg-[#151b2b] border-[#2a3040]/30 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#d4d4d4"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#4B5563", fontSize: 11 }}
                  tickLine={{ stroke: "#2a3040" }}
                  axisLine={{ stroke: "#2a3040" }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value ? value.slice(0, 5) : ""}
                />
                <YAxis
                  domain={activeConfig.yDomain}
                  tick={{ fill: "#4B5563", fontSize: 11 }}
                  tickLine={{ stroke: "#2a3040" }}
                  axisLine={{ stroke: "#2a3040" }}

                  tickFormatter={formatYAxisTick}
                  label={{
                    value: activeConfig?.yAxisLabel || "Value",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fill: "#4B5563",
                      fontSize: 11,
                      textAnchor: "middle",
                    },
                    offset: 0,
                  }}
                  width={80}
                />
                <Tooltip
                  content={<CustomTooltip tabId={activeTab} rawData={activeData} />}
                  cursor={{
                    stroke: "#f97316",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => (
                    <span style={{ color: "#9CA3AF" }}>{value}</span>
                  )}
                />
                {numericDataKeys.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key.replace(/_/g, ' ').toUpperCase()}
                    stroke={strokeColors[index % strokeColors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: strokeColors[index % strokeColors.length],
                      stroke: "#f5f5f5",
                      strokeWidth: 2,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// ACTUATOR CONTROL COMPONENT
// ============================================================================

const actuators = [
  { id: "cooling_fan", label: "Cooling Fan", Icon: FanIcon, defaultOn: true },
  { id: "entrance_humidifier", label: "Entrance Humidifier", Icon: DropletsIcon, defaultOn: false },
  { id: "hall_ventilation", label: "Hall Ventilation", Icon: WindIcon, defaultOn: true },
  { id: "habitat_heater", label: "Habitat Heater", Icon: FlameIcon, defaultOn: false },
]

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 ${checked ? "bg-orange-500 border-orange-400 glow-orange" : "bg-[#1A2235] border border-[#2a3040]"
        }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition-transform ${checked ? "translate-x-5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "translate-x-0 bg-gray-500"}
          }`}
      />
    </button>
  )
}

function ActuatorControl({ actuatorData, handleToggleActuator }) {
  const toggleActuator = (id) => {
    const currentState = actuatorData[id] || 'OFF';
    handleToggleActuator(id, currentState);
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#0B0F19] bg-grid text-gray-2000" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Actuator Control Center
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {actuators.map((actuator) => (
          <div
            key={actuator.id}
            className={`rounded-lg border border-[#2a3040] transition-all ${actuatorData[actuator.id] === 'ON' ? "bg-[#151b2b] border-[#2a3040]" : "bg-[#0F1423] border-[#2a3040]"
              }`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${actuatorData[actuator.id] === 'ON'
                    ? "bg-orange-500 border-orange-400 glow-orange text-black"
                    : "bg-[#151b2b] border-[#2a3040] text-gray-500"
                    }`}
                >
                  <actuator.Icon className={`h-5 w-5 ${actuatorData[actuator.id] === "ON" ? (actuator.id === "cooling_fan" ? "animate-spin" : actuator.id === "entrance_humidifier" ? "animate-falling-drops text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,1)]" : actuator.id === "hall_ventilation" ? "animate-blowing-wind text-gray-300" : actuator.id === "habitat_heater" ? "animate-burning-flame text-red-500" : "") : ""}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100 tracking-widest">{actuator.label}</p>
                  <p className="text-xs text-gray-500">
                    {actuatorData[actuator.id] === 'ON' ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={actuatorData[actuator.id] === 'ON'}
                onChange={() => toggleActuator(actuator.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// RULE ENGINE COMPONENT
// ============================================================================

const sensorOptions = [
  "greenhouse_temperature",
  "entrance_humidity",
  "co2_hall",
  "hydroponic_ph",
  "water_tank_level",
  "corridor_pressure",
  "air_quality_pm25",
  "air_quality_voc",
]

const operators = [">", "<", ">=", "<=", "=="]

const actuatorOptions = ["cooling_fan", "entrance_humidifier", "hall_ventilation", "habitat_heater"]

const actuatorStates = ["ON", "OFF"]

const initialRules = []

function RuleEngine({ rules }) {
  const initialRulesState = rules.length > 0 ? rules : initialRules;
  const [localRules, setLocalRules] = useState(initialRulesState);

  // Update when external rules load
  useEffect(() => {
    if (rules.length > 0) setLocalRules(rules);
  }, [rules]);
  const [newRule, setNewRule] = useState({
    sensor: "",
    operator: "",
    value: "100",
    actuator: "",
    state: "",
  })

  const addRule = async () => {
    if (newRule.sensor && newRule.operator && newRule.actuator && newRule.state) {
      try {
        const payload = {
          sensor_name: newRule.sensor,
          operator: newRule.operator,
          threshold_value: parseFloat(newRule.value),
          actuator_name: newRule.actuator,
          actuator_state: newRule.state
        };
        const res = await fetch("http://localhost:8000/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === "success") {
          setLocalRules([
            ...localRules,
            {
              id: data.rule_id,
              ...newRule,
            },
          ]);
          setNewRule({ sensor: "", operator: "", value: "100", actuator: "", state: "" });
        }
      } catch (err) {
        console.error("Failed to add rule:", err);
      }
    }
  }

  const deleteRule = async (id) => {
    try {
      await fetch(`http://localhost:8000/rules/${id}`, { method: "DELETE" });
      setLocalRules(localRules.filter((rule) => rule.id !== id));
    } catch (err) {
      console.error("Failed to delete rule:", err);
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#0B0F19] bg-grid text-gray-2000" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Rule Engine — IF-THEN Logic
        </h2>
      </div>
      <div className="rounded-md card-beveled transition-all duration-300 hover:border-orange-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="border-b border-[#2a3040] p-4">
          <span className="text-sm font-medium text-gray-100 tracking-widest">Rule Builder</span>
        </div>
        <div className="space-y-6 p-4">
          {/* Rule Builder Form */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-500">IF</span>
            <select
              value={newRule.sensor}
              onChange={(e) => setNewRule({ ...newRule, sensor: e.target.value })}
              className="h-9 w-48 rounded-md border border-[#2a3040] bg-[#0B0F19] border-[#2a3040] text-gray-300 px-3 text-sm text-cyan-400 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            >
              <option value="">Select sensor</option>
              {sensorOptions.map((sensor) => (
                <option key={sensor} value={sensor}>
                  {sensor}
                </option>
              ))}
            </select>
            <select
              value={newRule.operator}
              onChange={(e) => setNewRule({ ...newRule, operator: e.target.value })}
              className="h-9 w-24 rounded-md border border-[#2a3040] bg-[#0B0F19] border-[#2a3040] text-gray-300 px-3 text-sm text-cyan-400 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            >
              <option value="">Op</option>
              {operators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newRule.value}
              onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
              className="h-9 w-20 rounded-md border border-[#2a3040] bg-[#0B0F19] border-[#2a3040] text-gray-300 px-3 text-sm text-cyan-400 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
              placeholder="Value"
            />
            <span className="text-sm font-medium text-gray-500">THEN set</span>
            <select
              value={newRule.actuator}
              onChange={(e) => setNewRule({ ...newRule, actuator: e.target.value })}
              className="h-9 w-48 rounded-md border border-[#2a3040] bg-[#0B0F19] border-[#2a3040] text-gray-300 px-3 text-sm text-cyan-400 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            >
              <option value="">Select actuator</option>
              {actuatorOptions.map((actuator) => (
                <option key={actuator} value={actuator}>
                  {actuator}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-gray-500">to</span>
            <select
              value={newRule.state}
              onChange={(e) => setNewRule({ ...newRule, state: e.target.value })}
              className="h-9 w-24 rounded-md border border-[#2a3040] bg-[#0B0F19] border-[#2a3040] text-gray-300 px-3 text-sm text-cyan-400 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            >
              <option value="">State</option>
              {actuatorStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <button
              onClick={addRule}
              className="flex h-9 items-center gap-2 rounded-md bg-orange-500 border-orange-400 glow-orange px-4 text-sm font-medium text-black transition-colors hover:bg-[#2a3040]"
            >
              <PlusIcon className="h-4 w-4" />
              Add Rule
            </button>
          </div>

          {/* Rules Table */}
          <div className="rounded-lg border border-[#2a3040]">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#2a3040] bg-[#151b2b] border-[#2a3040] px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rule Definition
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </span>
            </div>
            {localRules.map((rule) => (
              <div
                key={rule.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#2a3040] px-4 py-3 last:border-b-0"
              >
                <div className="font-mono text-sm text-gray-100 tracking-widest">
                  <span className="text-gray-500">IF</span>{" "}
                  <span className="font-medium">{rule.sensor}</span>{" "}
                  <span className="text-gray-500">{rule.operator}</span>{" "}
                  <span className="font-medium">{rule.value}</span>{" "}
                  <span className="text-gray-500">THEN set</span>{" "}
                  <span className="font-medium">{rule.actuator}</span>{" "}
                  <span className="text-gray-500">to</span>{" "}
                  <span className="font-medium">{rule.state}</span>
                </div>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-[#151b2b] border-[#2a3040] hover:text-gray-100 tracking-widest"
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// ACTIVITY LOG COMPONENT
// ============================================================================

function ActivityLog({ logs }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#0B0F19] bg-grid text-gray-2000" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          System Console — Activity Log
        </h2>
      </div>
      <div className="rounded-md card-beveled transition-all duration-300 hover:border-orange-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 border-b border-[#2a3040] p-4">
          <TerminalIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-100 tracking-widest">Activity Log</span>
        </div>
        <div className="p-4">
          <div className="rounded-lg border border-[#2a3040] bg-[#0B0F19] bg-grid text-gray-200 p-4">
            <div className="space-y-2 font-mono text-sm h-64 overflow-y-auto pr-4 no-scrollbar">
              {(logs && logs.length > 0 ? logs : []).map((entry, index) => (
                <div key={index} className="flex gap-4">
                  <span className="shrink-0 text-cyan-600/50">[{entry.timestamp}]</span>
                  <span className="text-cyan-400">{entry.message}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-cyan-600/50">{">"}</span>
                <span className="inline-block h-4 w-2 animate-pulse bg-[#2a3040]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [sensors, setSensors] = useState({});
  const [actuators, setActuators] = useState({});
  const [logs, setLogs] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [rules, setRules] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Fetch rules once on mount
    fetch("http://localhost:8000/rules")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setRules(data.data || []);
        }
      })
      .catch((err) => console.error("Failed to fetch rules:", err));

    // Polling interval for state bundle
    const interval = setInterval(() => {
      fetch("http://localhost:8000/state")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && data.data) {
            setSensors(data.data.sensors || {});
            setActuators(data.data.actuators || {});

            // Calculate local time correctly assuming backend returns UTC
            const adjustedLogs = (data.data.logs || []).map(log => {
              if (!log.timestamp) return log;
              const [h, m, s] = log.timestamp.split(':').map(Number);
              const d = new Date();
              d.setUTCHours(h, m, s || 0);
              const localH = d.getHours().toString().padStart(2, '0');
              const localM = d.getMinutes().toString().padStart(2, '0');
              const localS = d.getSeconds().toString().padStart(2, '0');
              return { ...log, timestamp: `${localH}:${localM}:${localS}` };
            });
            setLogs(adjustedLogs);

            const adjustedTelemetry = {};
            if (data.data.telemetry) {
              for (const [key, arr] of Object.entries(data.data.telemetry)) {
                adjustedTelemetry[key] = arr.map(item => {
                  if (!item.time) return item;
                  const [h, m, s] = item.time.split(':').map(Number);
                  const d = new Date();
                  d.setUTCHours(h, m, s || 0);
                  const localH = d.getHours().toString().padStart(2, '0');
                  const localM = d.getMinutes().toString().padStart(2, '0');
                  const localS = d.getSeconds().toString().padStart(2, '0');
                  return { ...item, time: `${localH}:${localM}:${localS}` };
                });
              }
            }
            setTelemetry(adjustedTelemetry);

            // Once we have valid sensor data, mark as ready to transition out of loading screen
            if (Object.keys(data.data.sensors || {}).length > 0) {
              // Add a tiny delay to ensure smooth transition
              setTimeout(() => setIsReady(true), 500);
            }
          }
        })
        .catch((err) => console.error("Failed to fetch state:", err));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleActuator = async (actuatorName, currentState) => {
    const newState = currentState === 'ON' ? 'OFF' : 'ON';

    // Optimistic UI update: immediately set the new state in the frontend
    setActuators(prev => ({
      ...prev,
      [actuatorName]: newState
    }));

    try {
      await fetch(`http://localhost:8000/actuators/${actuatorName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: newState })
      });
      // The background polling will eventually sync with this state
    } catch (err) {
      console.error("Failed to toggle actuator:", err);
      // Revert the state on error
      setActuators(prev => ({
        ...prev,
        [actuatorName]: currentState
      }));
    }
  };

  return (
    <>
      {/* Show Loading Screen if not ready. We use a transition to fade it out, but for simplicity here we unmount it when ready, or we can keep it with opacity */}
      {!isReady && <MarsLoadingScreen />}

      <div className={`min-h-screen bg-[#0B0F19] bg-grid text-gray-200 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <Header logs={logs} />
        <main className="mx-auto max-w-7xl space-y-8 p-6">
          <SensorGrid sensorData={sensors} />
          <TelemetryPanel telemetry={telemetry} />
          <ActuatorControl actuatorData={actuators} handleToggleActuator={handleToggleActuator} />
          <RuleEngine rules={rules} />
          <ActivityLog logs={logs} />
        </main>
        <footer className="border-t border-[#2a3040] py-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
            MARS OPS HABITAT CONTROL SYSTEM v1.0 — Made on Earth with <span className="text-orange-500">♥</span> by DeployDudes
          </p>
        </footer>
      </div>
    </>
  )
}
