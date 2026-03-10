
import React, { useState } from 'react';
import { translations } from '../translations';
import { Language } from '../types';

interface LandingPageProps {
  onPurchase: () => void;
  brandName?: string;
  onToggleTestMode?: () => void;
  language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPurchase, brandName = 'Mail World Office Ship Quote', onToggleTestMode, language }) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const t = translations[language];

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount === 3 && onToggleTestMode) {
      onToggleTestMode();
    }
    if (newCount === 5) {
      setLogoClicks(5); // Keep it at 5 to show the button
    } else {
      setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 relative overflow-x-hidden">
      {/* Secret Skip Button */}
      {logoClicks >= 5 && (
        <button 
          onClick={onPurchase}
          className="fixed top-4 right-4 z-[200] bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-bounce"
        >
          {t.bypassDashboard}
        </button>
      )}

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {/* Decorative background circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center">
            <div className="mb-8 flex justify-center">
              {/* High-fidelity SVG Logo with secret click handler */}
              <div 
                onClick={handleLogoClick}
                className="w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 cursor-pointer active:scale-95 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M12 12l4-4m-8 0l4 4" opacity="0.5" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tighter uppercase leading-tight px-2">
              {brandName}
            </h1>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">{t.officialPortal}</p>
            
            <p className="text-gray-500 mb-8 font-medium leading-relaxed text-sm">
              {t.industryStandard}
            </p>
            
            <div className="bg-gray-50 rounded-[2rem] p-8 mb-10 border border-gray-100 shadow-inner">
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center text-sm font-bold text-gray-700">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  {t.packageSpecs}
                </li>
                <li className="flex items-center text-sm font-bold text-gray-700">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  {t.eliteBenefits}
                </li>
              </ul>
              
              <div className="flex items-baseline justify-center">
                 <span className="text-5xl font-black text-blue-900 tracking-tighter uppercase">{t.free}</span>
              </div>
              <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">{t.professionalLicense}</div>
            </div>

            <button 
              onClick={onPurchase}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest text-sm"
            >
              {t.initialize}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex items-center justify-center space-x-3 mb-3">
               <i className="fas fa-mailbox text-blue-300"></i>
               <h3 className="text-blue-100 font-black uppercase tracking-widest text-xs">{t.additionalServices}</h3>
            </div>
            <p className="text-blue-200 text-sm font-medium mb-6 leading-relaxed">
              {t.ipostalInfo}
            </p>
            <a 
              href="https://ipostal1.com/MailWorldOffice" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl transition-all border border-white/10 font-black uppercase tracking-widest text-[10px]"
            >
              <span>{t.visitSite}</span>
              <i className="fas fa-external-link-alt text-[8px]"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">{t.featuresTitle}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase mb-3">{t.feature1Title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{t.feature1Desc}</p>
            </div>

            <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                <i className="fas fa-crown"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase mb-3">{t.feature2Title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{t.feature2Desc}</p>
            </div>

            <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl">
                <i className="fas fa-globe"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase mb-3">{t.feature3Title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-50 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">{t.howItWorksTitle}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 -translate-y-1/2 z-0"></div>

            {[
              { step: '01', title: t.step1Title, desc: t.step1Desc, icon: 'fa-keyboard' },
              { step: '02', title: t.step2Title, desc: t.step2Desc, icon: 'fa-magnifying-glass-dollar' },
              { step: '03', title: t.step3Title, desc: t.step3Desc, icon: 'fa-truck-ramp-box' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-2xl font-black text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase mb-3">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-950 py-16 px-4 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span className="text-xl font-black uppercase tracking-tight">{brandName}</span>
            </div>
            <p className="text-blue-300 text-sm font-medium leading-relaxed">
              {t.industryStandard}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">{t.footerContact}</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-blue-100 font-bold">
                <i className="fas fa-location-dot text-blue-500"></i>
                <span>{t.footerAddress}</span>
              </li>
              <li className="flex items-center space-x-3 text-blue-100 font-bold">
                <i className="fas fa-envelope text-blue-500"></i>
                <span>support@mailworldoffice.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Legal</h4>
            <ul className="space-y-4">
              <li className="text-blue-100 font-bold cursor-pointer hover:text-white transition-colors">Privacy Policy</li>
              <li className="text-blue-100 font-bold cursor-pointer hover:text-white transition-colors">Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} {brandName}. {t.footerRights}.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
