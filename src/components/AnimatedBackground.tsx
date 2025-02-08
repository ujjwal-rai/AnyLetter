import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gray-100">
        {/* Grid pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(white 2px, transparent 2px),
              linear-gradient(90deg, white 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground; 