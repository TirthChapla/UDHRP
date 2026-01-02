import React from 'react';
import './Input.css';

function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  helperText,
  required = false,
  disabled = false,
  ...props 
}) {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        <input
          type={type}
          className={`input-field ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
}

export default Input;
