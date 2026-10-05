import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function ApplicationTracker({ applicationId = 'MOTA-PMS-2026-00124', onBack, onNavigate }) {
  const { t, language } = useLanguage();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracker() {
      try {
        const data = await api.getApplicationById(applicationId);
        setApp(data);
      } catch (err) {
        console.error("Error loading application tracker:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTracker();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[#f7f8fc] p-6 text-center">
        <div className="w-7 h-7 border-2 border-[#0E3D2F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#f7f8fc] space-y-3">
        <span className="text-4xl text-slate-300">📊</span>
        <h2 className="text-base font-bold text-slate-800">
          {language === 'hi' ? 'ट्रैकर उपलब्ध नहीं है' : 'Tracker Unavailable'}
        </h2>
        <p className="text-xs text-slate-500 max-w-xs">
          {language === 'hi' ? 'इस आवेदन के सत्यापन चरण नहीं मिले।' : 'Unable to locate the verification milestones for this application.'}
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
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-90 transition-transform"
          >
            <svg className="w-5 h-5 stroke-[2.2] stroke-current fill-none" viewBox="0 0 24 24">
              <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-xs font-bold text-[#0E3D2F] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {language === 'hi' ? 'सक्रिय आवेदन' : 'Active Application'}
          </span>
        </div>

        <div className="mt-2">
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight leading-tight">
            {t.tracker.title}
          </h1>
          <p className="text-[14px] font-semibold text-[#0E3D2F] mt-0.5">
            {language === 'hi' ? 'पोस्ट-मैट्रिक छात्रवृत्ति' : app.scholarship_name}
          </p>
          <p className="text-[11.5px] font-mono text-slate-400 mt-0.5">
            {app.id}
          </p>
        </div>
      </div>

      {/* Main Vertical Timeline Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col justify-start space-y-3">

        {/* Current Stage Highlight Banner */}
        <div className="bg-gradient-to-r from-[#0E3D2F] to-[#154f3b] rounded-2xl p-4 text-white shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
              {language === 'hi' ? 'वर्तमान स्थिति' : 'CURRENT STATUS'}
            </span>
            <span className="text-[11px] font-bold bg-[#FBBF24] text-[#0E3D2F] px-2 py-0.5 rounded-full">
              {app.progress_percent || 72}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
            </span>
          </div>
          <h2 className="text-[16px] font-bold">
            {language === 'hi' ? 'स्वीकृति प्रक्रियाधीन (Sanction Process)' : 'Sanction Process (Underway)'}
          </h2>
          <p className="text-[11.5px] text-emerald-100 mt-1 leading-snug">
            {language === 'hi'
              ? 'राज्य स्तर से अनुमोदित। मंत्रालय द्वारा निधि आवंटन आदेश तैयार किया जा रहा है।'
              : 'Approved at state level. Ministry fund sanction batch order is in progress.'}
          </p>
        </div>

        {/* Action Needed Card if any */}
        <div
          onClick={() => onNavigate('documents')}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-[12px] font-bold text-amber-900">
                {language === 'hi' ? 'भुगतान हेतु आय प्रमाण पत्र नवीनीकृत करें' : 'Renew Income Certificate for payment'}
              </p>
              <p className="text-[10.5px] text-amber-700">
                {language === 'hi' ? 'वॉलेट में जाकर एक क्लिक में अपडेट करें' : 'Update in Document Wallet'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-lg">
            {language === 'hi' ? 'ठीक करें →' : 'Fix →'}
          </span>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <h2 className="text-[13px] font-bold text-slate-800 mb-3 px-1">
            {language === 'hi' ? 'सत्यापन के 6 चरण' : '6 Verification Stages'}
          </h2>
          <section aria-label="Application Progress Timeline" className="relative pl-1">
            {app.stages?.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isActive = stage.status === 'active';
              const isLast = idx === app.stages.length - 1;

              return (
                <div key={stage.stage_id} className="relative flex items-start group">
                  {/* Timeline vertical connector line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[13px] top-[26px] bottom-0 w-[2px] ${
                        isCompleted ? 'bg-[#0E3D2F]' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Node icon */}
                  <div className="relative z-10 shrink-0">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-[#0E3D2F] flex items-center justify-center shadow-xs">
                        <svg className="w-3.5 h-3.5 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : isActive ? (
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0E3D2F] flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0E3D2F] animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-[1.8px] border-slate-300 flex items-center justify-center" />
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="ml-3.5 pb-5 pt-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-[13.5px] font-bold leading-snug ${isActive ? 'text-[#0E3D2F]' : 'text-slate-800'}`}>
                        {language === 'hi' ? (
                          stage.name === 'Application submitted' ? 'आवेदन जमा किया' :
                          stage.name === 'Document verification' ? 'दस्तावेज़ सत्यापन' :
                          stage.name === 'Institute verification' ? 'संस्थान स्तर सत्यापन' :
                          stage.name === 'State verification' ? 'राज्य सत्यापन' :
                          stage.name === 'Sanction' ? 'स्वीकृति प्रक्रिया' :
                          stage.name === 'Payment' ? 'डीबीटी प्रत्यक्ष भुगतान' : stage.name
                        ) : stage.name}
                      </h3>
                      {isActive && (
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                          {language === 'hi' ? 'प्रक्रियाधीन' : 'In Progress'}
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] mt-0.5 ${isActive ? 'text-[#0E3D2F] font-semibold' : 'text-slate-400'}`}>
                      {stage.date}
                    </p>
                    <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        {/* Info Callout Card */}
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center space-x-2.5">
          <span className="text-emerald-700 text-lg">🔔</span>
          <p className="text-[12px] font-medium text-emerald-800 tracking-tight leading-snug">
            {t.tracker.notifyNotice}
          </p>
        </div>

        {/* Ask JAGO CTA */}
        <button
          type="button"
          onClick={() => onNavigate('jago', { applicationId: app.id })}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-[#0E3D2F] flex items-center justify-center space-x-2 shadow-xs active:scale-[0.99] transition-all"
        >
          <span>🤖</span>
          <span>{t.tracker.askJagoBtn}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
