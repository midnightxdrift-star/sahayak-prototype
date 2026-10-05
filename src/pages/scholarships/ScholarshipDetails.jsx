import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Toast } from '../../components/ui/Overlays';

export default function ScholarshipDetails({ scholarshipId = 'mota-post-matric', onBack, onNavigate }) {
  const { t, language } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await api.getScholarshipById(scholarshipId);
        setScheme(data);
      } catch (err) {
        console.error("Error loading scholarship details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [scholarshipId]);

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    setToast({
      msg: next
        ? (language === 'hi' ? 'छात्रवृत्ति बुकमार्क में सहेजी गई!' : 'Scholarship saved to bookmarks!')
        : (language === 'hi' ? 'बुकमार्क से हटा दी गई' : 'Removed from bookmarks'),
      type: 'info'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-white p-6 text-center">
        <div className="w-7 h-7 border-2 border-[#0E3D2F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white space-y-3">
        <span className="text-4xl text-slate-300">🔍</span>
        <h2 className="text-base font-bold text-slate-800">
          {language === 'hi' ? 'छात्रवृत्ति नहीं मिली' : 'Scholarship Not Found'}
        </h2>
        <p className="text-xs text-slate-500 max-w-xs">
          {language === 'hi' ? 'अनुरोधित छात्रवृत्ति जानकारी उपलब्ध नहीं है।' : 'We could not find the requested scholarship information.'}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#0E3D2F] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95"
        >
          {t.common.back}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-white select-none relative overflow-hidden">
      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Navigation */}
      <nav className="px-5 pt-3 pb-2 flex justify-between items-center z-10 shrink-0 border-b border-slate-100">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go Back"
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5 stroke-[2.2] stroke-current fill-none" viewBox="0 0 24 24">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-sm font-bold text-slate-800">{t.scholarshipDetails.title}</span>
        <button
          type="button"
          onClick={toggleBookmark}
          aria-label="Bookmark"
          className={`p-1 -mr-1 active:scale-90 transition-transform ${bookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'}`}
        >
          <svg className="w-5 h-5 stroke-[2] stroke-current" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24">
            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 no-scrollbar pt-2">
        {/* Header Title Section */}
        <section className="relative pt-1 pb-2 flex items-start justify-between">
          <div className="flex-1 pr-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0E3D2F] text-[11px] font-semibold mb-2 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'hi' ? 'अंतिम तिथि: 31 अक्टूबर 2026' : (scheme.application_period || 'Open for 2026–27')}</span>
            </div>
            <h1 className="text-[20px] font-bold leading-tight text-slate-900 tracking-tight">
              {language === 'hi' ? (scheme.name_hi || scheme.name) : scheme.name}
            </h1>
            <p className="text-[12.5px] text-slate-500 font-normal mt-1 leading-snug">
              {language === 'hi' ? (scheme.short_description_hi || scheme.short_description) : scheme.short_description}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] flex items-center justify-center text-[#0E3D2F] shrink-0 mt-1 text-2xl shadow-xs">
            🎓
          </div>
        </section>

        {/* 3 Key Information Cards */}
        <section className="grid grid-cols-3 gap-2.5 mt-3">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0E3D2F] flex items-center justify-center mb-1 text-xs font-bold">
              ST
            </div>
            <h2 className="text-[10.5px] font-bold text-slate-800 leading-tight mb-0.5">{t.scholarshipDetails.whoIsItFor}</h2>
            <p className="text-[9.5px] text-slate-500 leading-tight">
              {language === 'hi' ? 'कक्षा 11-12 एवं उच्चतर' : (scheme.who_is_it_for || 'ST Students')}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1 text-xs font-bold">
              📄
            </div>
            <h2 className="text-[10.5px] font-bold text-slate-800 leading-tight mb-0.5">{t.scholarshipDetails.whatYouNeed}</h2>
            <p className="text-[9.5px] text-slate-500 leading-tight">
              {language === 'hi' ? 'DigiLocker दस्तावेज़' : (scheme.what_you_need || 'Certificates')}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1 text-xs font-bold">
              ₹
            </div>
            <h2 className="text-[10.5px] font-bold text-slate-800 leading-tight mb-0.5">{t.scholarshipDetails.grantAmount}</h2>
            <p className="text-[9.5px] text-slate-700 font-bold leading-tight">
              {scheme.amount || '₹25,000/yr'}
            </p>
          </div>
        </section>

        {/* Eligibility Criteria */}
        <section className="mt-5 space-y-2">
          <h2 className="text-[14px] font-bold text-slate-900">{t.scholarshipDetails.eligibilityTitle}</h2>
          <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-100">
            {language === 'hi' ? (
              <>
                <div className="flex items-start space-x-2 text-[12px] text-slate-700">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>अनुसूचित जनजाति (ST) का प्रमाण पत्र होना आवश्यक।</span>
                </div>
                <div className="flex items-start space-x-2 text-[12px] text-slate-700">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>पारिवारिक वार्षिक आय ₹2.5 लाख से अधिक न हो।</span>
                </div>
                <div className="flex items-start space-x-2 text-[12px] text-slate-700">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>मान्यता प्राप्त संस्थान में पोस्ट-मैट्रिक पाठ्यक्रम में नामांकित।</span>
                </div>
              </>
            ) : (
              scheme.eligibility_criteria?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[12px] text-slate-700">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Required Documents Section */}
        <section className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-[14px] font-bold text-slate-900">{t.scholarshipDetails.requiredDocsTitle}</h2>
            <span className="text-[11px] font-semibold text-[#0E3D2F]">
              {language === 'hi' ? 'DigiLocker सिंक' : 'DigiLocker Synced'}
            </span>
          </div>

          <div className="space-y-2">
            {(scheme.documents_required || [
              'Aadhaar Card',
              'ST Certificate',
              'Income Certificate',
              'Previous Year Marksheet',
              'Bank Passbook / Disbursal Details'
            ]).map((doc, idx) => {
              const docNameHi = doc === 'Aadhaar Card' ? 'आधार कार्ड' :
                                doc.includes('ST') || doc.includes('Caste') ? 'एसटी प्रमाण पत्र' :
                                doc.includes('Income') ? 'आय प्रमाण पत्र' :
                                doc.includes('Marksheet') ? 'अंकतालिका' :
                                doc.includes('Bank') ? 'बैंक पासबुक' : doc;
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0E3D2F] flex items-center justify-center text-xs">
                      📁
                    </div>
                    <span className="text-[12px] font-medium text-slate-800">{language === 'hi' ? docNameHi : doc}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {t.scholarshipDetails.digilockerReady}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="mt-6 flex flex-col space-y-2.5 pb-4">
          <button
            type="button"
            onClick={() => onNavigate('document-reuse', { scholarshipId: scheme.id })}
            className="w-full bg-[#0E3D2F] hover:bg-[#0a2d21] active:scale-[0.98] transition-all text-white text-[14px] font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>{t.scholarshipDetails.startAppBtn}</span>
            <span className="text-base">→</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('jago', { scholarshipId: scheme.id })}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-[0.98] transition-all text-slate-800 text-[13px] font-medium py-3 px-4 rounded-2xl flex items-center justify-center space-x-2"
          >
            <span>🤖</span>
            <span>{language === 'hi' ? 'इस योजना के बारे में जागो से पूछें' : 'Ask JAGO about this scheme'}</span>
          </button>
        </section>
      </div>
    </div>
  );
}
