import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function PaymentsDbt({ onBack, onNavigate }) {
  const { t, language } = useLanguage();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await api.getPayments();
        setPaymentData(data);
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[#f7f8fc] p-6 text-center">
        <div className="w-7 h-7 border-2 border-[#0E3D2F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#f7f8fc] space-y-3">
        <span className="text-4xl text-slate-300">💳</span>
        <h2 className="text-base font-bold text-slate-800">
          {language === 'hi' ? 'कोई भुगतान रिकॉर्ड नहीं' : 'No Payment Records'}
        </h2>
        <p className="text-xs text-slate-500 max-w-xs">
          {language === 'hi' ? 'भुगतान जानकारी इस समय उपलब्ध नहीं है।' : 'Payment information is not available at this moment.'}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#0E3D2F] text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          {t.common.back}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f7f8fc] select-none relative overflow-hidden">
      {/* Top Navigation */}
      <div className="px-5 pt-3 pb-2.5 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all"
          >
            <svg className="w-4.5 h-4.5 stroke-[2.2] stroke-current fill-none" viewBox="0 0 24 24">
              <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.payments.sub}
            </span>
            <h1 className="text-[18px] font-bold text-slate-900 leading-tight">{t.payments.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-emerald-800 font-bold">{t.payments.aadhaarLinked}</span>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5 no-scrollbar">

        {/* Bank Account Seeding Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl shrink-0">
            🏦
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-slate-900 truncate">
                {paymentData.bank_name || 'State Bank of India'}
              </p>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9.5px] font-bold rounded-full">
                DBT Active
              </span>
            </div>
            <p className="text-[11.5px] text-slate-500 font-mono mt-0.5">
              A/C: {paymentData.account_mask || '•••• 6712'} (Aadhaar Seeded)
            </p>
          </div>
        </div>

        {/* Total Received vs Pending Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Received */}
          <div className="bg-gradient-to-br from-[#0E3D2F] to-[#154f3b] rounded-2xl p-3.5 text-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-200">{t.payments.totalReceived}</span>
              <span className="text-emerald-300">✓</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-white tracking-tight block">
                ₹{paymentData.total_received.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-emerald-200 block mt-0.5">
                {paymentData.cycles_credited} {t.payments.cyclesCredited}
              </span>
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900">{t.payments.pending}</span>
              <span className="text-amber-600">⏳</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-amber-900 tracking-tight block">
                ₹{paymentData.pending_amount.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-amber-700 block mt-0.5">
                {t.payments.finalInstallment}
              </span>
            </div>
          </div>
        </div>

        {/* Disbursement Cadence Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[13px] font-bold text-slate-900 block">{t.payments.cadenceTitle}</span>
              <span className="text-[11px] text-slate-500">{t.payments.cadenceSub}</span>
            </div>
            <span className="text-[11px] font-bold text-[#0E3D2F] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              ₹5,000/{language === 'hi' ? 'माह' : 'mo'}
            </span>
          </div>

          {/* CSS Chart Bars */}
          <div className="pt-3 pb-1">
            <div className="h-28 w-full flex items-end justify-around border-b border-slate-200 pb-1">
              {paymentData.monthly_schedule?.map((item, idx) => {
                const isPaid = item.status === 'disbursed';
                const monthHi = item.month === 'Jun' ? 'जून' :
                                item.month === 'Jul' ? 'जुलाई' :
                                item.month === 'Aug' ? 'अगस्त' :
                                item.month === 'Sep' ? 'सितंबर' : item.month;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 w-1/5">
                    <span className="text-[10px] font-bold text-slate-500">₹5k</span>
                    <div
                      className={`w-7 rounded-t-lg transition-all ${
                        isPaid ? 'bg-[#0E3D2F] h-16' : 'bg-amber-400 h-16 relative'
                      }`}
                    >
                      {!isPaid && (
                        <div className="absolute -top-1 left-0 right-0 h-1 bg-white/40 animate-pulse rounded-t-lg" />
                      )}
                    </div>
                    <span className={`text-[11px] font-semibold pt-1 ${isPaid ? 'text-slate-800' : 'text-amber-800'}`}>
                      {language === 'hi' ? monthHi : item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2.5 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0E3D2F]" />
                <span>{language === 'hi' ? 'खाते में अंतरित' : 'Credited to Bank'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>{language === 'hi' ? 'सत्यापन प्रक्रियाधीन' : 'In Verification'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-slate-900">{t.payments.historyTitle}</h2>
            <span className="text-[11px] text-[#0E3D2F] font-semibold">{language === 'hi' ? '4 किस्तें' : '4 Cycles'}</span>
          </div>

          <div className="space-y-2">
            {paymentData.history?.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E3D2F] flex items-center justify-center font-bold text-sm shrink-0">
                    ₹
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-bold text-slate-900">₹{tx.amount.toLocaleString()}</span>
                      <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-100">
                        {language === 'hi' ? 'सफल' : 'Success'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                      {language === 'hi' ? 'पोस्ट-मैट्रिक छात्रवृत्ति' : tx.scheme_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11.5px] font-semibold text-slate-800 block">{tx.date}</span>
                  <span className="text-[9.5px] text-slate-400 font-mono block">{tx.reference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ask JAGO CTA */}
        <button
          type="button"
          onClick={() => onNavigate('jago')}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-bold text-[#0E3D2F] flex items-center justify-center space-x-2 shadow-xs active:scale-[0.99] transition-all"
        >
          <span>🤖</span>
          <span>{t.payments.askJagoBtn}</span>
          <span>→</span>
        </button>

        {/* Prototype boundary notice */}
        <p className="text-[10px] text-center text-slate-400 font-medium tracking-wide pb-1">
          {t.payments.prototypeNotice}
        </p>
      </div>
    </div>
  );
}
