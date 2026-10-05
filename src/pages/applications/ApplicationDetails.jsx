import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function ApplicationDetails({ applicationId = 'MOTA-PMS-2026-00124', onBack, onNavigate }) {
  const { t, language } = useLanguage();
  const [app, setApp] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApp() {
      try {
        const data = await api.getApplicationById(applicationId);
        setApp(data);
      } catch (err) {
        console.error("Error loading application details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[#fbfcfd] p-6 text-center">
        <div className="w-7 h-7 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#fbfcfd] space-y-3">
        <span className="material-symbols-outlined text-[40px] text-slate-300">folder_off</span>
        <h2 className="text-base font-bold text-slate-800">Application Not Found</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          The requested application records could not be found.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#1b5e40] text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          {t.common.back}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#fbfcfd] select-none relative overflow-hidden">
      {/* Top App Bar with Segments */}
      <section className="px-5 pt-2 pb-3 flex flex-col gap-3 bg-[#fbfcfd] shrink-0 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1 -ml-1 text-slate-800 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5 stroke-[2.2] stroke-current" fill="none" viewBox="0 0 24 24">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-[#0f2439] tracking-tight">{t.applicationDetails.title}</h1>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('application-tracker', { applicationId: app.id })}
            className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
          >
            {t.applicationDetails.trackerPill}
          </button>
        </div>

        {/* Segmented Tab Bar */}
        <nav aria-label="Application tabs" className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
              activeTab === 'overview'
                ? 'bg-[#1b5e40] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.applicationDetails.tabs.overview}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
              activeTab === 'verification'
                ? 'bg-[#1b5e40] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.applicationDetails.tabs.verification}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
              activeTab === 'documents'
                ? 'bg-[#1b5e40] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.applicationDetails.tabs.documents}
          </button>
        </nav>
      </section>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 pb-20 no-scrollbar">
        {activeTab === 'overview' && (
          <>
            {/* Student Details Section */}
            <section className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-[#0d2137]">{t.applicationDetails.studentDetailsTitle}</h2>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {t.common.verified}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center text-[#2563eb]">
                    👤
                  </div>
                  <div>
                    <span className="text-[14px] font-bold text-[#0d2137] block">
                      {language === 'hi' ? 'रमेश कुमार' : (app.student_details?.name || "Ramesh Kumar")}
                    </span>
                    <span className="text-[12px] text-slate-500 font-medium">
                      {app.student_details?.student_id || "ST202600124"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center text-[#2563eb]">
                    🎓
                  </div>
                  <div>
                    <span className="text-[13px] font-bold text-[#0d2137] block">
                      {language === 'hi' ? 'बी.टेक कंप्यूटर साइंस' : (app.student_details?.course || "B.Tech Computer Science")}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {language === 'hi' ? 'एबीसी प्रौद्योगिकी कॉलेज' : (app.student_details?.college || "ABC College of Technology")}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Scheme & Stage Card */}
            <section className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-xs space-y-3">
              <h2 className="text-[15px] font-bold text-[#0d2137]">{language === 'hi' ? 'छात्रवृत्ति सारांश' : 'Scholarship Summary'}</h2>
              
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500">{language === 'hi' ? 'योजना का नाम' : 'Scheme Name'}</span>
                <span className="text-xs font-bold text-slate-900">{language === 'hi' ? 'पोस्ट-मैट्रिक छात्रवृत्ति' : app.scholarship_name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500">{language === 'hi' ? 'आवेदन संख्या' : 'Application ID'}</span>
                <span className="text-xs font-mono text-slate-800">{app.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500">{language === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'}</span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {language === 'hi' ? 'सत्यापन पूर्ण' : app.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-slate-500">{language === 'hi' ? 'स्वीकृति चरण' : 'Sanction State'}</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {language === 'hi' ? 'स्वीकृति प्रक्रियाधीन' : `${app.sanction_status} (In Process)`}
                </span>
              </div>
            </section>
          </>
        )}

        {activeTab === 'verification' && (
          <section className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-xs space-y-3">
            <h2 className="text-[15px] font-bold text-[#0d2137]">{t.applicationDetails.verificationChecklistTitle}</h2>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{language === 'hi' ? 'संस्थान स्तर सत्यापन' : 'Institute Level'}</span>
                    <span className="text-[11px] text-slate-500">{language === 'hi' ? '2 जुलाई 2026 को स्वीकृत' : 'Approved on 2 Jul 2026'}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800">{language === 'hi' ? 'सत्यापित' : 'Passed'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{language === 'hi' ? 'राज्य कल्याण विभाग' : 'State Welfare Dept'}</span>
                    <span className="text-[11px] text-slate-500">{language === 'hi' ? '15 जुलाई 2026 को स्वीकृत' : 'Approved on 15 Jul 2026'}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800">{language === 'hi' ? 'सत्यापित' : 'Passed'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">···</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{language === 'hi' ? 'मंत्रालय स्वीकृति आदेश' : 'Ministry Sanction Order'}</span>
                    <span className="text-[11px] text-amber-800">{language === 'hi' ? 'धन आवंटन प्रतीक्षित' : 'Awaiting fund allocation'}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-800">{t.common.pending}</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'documents' && (
          <section className="bg-white rounded-2xl p-4 border border-slate-100/80 shadow-xs space-y-2.5">
            <h2 className="text-[15px] font-bold text-[#0d2137]">{t.applicationDetails.submittedDocsTitle}</h2>
            
            {app.submitted_documents?.map((doc, idx) => {
              const docNameHi = doc.name === 'Aadhaar Card' ? 'आधार कार्ड' :
                                doc.name === 'Tribal Caste Certificate' ? 'जाति प्रमाण पत्र' :
                                doc.name === 'Income Certificate' ? 'आय प्रमाण पत्र' :
                                doc.name === 'Bonafide Certificate' ? 'बोनाफाइड प्रमाण पत्र' : doc.name;
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{language === 'hi' ? docNameHi : doc.name}</span>
                    <span className="text-[11px] text-slate-500">{doc.doc_ref}</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status === 'Verified' ? t.common.verified : t.common.pending}
                  </span>
                </div>
              );
            })}
          </section>
        )}

        {/* View Full Timeline Button */}
        <button
          type="button"
          onClick={() => onNavigate('application-tracker', { applicationId: app.id })}
          className="w-full bg-[#0E3D2F] hover:bg-[#092b21] active:scale-95 text-white py-3.5 rounded-2xl text-xs font-semibold shadow-xs transition-all"
        >
          {t.applicationDetails.openTrackerBtn}
        </button>
      </div>
    </div>
  );
}
