import { Mail, Phone, Globe, MapPin } from "lucide-react";

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

export function ContactBlock({ contact, variant = "light", className = "" }: ContactBlockProps) {
  const isDark = variant === "dark";
  const iconColor = isDark ? "#22a87e" : "#1a7a5c";
  const textColor = isDark ? "#e8f5f0" : "#0f2a20";
  const mutedColor = isDark ? "#a8cfc0" : "#3a6b55";

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
          <p style={{ fontSize: "1.25rem", fontWeight: 600, color: textColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {contact.name}
          </p>
          {contact.role && (
            <p style={{ fontSize: "0.875rem", color: mutedColor, marginTop: "0.25rem" }}>
              {contact.role}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {items.map(({ icon: Icon, value }, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icon size={16} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ fontSize: "0.875rem", color: mutedColor }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
