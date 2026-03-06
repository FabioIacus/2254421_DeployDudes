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
// ICONS (SVG Components to replace Lucide icons)
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
// HEADER COMPONENT
// ============================================================================

function Header() {
  const [time, setTime] = useState("")

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
    <header className="flex items-center justify-between border-b border-neutral-300 bg-neutral-100 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-neutral-300 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-neutral-600" />
        </div>
        <h1 className="text-lg font-semibold tracking-wide text-neutral-800">
          MARS OPS <span className="text-neutral-500">|</span> HABITAT CONTROL
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md border border-neutral-300 bg-neutral-200 px-3 py-1.5">
          <CpuIcon className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">System: OK</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-neutral-300 bg-neutral-200 px-3 py-1.5">
          <RadioIcon className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">Broker: Connected</span>
        </div>
        <div className="rounded-md border border-neutral-300 bg-neutral-800 px-4 py-1.5">
          <span className="font-mono text-sm font-semibold text-neutral-100">{time || "00:00:00"}</span>
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// SENSOR GRID COMPONENT
// ============================================================================

const sensors = [
  { id: "greenhouse_temperature", label: "Greenhouse Temp", value: "24.7", unit: "°C", Icon: ThermometerIcon },
  { id: "entrance_humidity", label: "Entrance Humidity", value: "45", unit: "%", Icon: DropletsIcon },
  { id: "co2_hall", label: "CO₂ Hall", value: "892", unit: "ppm", Icon: CloudFogIcon },
  { id: "hydroponic_ph", label: "Hydroponic pH", value: "6.4", unit: "pH", Icon: FlaskConicalIcon },
  { id: "water_tank_level", label: "Water Tank Level", value: "78", unit: "%", Icon: WavesIcon },
  { id: "corridor_pressure", label: "Corridor Pressure", value: "1013", unit: "hPa", Icon: GaugeIcon },
  { id: "air_quality_pm25", label: "Air Quality PM2.5", value: "12", unit: "µg/m³", Icon: WindIcon },
  { id: "air_quality_voc", label: "Air Quality VOC", value: "0.3", unit: "ppm", Icon: ActivityIcon },
]

function SensorGrid() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-neutral-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Sensor Grid — REST Polling
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="rounded-lg border border-neutral-300 bg-neutral-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between p-4 pb-2">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {sensor.label}
              </span>
              <sensor.Icon className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-800">{sensor.value}</span>
                <span className="text-sm font-medium text-neutral-500">{sensor.unit}</span>
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
    id: "power",
    label: "Power",
    Icon: ZapIcon,
    unit: "kW",
    yAxisLabel: "Power (kW)",
    lines: [
      { key: "solar_array", name: "Solar Array" },
      { key: "power_bus", name: "Power Bus", strokeDasharray: "5 5" },
      { key: "power_consumption", name: "Consumption", strokeDasharray: "2 2" },
    ],
    yDomain: [0, 120],
  },
  {
    id: "environment",
    label: "Environment",
    Icon: LeafIcon,
    unit: "mSv/h | %",
    yAxisLabel: "Radiation (mSv/h) | Life Support (%)",
    lines: [
      { key: "radiation", name: "Radiation (mSv/h)" },
      { key: "life_support", name: "Life Support (%)", strokeDasharray: "5 5" },
    ],
    yDomain: [0, 100],
  },
  {
    id: "thermal",
    label: "Thermal",
    Icon: ThermometerSunIcon,
    unit: "°C",
    yAxisLabel: "Temperature (°C)",
    lines: [{ key: "thermal_loop", name: "Thermal Loop" }],
    yDomain: [-20, 40],
  },
  {
    id: "airlock",
    label: "Airlock",
    Icon: DoorOpenIcon,
    unit: "",
    yAxisLabel: "State (Open/Closed)",
    lines: [{ key: "airlock_state", name: "Airlock State" }],
    yDomain: [-0.2, 1.2],
  },
]

const strokeColors = ["#525252", "#737373", "#a3a3a3"]

function generateTimestamps(count) {
  const timestamps = []
  const baseHour = 12
  const baseMinute = 30
  for (let i = 0; i < count; i++) {
    const totalMinutes = baseMinute + i * 2
    const hours = baseHour + Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    timestamps.push(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
    )
  }
  return timestamps
}

function generatePowerData(timestamps) {
  return timestamps.map((time, i) => ({
    time,
    solar_array: 85 + Math.sin(i * 0.5) * 15 + Math.random() * 5,
    power_bus: 70 + Math.cos(i * 0.3) * 10 + Math.random() * 3,
    power_consumption: 55 + Math.sin(i * 0.4 + 1) * 12 + Math.random() * 4,
  }))
}

function generateEnvironmentData(timestamps) {
  return timestamps.map((time, i) => ({
    time,
    radiation: 0.15 + Math.sin(i * 0.2) * 0.08 + Math.random() * 0.02,
    life_support: 92 + Math.cos(i * 0.15) * 5 + Math.random() * 2,
  }))
}

function generateThermalData(timestamps) {
  return timestamps.map((time, i) => ({
    time,
    thermal_loop: 18 + Math.sin(i * 0.25) * 8 + Math.random() * 2,
  }))
}

function generateAirlockData(timestamps) {
  const states = [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0]
  return timestamps.map((time, i) => ({
    time,
    airlock_state: states[i % states.length],
  }))
}

function CustomTooltip({ active, payload, label, tabId }) {
  if (!active || !payload || !payload.length) return null

  const formatValue = (value, key) => {
    if (tabId === "airlock") {
      return value === 1 ? "Open" : "Closed"
    }
    if (tabId === "environment" && key === "radiation") {
      return `${value.toFixed(3)} mSv/h`
    }
    if (tabId === "environment" && key === "life_support") {
      return `${value.toFixed(1)} %`
    }
    if (tabId === "thermal") {
      return `${value.toFixed(1)} °C`
    }
    if (tabId === "power") {
      return `${value.toFixed(1)} kW`
    }
    return value.toFixed(2)
  }

  return (
    <div className="rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 shadow-lg">
      <div className="mb-1 border-b border-neutral-300 pb-1 text-xs text-neutral-500">
        Timestamp: {label}
      </div>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: strokeColors[index] || "#525252" }}
          />
          <span className="text-neutral-500">{entry.name}:</span>
          <span className="font-semibold text-neutral-800">
            {formatValue(entry.value, entry.dataKey)}
          </span>
        </div>
      ))}
    </div>
  )
}

function TelemetryPanel() {
  const [activeTab, setActiveTab] = useState("power")

  const timestamps = useMemo(() => generateTimestamps(15), [])

  const data = useMemo(() => {
    return {
      power: generatePowerData(timestamps),
      environment: generateEnvironmentData(timestamps),
      thermal: generateThermalData(timestamps),
      airlock: generateAirlockData(timestamps),
    }
  }, [timestamps])

  const activeConfig = tabConfigs.find((t) => t.id === activeTab)
  const activeData = data[activeTab]

  const formatYAxisTick = (value) => {
    if (activeTab === "airlock") {
      return value === 1 ? "Open" : value === 0 ? "Closed" : ""
    }
    return value.toString()
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-neutral-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Interactive Telemetry Panel — Stream
        </h2>
      </div>
      <div className="rounded-lg border border-neutral-300 bg-neutral-100">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-800">
              Live Telemetry Data
            </span>
            <div className="flex gap-1">
              {tabConfigs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-neutral-800 text-neutral-100"
                      : "bg-neutral-200 text-neutral-500 hover:bg-neutral-300 hover:text-neutral-700"
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
          <div className="h-72 w-full rounded-lg border border-neutral-300 bg-neutral-200/30 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#d4d4d4"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#737373", fontSize: 11 }}
                  tickLine={{ stroke: "#d4d4d4" }}
                  axisLine={{ stroke: "#d4d4d4" }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis
                  domain={activeConfig.yDomain}
                  tick={{ fill: "#737373", fontSize: 11 }}
                  tickLine={{ stroke: "#d4d4d4" }}
                  axisLine={{ stroke: "#d4d4d4" }}
                  tickFormatter={formatYAxisTick}
                  ticks={activeTab === "airlock" ? [0, 1] : undefined}
                  label={{
                    value: activeConfig.yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fill: "#737373",
                      fontSize: 11,
                      textAnchor: "middle",
                    },
                    offset: 0,
                  }}
                  width={80}
                />
                <Tooltip
                  content={<CustomTooltip tabId={activeTab} />}
                  cursor={{
                    stroke: "#404040",
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
                    <span style={{ color: "#737373" }}>{value}</span>
                  )}
                />
                {activeConfig.lines.map((line, index) => (
                  <Line
                    key={line.key}
                    type={activeTab === "airlock" ? "stepAfter" : "monotone"}
                    dataKey={line.key}
                    name={line.name}
                    stroke={strokeColors[index]}
                    strokeWidth={2}
                    strokeDasharray={line.strokeDasharray}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: strokeColors[index],
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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 ${
        checked ? "bg-neutral-800" : "bg-neutral-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

function ActuatorControl() {
  const [states, setStates] = useState(
    Object.fromEntries(actuators.map((a) => [a.id, a.defaultOn]))
  )

  const toggleActuator = (id) => {
    setStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-neutral-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Actuator Control Center
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {actuators.map((actuator) => (
          <div
            key={actuator.id}
            className={`rounded-lg border border-neutral-300 transition-all ${
              states[actuator.id] ? "bg-neutral-200" : "bg-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    states[actuator.id]
                      ? "bg-neutral-800 text-neutral-100"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  <actuator.Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{actuator.label}</p>
                  <p className="text-xs text-neutral-500">
                    {states[actuator.id] ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={states[actuator.id]}
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

const initialRules = [
  { id: 1, sensor: "co2_hall", operator: ">", value: "1000", actuator: "hall_ventilation", state: "ON" },
  { id: 2, sensor: "greenhouse_temperature", operator: ">", value: "30", actuator: "cooling_fan", state: "ON" },
  { id: 3, sensor: "entrance_humidity", operator: "<", value: "40", actuator: "entrance_humidifier", state: "ON" },
]

function RuleEngine() {
  const [rules, setRules] = useState(initialRules)
  const [newRule, setNewRule] = useState({
    sensor: "",
    operator: "",
    value: "100",
    actuator: "",
    state: "",
  })

  const addRule = () => {
    if (newRule.sensor && newRule.operator && newRule.actuator && newRule.state) {
      setRules([
        ...rules,
        {
          id: Date.now(),
          ...newRule,
        },
      ])
      setNewRule({ sensor: "", operator: "", value: "100", actuator: "", state: "" })
    }
  }

  const deleteRule = (id) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-neutral-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Rule Engine — IF-THEN Logic
        </h2>
      </div>
      <div className="rounded-lg border border-neutral-300 bg-neutral-100">
        <div className="border-b border-neutral-300 p-4">
          <span className="text-sm font-medium text-neutral-800">Rule Builder</span>
        </div>
        <div className="space-y-6 p-4">
          {/* Rule Builder Form */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-neutral-500">IF</span>
            <select
              value={newRule.sensor}
              onChange={(e) => setNewRule({ ...newRule, sensor: e.target.value })}
              className="h-9 w-48 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
              className="h-9 w-24 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
              className="h-9 w-20 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="Value"
            />
            <span className="text-sm font-medium text-neutral-500">THEN set</span>
            <select
              value={newRule.actuator}
              onChange={(e) => setNewRule({ ...newRule, actuator: e.target.value })}
              className="h-9 w-48 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="">Select actuator</option>
              {actuatorOptions.map((actuator) => (
                <option key={actuator} value={actuator}>
                  {actuator}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-neutral-500">to</span>
            <select
              value={newRule.state}
              onChange={(e) => setNewRule({ ...newRule, state: e.target.value })}
              className="h-9 w-24 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
              className="flex h-9 items-center gap-2 rounded-md bg-neutral-800 px-4 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-700"
            >
              <PlusIcon className="h-4 w-4" />
              Add Rule
            </button>
          </div>

          {/* Rules Table */}
          <div className="rounded-lg border border-neutral-300">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-300 bg-neutral-200 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Rule Definition
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Actions
              </span>
            </div>
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-300 px-4 py-3 last:border-b-0"
              >
                <div className="font-mono text-sm text-neutral-800">
                  <span className="text-neutral-500">IF</span>{" "}
                  <span className="font-medium">{rule.sensor}</span>{" "}
                  <span className="text-neutral-500">{rule.operator}</span>{" "}
                  <span className="font-medium">{rule.value}</span>{" "}
                  <span className="text-neutral-500">THEN set</span>{" "}
                  <span className="font-medium">{rule.actuator}</span>{" "}
                  <span className="text-neutral-500">to</span>{" "}
                  <span className="font-medium">{rule.state}</span>
                </div>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-800"
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

const logEntries = [
  { timestamp: "14:32:15", message: "System initialized. All sensors reporting nominal values." },
  { timestamp: "14:32:47", message: "Rule triggered: co2_hall exceeded 1000 ppm → hall_ventilation set to ON" },
  { timestamp: "14:33:02", message: "Telemetry stream connected. Receiving data at 1Hz refresh rate." },
  { timestamp: "14:33:28", message: "Actuator state change: cooling_fan manually toggled to OFF" },
  { timestamp: "14:34:11", message: "Warning: water_tank_level approaching threshold (78%). Monitor advised." },
]

function ActivityLog() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-neutral-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          System Console — Activity Log
        </h2>
      </div>
      <div className="rounded-lg border border-neutral-300 bg-neutral-100">
        <div className="flex items-center gap-2 border-b border-neutral-300 p-4">
          <TerminalIcon className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-800">Activity Log</span>
        </div>
        <div className="p-4">
          <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-4">
            <div className="space-y-2 font-mono text-sm">
              {logEntries.map((entry, index) => (
                <div key={index} className="flex gap-4">
                  <span className="shrink-0 text-neutral-400">[{entry.timestamp}]</span>
                  <span className="text-neutral-600">{entry.message}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-neutral-400">{">"}</span>
                <span className="inline-block h-4 w-2 animate-pulse bg-neutral-400" />
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
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="mx-auto max-w-7xl space-y-8 p-6">
        <SensorGrid />
        <TelemetryPanel />
        <ActuatorControl />
        <RuleEngine />
        <ActivityLog />
      </main>
      <footer className="border-t border-neutral-300 py-4 text-center">
        <p className="text-xs text-neutral-500">
          MARS OPS HABITAT CONTROL SYSTEM v1.0 — Engineering Blueprint Interface
        </p>
      </footer>
    </div>
  )
}
