import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3 } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ChartBlockProps {
  data?: ChartData[];
  chartType?: "bar" | "line" | "column";
  title?: string;
  unit?: string;
  variant?: "light" | "dark";
  className?: string;
}

export function ChartBlock({ data, chartType = "bar", title, unit, variant = "light", className = "" }: ChartBlockProps) {
  const isDark = variant === "dark";
  const chartColor = isDark ? "#22a87e" : "#1a7a5c";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = isDark ? "#a8cfc0" : "#3a6b55";

  if (!data || data.length === 0) {
    return (
      <div
        data-testid="chart-block-placeholder"
        className={`flex flex-col items-center justify-center gap-3 rounded-md ${className}`}
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          border: `2px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
          padding: "2rem",
          minHeight: "14rem",
        }}
      >
        <BarChart3 size={32} style={{ opacity: 0.4, color: isDark ? "#a8cfc0" : "#6b9e8c" }} />
        <span style={{ fontSize: "0.875rem", opacity: 0.5, color: isDark ? "#a8cfc0" : "#6b9e8c" }}>
          [INSERIR GRÁFICO COM DADOS]
        </span>
      </div>
    );
  }

  return (
    <div data-testid="chart-block" className={className}>
      {title && (
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: textColor, marginBottom: "0.75rem" }}>
          {title} {unit && <span style={{ fontWeight: 400 }}>({unit})</span>}
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        {chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={{ fill: chartColor }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
