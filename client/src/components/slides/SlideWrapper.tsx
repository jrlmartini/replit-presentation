import type { Slide } from "@shared/schema";

interface SlideWrapperProps {
  slide: Slide;
  variant: "light" | "dark";
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
}

export function SlideWrapper({ slide, variant, backgroundImage, children, className = "" }: SlideWrapperProps) {
  const isDark = variant === "dark";

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className={`relative w-full h-full flex flex-col ${className}`}
      style={{
        aspectRatio: "16/9",
        fontFamily: "'Inter', sans-serif",
        color: isDark ? "#e8f5f0" : "#0f2a20",
        background: isDark
          ? "linear-gradient(135deg, #0f1f1a 0%, #142b23 50%, #1a3a2e 100%)"
          : "linear-gradient(135deg, #f5faf8 0%, #edf6f2 50%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isDark ? 0.3 : 0.15,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full" style={{ padding: "3rem 4rem" }}>
        {children}
      </div>
    </div>
  );
}
