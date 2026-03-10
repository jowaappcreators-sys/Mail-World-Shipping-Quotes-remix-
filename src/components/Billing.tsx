
import React from 'react';
import { Transaction, Language } from '../types';
import { translations } from '../translations';

interface BillingProps {
  transactions: Transaction[];
  onGoHome?: () => void;
  language: Language;
}

const Billing: React.FC<BillingProps> = ({ transactions, onGoHome, language }) => {
  const t = translations[language];

  const handleDownloadReceipt = (tx: Transaction) => {
    const fulfillmentText = tx.type === 'LABEL' 
      ? `FULFILLMENT:    ${tx.fulfillment === 'PICKUP' ? 'Professional Pickup (Tulsa Area)' : 'Mail World Office Drop-Off'}\n` +
        `EMAIL SENT TO:  ${tx.email}\n` +
        (tx.pickupAddress ? `PICKUP ADDR:   ${tx.pickupAddress}\n` : '')
      : '';

    const content = `
MAIL WORLD OFFICE - OFFICIAL RECEIPT
====================================
Transaction ID: ${tx.id}
Date:           ${tx.date}
Status:         ${tx.status}
Payment Method: ${tx.method}
Type:           ${tx.type}

ORDER DETAILS:
------------------------------------
Item:           ${tx.item}
Amount:         $${tx.amount.toFixed(2)}
Tax:            $0.00
Total:          $${tx.amount.toFixed(2)}

${fulfillmentText}
------------------------------------
INSTRUCTIONS:
${tx.type === 'LABEL' 
  ? (tx.fulfillment === 'PICKUP' 
    ? `A pickup agent has been dispatched to ${tx.pickupAddress}. Please have your package ready. Your label has been sent to ${tx.email}.`
    : `Bring your package and this receipt to your nearest Mail World Office for drop-off. Your digital label has been emailed to ${tx.email}.`)
  : "Thank you for choosing Mail World Office Quote Hub."
}

Authorized Hub Transaction.
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${tx.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadLabel = (tx: Transaction) => {
    if (!tx.carrier || !tx.trackingNumber) return;

    const details = tx.packageDetails;
    const content = `
***************************************************
*             OFFICIAL SHIPPING LABEL             *
***************************************************
CARRIER:      ${tx.carrier.toUpperCase()}
SERVICE:      ${tx.service?.toUpperCase()}
TRACKING #:   ${tx.trackingNumber}
DATE ISSUED:  ${tx.date}

FROM:
---------------------------------------------------
${details?.from.street || 'MAIL WORLD CUSTOMER'}
${details?.from.city}, ${details?.from.state} ${details?.from.zip}
${details?.from.country}

TO:
---------------------------------------------------
${details?.to.street || 'RECIPIENT'}
${details?.to.city}, ${details?.to.state} ${details?.to.zip}
${details?.to.country}

PACKAGE DETAILS:
---------------------------------------------------
WEIGHT:       ${details?.weight} LBS
DIMENSIONS:   ${details?.length}x${details?.width}x${details?.height} IN
FULFILLMENT:  ${tx.fulfillment}

[BARCODE SIMULATION]
|| |||| ||| |||| || ||| |||| || ||| |||| |||| |||
${tx.trackingNumber}
***************************************************
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Label_${tx.carrier}_${tx.trackingNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
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

      {transactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-file-invoice text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t.noTransactions}</h2>
          <p className="text-gray-500 mt-2">{t.noPurchasesYet}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{t.billingPayments}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t.manageSubscriptions}</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.activeLicense}</span>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.type}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.details}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.item}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.amount}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.type === 'LABEL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-gray-600">{tx.date.split(',')[0]}</div>
                        {tx.email && (
                          <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">{t.sentTo} {tx.email}</div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-gray-900 uppercase block">{tx.item}</span>
                        {tx.trackingNumber && (
                           <div className="text-[10px] font-black text-emerald-600 uppercase mt-1">
                              <i className="fas fa-barcode mr-1"></i> {tx.trackingNumber}
                           </div>
                        )}
                        {tx.fulfillment && (
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {tx.fulfillment === 'PICKUP' ? `${t.scheduledPickup} ${tx.pickupAddress}` : t.selfDropOff}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-blue-900">${tx.amount.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={() => handleDownloadReceipt(tx)}
                            className="text-gray-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest flex items-center justify-end transition-all group"
                          >
                            <i className="fas fa-file-invoice mr-2 transition-transform group-hover:scale-110"></i>
                            {t.getReceipt}
                          </button>
                          {tx.type === 'LABEL' && (
                            <button 
                              onClick={() => handleDownloadLabel(tx)}
                              className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest flex items-center justify-end transition-all group"
                            >
                              <i className="fas fa-print mr-2 transition-transform group-hover:scale-110"></i>
                              {t.downloadLabel}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <div className="bg-blue-900 p-8 rounded-[2rem] text-white flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-800 rounded-3xl flex items-center justify-center text-2xl shadow-inner">
            <i className="fas fa-truck-ramp-box text-blue-300"></i>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">{t.labelPurchaseInstructions}</h3>
            <p className="text-blue-300 text-xs font-medium mt-1 max-w-lg">
              {t.labelPurchaseInstructionsDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
