
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Home, BookOpen, MessageSquare, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isCalculatorMode, setCalculatorMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Hide navigation when in calculator mode (safety feature)
  if (isCalculatorMode) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-16 pt-4 px-4 max-w-lg mx-auto w-full page-transition">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-border z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => navigate('/')}
            className={`p-4 flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/journal')}
            className={`p-4 flex flex-col items-center ${isActive('/journal') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BookOpen size={24} />
            <span className="text-xs mt-1">Journal</span>
          </button>
          
          <button
            onClick={() => navigate('/resources')}
            className={`p-4 flex flex-col items-center ${isActive('/resources') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">Resources</span>
          </button>
          
          <button
            onClick={() => navigate('/setup')}
            className={`p-4 flex flex-col items-center ${isActive('/setup') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
