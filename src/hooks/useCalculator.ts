
import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewInput, setIsNewInput] = useState(true);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressCount, setLongPressCount] = useState(0);
  
  const { settings, triggerAlert, setCalculatorMode, contacts } = useApp();
  
  const checkSpecialSequences = () => {
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
    
    // Special sequence to exit calculator mode: 1111=
    if (inputSequence.join('') === '1111=') {
      setCalculatorMode(false);
      setInputSequence([]);
    }
    
    // Special sequence to call emergency contact: 1111
    if (inputSequence.slice(-4).join('') === '1111' && inputSequence.slice(-5)[0] === '=') {
      if (contacts.length > 0) {
        // Call the first emergency contact
        triggerAlert(contacts[0].id);
        toast({
          title: "Calling Emergency Contact",
          description: `Calling ${contacts[0].name}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "No Emergency Contacts",
          description: "Please add an emergency contact first using the 'sin' button",
          variant: "destructive",
        });
      }
      setInputSequence([]);
    }
  };
  
  const handleButtonPress = (value: string) => {
    // Add to input sequence
    setInputSequence(prev => {
      const newSequence = [...prev, value];
      if (newSequence.length > 10) {
        return newSequence.slice(1);
      }
      return newSequence;
    });
    
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
  
  return {
    display,
    memory,
    operation,
    longPressCount,
    handleButtonPress,
    handleTouchStart,
    handleTouchEnd,
    checkSpecialSequences,
    inputSequence
  };
};
