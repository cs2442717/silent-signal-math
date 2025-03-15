
import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorButtonProps {
  value: string;
  onClick: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  className?: string;
  colSpan?: number;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  onTouchStart,
  onTouchEnd,
  className,
  colSpan = 1
}) => {
  const getButtonClass = () => {
    if (value === 'C' || value === '±' || value === '%') {
      return 'calc-button-function';
    } else if (['+', '-', '×', '÷', '='].includes(value)) {
      return 'calc-button-primary';
    } else {
      return 'calc-button-secondary';
    }
  };

  return (
    <button
      className={cn(
        getButtonClass(),
        colSpan > 1 && `col-span-${colSpan}`,
        className
      )}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {value}
    </button>
  );
};

export default CalculatorButton;
