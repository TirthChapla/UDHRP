import React from 'react';
import './Card.css';

function Card({ children, className = '', variant = 'default', hover = false, onClick }) {
  const cardClasses = `card card-${variant} ${hover ? 'card-hover' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}

export default Card;
