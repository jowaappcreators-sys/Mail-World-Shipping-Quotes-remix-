
import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { Language } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  onSuccess: () => void;
  targetEmail?: string;
  stripeKey: string;
  language: Language;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, itemName, itemPrice, onSuccess, targetEmail, stripeKey, language }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'dispatching' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [stripeReady, setStripeReady] = useState(false);
  const [transactionId] = useState(() => 'ST_TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      // Initialize Stripe if not already done
      const win = window as unknown as { Stripe?: (key: string) => void };
      if (win.Stripe && stripeKey) {
        try {
          win.Stripe(stripeKey);
          setTimeout(() => setStripeReady(true), 0);
        } catch (e) {
          console.error("Stripe initialization error:", e);
        }
      } else if (!stripeKey) {
        setTimeout(() => setStripeReady(false), 0);
      }
    } else {
      setTimeout(() => {
        setStep('details');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setCardName('');
      }, 0);
    }
  }, [isOpen, stripeKey]);

  const handleFillTestData = () => {
    setCardName('MAIL WORLD SHIPPER');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvv('123');
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeReady) {
      alert(language === 'en' ? "Stripe is still loading. Please wait a moment." : "Stripe todavía se está cargando. Por favor, espere un momento.");
      return;
    }

    setStep('processing');
    
    // Simulate the Stripe confirmation lifecycle
    setTimeout(() => {
      // New Dispatching Step: Simulates email sending and label generation
      setStep('dispatching');
      
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 3000); // Wait 3s for "dispatching"
    }, 2000); // Wait 2s for "authorizing"
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Stripe-style Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-[#F6F9FC] w-full max-w-lg rounded-3xl shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Stripe Header Brand */}
        <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#635BFF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
               <i className="fas fa-shipping-fast text-lg"></i>
            </div>
            <div>
              <span className="font-black text-slate-800 tracking-tight uppercase text-xs block leading-none">{t.appName}</span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                {t.secureGateway}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {step === 'details' && (
          <div className="p-8">
            <div className="mb-10 text-center md:text-left">
               <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t.checkoutAmount}</div>
               <div className="text-5xl font-black text-slate-900 tracking-tighter">${itemPrice.toFixed(2)}</div>
               <div className="mt-4 inline-flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <i className="fas fa-box-open mr-2 text-[#635BFF]"></i>
                  <span>{itemName}</span>
               </div>
            </div>

            <form onSubmit={handlePay} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.cardInfo}</label>
                <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden focus-within:border-[#635BFF] transition-all">
                  <div className="px-5 py-4 border-b border-slate-50 relative">
                    <input 
                      type="text" required placeholder="Card number"
                      maxLength={19}
                      value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full bg-transparent outline-none text-slate-700 font-bold placeholder:text-slate-200 tracking-widest"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center space-x-3 grayscale opacity-40">
                       <i className="fab fa-cc-visa text-2xl"></i>
                       <i className="fab fa-cc-mastercard text-2xl"></i>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 px-5 py-4 border-r border-slate-50">
                      <input 
                        type="text" required placeholder="MM / YY" maxLength={5}
                        value={expiry} onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-transparent outline-none text-slate-700 font-bold placeholder:text-slate-200"
                      />
                    </div>
                    <div className="flex-1 px-5 py-4">
                      <input 
                        type="password" required placeholder="CVC" maxLength={4}
                        value={cvv} onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-transparent outline-none text-slate-700 font-bold placeholder:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.cardholderName}</label>
                <input 
                  type="text" required placeholder="Name on card"
                  value={cardName} onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold outline-none shadow-sm focus:border-[#635BFF] transition-all placeholder:text-slate-200 uppercase"
                />
              </div>

              <div className="flex flex-col space-y-4 pt-4">
                <button 
                  type="submit"
                  disabled={!stripeReady || !stripeKey}
                  className="w-full bg-[#635BFF] hover:bg-[#5850EC] disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
                >
                  {stripeKey ? (stripeReady ? t.completePayment : t.initializingStripe) : t.stripeDisconnected}
                </button>
                <div className="flex items-center justify-between pt-2">
                  <button 
                    type="button" 
                    onClick={handleFillTestData}
                    className="text-[10px] font-black text-[#635BFF] uppercase tracking-[0.2em] hover:text-[#5850EC] transition-colors"
                  >
                    {t.testMode}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setStep('success'); setTimeout(onSuccess, 1000); }}
                    className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors"
                  >
                    {t.bypassPayment}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-24 text-center animate-in fade-in duration-500 bg-white">
            <div className="relative w-20 h-20 mx-auto mb-10">
              <div className="absolute inset-0 border-4 border-slate-50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#635BFF] rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fas fa-lock text-[#635BFF] opacity-30"></i>
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.authorizing}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.pendingResponse}</p>
          </div>
        )}

        {step === 'dispatching' && (
          <div className="p-24 text-center animate-in fade-in duration-500 bg-white">
             <div className="flex justify-center space-x-2 mb-10">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
             </div>
             <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.dispatchingLabel}</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.generatingAssets}</p>
             <div className="bg-slate-50 py-3 px-6 rounded-2xl border border-slate-100 inline-block">
                <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                   <i className="fas fa-paper-plane animate-pulse"></i>
                   <span>{t.mailingTo} {targetEmail || 'Processing...'}</span>
                </div>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-20 text-center animate-in zoom-in-95 duration-500 bg-white">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <i className="fas fa-check text-4xl"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">{t.success}</h2>
            <p className="text-sm font-bold text-slate-400 mb-10 uppercase tracking-widest">{t.paymentConfirmed}</p>
            
            <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-100">
               <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">{t.receiptRef}</div>
               <div className="text-xs font-mono text-slate-500 font-bold">{transactionId}</div>
            </div>
          </div>
        )}

        {/* Stripe Footer */}
        <div className="bg-slate-50 py-5 border-t border-gray-100 flex items-center justify-center space-x-2">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.verifiedBy}</span>
           <svg className="w-14 h-6 fill-slate-300" viewBox="0 0 44 19">
              <path d="M43.9 8.1c0-4.5-2.4-7.2-6.4-7.2-4 0-6.6 2.8-6.6 7.2 0 4.7 2.6 7.3 6.7 7.3 1.9 0 3.6-.5 4.8-1.2l-.7-2.3c-1 .5-2.2.9-3.9.9-2.3 0-3.6-1.1-3.6-3.1h8.7c0-.2.1-.8.1-1.6zm-10.2-1.3c0-1.8 1.1-3 2.8-3s2.7 1.2 2.7 3h-5.5zm-15.7 8.3c1.7 0 2.8-.7 3.5-1.5v1.2h3.2V1.1h-3.2v5.3c-.7-.8-1.8-1.5-3.5-1.5-3 0-5.5 2.6-5.5 7.7s2.4 7.7 5.5 7.7zm1.1-12.4c1.9 0 3.3 1.5 3.3 4.7s-1.4 4.7-3.3 4.7c-1.9 0-3.2-1.5-3.2-4.7s1.3-4.7 3.2-4.7zm-11.1 0c-1.4 0-2.3.6-2.9 1.2V5.1H1.9v10h3.2V8.4c0-1.6.9-2.4 2.1-2.4.2 0 .4 0 .6.1V2.8c-.3-.1-.7-.1-.9-.1zm-5.7 5.1V2.1H.1V15.1h3.3V7.8z"/>
           </svg>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
