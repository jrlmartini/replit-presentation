import { themeConatus, getVariantColors } from "@shared/theme-conatus";

interface AgendaListProps {
  items: string[];
  variant?: "light" | "dark";
  className?: string;
}

const t = themeConatus;
const layout = t.slideLayout.agenda;

export function AgendaList({ items, variant = "light", className = "" }: AgendaListProps) {
  const vc = getVariantColors(variant);

  return (
    <ol data-testid="agenda-list" className={`flex flex-col gap-4 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-4">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: layout.numberSize,
              height: layout.numberSize,
              borderRadius: "50%",
              backgroundColor: vc.agendaBg,
              border: `2px solid ${vc.accent}`,
              color: vc.accent,
              fontWeight: 700,
              fontSize: t.typography.caption.size,
              fontFamily: t.fonts.heading,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <span
            style={{
              fontSize: layout.itemSize,
              fontWeight: 500,
              color: vc.text,
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
