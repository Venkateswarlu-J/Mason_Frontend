/* src/components/common/Input.js */

import React, { useState } from 'react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  name,
  required,
  autoComplete,
  disabled,
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}{required && ' *'}</label>}
      <div className={isPassword ? 'input-icon-wrap' : ''}>
        <input
          className={`input-field${error ? ' input-error' : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            className="input-icon-btn"
            onClick={() => setShowPw(p => !p)}
            tabIndex={-1}
          >
            {showPw ? 'HIDE' : 'SHOW'}
          </button>
        )}
      </div>
      {error  && <span className="input-error-msg">{error}</span>}
      {hint && !error && <span className="input-hint">{hint}</span>}
    </div>
  );
}
