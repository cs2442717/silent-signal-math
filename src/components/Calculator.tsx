
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewInput, setIsNewInput] = useState(true);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressCount, setLongPressCount] = useState(0);
  
  const { settings, triggerAlert, setCalculatorMode } = useApp();
  
  // Track input sequence for secret codes
  useEffect(() => {
    if (inputSequence.length === 0) return;
    
    // Check if the PIN matches the trigger PIN
    if (inputSequence.join('') === settings.triggerPin) {
      triggerAlert();
      toast({
        title: "Help is on the way",
        description: "Alert triggered silently",
        variant: "destructive",
      });
      setInputSequence([]);
    }
    
    // Special sequence to exit calculator mode: 0 0 0 0
    if (inputSequence.join('') === '0000') {
      setCalculatorMode(false);
      setInputSequence([]);
    }
    
  }, [inputSequence, settings.triggerPin]);
  
  const handleButtonPress = (value: string) => {
    // Add to input sequence
    setInputSequence(prev => [...prev, value]);
    if (inputSequence.length > 10) {
      setInputSequence(prev => prev.slice(1));
    }
    
    if (value === 'C') {
      // Clear
      setDisplay('0');
      setIsNewInput(true);
      return;
    }
    
    if (value === '=') {
      // Calculate result
      calculate();
      return;
    }
    
    if (['+', '-', '×', '÷'].includes(value)) {
      // Set operation
      setOperation(value);
      setMemory(parseFloat(display));
      setIsNewInput(true);
      return;
    }
    
    if (value === '.') {
      // Add decimal point
      if (!display.includes('.')) {
        setDisplay(display + '.');
      }
      return;
    }
    
    // Handle numeric input
    if (isNewInput) {
      setDisplay(value);
      setIsNewInput(false);
    } else {
      if (display === '0' && value !== '.') {
        setDisplay(value);
      } else {
        setDisplay(display + value);
      }
    }
  };
  
  const calculate = () => {
    if (memory === null || operation === null) return;
    
    const current = parseFloat(display);
    let result = 0;
    
    switch (operation) {
      case '+':
        result = memory + current;
        break;
      case '-':
        result = memory - current;
        break;
      case '×':
        result = memory * current;
        break;
      case '÷':
        if (current === 0) {
          toast({
            title: "Error",
            description: "Cannot divide by zero",
            variant: "destructive",
          });
          setDisplay('Error');
          setIsNewInput(true);
          return;
        }
        result = memory / current;
        break;
    }
    
    setDisplay(result.toString());
    setMemory(null);
    setOperation(null);
    setIsNewInput(true);
  };
  
  const handleLongPress = (value: string) => {
    // Different long press actions depending on the button
    if (value === 'C') {
      // Clear the memory
      setMemory(null);
      setOperation(null);
      toast({
        title: "Memory Cleared",
        description: "All memory has been cleared",
      });
    } else {
      // For number buttons, morse code functionality
      setLongPressCount(prev => prev + 1);
      
      if (longPressCount > 3) {
        triggerAlert();
        toast({
          title: "Emergency Alert Triggered",
          description: "Help is on the way",
          variant: "destructive",
        });
        setLongPressCount(0);
      }
    }
  };
  
  const handleTouchStart = (value: string) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      handleLongPress(value);
    }, 1500);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
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
      
      <div className="grid grid-cols-4 gap-2">
        <button
          className="calc-button-function"
          onClick={() => handleButtonPress('C')}
          onTouchStart={() => handleTouchStart('C')}
          onTouchEnd={handleTouchEnd}
        >
          C
        </button>
        <button
          className="calc-button-function"
          onClick={() => handleButtonPress('±')}
        >
          ±
        </button>
        <button
          className="calc-button-function"
          onClick={() => handleButtonPress('%')}
        >
          %
        </button>
        <button
          className="calc-button-primary"
          onClick={() => handleButtonPress('÷')}
        >
          ÷
        </button>
        
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('7')}
          onTouchStart={() => handleTouchStart('7')}
          onTouchEnd={handleTouchEnd}
        >
          7
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('8')}
          onTouchStart={() => handleTouchStart('8')}
          onTouchEnd={handleTouchEnd}
        >
          8
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('9')}
          onTouchStart={() => handleTouchStart('9')}
          onTouchEnd={handleTouchEnd}
        >
          9
        </button>
        <button
          className="calc-button-primary"
          onClick={() => handleButtonPress('×')}
        >
          ×
        </button>
        
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('4')}
          onTouchStart={() => handleTouchStart('4')}
          onTouchEnd={handleTouchEnd}
        >
          4
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('5')}
          onTouchStart={() => handleTouchStart('5')}
          onTouchEnd={handleTouchEnd}
        >
          5
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('6')}
          onTouchStart={() => handleTouchStart('6')}
          onTouchEnd={handleTouchEnd}
        >
          6
        </button>
        <button
          className="calc-button-primary"
          onClick={() => handleButtonPress('-')}
        >
          -
        </button>
        
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('1')}
          onTouchStart={() => handleTouchStart('1')}
          onTouchEnd={handleTouchEnd}
        >
          1
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('2')}
          onTouchStart={() => handleTouchStart('2')}
          onTouchEnd={handleTouchEnd}
        >
          2
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('3')}
          onTouchStart={() => handleTouchStart('3')}
          onTouchEnd={handleTouchEnd}
        >
          3
        </button>
        <button
          className="calc-button-primary"
          onClick={() => handleButtonPress('+')}
        >
          +
        </button>
        
        <button
          className="calc-button-secondary col-span-2"
          onClick={() => handleButtonPress('0')}
          onTouchStart={() => handleTouchStart('0')}
          onTouchEnd={handleTouchEnd}
        >
          0
        </button>
        <button
          className="calc-button-secondary"
          onClick={() => handleButtonPress('.')}
        >
          .
        </button>
        <button
          className="calc-button-primary"
          onClick={() => handleButtonPress('=')}
        >
          =
        </button>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Enter PIN sequence to access additional features
      </div>
    </div>
  );
};

export default Calculator;
