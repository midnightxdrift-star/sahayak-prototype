import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SuccessModal, Toast } from '../../components/ui/Overlays';

const DOCS = [
  { key: 'aadhaar', icon: '🪪', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', note: 'Linked to •••• 4029', noteHi: '•••• 4029 से जुड़ा', status: 'Verified', statusHi: 'सत्यापित' },
  { key: 'st', icon: '🏅', name: 'ST Certificate', nameHi: 'अनुसूचित जनजाति प्रमाण पत्र', note: 'Reg: TRB/2021/8834', noteHi: 'पंजी: TRB/2021/8834', status: 'Verified', statusHi: 'सत्यापित' },
  { key: 'bank', icon: '🏦', name: 'Bank Passbook', nameHi: 'बैंक पासबुक', note: 'SBI •••• 6712', noteHi: 'SBI •••• 6712', status: 'Verified', statusHi: 'सत्यापित' },
  { key: 'marksheet', icon: '📝', name: 'Class XII Marksheet', nameHi: 'कक्षा 12वीं अंकतालिका', note: 'CGPA 8.2 — Board Verified', noteHi: 'CGPA 8.2 — बोर्ड सत्यापित', status: 'Verified', statusHi: 'सत्यापित' },
];

export default function DocumentReuse({ scholarshipId, onBack, onNavigate }) {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState({ aadhaar: true, st: true, bank: true, marksheet: true });
  const [successOpen, setSuccessOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const toggle = (key) => setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleConfirm = () => {
    setSuccessOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f7f8fc] select-none">
      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Success Modal */}
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={language === 'hi' ? 'दस्तावेज़ संलग्न हो गए!' : 'Documents Attached!'}
        message={language === 'hi'
          ? `${selectedCount} सत्यापित दस्तावेज़ आपके छात्रवृत्ति आवेदन से सफलतापूर्वक जोड़ दिए गए हैं।`
          : `${selectedCount} verified documents have been successfully attached to your scholarship application.`}
        actionLabel={language === 'hi' ? 'आवेदन विवरण देखें' : 'View Application Details'}
        onAction={() => { setSuccessOpen(false); onNavigate('application-details'); }}
      />

      {/* Header */}
      <div className="bg-white px-5 pt-2 pb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5 stroke-[2.2] stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-sm font-bold text-slate-800">{t.reuse.title}</h1>
        <div className="w-8" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-2 space-y-4">

        {/* Header Illustration */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs text-center">
          <div className="text-5xl mb-2">📋</div>
          <h2 className="text-[17px] font-bold text-slate-900">{t.reuse.heading}</h2>
          <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{t.reuse.sub}</p>
        </div>

        {/* DigiLocker Badge */}
        <div className="bg-gradient-to-r from-[#0E3D2F] to-[#1a5c47] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🔐</div>
          <div>
            <p className="text-[13px] font-bold text-white">
              {language === 'hi' ? 'शासकीय प्रमाणित' : 'Government Certified'}
            </p>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              {language === 'hi' ? 'UIDAI एवं DigiLocker द्वारा क्रिप्टोग्राफिक सत्यापन' : 'Cryptographically verified via UIDAI & DigiLocker'}
            </p>
          </div>
          <span className="ml-auto text-[11px] font-bold bg-[#FBBF24] text-[#0E3D2F] px-2.5 py-1 rounded-full shrink-0">
            {DOCS.length} {language === 'hi' ? 'तैयार' : 'Ready'}
          </span>
        </div>

        {/* Select All */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
            {language === 'hi' ? 'दस्तावेज़ चुनें' : 'Select Documents'}
          </p>
          <button
            type="button"
            onClick={() => {
              const allSelected = Object.values(selected).every(Boolean);
              const newState = {};
              DOCS.forEach((d) => { newState[d.key] = !allSelected; });
              setSelected(newState);
            }}
            className="text-[11.5px] font-semibold text-[#0E3D2F] hover:underline"
          >
            {Object.values(selected).every(Boolean)
              ? (language === 'hi' ? 'सभी हटाएं' : 'Deselect All')
              : (language === 'hi' ? 'सभी चुनें' : 'Select All')}
          </button>
        </div>

        {/* Document Checkboxes */}
        <div className="space-y-2.5">
          {DOCS.map((doc) => (
            <div
              key={doc.key}
              onClick={() => toggle(doc.key)}
              className={`bg-white rounded-2xl border p-3.5 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-all ${
                selected[doc.key] ? 'border-[#0E3D2F] shadow-sm' : 'border-slate-200'
              }`}
            >
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                selected[doc.key] ? 'bg-[#0E3D2F]' : 'border-2 border-slate-300 bg-white'
              }`}>
                {selected[doc.key] && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shrink-0">
                {doc.icon}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate">
                  {language === 'hi' ? doc.nameHi : doc.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {language === 'hi' ? doc.noteHi : doc.note}
                </p>
              </div>

              {/* Status */}
              <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                {language === 'hi' ? '✓ ' + doc.statusHi : '✓ ' + doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] text-slate-500">
            {language === 'hi' ? `${selectedCount} दस्तावेज़ चुने गए` : `${selectedCount} documents selected`}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            {language === 'hi' ? 'DigiLocker सत्यापित' : 'DigiLocker verified'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={selectedCount === 0}
          className="w-full bg-[#0E3D2F] hover:bg-[#0a2d21] disabled:opacity-40 active:scale-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>{t.reuse.confirmBtn}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
