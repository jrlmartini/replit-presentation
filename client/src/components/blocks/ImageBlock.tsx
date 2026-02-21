import { ImageIcon } from "lucide-react";

interface ImageBlockProps {
  src?: string;
  alt?: string;
  placeholder?: string;
  variant?: "light" | "dark";
  className?: string;
}

export function ImageBlock({ src, alt = "", placeholder, variant = "light", className = "" }: ImageBlockProps) {
  const isDark = variant === "dark";

  if (!src || src === "[INSERIR IMAGEM]") {
    return (
      <div
        data-testid="image-block-placeholder"
        className={`flex flex-col items-center justify-center gap-3 rounded-md ${className}`}
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          border: `2px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
          padding: "2rem",
          minHeight: "12rem",
        }}
      >
        <ImageIcon size={32} style={{ opacity: 0.4, color: isDark ? "#a8cfc0" : "#6b9e8c" }} />
        <span style={{ fontSize: "0.875rem", opacity: 0.5, color: isDark ? "#a8cfc0" : "#6b9e8c" }}>
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
