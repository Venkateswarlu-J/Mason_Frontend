import React from "react";
import "../../styles/components.css";
export default function Badge({ label, variant = "neutral" }) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
