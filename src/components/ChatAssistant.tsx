
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Send, User, Phone, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const responses = [
  {
    keywords: ['help', 'abuse', 'violence'],
    response: `I understand you may be in a difficult situation. Here are some resources that can help:

1. National Domestic Violence Hotline: 1-800-799-7233 (SAFE)
2. Crisis Text Line: Text HOME to 741741
3. Safe Horizon: 1-800-621-HOPE (4673)

Remember, you're not alone. These services are confidential and available 24/7.`
  },
  {
    keywords: ['legal', 'rights', 'restraining', 'order', 'police'],
    response: `Regarding legal help for domestic violence situations:

1. You have the right to file for a restraining order
2. Legal aid services can often help at low or no cost
3. Document any incidents (dates, times, descriptions)
4. Many police departments have special DV units

The National Domestic Violence Hotline (1-800-799-7233) can connect you with local legal resources.`
  },
  {
    keywords: ['leave', 'escape', 'plan', 'safety'],
    response: `Safety planning is important. Here are some considerations:

1. Pack an emergency bag with essentials
2. Keep important documents in a safe place
3. Create a code word with trusted friends/family
4. Know safe places you can go
5. Consider using a different phone/device that can't be tracked

Remember, leaving can be the most dangerous time. The National Domestic Violence Hotline (1-800-799-7233) can help you make a personalized safety plan.`
  },
  {
    keywords: ['children', 'kids', 'child', 'family'],
    response: `When children are involved in domestic violence situations:

1. Child Protective Services can provide support (not just removal)
2. Many shelters accept children
3. Courts often consider domestic violence in custody decisions
4. School counselors can be resources for children
5. Therapy can help children process trauma

Childhelp National Child Abuse Hotline: 1-800-4-A-CHILD (1-800-422-4453) is available 24/7.`
  }
];

const defaultMessages: Message[] = [
  {
    id: '1',
    text: "Hello, I'm here to provide resources and support. What can I help you with today?",
    isUser: false,
  }
];

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Generate response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        isUser: false,
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };
  
  const generateResponse = (message: string): string => {
    const lowercaseMsg = message.toLowerCase();
    
    // Check for specific keywords
    for (const resp of responses) {
      if (resp.keywords.some(keyword => lowercaseMsg.includes(keyword))) {
        return resp.response;
      }
    }
    
    // Default response if no keywords match
    return `Look at the calculator and try out Mathway for more help in solving your math problem! We are glad to assist you today!`;
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="p-4 bg-card rounded-t-lg border-b border-border flex justify-between items-center">
        <h2 className="font-semibold">Support Assistant</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Phone size={14} /> 
          <a href="tel:18007997233">Call Hotline</a>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {!msg.isUser && (
                <div className="flex items-center gap-1 mb-1 text-xs font-medium">
                  Support Assistant
                </div>
              )}
              
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send size={16} />
          </Button>
        </div>
        
        <div className="mt-3">
          <Separator className="my-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Confidential Support</span>
            </div>
            <a 
              href="https://www.thehotline.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary"
            >
              <span>More Resources</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
