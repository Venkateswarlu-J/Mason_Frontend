import React from "react";

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["", "#E24B4A", "#EF9F27", "#639922", "#1D9E75"];

export default function PasswordStrength({ password }) {
  const strength = getStrength(password);
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 2,
            background: i <= strength ? COLORS[strength] : "var(--clr-border)", transition: "background 0.3s" }} />
        ))}
      </div>
      {password && (
        <p style={{ fontSize: 11, marginTop: 6, fontFamily: "var(--font-mono)", color: COLORS[strength] }}>
          {LABELS[strength]}
        </p>
      )}
    </div>
  );
}
