interface TextBlockProps {
  content: string;
  variant?: "light" | "dark";
  size?: "title" | "subtitle" | "heading" | "body" | "caption";
  className?: string;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  title: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  subtitle: { fontSize: "1.25rem", fontWeight: 400, lineHeight: 1.4, opacity: 0.85 },
  heading: { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
  caption: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.4, opacity: 0.7 },
};

export function TextBlock({ content, variant = "light", size = "body", className = "" }: TextBlockProps) {
  const isDark = variant === "dark";
  return (
    <div
      data-testid="text-block"
      className={className}
      style={{
        ...sizeStyles[size],
        color: isDark ? "#e8f5f0" : "#0f2a20",
      }}
    >
      {content}
    </div>
  );
}
