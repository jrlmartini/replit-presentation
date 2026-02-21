import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { themeConatus, getVariantColors } from "@shared/theme-conatus";

interface ContactInfo {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

interface ContactBlockProps {
  contact: ContactInfo;
  variant?: "light" | "dark";
  className?: string;
}

const t = themeConatus;

export function ContactBlock({ contact, variant = "light", className = "" }: ContactBlockProps) {
  const vc = getVariantColors(variant);

  const items = [
    { icon: Mail, value: contact.email },
    { icon: Phone, value: contact.phone },
    { icon: Globe, value: contact.website },
    { icon: MapPin, value: contact.address },
  ].filter(item => item.value);

  return (
    <div data-testid="contact-block" className={`flex flex-col gap-4 ${className}`}>
      {contact.name && (
        <div>
          <p style={{ fontSize: t.typography.subtitle.size, fontWeight: 600, color: vc.text, fontFamily: t.fonts.heading }}>
            {contact.name}
          </p>
          {contact.role && (
            <p style={{ fontSize: t.typography.caption.size, color: vc.textSecondary, marginTop: "0.25rem" }}>
              {contact.role}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {items.map(({ icon: Icon, value }, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icon size={16} style={{ color: vc.accent, flexShrink: 0 }} />
            <span style={{ fontSize: t.typography.caption.size, color: vc.textSecondary }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
