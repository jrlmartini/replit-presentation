import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3 } from "lucide-react";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

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

const t = themeConatus;

export function ChartBlock({ data, chartType = "bar", title, unit, variant = "light", className = "" }: ChartBlockProps) {
  const vc = getVariantColors(variant);

  if (!data || data.length === 0) {
    return (
      <div
        data-testid="chart-block-placeholder"
        className={`flex flex-col items-center justify-center gap-3 rounded-md ${className}`}
        style={{
          backgroundColor: vc.placeholderBg,
          border: `2px dashed ${vc.placeholderBorder}`,
          padding: "2rem",
          minHeight: "14rem",
        }}
      >
        <BarChart3 size={32} style={{ opacity: 0.4, color: vc.textSecondary }} />
        <span style={{ fontSize: t.typography.caption.size, opacity: 0.5, color: vc.textSecondary }}>
          [INSERIR GRÁFICO COM DADOS]
        </span>
      </div>
    );
  }

  return (
    <div data-testid="chart-block" className={className}>
      {title && (
        <p style={{ fontSize: t.typography.caption.size, fontWeight: 600, color: vc.textSecondary, marginBottom: "0.75rem" }}>
          {title} {unit && <span style={{ fontWeight: 400 }}>({unit})</span>}
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        {chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={vc.gridColor} />
            <XAxis dataKey="name" tick={{ fill: vc.textSecondary, fontSize: 12 }} />
            <YAxis tick={{ fill: vc.textSecondary, fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={vc.accent} strokeWidth={2} dot={{ fill: vc.accent }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={vc.gridColor} />
            <XAxis dataKey="name" tick={{ fill: vc.textSecondary, fontSize: 12 }} />
            <YAxis tick={{ fill: vc.textSecondary, fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={vc.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
