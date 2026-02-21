import type { Slide } from "@shared/schema";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

const t = themeConatus;

interface SlideWrapperProps {
  slide: Slide;
  variant: "light" | "dark";
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
}

export function SlideWrapper({ slide, variant, backgroundImage, children, className = "" }: SlideWrapperProps) {
  const isDark = variant === "dark";
  const vc = getVariantColors(variant);

  return (
    <div
      data-testid={`slide-${slide.id}`}
      className={`relative w-full h-full flex flex-col ${className}`}
      style={{
        aspectRatio: "16/9",
        fontFamily: t.fonts.body,
        color: vc.text,
        background: vc.gradient,
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
            opacity: isDark ? t.backgrounds.closing.opacity : t.backgrounds.light.opacity,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col h-full" style={{ padding: t.spacing.slide.padding }}>
        {children}
      </div>
    </div>
  );
}
