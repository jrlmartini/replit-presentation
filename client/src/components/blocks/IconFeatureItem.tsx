import { themeConatus, getVariantColors } from "@shared/theme-conatus";
import * as LucideIcons from "lucide-react";

interface IconFeatureItemProps {
  iconSrc?: string;
  iconName?: string;
  title: string;
  text: string;
  variant?: "light" | "dark";
  className?: string;
}

const t = themeConatus;
const il = t.iconLayout;

function getIcon(iconName?: string, iconSrc?: string, color?: string) {
  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt=""
        style={{ width: il.iconSize, height: il.iconSize, objectFit: "contain" }}
      />
    );
  }

  if (iconName) {
    const pascalName = iconName
      .split(/[-_\s]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");
    const IconComp = (LucideIcons as any)[pascalName];
    if (IconComp) {
      return <IconComp size={28} style={{ color }} />;
    }
  }

  const FallbackIcon = LucideIcons.Sparkles;
  return <FallbackIcon size={28} style={{ color }} />;
}

export function IconFeatureItem({ iconSrc, iconName, title, text, variant = "light", className = "" }: IconFeatureItemProps) {
  const vc = getVariantColors(variant);

  return (
    <div
      data-testid="icon-feature-item"
      className={`flex flex-col items-center text-center ${className}`}
      style={{ gap: il.itemGap }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: il.iconContainerSize,
          height: il.iconContainerSize,
          borderRadius: t.radius.lg,
          backgroundColor: vc.tagBg,
          border: `1px solid ${vc.tagBorder}`,
        }}
      >
        {getIcon(iconName, iconSrc, vc.accent)}
      </div>
      <h4
        style={{
          fontFamily: t.fonts.heading,
          fontSize: il.titleSize,
          fontWeight: il.titleWeight,
          lineHeight: 1.3,
          color: vc.text,
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: il.textSize,
          lineHeight: 1.5,
          color: vc.textSecondary,
        }}
      >
        {text}
      </p>
    </div>
  );
}
