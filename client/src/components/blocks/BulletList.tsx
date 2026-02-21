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
    <ul data-testid="bullet-list" className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <IconComponent
            size={icon === "dot" ? 8 : 18}
            style={{
              color: vc.accent,
              marginTop: icon === "dot" ? "0.5rem" : "0.15rem",
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
