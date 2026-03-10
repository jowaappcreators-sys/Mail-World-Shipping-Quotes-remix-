
import React, { useState, useEffect, useRef } from 'react';
import { createSupportChat } from '../services/geminiService';
import { Chat } from '@google/genai';
import { Language } from '../types';
import { translations } from '../translations';

interface ChatbotProps {
  brandName?: string;
  language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ brandName = 'Mail World Office Ship Quote', language }) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: t.chatbotGreeting.replace('{brand}', brandName) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatInstance.current = createSupportChat(language);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = { role: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (!chatInstance.current) chatInstance.current = createSupportChat();
      
      const response = await chatInstance.current.sendMessage({ message: textToSend });
      const aiText = response.text || t.chatbotTrouble;
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: t.chatbotError }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    t.quickActionElite,
    t.quickActionPickup,
    t.quickActionLabel,
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[150] no-print">
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative group"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-xl`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-brand p-6 text-white shrink-0 transition-colors duration-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">{brandName} {t.chatbotSupport}</h3>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{t.chatbotOnline}</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-brand text-white rounded-tr-none shadow-md' 
                  : 'bg-gray-100 text-gray-700 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {!isTyping && (
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickActions.map(action => (
                <button 
                  key={action}
                  onClick={() => handleSend(undefined, action)}
                  className="whitespace-nowrap bg-brand-light text-brand text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-brand/10 hover:bg-brand/10 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="p-4 bg-gray-50 border-t border-gray-100 flex items-center space-x-2 shrink-0">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatbotPlaceholder}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:bg-gray-300 transition-all shadow-lg"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
