
import React, { useState } from 'react';
import { CarrierQuote, PackageDetails, Language } from '../types';
import ShippingChart from './ShippingChart';
import { translations } from '../translations';

interface QuoteResultsProps {
  quotes: CarrierQuote[];
  details: PackageDetails;
  onSave: () => void;
  onPurchaseLabel: (quote: CarrierQuote, pickupFee: number, fulfillment: 'DROP_OFF' | 'PICKUP', email: string, pickupAddress?: string) => void;
  isSaved?: boolean;
  language: Language;
}

const VectorLogo: React.FC<{ size?: string; color?: string }> = ({ size = "w-12 h-12", color = "text-blue-600" }) => (
  <div className={`${size} ${color} flex-shrink-0`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M12 12l4-4m-8 0l4 4" opacity="0.3" />
    </svg>
  </div>
);

const QuoteResults: React.FC<QuoteResultsProps> = ({ quotes, details, onSave, onPurchaseLabel, isSaved, language }) => {
  const [fulfillmentType, setFulfillmentType] = useState<'DROP_OFF' | 'PICKUP'>('DROP_OFF');
  const [isTulsaRadius, setIsTulsaRadius] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const t = translations[language];

  const [quoteRef] = useState(() => Math.floor(Date.now() / 100000).toString().slice(-6));

  const sortedQuotes = [...quotes].sort((a, b) => (a.finalPrice || 0) - (b.finalPrice || 0));
  const cheapest = sortedQuotes[0];

  const pickupFee = fulfillmentType === 'PICKUP' ? (isTulsaRadius ? 0 : 7) : 0;

  const handleBuyLabel = (quote: CarrierQuote) => {
    setError(null);
    
    if (!userEmail || !userEmail.includes('@')) {
      setError(t.invalidEmail);
      triggerShake();
      return;
    }

    if (fulfillmentType === 'PICKUP' && !pickupAddress) {
      setError(t.enterPickupAddress);
      triggerShake();
      return;
    }

    onPurchaseLabel(quote, pickupFee, fulfillmentType, userEmail, fulfillmentType === 'PICKUP' ? pickupAddress : undefined);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Action Bar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center no-print gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 ${isSaved ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} rounded-2xl flex items-center justify-center transition-colors shadow-inner`}>
            <i className={`fas ${isSaved ? 'fa-bookmark text-xl' : 'fa-check-double text-xl'}`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{isSaved ? t.archivedQuote : t.rateAnalysis}</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1">{details.to.city}, {details.to.zip}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {!isSaved && (
            <button 
              onClick={onSave} 
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 text-xs font-black uppercase tracking-widest transition-all active:scale-95"
            >
              {t.saveRecord}
            </button>
          )}
          <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
          <button onClick={handlePrint} title={t.printQuote} className="w-12 h-12 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-600 flex items-center justify-center transition-colors border border-blue-100">
            <i className="fas fa-print"></i>
          </button>
        </div>
      </div>

      {/* Fulfillment Options */}
      <div className={`bg-blue-900 rounded-[2rem] p-8 text-white no-print shadow-xl shadow-blue-200/50 transition-transform ${shake ? 'animate-bounce' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xs font-black text-blue-300 uppercase tracking-[0.3em] mb-2">{t.fulfillmentMode}</h3>
            <p className="text-xl font-black uppercase tracking-tight">{t.howToSend}</p>
          </div>
          
          <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/20">
            <button 
              onClick={() => setFulfillmentType('DROP_OFF')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all ${fulfillmentType === 'DROP_OFF' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-200 hover:text-white'}`}
            >
              {t.dropOff}
            </button>
            <button 
              onClick={() => setFulfillmentType('PICKUP')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all ${fulfillmentType === 'PICKUP' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-200 hover:text-white'}`}
            >
              {t.pickupService}
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest block ml-1 transition-colors ${!userEmail ? 'text-blue-300' : 'text-emerald-400'}`}>
              <i className="fas fa-envelope mr-1.5"></i> {t.emailLabelDelivery}
            </label>
            <input 
              type="email" 
              placeholder="your@email.com"
              value={userEmail}
              onChange={(e) => { setUserEmail(e.target.value); setError(null); }}
              className={`w-full bg-white/10 border-2 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all ${!userEmail && error ? 'border-red-500 bg-red-500/10' : 'border-white/20 focus:border-blue-400 focus:bg-white/20'}`}
            />
          </div>
          {fulfillmentType === 'PICKUP' && (
            <div className="space-y-2 animate-in slide-in-from-right-4">
              <label className={`text-[10px] font-black uppercase tracking-widest block ml-1 transition-colors ${!pickupAddress ? 'text-blue-300' : 'text-emerald-400'}`}>
                <i className="fas fa-map-marker-alt mr-1.5"></i> {t.pickupStreetAddress}
              </label>
              <input 
                type="text" 
                placeholder="123 Main St, Tulsa, OK"
                value={pickupAddress}
                onChange={(e) => { setPickupAddress(e.target.value); setError(null); }}
                className={`w-full bg-white/10 border-2 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all ${!pickupAddress && error ? 'border-red-500 bg-red-500/10' : 'border-white/20 focus:border-blue-400 focus:bg-white/20'}`}
              />
            </div>
          )}
        </div>

        {fulfillmentType === 'PICKUP' && (
          <div className="mt-8 pt-8 border-t border-white/10 animate-in slide-in-from-top-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                  <i className="fas fa-location-crosshairs text-blue-300"></i>
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm tracking-tight">{t.tulsaRadius}</h4>
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">{t.freeWithin15}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsTulsaRadius(true)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition-all ${isTulsaRadius ? 'border-green-400 bg-green-400/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <i className={`fas ${isTulsaRadius ? 'fa-check-circle text-green-400' : 'fa-circle text-white/20'}`}></i>
                  <span className="text-xs font-black uppercase">{t.tulsaWithin15}</span>
                </button>
                <button 
                  onClick={() => setIsTulsaRadius(false)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition-all ${!isTulsaRadius ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <i className={`fas ${!isTulsaRadius ? 'fa-check-circle text-amber-400' : 'fa-circle text-white/20'}`}></i>
                  <span className="text-xs font-black uppercase">{t.outsideRadius}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {fulfillmentType === 'DROP_OFF' && (
          <div className="mt-8 flex items-center justify-center space-x-3 bg-blue-800/50 p-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.1em] text-blue-200">
            <i className="fas fa-store"></i>
            <span>{t.bringToOffice}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-200 text-[10px] font-black uppercase tracking-widest flex items-center animate-in fade-in slide-in-from-top-2">
            <i className="fas fa-exclamation-triangle mr-3 text-red-400"></i>
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {quotes.map((quote) => {
          const isCheapest = quote === cheapest;
          const carrierColor = { 'FedEx': '#4D148C', 'UPS': '#351C15', 'DHL': '#FFCC00', 'USPS': '#333366' }[quote.carrier];
          
          const inAppPrice = parseFloat(((quote.finalPrice || quote.basePrice) * 0.95).toFixed(2));

          return (
            <div key={quote.carrier} className={`bg-white p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden group flex flex-col ${isCheapest ? 'border-emerald-500 shadow-xl scale-[1.02] z-10' : 'border-gray-50 opacity-95 hover:opacity-100 hover:border-blue-200'}`}>
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-[0.2em]">
                {t.inAppDiscount}
              </div>
              
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg" style={{ backgroundColor: carrierColor }}>
                  <i className={`fab fa-${quote.carrier.toLowerCase() === 'usps' ? 'envelope' : quote.carrier.toLowerCase()}`}></i>
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900 leading-none uppercase">{quote.carrier}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{quote.serviceName}</p>
                </div>
              </div>
              
              <div className="mb-6 flex-1">
                <div className="flex items-baseline space-x-1">
                  <span className="text-gray-400 text-xl font-black">$</span>
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">{inAppPrice}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase line-through">${quote.finalPrice}</span>
                  <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{t.eliteDiscountRate}</span>
                </div>
                
                {fulfillmentType === 'PICKUP' && (
                  <div className={`mt-4 text-[9px] font-black uppercase tracking-widest py-2 px-3 rounded-lg border ${isTulsaRadius ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                    {isTulsaRadius ? t.tulsaWithin15 : t.outsideRadius}
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleBuyLabel(quote)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest text-[10px] mt-4"
              >
                {t.securePurchase}
              </button>
            </div>
          );
        })}
      </div>

      <div className="no-print">
        <ShippingChart quotes={quotes} language={language} />
      </div>

      {/* PRINT-ONLY VIEW */}
      <div className="print-only bg-white p-12 font-sans w-full">
        <div className="flex justify-between items-center border-b-8 border-blue-900 pb-10 mb-12">
          <div className="flex items-center space-x-6">
            <VectorLogo size="w-24 h-24" color="text-blue-900" />
            <div>
              <h1 className="text-5xl font-black text-blue-900 uppercase tracking-tighter leading-none mb-1">{t.appName}</h1>
              <p className="text-sm font-black text-blue-500 uppercase tracking-[0.5em]">{t.quoteHubSummary}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-2">{t.internalDocument}</p>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">#{quoteRef}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <h3 className="text-[11px] font-black text-blue-900 uppercase mb-5 tracking-[0.3em] border-b border-blue-100 pb-3">{t.shippingOrigin}</h3>
            <div className="text-sm font-black text-gray-800 leading-relaxed uppercase space-y-1">
              <p>{details.from.street || t.noStreetAddress}</p>
              <p>{details.from.city}, {details.from.state} {details.from.zip}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <h3 className="text-[11px] font-black text-blue-900 uppercase mb-5 tracking-[0.3em] border-b border-blue-100 pb-3">{t.destination}</h3>
            <div className="text-sm font-black text-gray-800 leading-relaxed uppercase space-y-1">
              <p>{details.to.street || t.noStreetAddress}</p>
              <p>{details.to.city}, {details.to.state} {details.to.zip}</p>
            </div>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-24">
          <thead>
            <tr className="border-b-4 border-gray-900">
              <th className="py-8 uppercase text-[11px] font-black tracking-[0.4em] text-gray-400">{t.carrierPartner}</th>
              <th className="py-8 uppercase text-[11px] font-black tracking-[0.4em] text-gray-400">{t.serviceLevel}</th>
              <th className="py-8 uppercase text-[11px] font-black tracking-[0.4em] text-gray-400 text-right">{t.quotePrice}</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(q => (
              <tr key={q.carrier} className="border-b border-gray-50">
                <td className="py-8 font-black text-3xl text-gray-900 uppercase tracking-tighter">{q.carrier}</td>
                <td className="py-8 text-sm font-black text-gray-400 uppercase tracking-widest">{q.serviceName}</td>
                <td className="py-8 text-right font-black text-4xl text-blue-900 tracking-tighter">${q.finalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-32 border-t pt-12">
          <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.6em] mb-4 mt-6">{t.appName} {t.quoteHub}</p>
          <p className="text-xs font-bold text-gray-400 italic max-w-lg mx-auto leading-relaxed">
            {t.valid24h}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteResults;
