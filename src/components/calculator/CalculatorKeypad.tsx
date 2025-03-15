
import React from 'react';
import CalculatorButton from './CalculatorButton';
import { useApp } from '@/contexts/AppContext';

interface CalculatorKeypadProps {
  onButtonPress: (value: string) => void;
  onTouchStart: (value: string) => void;
  onTouchEnd: () => void;
}

const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onButtonPress,
  onTouchStart,
  onTouchEnd
}) => {
  const { addContact } = useApp();

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      <CalculatorButton
        key="sin"
        value="sin"
        onClick={() => onButtonPress('sin')}
        className="calc-button-function"
      />
      {buttons.flat().map((value, index) => {
        // Special handling for zero button which spans 2 columns
        if (value === '0') {
          return (
            <CalculatorButton
              key={value}
              value={value}
              colSpan={2}
              onClick={() => onButtonPress(value)}
              onTouchStart={() => onTouchStart(value)}
              onTouchEnd={onTouchEnd}
            />
          );
        }
        
        return (
          <CalculatorButton
            key={value}
            value={value}
            onClick={() => onButtonPress(value)}
            onTouchStart={value !== '.' && value !== '=' && value !== '±' && value !== '%' ? 
              () => onTouchStart(value) : undefined}
            onTouchEnd={value !== '.' && value !== '=' && value !== '±' && value !== '%' ? 
              onTouchEnd : undefined}
          />
        );
      })}
    </div>
  );
};

export default CalculatorKeypad;
