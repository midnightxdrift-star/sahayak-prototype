import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { BottomSheet, Toast, SuccessModal } from '../../components/ui/Overlays';

const INITIAL_DOCS = [
  { id: 'doc-1', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', type: 'aadhaar', status: 'verified', note: 'Linked to •••• 4029', noteHi: '•••• 4029 से जुड़ा' },
  { id: 'doc-2', name: 'ST Certificate', nameHi: 'अनुसूचित जनजाति प्रमाण पत्र', type: 'st_certificate', status: 'verified', note: 'Reg: TRB/2021/8834', noteHi: 'पंजी: TRB/2021/8834' },
  { id: 'doc-3', name: 'Income Certificate', nameHi: 'आय प्रमाण पत्र', type: 'income_certificate', status: 'action_needed', note: 'Expired — FY 2025–26', noteHi: 'समाप्त — FY 2025-26' },
  { id: 'doc-4', name: 'Class XII Marksheet', nameHi: 'कक्षा 12वीं की अंकतालिका', type: 'marksheet', status: 'verified', note: 'Board Verified Record', noteHi: 'बोर्ड सत्यापित रिकॉर्ड' },
  { id: 'doc-5', name: 'Bank Passbook', nameHi: 'बैंक पासबुक', type: 'bank_details', status: 'verified', note: 'SBI •••• 6712 (Aadhaar seeded)', noteHi: 'SBI •••• 6712 (आधार सीडेड)' },
  { id: 'doc-6', name: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', type: 'passport_photo', status: 'verified', note: 'Uploaded Jun 2026', noteHi: 'जून 2026 में अपलोड' },
];

const DOC_ICONS = {
  aadhaar: { icon: '🪪', bg: 'bg-blue-50', text: 'text-blue-700' },
  st_certificate: { icon: '🏅', bg: 'bg-purple-50', text: 'text-purple-700' },
  income_certificate: { icon: '📄', bg: 'bg-orange-50', text: 'text-orange-700' },
  marksheet: { icon: '📝', bg: 'bg-amber-50', text: 'text-amber-700' },
  bank_details: { icon: '🏦', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  passport_photo: { icon: '🖼', bg: 'bg-slate-50', text: 'text-slate-700' },
};

export default function DocumentWallet({ onNavigate }) {
  const { t, language } = useLanguage();
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [loading, setLoading] = useState(true);
  const [fixSheetOpen, setFixSheetOpen] = useState(false);
  const [viewSheetDoc, setViewSheetDoc] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        await api.getDocuments();
      } catch (err) {
        console.error('Error loading document wallet:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWallet();
  }, []);

  const verifiedCount = docs.filter((d) => d.status === 'verified').length;
  const total = docs.length;
  const readiness = Math.round((verifiedCount / total) * 100);
  const hasAction = docs.some((d) => d.status === 'action_needed');

  const handleFixIncome = () => {
    setFixSheetOpen(false);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === 'doc-3' ? { ...d, status: 'verified', note: 'Updated FY 2026–27', noteHi: 'अपडेट — FY 2026-27' } : d
        )
      );
      setSuccessOpen(true);
    }, 300);
  };

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 select-none bg-[#f7f8fc]">

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Success Modal */}
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={language === 'hi' ? 'दस्तावेज़ अपडेट हो गया!' : 'Document Updated!'}
        message={language === 'hi'
          ? 'आपका आय प्रमाण पत्र सत्यापित हो गया है। आपका आवेदन अब पूरी तरह तैयार है। 🎉'
          : 'Your Income Certificate is now verified. Your application is fully ready. 🎉'}
        actionLabel={language === 'hi' ? 'आवेदन की स्थिति देखें' : 'View Application Status'}
        onAction={() => { setSuccessOpen(false); onNavigate('application-tracker'); }}
      />

      {/* Fix Income Certificate BottomSheet */}
      <BottomSheet
        open={fixSheetOpen}
        onClose={() => setFixSheetOpen(false)}
        title={language === 'hi' ? 'आय प्रमाण पत्र नवीनीकरण' : 'Renew Income Certificate'}
      >
        <div className="px-5 pb-8 pt-3 space-y-4">
          {/* Why */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex gap-3">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div>
              <p className="text-[13px] font-bold text-amber-800">
                {language === 'hi' ? 'प्रमाण पत्र की अवधि समाप्त' : 'Certificate Expired'}
              </p>
              <p className="text-[12px] text-amber-700 mt-0.5 leading-snug">
                {language === 'hi'
                  ? 'आपका आय प्रमाण पत्र 14 अगस्त 2026 को समाप्त हो गया। FY 2026-27 का नया प्रमाण पत्र अपलोड करें।'
                  : 'Your income certificate expired on 14 Aug 2026. Please upload a fresh FY 2026–27 certificate to resume disbursement.'}
              </p>
            </div>
          </div>

          {/* Options */}
          <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
            {language === 'hi' ? 'विकल्प चुनें' : 'Choose method'}
          </p>

          {[
            {
              icon: '🔗',
              title: language === 'hi' ? 'DigiLocker से आयात करें' : 'Import from DigiLocker',
              sub: language === 'hi' ? 'तुरंत — सरकारी रिकॉर्ड से सत्यापित' : 'Instant — verified from government records',
              recommended: true,
              onClick: handleFixIncome,
            },
            {
              icon: '📸',
              title: language === 'hi' ? 'फोन से अपलोड करें' : 'Upload from Phone',
              sub: language === 'hi' ? '2-3 दिन में सत्यापित होगा' : 'Will be verified in 2–3 days',
              recommended: false,
              onClick: handleFixIncome,
            },
          ].map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={opt.onClick}
              className={`w-full text-left p-4 rounded-2xl border flex items-start gap-3.5 active:scale-[0.98] transition-all ${
                opt.recommended
                  ? 'bg-[#0E3D2F] border-[#0E3D2F] text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <span className="text-2xl mt-0.5">{opt.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-[13px] font-bold ${opt.recommended ? 'text-white' : 'text-slate-900'}`}>
                    {opt.title}
                  </p>
                  {opt.recommended && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#FBBF24] text-[#0E3D2F] rounded-full">
                      {language === 'hi' ? 'सुझाव' : 'RECOMMENDED'}
                    </span>
                  )}
                </div>
                <p className={`text-[11.5px] mt-0.5 ${opt.recommended ? 'text-emerald-200' : 'text-slate-500'}`}>
                  {opt.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Document Viewer BottomSheet */}
      <BottomSheet
        open={!!viewSheetDoc}
        onClose={() => setViewSheetDoc(null)}
        title={language === 'hi' ? (viewSheetDoc?.nameHi) : viewSheetDoc?.name}
      >
        {viewSheetDoc && (
          <div className="px-5 pb-8 pt-3 space-y-4">
            {/* Document card preview */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-2xl ${DOC_ICONS[viewSheetDoc.type]?.bg} flex items-center justify-center text-3xl`}>
                  {DOC_ICONS[viewSheetDoc.type]?.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900">
                    {language === 'hi' ? viewSheetDoc.nameHi : viewSheetDoc.name}
                  </p>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    {language === 'hi' ? viewSheetDoc.noteHi : viewSheetDoc.note}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: language === 'hi' ? 'जारी करने वाला' : 'Issuing Authority', value: language === 'hi' ? 'भारत सरकार / DigiLocker' : 'Government of India / DigiLocker' },
                  { label: language === 'hi' ? 'स्थिति' : 'Status', value: viewSheetDoc.status === 'verified' ? (language === 'hi' ? '✓ सत्यापित' : '✓ Verified') : (language === 'hi' ? '⚠ कार्रवाई आवश्यक' : '⚠ Action Needed'), color: viewSheetDoc.status === 'verified' ? 'text-emerald-700' : 'text-amber-700' },
                  { label: language === 'hi' ? 'DigiLocker सत्यापन' : 'DigiLocker Verification', value: viewSheetDoc.status === 'verified' ? (language === 'hi' ? 'क्रिप्टोग्राफिक रूप से सत्यापित' : 'Cryptographically Verified') : (language === 'hi' ? 'लंबित' : 'Pending') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-[11.5px] text-slate-500">{item.label}</span>
                    <span className={`text-[12px] font-semibold ${item.color || 'text-slate-800'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setViewSheetDoc(null); showToast(language === 'hi' ? 'दस्तावेज़ डाउनलोड हो रहा है...' : 'Document downloading...', 'info'); }}
              className="w-full bg-[#0E3D2F] text-white py-3.5 rounded-2xl text-[14px] font-semibold active:scale-95 transition-all"
            >
              {language === 'hi' ? 'दस्तावेज़ डाउनलोड करें' : 'Download Document'}
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Page Header */}
      <div className="bg-white px-5 pt-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-0.5">
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
              {language === 'hi' ? 'MoTA पोर्टल' : 'MoTA Portal'}
            </p>
            <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">{t.documents.title}</h1>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-800 font-semibold">{t.documents.digilockerSynced}</span>
          </div>
        </div>
        <p className="text-[13px] text-slate-500">{t.documents.subtitle}</p>
      </div>

      <div className="px-4 pt-4 space-y-3.5">

        {/* Readiness Banner */}
        <div className={`rounded-2xl p-4 border flex items-center gap-4 shadow-xs ${
          hasAction ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke={hasAction ? '#FDE68A' : '#A7F3D0'} strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22" fill="none"
                stroke={hasAction ? '#F59E0B' : '#059669'} strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22 * readiness / 100} 999`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[14px] font-extrabold ${hasAction ? 'text-amber-700' : 'text-emerald-800'}`}>
                {readiness}%
              </span>
            </div>
          </div>
          <div>
            <p className={`text-[14px] font-bold ${hasAction ? 'text-amber-800' : 'text-emerald-800'}`}>
              {language === 'hi' ? 'वॉल्ट तैयारी' : 'Vault Readiness'}
            </p>
            <p className={`text-[12px] mt-0.5 ${hasAction ? 'text-amber-700' : 'text-emerald-700'}`}>
              {verifiedCount}/{total} {language === 'hi' ? 'दस्तावेज़ सत्यापित' : 'documents verified'}
            </p>
            {hasAction && (
              <button
                type="button"
                onClick={() => setFixSheetOpen(true)}
                className="mt-2 px-3 py-1 bg-amber-600 text-white text-[11px] font-bold rounded-full active:scale-95 transition-all"
              >
                {language === 'hi' ? 'कमी ठीक करें →' : 'Fix Deficiency →'}
              </button>
            )}
          </div>
        </div>

        {/* Reuse Banner */}
        <button
          type="button"
          onClick={() => onNavigate('document-reuse')}
          className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between active:scale-[0.99] transition-all shadow-xs hover:border-[#0E3D2F]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E3D2F]/10 flex items-center justify-center text-lg">📋</div>
            <div className="text-left">
              <p className="text-[13px] font-bold text-slate-900">{t.documents.reuseBannerTitle}</p>
              <p className="text-[11px] text-slate-500">{t.documents.reuseBannerSub}</p>
            </div>
          </div>
          <span className="text-[11.5px] font-semibold text-[#0E3D2F]">
            {language === 'hi' ? 'चुनें →' : 'Select →'}
          </span>
        </button>

        {/* Document List */}
        <div className="space-y-2.5">
          {(loading ? INITIAL_DOCS : docs).map((doc) => {
            const isAction = doc.status === 'action_needed';
            const iconData = DOC_ICONS[doc.type] || DOC_ICONS.marksheet;
            return (
              <div
                key={doc.id}
                onClick={() => setViewSheetDoc(doc)}
                className={`bg-white rounded-2xl p-3.5 border flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-all shadow-xs ${
                  isAction ? 'border-amber-200 hover:border-amber-300' : 'border-slate-100 hover:border-emerald-200'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl ${iconData.bg} flex items-center justify-center shrink-0 text-2xl`}>
                  {iconData.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-slate-900 truncate">
                    {language === 'hi' ? doc.nameHi : doc.name}
                  </p>
                  <p className={`text-[11.5px] truncate mt-0.5 ${isAction ? 'text-amber-700 font-medium' : 'text-slate-400'}`}>
                    {language === 'hi' ? doc.noteHi : doc.note}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  {isAction ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFixSheetOpen(true); }}
                      className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10.5px] font-bold rounded-full border border-amber-200 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>⚠</span>
                      <span>{language === 'hi' ? 'ठीक करें' : 'Fix'}</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10.5px] font-semibold rounded-full border border-emerald-100 flex items-center gap-1">
                      <span>✓</span>
                      <span>{t.common.verified}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload New */}
        <button
          type="button"
          onClick={() => showToast(language === 'hi' ? 'नया दस्तावेज़ जोड़ने की सुविधा जल्द आएगी' : 'New document upload coming soon!', 'info')}
          className="w-full bg-white border border-dashed border-slate-300 rounded-2xl py-3.5 text-center text-[13px] font-semibold text-slate-600 flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-[#0E3D2F] hover:text-[#0E3D2F]"
        >
          <span className="text-lg">+</span>
          <span>{t.documents.uploadNew}</span>
        </button>
      </div>
    </div>
  );
}
