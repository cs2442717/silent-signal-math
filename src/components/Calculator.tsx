
import React, { useEffect } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import CalculatorDisplay from './calculator/CalculatorDisplay';
import CalculatorKeypad from './calculator/CalculatorKeypad';

const Calculator: React.FC = () => {
  const {
    display,
    memory,
    operation,
    handleButtonPress,
    handleTouchStart,
    handleTouchEnd,
    checkSpecialSequences,
    inputSequence
  } = useCalculator();
  
  // Check special sequences whenever inputSequence changes
  useEffect(() => {
    checkSpecialSequences();
  }, [inputSequence]);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <CalculatorDisplay 
        display={display} 
        memory={memory} 
        operation={operation} 
      />
      
      <CalculatorKeypad 
        onButtonPress={handleButtonPress}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Enter PIN sequence to access additional features
      </div>
    </div>
  );
};

export default Calculator;
