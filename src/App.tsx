
import React, { useState, useEffect, useCallback } from 'react';
import { View, PackageDetails, CarrierQuote, SavedQuote, Transaction } from './types';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import QuoteForm from './components/QuoteForm';
import QuoteResults from './components/QuoteResults';
import History from './components/History';
import PremiumPage from './components/PremiumPage';
import PaymentModal from './components/PaymentModal';
import Billing from './components/Billing';
import AdminPage from './components/AdminPage';
import Chatbot from './components/Chatbot';
import { translations } from './translations';
import { Language } from './types';

// Brand Types
export interface AppBranding {
  name: string;
  primaryColor: string;
  phone: string;
  ownerEmail: string;
  stripeKey: string;
  paymentLink: string;
}

const BrandLogo: React.FC<{ size?: string; className?: string }> = ({ size = "w-8 h-8", className = "" }) => (
  <div className={`${size} ${className} bg-brand rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0 transition-colors duration-500`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3/4 h-3/4">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M12 12l4-4m-8 0l4 4" opacity="0.5" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isPurchased, setIsPurchased] = useState<boolean>(() => localStorage.getItem('appPurchased') === 'true');
  const [isPremium, setIsPremium] = useState<boolean>(() => localStorage.getItem('isPremium') === 'true');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [showTestGuide, setShowTestGuide] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('appLanguage') as Language) || 'en');
  const t = translations[language];
  
  // Branding State
  const [branding, setBranding] = useState<AppBranding>(() => {
    const defaults: AppBranding = {
      name: import.meta.env.VITE_BRAND_NAME || 'Mail World Office Ship Quote',
      primaryColor: import.meta.env.VITE_BRAND_COLOR || '#2563eb',
      phone: import.meta.env.VITE_BRAND_PHONE || '918-555-0123',
      ownerEmail: import.meta.env.VITE_BRAND_EMAIL || 'admin@mailworldoffice.com',
      stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51SqjUNL673JawjPASL6whpFNe6eQLqf9oXIlsHr5LiIGXzprz1yvLz61aZKhoTekgIuM5kStsM4ZUBo6eoqv032B00qfpZ60Be',
      paymentLink: import.meta.env.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_6oE7v95p9'
    };
    const stored = localStorage.getItem('appBranding');
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) };
      } catch {
        return defaults;
      }
    }
    return defaults;
  });

  const [quoteHistory, setQuoteHistory] = useState<SavedQuote[]>(() => {
    const stored = localStorage.getItem('quoteHistory');
    return stored ? JSON.parse(stored) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [currentQuotes, setCurrentQuotes] = useState<CarrierQuote[] | null>(null);
  const [lastDetails, setLastDetails] = useState<PackageDetails | null>(null);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ 
    name: string; 
    price: number; 
    type: 'app' | 'premium' | 'label';
    fulfillment?: 'DROP_OFF' | 'PICKUP';
    email?: string;
    pickupAddress?: string;
    carrier?: string;
    service?: string;
  }>({ name: '', price: 0, type: 'app' });

  useEffect(() => {
    (window as unknown as { isTestMode: boolean }).isTestMode = isTestMode;
  }, [isTestMode]);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Apply CSS Variables for Branding
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-color', branding.primaryColor);
    
    // Simple helper to darken color for hover/dark states
    const darken = (hex: string) => {
      if (!hex || hex.length !== 7 || !hex.startsWith('#')) return hex;
      try {
        const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 30).toString(16).padStart(2, '0');
        const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30).toString(16).padStart(2, '0');
        const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 30).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      } catch {
        return hex;
      }
    };
    
    root.style.setProperty('--brand-color-dark', darken(branding.primaryColor));
    localStorage.setItem('appBranding', JSON.stringify(branding));
  }, [branding]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    
    if (params.get('mode') === 'test' || (qParam && qParam.includes('mode=test'))) {
      setTimeout(() => {
        setIsTestMode(true);
        setShowTestGuide(true);
        setIsPurchased(true); // Auto-unlock in test mode
      }, 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quoteHistory', JSON.stringify(quoteHistory));
  }, [quoteHistory]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const goHome = () => {
    setCurrentView(View.DASHBOARD);
    setCurrentQuotes(null);
    setLastDetails(null);
    setActiveQuoteId(null);
    setIsMobileMenuOpen(false);
  };

  const toggleTestModeManually = () => {
    setIsTestMode(prev => !prev);
    setShowTestGuide(!isTestMode);
    alert(!isTestMode ? t.testModeActivated : t.testModeDeactivated);
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount === 5) {
      setIsAdminMode(prev => !prev);
      setLogoClickCount(0);
      alert(isAdminMode ? t.adminModeDisabled : t.adminModeEnabled);
    }
    setTimeout(() => setLogoClickCount(0), 2000);
  };

  const handleShare = () => {
    const origin = window.location.origin;
    const path = window.location.pathname.replace(/\/$/, ""); 
    const cleanBase = origin + path;
    const testLink = `${cleanBase}/?mode=test`;
    
    navigator.clipboard.writeText(testLink);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const initiateCheckout = (
    type: 'app' | 'premium' | 'label', 
    quote?: CarrierQuote, 
    pickupFee: number = 0, 
    fulfillment?: 'DROP_OFF' | 'PICKUP',
    email?: string,
    pickupAddress?: string
  ) => {
    if (type === 'app') {
      setIsPurchased(true);
      localStorage.setItem('appPurchased', 'true');
      const newTransaction: Transaction = {
        id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toLocaleString(),
        item: t.proHubLicense,
        amount: 0,
        status: 'Settled',
        method: t.freeActivation,
        type: 'LICENSE'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setCurrentView(View.DASHBOARD);
      return;
    } 
    
    if (type === 'premium') {
      setCheckoutItem({ name: t.eliteMemberAccess, price: 9.99, type: 'premium' });
    } else if (type === 'label' && quote) {
      const discountedLabelPrice = (quote.finalPrice || quote.basePrice) * 0.95;
      const total = discountedLabelPrice + pickupFee;
      setCheckoutItem({ 
        name: t.shippingLabel.replace('{carrier}', quote.carrier).replace('{service}', quote.serviceName), 
        price: parseFloat(total.toFixed(2)), 
        type: 'label',
        fulfillment: fulfillment,
        email: email,
        pickupAddress: pickupAddress,
        carrier: quote.carrier,
        service: quote.serviceName
      });
    }
    setIsPaymentModalOpen(true);
  };

  const saveQuoteToHistory = useCallback((quotes: CarrierQuote[], details: PackageDetails, silent: boolean = false) => {
    if (activeQuoteId && quoteHistory.find(q => q.id === activeQuoteId)) {
      if (!silent) alert(t.quoteInHistory);
      return;
    }
    const cheapest = [...quotes].sort((a, b) => (a.finalPrice || 0) - (b.finalPrice || 0))[0];
    const newId = Math.random().toString(36).substr(2, 9);
    const newQuote: SavedQuote = {
      id: newId, date: new Date().toLocaleString(), details, quotes, cheapestCarrier: cheapest.carrier
    };
    setQuoteHistory(prev => [newQuote, ...prev]);
    setActiveQuoteId(newId);
    if (!silent) alert(t.quoteSaved);
  }, [activeQuoteId, quoteHistory, t]);

  const handlePaymentSuccess = () => {
    const trackingNum = checkoutItem.type === 'label' 
      ? (checkoutItem.carrier === 'FedEx' ? '400' : '1Z') + Math.random().toString().slice(2, 14)
      : undefined;

    const newTransaction: Transaction = {
      id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleString(),
      item: checkoutItem.name,
      amount: checkoutItem.price,
      status: 'Settled',
      method: 'Visa •••• 4242',
      type: checkoutItem.type === 'label' ? 'LABEL' : (checkoutItem.type === 'app' ? 'LICENSE' : 'PREMIUM'),
      fulfillment: checkoutItem.fulfillment,
      email: checkoutItem.email,
      pickupAddress: checkoutItem.pickupAddress,
      trackingNumber: trackingNum,
      carrier: checkoutItem.carrier,
      service: checkoutItem.service,
      packageDetails: lastDetails || undefined
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setIsPaymentModalOpen(false);

    if (checkoutItem.type === 'app') {
      setIsPurchased(true);
      localStorage.setItem('appPurchased', 'true');
      setCurrentView(View.DASHBOARD);
    } else if (checkoutItem.type === 'premium') {
      setIsPremium(true);
      localStorage.setItem('isPremium', 'true');
      setCurrentView(View.PREMIUM);
    } else {
      if (currentQuotes && lastDetails) {
        saveQuoteToHistory(currentQuotes, lastDetails, true);
      }
      alert(t.labelSentSuccess.replace('{email}', checkoutItem.email || ''));
      setCurrentView(View.BILLING);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('appPurchased');
    localStorage.removeItem('isPremium');
    setIsPurchased(false);
    setIsPremium(false);
    setIsAdminMode(false);
    setCurrentQuotes(null);
    setLastDetails(null);
    setActiveQuoteId(null);
    setCurrentView(View.DASHBOARD);
  };

  const handleViewHistoryItem = (item: SavedQuote) => {
    setCurrentQuotes(item.quotes);
    setLastDetails(item.details);
    setActiveQuoteId(item.id);
    setCurrentView(View.DASHBOARD);
  };

  const handleNewQuote = () => {
    setCurrentQuotes(null);
    setLastDetails(null);
    setActiveQuoteId(null);
    setCurrentView(View.QUOTE_FORM);
  };

  const switchView = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {(isTestMode || showTestGuide) && (
        <div className="bg-amber-500 text-white text-[10px] font-black py-1.5 px-4 text-center uppercase tracking-[0.2em] no-print">
          <i className="fas fa-flask mr-2"></i> {t.simulationActive}
        </div>
      )}

      {!isPurchased ? (
        <>
          <LandingPage onPurchase={() => initiateCheckout('app')} brandName={branding.name} onToggleTestMode={toggleTestModeManually} language={language} />
          <PaymentModal 
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            itemName={checkoutItem.name}
            itemPrice={checkoutItem.price}
            onSuccess={handlePaymentSuccess}
            targetEmail={checkoutItem.email}
            stripeKey={branding.stripeKey}
            language={language}
          />
        </>
      ) : (
        <>
          <header className="bg-brand-dark text-white shadow-lg no-print transition-colors duration-500 sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleLogoClick}>
                <BrandLogo />
                <div className="flex flex-col" onClick={goHome}>
                  <span className="text-lg font-black tracking-tight leading-none group-hover:text-blue-200 transition-colors uppercase">{branding.name.split(' ')[0]} {branding.name.split(' ')[1]}</span>
                  <span className="text-[10px] font-bold text-blue-300 tracking-[0.3em] uppercase">{t.quoteHub}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center bg-white/10 rounded-xl px-2 py-1">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${language === 'en' ? 'bg-white text-blue-900' : 'text-white/60 hover:text-white'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLanguage('es')}
                    className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${language === 'es' ? 'bg-white text-blue-900' : 'text-white/60 hover:text-white'}`}
                  >
                    ES
                  </button>
                </div>

                <button onClick={goHome} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all sm:hidden">
                  <i className="fas fa-house text-xs"></i>
                </button>
                {isAdminMode && (
                  <button 
                    onClick={handleShare}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${copiedShare ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}
                    title={t.copyTesterLink}
                  >
                    <i className={`fas ${copiedShare ? 'fa-check' : 'fa-share-nodes'} text-xs`}></i>
                  </button>
                )}
                
                <div className="hidden sm:flex items-center space-x-4">
                  <button onClick={goHome} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                    <i className="fas fa-house text-[10px]"></i>
                    {t.home}
                  </button>
                  {isPremium && (
                    <span className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                      {t.elite}
                    </span>
                  )}
                  {!isPremium && (
                    <button onClick={() => setCurrentView(View.PREMIUM)} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                      <i className="fas fa-crown text-[10px] text-yellow-400"></i>
                      {t.upgrade}
                    </button>
                  )}
                  <div className="h-4 w-px bg-white/20"></div>
                  <button onClick={() => setCurrentView(View.BILLING)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <i className="fas fa-file-invoice-dollar text-xs"></i>
                  </button>
                </div>

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/10 active:bg-white/20 transition-all"
                >
                  <div className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </button>
              </div>
            </div>
          </header>

          <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-3">
                    <BrandLogo />
                    <span className="text-sm font-black uppercase tracking-tight text-gray-900">{t.navigation}</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <Navigation activeView={currentView} setView={switchView} onLogout={handleLogout} isAdmin={isAdminMode} language={language} />
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-24 lg:pb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="hidden lg:block w-64 no-print">
                <Navigation activeView={currentView} setView={switchView} onLogout={handleLogout} isAdmin={isAdminMode} language={language} />
              </aside>

              <main className="flex-1">
                {currentView === View.DASHBOARD && !currentQuotes && (
                  <div className="space-y-6">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                       <div className="absolute right-[-2rem] top-[-2rem] opacity-[0.03] rotate-12">
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-96 h-96">
                            <circle cx="12" cy="12" r="10" />
                         </svg>
                       </div>
                      <div className="relative z-10 text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">{t.quoteEngine}</h1>
                        <p className="text-gray-500 mt-2 font-medium">{t.officialLogic.replace('{brand}', branding.name)}</p>
                      </div>
                      <button onClick={handleNewQuote} className="relative z-10 bg-brand hover:bg-brand-dark text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center space-x-3 uppercase tracking-widest text-sm">
                        <i className="fas fa-plus"></i>
                        <span>{t.newQuote}</span>
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                            <i className="fas fa-calculator"></i>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.totalQuotes}</span>
                        </div>
                        <div className="text-3xl font-black text-gray-900">{quoteHistory.length}</div>
                      </div>

                      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isPremium ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400'}`}>
                            <i className="fas fa-crown"></i>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.eliteStatus}</span>
                        </div>
                        <div className={`text-xl font-black uppercase tracking-tight ${isPremium ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {isPremium ? t.active : t.inactive}
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                            <i className="fas fa-receipt"></i>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transactions</span>
                        </div>
                        <div className="text-3xl font-black text-gray-900">{transactions.length}</div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">{t.recentActivity}</h2>
                        <button onClick={() => setCurrentView(View.HISTORY)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                          {t.viewAll}
                        </button>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {quoteHistory.length === 0 ? (
                          <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                              <i className="fas fa-clock-rotate-left text-xl"></i>
                            </div>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{t.noActivity}</p>
                          </div>
                        ) : (
                          quoteHistory.slice(0, 5).map((item) => (
                            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewHistoryItem(item)}>
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                  <i className="fas fa-box-open"></i>
                                </div>
                                <div>
                                  <div className="text-xs font-black text-gray-900 uppercase tracking-tight">
                                    {item.details.from.city} → {item.details.to.city}
                                  </div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                                    {new Date(item.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-black text-gray-900">
                                {item.details.weight} lbs
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {currentView === View.QUOTE_FORM && (
                  <QuoteForm 
                    onQuotesReceived={(quotes, details) => { setCurrentQuotes(quotes); setLastDetails(details); setActiveQuoteId(null); setCurrentView(View.DASHBOARD); }} 
                    isPremium={isPremium} 
                    quoteCount={quoteHistory.length}
                    onGoHome={goHome} 
                    language={language}
                  />
                )}
                {currentView === View.HISTORY && <History history={quoteHistory} onViewItem={handleViewHistoryItem} onGoHome={goHome} language={language} />}
                {currentView === View.PREMIUM && <PremiumPage isPremium={isPremium} onPurchase={() => initiateCheckout('premium')} onGoHome={goHome} language={language} />}
                {currentView === View.BILLING && <Billing transactions={transactions} onGoHome={goHome} language={language} />}
                {currentView === View.ADMIN && isAdminMode && (
                  <AdminPage 
                    transactions={transactions} 
                    branding={branding} 
                    onUpdateBranding={setBranding}
                    onGoHome={goHome}
                    language={language}
                  />
                )}
                {currentQuotes && currentView === View.DASHBOARD && (
                  <div className="mt-0">
                    <QuoteResults quotes={currentQuotes} details={lastDetails!} onSave={() => saveQuoteToHistory(currentQuotes, lastDetails!)} onPurchaseLabel={(quote, fee, fulfillment, email, address) => initiateCheckout('label', quote, fee, fulfillment, email, address)} isSaved={!!activeQuoteId && !!quoteHistory.find(q => q.id === activeQuoteId)} language={language} paymentLink={branding.paymentLink} />
                    <button onClick={goHome} className="mt-8 text-gray-400 hover:text-brand font-bold text-xs uppercase tracking-widest flex items-center gap-2 no-print transition-all">
                      <i className="fas fa-arrow-left"></i> {t.returnDashboard}
                    </button>
                  </div>
                )}
              </main>
            </div>
          </div>
          
          <Chatbot brandName={branding.name} language={language} />
        </>
      )}

      {isTestMode && (
        <div className="fixed bottom-6 left-6 z-[200] no-print">
          <button onClick={() => setShowTestGuide(!showTestGuide)} className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce">
            <i className={`fas ${showTestGuide ? 'fa-times' : 'fa-vial'}`}></i>
          </button>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        itemName={checkoutItem.name}
        itemPrice={checkoutItem.price}
        onSuccess={handlePaymentSuccess}
        targetEmail={checkoutItem.email}
        stripeKey={branding.stripeKey}
        language={language}
      />
    </div>
  );
};

export default App;
