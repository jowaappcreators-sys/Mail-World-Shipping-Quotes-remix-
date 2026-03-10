
import React, { useState } from 'react';
import { PackageDetails, CarrierQuote, Language } from '../types';
import { getShippingQuotes } from '../services/geminiService';
import { translations } from '../translations';

interface QuoteFormProps {
  onQuotesReceived: (quotes: CarrierQuote[], details: PackageDetails) => void;
  isPremium: boolean;
  quoteCount: number;
  onGoHome?: () => void;
  language: Language;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onQuotesReceived, isPremium, quoteCount, onGoHome, language }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];
  
  const [details, setDetails] = useState<PackageDetails>({
    weight: 1,
    length: 12,
    width: 12,
    height: 12,
    isInternational: false,
    from: { street: '', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
    to: { street: '', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'USA' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPremium && quoteCount >= 3) {
      setError(t.freeLimitReached);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const quotes = await getShippingQuotes(details);
      
      const markedUpQuotes = quotes.map(q => {
        let finalPrice = q.basePrice * 1.25;
        if (isPremium) {
          finalPrice = finalPrice * 0.95;
        }
        return { ...q, finalPrice: parseFloat(finalPrice.toFixed(2)) };
      });

      onQuotesReceived(markedUpQuotes, details);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.somethingWentWrong;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PackageDetails, value: number | boolean) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (type: 'from' | 'to', field: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {onGoHome && (
        <button 
          onClick={onGoHome}
          className="flex items-center space-x-2 text-gray-400 hover:text-brand font-black text-[10px] uppercase tracking-[0.2em] transition-all"
        >
          <i className="fas fa-chevron-left"></i>
          <i className="fas fa-house"></i>
          <span>{t.returnDashboard}</span>
        </button>
      )}

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <i className="fas fa-truck-fast text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t.calculateShipping}</h2>
            <p className="text-gray-500 text-sm">{t.compareRates}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t.packageSpecs}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t.weight}</label>
                <input 
                  type="number" required min="0.1" step="0.1"
                  value={details.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t.length}</label>
                <input 
                  type="number" required min="1"
                  value={details.length}
                  onChange={(e) => handleInputChange('length', parseFloat(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t.width}</label>
                <input 
                  type="number" required min="1"
                  value={details.width}
                  onChange={(e) => handleInputChange('width', parseFloat(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t.height}</label>
                <input 
                  type="number" required min="1"
                  value={details.height}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-gray-200">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" name="destType" checked={!details.isInternational}
                  onChange={() => handleInputChange('isInternational', false)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${!details.isInternational ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {!details.isInternational && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span className={`text-sm font-semibold ${!details.isInternational ? 'text-gray-900' : 'text-gray-500'}`}>{t.domestic}</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" name="destType" checked={details.isInternational}
                  onChange={() => handleInputChange('isInternational', true)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${details.isInternational ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {details.isInternational && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span className={`text-sm font-semibold ${details.isInternational ? 'text-gray-900' : 'text-gray-500'}`}>{t.international}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-600 flex items-center bg-blue-50 w-fit px-3 py-1 rounded-full">
                <i className="fas fa-location-dot mr-2"></i> {t.shippingFrom}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <input 
                  placeholder={t.country} required
                  value={details.from.country}
                  onChange={(e) => handleAddressChange('from', 'country', e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
                <input 
                  placeholder={t.street} required
                  value={details.from.street}
                  onChange={(e) => handleAddressChange('from', 'street', e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder={t.city} required
                    value={details.from.city}
                    onChange={(e) => handleAddressChange('from', 'city', e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                  <input 
                    placeholder={t.state} required
                    value={details.from.state}
                    onChange={(e) => handleAddressChange('from', 'state', e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
                <input 
                  placeholder={t.zip} required
                  value={details.from.zip}
                  onChange={(e) => handleAddressChange('from', 'zip', e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-600 flex items-center bg-blue-50 w-fit px-3 py-1 rounded-full">
                <i className="fas fa-map-pin mr-2"></i> {t.shippingTo}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <input 
                  placeholder={t.country} required
                  value={details.to.country}
                  onChange={(e) => handleAddressChange('to', 'country', e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
                <input 
                  placeholder={t.street} required
                  value={details.to.street}
                  onChange={(e) => handleAddressChange('to', 'street', e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder={t.city} required
                    value={details.to.city}
                    onChange={(e) => handleAddressChange('to', 'city', e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                  <input 
                    placeholder={t.state} required
                    value={details.to.state}
                    onChange={(e) => handleAddressChange('to', 'state', e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
                <input 
                  placeholder={t.zip} required
                  value={details.to.zip}
                  onChange={(e) => handleAddressChange('to', 'zip', e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center">
              <i className="fas fa-exclamation-triangle mr-3"></i>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-3 active:scale-[0.98] ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t.calculating}</span>
              </>
            ) : (
              <>
                <i className="fas fa-magnifying-glass"></i>
                <span>{t.compareCarriers}</span>
              </>
            )}
          </button>
          
          {((window as unknown) as { isTestMode?: boolean }).isTestMode && (
            <button 
              type="button"
              onClick={() => {
                const mockQuotes: CarrierQuote[] = [
                  { carrier: 'FedEx', serviceName: 'Ground', basePrice: 15.50, estimatedDays: 3, finalPrice: 19.38 },
                  { carrier: 'UPS', serviceName: 'Standard', basePrice: 14.20, estimatedDays: 4, finalPrice: 17.75 },
                  { carrier: 'DHL', serviceName: 'Express', basePrice: 45.00, estimatedDays: 2, finalPrice: 56.25 },
                  { carrier: 'USPS', serviceName: 'Priority', basePrice: 8.95, estimatedDays: 3, finalPrice: 11.19 }
                ];
                onQuotesReceived(mockQuotes, details);
              }}
              className="w-full py-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              {t.simulateTestQuotes}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;
