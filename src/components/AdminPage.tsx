
import React, { useMemo, useState } from 'react';
import { Transaction, Language } from '../types';
import { AppBranding } from '../App';
import { translations } from '../translations';

interface AdminPageProps {
  transactions: Transaction[];
  branding: AppBranding;
  onUpdateBranding: (branding: AppBranding) => void;
  onGoHome?: () => void;
  language: Language;
}

const AdminPage: React.FC<AdminPageProps> = ({ transactions, branding, onUpdateBranding, onGoHome, language }) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'branding' | 'logs'>('stats');
  
  // Local branding state for editing
  const [editBranding, setEditBranding] = useState(branding);

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const labelSales = transactions.filter(t => t.type === 'LABEL').length;
    const premiumUpgrades = transactions.filter(t => t.item.includes('Elite') || t.type === 'PREMIUM').length;
    const appLicenses = transactions.filter(t => t.item.includes('Professional Hub')).length;

    return { totalRevenue, labelSales, premiumUpgrades, appLicenses };
  }, [transactions]);

  const handleSaveBranding = () => {
    onUpdateBranding(editBranding);
    alert(t.configUpdated);
  };

  const copyTestLink = () => {
    const origin = window.location.origin;
    const path = window.location.pathname.replace(/\/$/, ""); 
    const cleanBase = origin + path;
    const testLink = `${cleanBase}/?mode=test`;
    
    navigator.clipboard.writeText(testLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{t.adminControlPanel}</h1>
          <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mt-1">{t.restrictedAccess}</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button 
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
           >{t.launchHub}</button>
           <button 
            onClick={() => setActiveTab('branding')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'branding' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
           >{t.branding}</button>
           <button 
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
           >{t.systemLogs}</button>
           <button 
            onClick={() => {
              if (window.confirm(t.resetAppConfirm)) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
           >{t.resetApp}</button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <i className="fas fa-share-nodes text-[15rem] rotate-12"></i>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <i className="fas fa-rocket text-sm"></i>
                     </div>
                     <span>{t.launchShareWizard}</span>
                  </h2>
                  <p className="text-slate-400 mt-2 font-medium max-w-xl">
                    {t.launchShareWizardDesc}
                  </p>
                </div>
                
                <button 
                  onClick={copyTestLink}
                  className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border-2 ${copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-indigo-500/50 text-indigo-400 hover:bg-indigo-500 hover:text-white shadow-xl shadow-indigo-500/10'}`}
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-link'}`}></i>
                  {copied ? t.cleanLinkCopied : t.copySecureTestLink}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">{t.step01}</div>
                  <h3 className="font-bold text-lg mb-2">{t.step01Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.step01Desc}</p>
                </div>
                
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">{t.step02}</div>
                  <h3 className="font-bold text-lg mb-2">{t.step02Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.step02Desc}</p>
                </div>

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">{t.step03}</div>
                  <h3 className="font-bold text-lg mb-2">{t.step03Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.step03Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.platformRevenue}</div>
              <div className="text-3xl font-black text-brand tracking-tighter">${stats.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.labelsGenerated}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tighter">{stats.labelSales}</div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.eliteMembers}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tighter">{stats.premiumUpgrades}</div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.hubLicenses}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tighter">{stats.appLicenses}</div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">{t.systemHealth}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-plug"></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.apiStatus}</div>
                    <div className="text-sm font-black text-emerald-600 uppercase">{t.operational}</div>
                  </div>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>

              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-database"></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.dbStatus}</div>
                    <div className="text-sm font-black text-blue-600 uppercase">{t.connected}</div>
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>

              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-sync"></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.lastSync}</div>
                    <div className="text-sm font-black text-purple-600 uppercase">{t.justNow}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-xl animate-in slide-in-from-right-4 duration-500">
          <div className="flex items-center space-x-6 mb-10">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
              <i className="fas fa-palette text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{t.appCustomization}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t.appCustomizationDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.businessIdentityName}</label>
                <input 
                  type="text"
                  value={editBranding.name}
                  onChange={(e) => setEditBranding({...editBranding, name: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 font-black uppercase tracking-tight outline-none focus:border-gray-900 transition-all shadow-inner"
                  placeholder="e.g. Mail World Office"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.supportPhoneLine}</label>
                <input 
                  type="text"
                  value={editBranding.phone}
                  onChange={(e) => setEditBranding({...editBranding, phone: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 font-black uppercase tracking-tight outline-none focus:border-gray-900 transition-all shadow-inner"
                  placeholder="e.g. 918-555-0123"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.adminOwnerEmail}</label>
                <input 
                  type="email"
                  value={editBranding.ownerEmail}
                  onChange={(e) => setEditBranding({...editBranding, ownerEmail: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 font-black uppercase tracking-tight outline-none focus:border-gray-900 transition-all shadow-inner"
                  placeholder="e.g. owner@example.com"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.stripePublishableKey}</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={editBranding.stripeKey}
                    onChange={(e) => setEditBranding({...editBranding, stripeKey: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 font-black uppercase tracking-tight outline-none focus:border-gray-900 transition-all shadow-inner"
                    placeholder="pk_test_..."
                  />
                  {editBranding.stripeKey && (
                    <button 
                      onClick={() => {
                        if (window.confirm(t.disconnectConfirm)) {
                          setEditBranding({...editBranding, stripeKey: ''});
                        }
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                      {t.disconnect}
                    </button>
                  )}
                </div>
                {!editBranding.stripeKey && (
                  <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest ml-1">
                    <i className="fas fa-exclamation-triangle mr-1"></i> {t.stripeDisconnectedMsg}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.sharePayment} Link</label>
                <input 
                  type="text"
                  value={editBranding.paymentLink}
                  onChange={(e) => setEditBranding({...editBranding, paymentLink: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 font-black uppercase tracking-tight outline-none focus:border-gray-900 transition-all shadow-inner"
                  placeholder="https://buy.stripe.com/..."
                />
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  {language === 'es' ? 'Cree un "Payment Link" en su tablero de Stripe y péguelo aquí.' : 'Create a "Payment Link" in your Stripe dashboard and paste it here.'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.brandSignatureColor}</label>
                <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 shadow-inner">
                  <input 
                    type="color"
                    value={editBranding.primaryColor}
                    onChange={(e) => setEditBranding({...editBranding, primaryColor: e.target.value})}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl cursor-pointer overflow-hidden"
                  />
                  <div className="flex-1">
                    <input 
                      type="text"
                      value={editBranding.primaryColor}
                      onChange={(e) => setEditBranding({...editBranding, primaryColor: e.target.value})}
                      className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-mono text-sm uppercase outline-none focus:border-gray-900 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveBranding}
                className="w-full bg-gray-900 text-white font-black py-6 rounded-[1.5rem] shadow-2xl hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
              >
                {t.applySynchronizeBranding}
              </button>

              <div className="pt-8 border-t border-gray-100">
                <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100">
                  <h3 className="text-red-600 font-black uppercase text-xs tracking-widest mb-2">{t.dangerZone}</h3>
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mb-6 leading-relaxed">
                    {t.transferOwnershipDesc}
                  </p>
                  <button 
                    onClick={() => {
                      if (window.confirm(t.transferOwnershipConfirm.replace('{email}', editBranding.ownerEmail))) {
                        handleSaveBranding();
                      }
                    }}
                    className="w-full bg-white text-red-600 border-2 border-red-100 font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all uppercase tracking-widest text-[10px]"
                  >
                    {t.confirmOwnershipTransfer}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute top-6 left-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.liveVisualPreview}</div>
               
               <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 transform rotate-2">
                  <div className="px-6 py-5 flex items-center space-x-4" style={{ backgroundColor: editBranding.primaryColor }}>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                       <i className="fas fa-globe text-xs"></i>
                    </div>
                    <div className="text-[11px] font-black text-white uppercase tracking-tight">{editBranding.name}</div>
                  </div>
                  <div className="p-8">
                    <div className="h-4 w-3/4 bg-gray-100 rounded-full mb-4"></div>
                    <div className="h-4 w-1/2 bg-gray-50 rounded-full mb-8"></div>
                    <div className="h-14 w-full rounded-2xl shadow-lg transition-colors" style={{ backgroundColor: editBranding.primaryColor }}></div>
                    <div className="mt-8 flex items-center space-x-3 text-gray-300">
                       <i className="fas fa-phone-volume text-sm"></i>
                       <span className="text-[11px] font-black uppercase tracking-widest">{editBranding.phone}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">{t.systemAuditLogs}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t.realTimeMonitoring}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.idReference}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.entityEmail}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.operation}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.value}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="text-gray-300 italic text-sm font-medium">{t.waitingFirstTransaction}</div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-10 py-6 font-mono text-[11px] text-gray-400">#{tx.id}</td>
                      <td className="px-10 py-6">
                        <div className="text-sm font-black text-gray-900 uppercase leading-none">{tx.email || 'Root User'}</div>
                        <div className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">{tx.date}</div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                          tx.type === 'LABEL' ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                          tx.type === 'LICENSE' ? 'bg-purple-50 border-purple-100 text-purple-600' : 
                          'bg-yellow-50 border-yellow-100 text-yellow-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-sm font-black text-gray-900">${tx.amount.toFixed(2)}</td>
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-3 justify-end">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{tx.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
