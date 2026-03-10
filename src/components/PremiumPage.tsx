
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface PremiumPageProps {
  isPremium: boolean;
  onPurchase: () => void;
  onGoHome?: () => void;
  language: Language;
}

const PremiumPage: React.FC<PremiumPageProps> = ({ isPremium, onPurchase, onGoHome, language }) => {
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 md:p-12 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fas fa-crown text-[10rem] rotate-12"></i>
        </div>
        
        <div className="relative z-10">
          <div className="inline-block bg-yellow-500 text-blue-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            {t.eliteService}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.premiumTitle}</h1>
          <p className="text-blue-200 text-lg max-w-md">
            {t.premiumDesc}
          </p>
          
          {isPremium ? (
            <div className="mt-8 flex items-center space-x-3 bg-white/10 w-fit px-6 py-3 rounded-2xl border border-white/20">
              <i className="fas fa-circle-check text-green-400"></i>
              <span className="font-bold">{t.memberStatusActive}</span>
            </div>
          ) : (
            <button 
              onClick={onPurchase}
              className="mt-8 bg-white text-blue-900 hover:bg-yellow-500 hover:text-blue-950 transition-all font-black py-4 px-10 rounded-2xl shadow-lg active:scale-95"
            >
              {t.upgradeNow}
            </button>
          )}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
            <i className="fas fa-infinity"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.unlimitedQuotes}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.unlimitedQuotesDesc}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
            <i className="fas fa-tags"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.discount5}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.discount5Desc}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
            <i className="fas fa-store"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.inStoreSavings}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.inStoreSavingsDesc}
          </p>
        </div>
      </div>

      {!isPremium && (
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-left">
            <div className="text-3xl font-black text-blue-900">$9.99</div>
            <div className="text-sm text-blue-600 font-bold leading-tight">{t.oneTimeCharge}<br/>{t.foreverAccess}</div>
          </div>
          <button 
            onClick={onPurchase}
            className="w-full md:w-auto bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl shadow-md hover:bg-blue-700 transition-all"
          >
            {t.upgradeToday}
          </button>
        </div>
      )}

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{t.faqTitle}</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { q: t.faq1Q, a: t.faq1A },
            { q: t.faq2Q, a: t.faq2A },
            { q: t.faq3Q, a: t.faq3A }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-2 flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px]">Q</span>
                {item.q}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed pl-9">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
