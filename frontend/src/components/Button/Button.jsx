import React from 'react';
import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = ''
}) {
  const buttonClasses = `
    button 
    button-${variant} 
    button-${size} 
    ${fullWidth ? 'button-full-width' : ''} 
    ${loading ? 'button-loading' : ''}
    ${className}
  `.trim();

  return (
    <button 
      type={type}
      className={buttonClasses} 
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="button-spinner"></span>}
      {!loading && icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
}

export default Button;
