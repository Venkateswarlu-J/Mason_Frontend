import React from "react";
import "../../styles/components.css";
export default function Spinner({ fullPage = false }) {
  if (fullPage) return <div className="page-loader"><div className="spinner" /></div>;
  return <div className="spinner" />;
}
