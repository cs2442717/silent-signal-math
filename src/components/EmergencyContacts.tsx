
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Phone, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const EmergencyContacts: React.FC = () => {
  const { contacts, addContact, removeContact, updateContact } = useApp();
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    triggerPin: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Error",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }
    
    addContact(newContact);
    setNewContact({
      name: '',
      phone: '',
      triggerPin: '',
    });
    setIsAdding(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your emergency contacts`,
    });
  };
  
  const handleCancel = () => {
    setNewContact({
      name: '',
      phone: '',
      triggerPin: '',
    });
    setIsAdding(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Emergency Contacts</h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </Button>
        )}
      </div>
      
      {isAdding ? (
        <Card className="p-4 space-y-4 animate-fade-in">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Contact name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Phone number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="pin">
              Trigger PIN (Optional)
              <span className="ml-1 text-xs text-muted-foreground">
                A PIN that will contact this person when entered
              </span>
            </Label>
            <Input
              id="pin"
              placeholder="Optional PIN code"
              value={newContact.triggerPin}
              onChange={(e) => setNewContact({ ...newContact, triggerPin: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>
              Save Contact
            </Button>
          </div>
        </Card>
      ) : (
        contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No emergency contacts added yet.</p>
            <p className="text-sm">Add contacts that should be alerted in case of emergency.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <Card key={contact.id} className="p-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone size={14} className="mr-1" />
                      {contact.phone}
                    </div>
                    {contact.triggerPin && (
                      <div className="text-xs mt-1">
                        PIN: <span className="bg-muted px-1 py-0.5 rounded">{contact.triggerPin}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContact(contact.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
      
      <Separator className="my-6" />
    </div>
  );
};

export default EmergencyContacts;
