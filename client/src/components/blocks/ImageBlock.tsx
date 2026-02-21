import { ImageIcon } from "lucide-react";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

interface ImageBlockProps {
  src?: string;
  alt?: string;
  placeholder?: string;
  variant?: "light" | "dark";
  className?: string;
}

const t = themeConatus;

export function ImageBlock({ src, alt = "", placeholder, variant = "light", className = "" }: ImageBlockProps) {
  const vc = getVariantColors(variant);

  if (!src || src === "[INSERIR IMAGEM]") {
    return (
      <div
        data-testid="image-block-placeholder"
        className={`flex flex-col items-center justify-center gap-3 rounded-md ${className}`}
        style={{
          backgroundColor: vc.placeholderBg,
          border: `2px dashed ${vc.placeholderBorder}`,
          padding: "2rem",
          minHeight: "12rem",
        }}
      >
        <ImageIcon size={32} style={{ opacity: 0.4, color: vc.textSecondary }} />
        <span style={{ fontSize: t.typography.caption.size, opacity: 0.5, color: vc.textSecondary }}>
          {placeholder || "[INSERIR IMAGEM]"}
        </span>
      </div>
    );
  }

  return (
    <div data-testid="image-block" className={className}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-md"
        style={{ maxHeight: "20rem" }}
      />
    </div>
  );
}
