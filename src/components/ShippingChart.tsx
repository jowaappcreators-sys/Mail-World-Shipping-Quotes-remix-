
import React from 'react';
import { CarrierQuote, Language } from '../types';
import { translations } from '../translations';

interface ShippingChartProps {
  quotes: CarrierQuote[];
  language: Language;
}

const ShippingChart: React.FC<ShippingChartProps> = ({ quotes, language }) => {
  const t = translations[language];
  const maxPrice = Math.max(...quotes.map(q => q.finalPrice || 0));

  const getCarrierColor = (carrier: string) => {
    switch (carrier) {
      case 'FedEx': return 'bg-[#4D148C]';
      case 'UPS': return 'bg-[#351C15]';
      case 'DHL': return 'bg-[#FFCC00]';
      case 'USPS': return 'bg-[#333366]';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mt-6 no-print">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{t.rateComparison}</h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t.visualizingQuotes}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
          <i className="fas fa-chart-simple"></i>
          <span>{t.liveData}</span>
        </div>
      </div>

      <div className="space-y-6">
        {quotes.map((quote) => {
          const percentage = ((quote.finalPrice || 0) / maxPrice) * 100;
          return (
            <div key={quote.carrier} className="group">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-700">{quote.carrier}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{quote.serviceName}</span>
                </div>
                <span className="text-sm font-black text-gray-900">${quote.finalPrice}</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getCarrierColor(quote.carrier)} transition-all duration-1000 ease-out rounded-full shadow-inner`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.cheapest}</span>
          </div>
        </div>
        <p className="text-[10px] font-medium text-gray-300 italic">{t.priceEstimatesDisclaimer}</p>
      </div>
    </div>
  );
};

export default ShippingChart;
