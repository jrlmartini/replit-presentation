import { CheckCircle2, ChevronRight, Circle } from "lucide-react";

interface BulletListProps {
  items: string[];
  variant?: "light" | "dark";
  icon?: "check" | "chevron" | "dot";
  className?: string;
}

export function BulletList({ items, variant = "light", icon = "chevron", className = "" }: BulletListProps) {
  const isDark = variant === "dark";
  const iconColor = isDark ? "#22a87e" : "#1a7a5c";

  const IconComponent = icon === "check" ? CheckCircle2 : icon === "chevron" ? ChevronRight : Circle;

  return (
    <ul data-testid="bullet-list" className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <IconComponent
            size={icon === "dot" ? 8 : 18}
            style={{
              color: iconColor,
              marginTop: icon === "dot" ? "0.5rem" : "0.15rem",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: isDark ? "#e8f5f0" : "#0f2a20",
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
