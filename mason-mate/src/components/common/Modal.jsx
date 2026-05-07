import React from "react";
import "../../styles/components.css";
export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
