interface AgendaListProps {
  items: string[];
  variant?: "light" | "dark";
  className?: string;
}

export function AgendaList({ items, variant = "light", className = "" }: AgendaListProps) {
  const isDark = variant === "dark";

  return (
    <ol data-testid="agenda-list" className={`flex flex-col gap-4 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-4">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: isDark ? "rgba(34, 168, 126, 0.2)" : "rgba(26, 122, 92, 0.1)",
              border: `2px solid ${isDark ? "#22a87e" : "#1a7a5c"}`,
              color: isDark ? "#22a87e" : "#1a7a5c",
              fontWeight: 700,
              fontSize: "0.875rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 500,
              color: isDark ? "#e8f5f0" : "#0f2a20",
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
