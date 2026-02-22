import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

interface BulletListProps {
  items: string[];
  variant?: "light" | "dark";
  icon?: "check" | "chevron" | "dot";
  className?: string;
}

const t = themeConatus;

export function BulletList({ items, variant = "light", icon = "chevron", className = "" }: BulletListProps) {
  const vc = getVariantColors(variant);
  const IconComponent = icon === "check" ? CheckCircle2 : icon === "chevron" ? ChevronRight : Circle;

  return (
    <ul data-testid="bullet-list" className={`flex flex-col ${className}`} style={{ gap: "0.95cqw" }}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start" style={{ gap: "0.95cqw" }}>
          <IconComponent
            size={icon === "dot" ? 8 : 18}
            style={{
              color: vc.accent,
              marginTop: icon === "dot" ? "0.6cqw" : "0.2cqw",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: t.typography.body.size,
              lineHeight: t.typography.body.lineHeight,
              color: vc.text,
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
