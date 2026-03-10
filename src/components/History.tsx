
import React from 'react';
import { SavedQuote, Language } from '../types';
import { translations } from '../translations';

interface HistoryProps {
  history: SavedQuote[];
  onViewItem: (item: SavedQuote) => void;
  onGoHome?: () => void;
  language: Language;
}

const History: React.FC<HistoryProps> = ({ history, onViewItem, onGoHome, language }) => {
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {onGoHome && (
        <button 
          onClick={onGoHome}
          className="flex items-center space-x-2 text-gray-400 hover:text-brand font-black text-[10px] uppercase tracking-[0.2em] transition-all"
        >
          <i className="fas fa-chevron-left"></i>
          <i className="fas fa-house"></i>
          <span>{t.backToHome}</span>
        </button>
      )}

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 mt-4 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-folder-open text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t.noHistoryYet}</h2>
          <p className="text-gray-500 mt-2">{t.saveHistoryInfo}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold text-gray-800">{t.quoteHistory}</h2>
            <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">{history.length} {t.saved}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-box-archive"></i>
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.details.to.city}, {item.details.to.zip}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.date}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-xs font-bold text-blue-500 uppercase">{item.details.weight} lbs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{t.bestOption}</div>
                    <div className="text-sm font-black text-green-600 uppercase">{item.cheapestCarrier}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onViewItem(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center"
                    >
                      <i className="fas fa-eye mr-2"></i> {t.viewManage}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest pt-8">{t.endOfHistory}</p>
        </>
      )}
    </div>
  );
};

export default History;
