import React from "react";
import "../../styles/components.css";
export default function EmptyState({ icon = "○", title, message, action }) {
  return (
    <div className="empty-state">
      <span style={{ fontSize: 32 }}>{icon}</span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
