
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';

const Index: React.FC = () => {
  const { settings, isCalculatorMode } = useApp();
  const navigate = useNavigate();
  
  // Redirect to setup if not completed
  useEffect(() => {
    if (!settings.setupCompleted && !isCalculatorMode) {
      navigate('/setup');
    }
  }, [settings.setupCompleted, isCalculatorMode, navigate]);
  
  return (
    <Layout>
      <Calculator />
    </Layout>
  );
};

export default Index;
