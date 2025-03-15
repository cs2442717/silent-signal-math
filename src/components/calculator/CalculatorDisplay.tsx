
import React from 'react';

interface CalculatorDisplayProps {
  display: string;
  memory: number | null;
  operation: string | null;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ 
  display, 
  memory, 
  operation 
}) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-lg mb-4">
      <div className="text-right text-5xl font-light mb-2 overflow-hidden">
        {display}
      </div>
      {operation && (
        <div className="text-right text-muted-foreground text-lg mb-2">
          {memory} {operation}
        </div>
      )}
    </div>
  );
};

export default CalculatorDisplay;
