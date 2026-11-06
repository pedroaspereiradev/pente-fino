import { CombIcon } from "./icons";

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#F4D7D4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CombIcon color="#1A0F2E" />
      </div>
      <div className="font-logo" style={{ fontSize: 22, fontWeight: 400, letterSpacing: 0.5 }}>
        pente.fino
      </div>
    </div>
  );
}
