
import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const { addContact } = useApp();

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const handleSinClick = () => {
    setIsContactDialogOpen(true);
  };

  const handleAddContact = () => {
    if (contactName && contactPhone) {
      addContact({
        name: contactName,
        phone: contactPhone
      });
      setContactName('');
      setContactPhone('');
      setIsContactDialogOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton
          key="sin"
          value="sin"
          onClick={handleSinClick}
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

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Input
                  placeholder="Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Input
                  placeholder="Phone Number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddContact}>Add Contact</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalculatorKeypad;
