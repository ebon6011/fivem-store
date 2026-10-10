import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

// Rendered to a PNG by next/og. Only inline styles and flex layout are supported here.
export function OgCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: "#07060b",
        backgroundImage: `radial-gradient(circle at 20% 15%, ${site.accent}80, transparent 55%)`,
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: site.accent }} />
        {site.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 30, color: "#a1a1aa" }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: site.accent }}>FiveM scripts · ESX · QBCore · QBox · Standalone</div>
    </div>
  );
}
