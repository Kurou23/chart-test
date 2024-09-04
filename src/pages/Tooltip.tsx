import React from 'react';

interface TooltipProps {
  content: string;
  x: number;
  y: number;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, x, y, visible }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default Tooltip;
