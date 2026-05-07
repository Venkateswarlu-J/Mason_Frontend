/* src/components/common/Button.js */

import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = '',
  full = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    full && 'btn-full',
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner" />}
      {children}
    </button>
  );
}
