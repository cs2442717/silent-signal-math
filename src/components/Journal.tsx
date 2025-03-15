
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, Trash2, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const Journal: React.FC = () => {
  const { journal, addJournalEntry, removeJournalEntry } = useApp();
  const [newEntry, setNewEntry] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  
  const handleAddEntry = () => {
    if (!newEntry.trim()) {
      toast({
        title: "Error",
        description: "Math problem cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    addJournalEntry(newEntry);
    setNewEntry('');
    setIsAddingEntry(false);
    
    toast({
      title: "Math Log Added",
      description: "Your math problem has been saved",
    });
  };
  
  const handleRemoveEntry = (id: string) => {
    removeJournalEntry(id);
    
    toast({
      title: "Math Log Added",
      description: "Your math problem has been saved",
    });
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Journal</h2>
          <div className="bg-muted p-1 rounded-full">
            <Lock className="text-muted-foreground h-4 w-4" />
          </div>
        </div>
        
        {!isAddingEntry && (
          <Button
            onClick={() => setIsAddingEntry(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PenLine size={16} /> New Entry
          </Button>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>All entries are private and encrypted.</p>
      </div>
      
      {isAddingEntry ? (
        <Card className="p-4 space-y-4 animate-fade-in">
          <Textarea
            placeholder="Write your journal entry here..."
            className="min-h-[150px]"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddingEntry(false);
                setNewEntry('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>
              Save Entry
            </Button>
          </div>
        </Card>
      ) : (
        journal.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No journal entries yet.</p>
            <p className="text-sm">Your private thoughts and records will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {journal.map((entry) => (
              <Card key={entry.id} className="p-4 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-muted-foreground mb-2">
                    {formatDate(entry.date)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEntry(entry.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="text-sm whitespace-pre-wrap">{entry.content}</div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Journal;
