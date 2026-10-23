import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "CV Arsindo Niaga Sejahtera, Bandar Lampung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const png = await readFile(join(process.cwd(), "public/logo/logo-mark-white.png"));
  const mark = `data:image/png;base64,${png.toString("base64")}`;
  const units = ["Perdagangan Suku Cadang", "Jasa Reparasi Mesin", "Perdagangan Oli", "Rental Mobil"];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg,#12305c 0%,#0b1a33 60%,#070f20 100%)",
        color: "white",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={163} height={88} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, letterSpacing: 8, color: "#f5a524" }}>CV</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>ARSINDO NIAGA</div>
          <div style={{ fontSize: 18, letterSpacing: 12, color: "rgba(255,255,255,.75)" }}>SEJAHTERA</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, maxWidth: 950 }}>
          Mitra terpercaya untuk kebutuhan industri & mobilitas Anda
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
          {units.map((u) => (
            <div
              key={u}
              style={{
                fontSize: 22,
                padding: "10px 20px",
                borderRadius: 999,
                border: "2px solid rgba(255,255,255,.25)",
                color: "rgba(255,255,255,.9)",
              }}
            >
              {u}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 22, color: "rgba(255,255,255,.6)" }}>Bandar Lampung · Lampung · Indonesia</div>
    </div>,
    size,
  );
}
