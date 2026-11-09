import React from 'react';

export function Tag({ children, variant = '' }) {
  return <span className={`tag ${variant}`}>{children}</span>;
}

export default Tag;
