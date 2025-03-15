
import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '@/utils/storage';
import { getCurrentLocation } from '@/utils/location';
import { startShakeDetection, stopShakeDetection } from '@/utils/motion';
import { startRecording, stopRecording } from '@/utils/audio';
import { toast } from '@/components/ui/use-toast';

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  triggerPin?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  timestamp: number;
};

export type Settings = {
  setupCompleted: boolean;
  triggerPin: string;
  shakeTriggerEnabled: boolean;
  autoRecordEnabled: boolean;
};

type AppContextType = {
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => void;
  
  journal: JournalEntry[];
  addJournalEntry: (content: string) => void;
  removeJournalEntry: (id: string) => void;
  
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  
  isCalculatorMode: boolean;
  setCalculatorMode: (mode: boolean) => void;
  
  triggerAlert: (contactId?: string) => Promise<void>;
  startAudioRecording: () => Promise<void>;
  stopAudioRecording: () => Promise<string | null>;
  
  currentLocation: { latitude: number; longitude: number } | null;
};

const defaultSettings: Settings = {
  setupCompleted: false,
  triggerPin: '',
  shakeTriggerEnabled: true,
  autoRecordEnabled: true,
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isCalculatorMode, setCalculatorMode] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      const storedContacts = await loadFromStorage<EmergencyContact[]>('emergency_contacts');
      if (storedContacts) setContacts(storedContacts);
      
      const storedJournal = await loadFromStorage<JournalEntry[]>('journal_entries');
      if (storedJournal) setJournal(storedJournal);
      
      const storedSettings = await loadFromStorage<Settings>('app_settings');
      if (storedSettings) setSettings({...defaultSettings, ...storedSettings});
    };
    
    loadData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    saveToStorage('emergency_contacts', contacts);
  }, [contacts]);
  
  useEffect(() => {
    saveToStorage('journal_entries', journal);
  }, [journal]);
  
  useEffect(() => {
    saveToStorage('app_settings', settings);
  }, [settings]);

  // Set up shake detection
  useEffect(() => {
    if (settings.shakeTriggerEnabled) {
      const handleShake = () => {
        triggerAlert();
        toast({
          title: "Emergency Alert Triggered",
          description: "Help is on the way",
          variant: "destructive",
        });
      };
      
      startShakeDetection(handleShake);
      return () => stopShakeDetection();
    }
  }, [settings.shakeTriggerEnabled]);

  // Update location periodically
  useEffect(() => {
    const updateLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };
    
    updateLocation();
    const intervalId = setInterval(updateLocation, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const updateContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, ...updatedContact } : contact
    ));
  };

  const addJournalEntry = (content: string) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content,
      timestamp: Date.now(),
    };
    setJournal([newEntry, ...journal]);
  };

  const removeJournalEntry = (id: string) => {
    setJournal(journal.filter(entry => entry.id !== id));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const triggerAlert = async (contactId?: string) => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      // In a real app, this would call/message the specified contact or emergency services
      console.log('Alert triggered!', {
        contactId,
        location,
        time: new Date().toISOString(),
      });
      
      if (settings.autoRecordEnabled) {
        startAudioRecording();
        // In a real app, you would also want to stop the recording after some time
        setTimeout(stopAudioRecording, 30000); // 30 seconds
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error triggering alert:', error);
      return Promise.reject(error);
    }
  };

  const startAudioRecording = async () => {
    if (isRecording) return;
    
    try {
      await startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopAudioRecording = async () => {
    if (!isRecording) return null;
    
    try {
      const audioUrl = await stopRecording();
      setIsRecording(false);
      return audioUrl;
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      return null;
    }
  };

  return (
    <AppContext.Provider value={{
      contacts,
      addContact,
      removeContact,
      updateContact,
      
      journal,
      addJournalEntry,
      removeJournalEntry,
      
      settings,
      updateSettings,
      
      isCalculatorMode,
      setCalculatorMode,
      
      triggerAlert,
      startAudioRecording,
      stopAudioRecording,
      
      currentLocation,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
