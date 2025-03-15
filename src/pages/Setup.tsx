
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/Layout';
import EmergencyContacts from '@/components/EmergencyContacts';
import AlertSystem from '@/components/AlertSystem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const Setup: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState('contacts');
  const navigate = useNavigate();
  
  const completeSetup = () => {
    updateSettings({ setupCompleted: true });
    
    toast({
      title: "Setup Complete",
      description: "Your emergency alert system is now ready",
    });
    
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your emergency contacts and alert system
          </p>
        </div>
        
        <Tabs defaultValue="contacts" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="alerts">Alert System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts" className="page-transition">
            <EmergencyContacts />
            
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back to Calculator
              </Button>
              
              <Button onClick={() => setActiveTab('alerts')}>
                Next: Alert System
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="page-transition">
            <AlertSystem />
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('contacts')}
              >
                Back to Contacts
              </Button>
              
              <Button onClick={completeSetup}>
                {settings.setupCompleted ? 'Save Changes' : 'Complete Setup'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Setup;
