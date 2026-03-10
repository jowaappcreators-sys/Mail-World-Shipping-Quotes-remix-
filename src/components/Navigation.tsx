
import React from 'react';
import { View, Language } from '../types';
import { translations } from '../translations';

interface NavigationProps {
  activeView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  language: Language;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setView, onLogout, isAdmin, language }) => {
  const t = translations[language];
  const items = [
    { id: View.DASHBOARD, label: t.dashboard, icon: 'fa-chart-line' },
    { id: View.QUOTE_FORM, label: t.getQuote, icon: 'fa-calculator' },
    { id: View.HISTORY, label: t.history, icon: 'fa-clock-rotate-left' },
    { id: View.PREMIUM, label: t.eliteBenefits, icon: 'fa-crown' },
    { id: View.BILLING, label: t.billing, icon: 'fa-file-invoice-dollar' },
  ];

  if (isAdmin) {
    items.push({ id: View.ADMIN, label: t.adminHub, icon: 'fa-user-shield' });
  }

  return (
    <nav className="flex flex-col h-full space-y-2">
      <div className="space-y-2 flex-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
              activeView === item.id
                ? (item.id === View.ADMIN ? 'bg-red-600 text-white shadow-md' : 'bg-blue-600 text-white shadow-md')
                : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-blue-600'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center`}></i>
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
        >
          <i className="fas fa-right-from-bracket w-6 text-center"></i>
          <span>{t.logout}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
