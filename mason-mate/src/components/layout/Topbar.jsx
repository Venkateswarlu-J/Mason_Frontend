import React from "react";
import "./Topbar.css";
export default function Topbar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuClick}>☰</button>
      <h2 className="topbar-title">{title}</h2>
    </header>
  );
}
