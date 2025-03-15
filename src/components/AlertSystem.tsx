
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertTriangle, ShieldAlert, Mic } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AlertSystem: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    triggerAlert, 
    startAudioRecording, 
    stopAudioRecording 
  } = useApp();
  
  const [newPin, setNewPin] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handlePinChange = () => {
    if (newPin.length < 4) {
      toast({
        title: "Error",
        description: "PIN must be at least 4 digits",
        variant: "destructive",
      });
      return;
    }
    
    updateSettings({ triggerPin: newPin });
    setNewPin('');
    
    toast({
      title: "PIN Updated",
      description: "Your emergency PIN has been updated",
    });
  };
  
  const handleShakeToggle = (value: boolean) => {
    updateSettings({ shakeTriggerEnabled: value });
    
    toast({
      title: value ? "Shake Detection Enabled" : "Shake Detection Disabled",
      description: value 
        ? "Device will detect shaking to trigger emergency alert" 
        : "Shake detection has been turned off",
    });
  };
  
  const handleRecordingToggle = (value: boolean) => {
    updateSettings({ autoRecordEnabled: value });
    
    toast({
      title: value ? "Auto Recording Enabled" : "Auto Recording Disabled",
      description: value 
        ? "Device will automatically record audio when alert is triggered" 
        : "Auto recording has been turned off",
    });
  };
  
  const handleEmergencyAlert = async () => {
    await triggerAlert();
    
    toast({
      title: "Emergency Alert Triggered",
      description: "Help is on the way",
      variant: "destructive",
    });
  };
  
  const toggleRecording = async () => {
    if (isRecording) {
      const audioUrl = await stopAudioRecording();
      setIsRecording(false);
      
      if (audioUrl) {
        toast({
          title: "Recording Saved",
          description: "Audio recording has been saved",
        });
      }
    } else {
      await startAudioRecording();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Audio recording has started",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Alert System</h2>
      
      <Card className="p-4 border-destructive/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-destructive/10 p-2 rounded-full">
            <AlertTriangle className="text-destructive h-6 w-6" />
          </div>
          <h3 className="font-medium">Emergency Alert</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Press this button to immediately send an alert with your location to your emergency contacts.
        </p>
        
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleEmergencyAlert}
        >
          <ShieldAlert className="mr-2 h-4 w-4" />
          Send Emergency Alert
        </Button>
      </Card>
      
      <Card className="p-4">
        <h3 className="font-medium mb-2">Record Audio</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manually record audio in an emergency situation.
        </p>
        
        <Button 
          variant={isRecording ? "destructive" : "default"}
          className="w-full" 
          onClick={toggleRecording}
        >
          <Mic className="mr-2 h-4 w-4" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </Card>
      
      <Card className="p-4 space-y-4">
        <h3 className="font-medium">Emergency PIN</h3>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="pin">
            Alert Trigger PIN
            <span className="ml-1 text-xs text-muted-foreground">
              Enter this in the calculator to send an alert
            </span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="pin"
              placeholder={settings.triggerPin || "Set a PIN code"}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              type="password"
            />
            <Button onClick={handlePinChange}>Save</Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 space-y-4">
        <h3 className="font-medium">Alert Settings</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="shake">Shake to Alert</Label>
            <p className="text-sm text-muted-foreground">
              Automatically trigger alert when device is shaken
            </p>
          </div>
          <Switch
            id="shake"
            checked={settings.shakeTriggerEnabled}
            onCheckedChange={handleShakeToggle}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="record">Auto Record</Label>
            <p className="text-sm text-muted-foreground">
              Automatically record audio when alert is triggered
            </p>
          </div>
          <Switch
            id="record"
            checked={settings.autoRecordEnabled}
            onCheckedChange={handleRecordingToggle}
          />
        </div>
      </Card>
    </div>
  );
};

export default AlertSystem;
