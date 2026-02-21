import { themeConatus, getVariantColors } from "@shared/theme-conatus";

interface TextBlockProps {
  content: string;
  variant?: "light" | "dark";
  size?: "title" | "subtitle" | "heading" | "body" | "caption";
  className?: string;
}

const t = themeConatus;

const sizeStyles: Record<string, React.CSSProperties> = {
  title: { fontSize: t.typography.title.size, fontWeight: t.typography.title.weight, lineHeight: t.typography.title.lineHeight, fontFamily: t.fonts.heading },
  subtitle: { fontSize: t.typography.subtitle.size, fontWeight: t.typography.subtitle.weight, lineHeight: t.typography.subtitle.lineHeight, opacity: 0.85 },
  heading: { fontSize: t.typography.heading.size, fontWeight: t.typography.heading.weight, lineHeight: t.typography.heading.lineHeight, fontFamily: t.fonts.heading },
  body: { fontSize: t.typography.body.size, fontWeight: t.typography.body.weight, lineHeight: t.typography.body.lineHeight },
  caption: { fontSize: t.typography.caption.size, fontWeight: t.typography.caption.weight, lineHeight: t.typography.caption.lineHeight, opacity: 0.7 },
};

export function TextBlock({ content, variant = "light", size = "body", className = "" }: TextBlockProps) {
  const vc = getVariantColors(variant);
  return (
    <div
      data-testid="text-block"
      className={className}
      style={{
        ...sizeStyles[size],
        color: vc.text,
      }}
    >
      {content}
    </div>
  );
}
