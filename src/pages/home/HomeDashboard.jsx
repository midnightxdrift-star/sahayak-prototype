import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function HomeDashboard({ onNavigate }) {
  const { t, language } = useLanguage();
  const [student, setStudent] = useState(null);
  const [application, setApplication] = useState(null);
  const [payments, setPayments] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docFixed, setDocFixed] = useState(false); // Live fix demo state

  useEffect(() => {
    async function loadData() {
      try {
        const [studentRes, appsRes, payRes, notifsRes] = await Promise.all([
          api.getStudent(),
          api.getApplications(),
          api.getPayments(),
          api.getNotifications()
        ]);
        setStudent(studentRes);
        setApplication(appsRes && appsRes[0] ? appsRes[0] : null);
        setPayments(payRes);
        setNotifications(notifsRes);
      } catch (err) {
        console.error('Error loading home dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length || 3;
  const studentName = language === 'hi' ? 'रमेश कुमार' : (student?.name || 'Ramesh Kumar');
  const firstWord = language === 'hi' ? 'रमेश' : (studentName.split(' ')[0] || 'Ramesh');
  const progress = application?.progress_percent || 72;
  const totalReceived = payments?.total_received || 20000;
  const pending = payments?.pending_amount || 5000;

  // Progress conic value
  const conicPercent = docFixed ? 88 : progress;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 select-none relative bg-[#f7f8fc]">

      {/* Top Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0E3D2F] via-[#154f3b] to-[#0a2d21] px-5 pt-2 pb-6">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute top-8 -right-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-4 w-28 h-28 rounded-full bg-[#FBBF24]/10" />

        {/* Top Row: Greeting + Bell + Avatar */}
        <div className="flex items-center justify-between relative z-10 mb-4">
          <div>
            <p className="text-emerald-300 text-[12px] font-medium tracking-wide">
              {language === 'hi' ? '🙏 नमस्ते,' : '🙏 Namaste,'}
            </p>
            <h1 className="text-white text-[22px] font-bold tracking-tight leading-tight">
              {firstWord}
              <span className="text-emerald-300 text-xl"> 👋</span>
            </h1>
            <p className="text-emerald-400 text-[11px] font-medium mt-0.5">
              {language === 'hi' ? 'बी.टेक CSE • 3rd Year • ABC College' : 'B.Tech CSE • 3rd Year • ABC College'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9a6 6 0 01-3-5.2V9a6 6 0 0112 0v2.8A6 6 0 0115 17z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 17a2 2 0 004 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-[#0E3D2F]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-xl bg-[#FBBF24] flex items-center justify-center font-bold text-[#0E3D2F] text-sm shadow-lg active:scale-90 transition-transform"
            >
              {language === 'hi' ? 'र' : 'R'}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          <button
            type="button"
            onClick={() => onNavigate('payments')}
            className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-center active:scale-95 transition-all"
          >
            <p className="text-white text-[18px] font-extrabold tracking-tight leading-none">
              ₹{(totalReceived / 1000).toFixed(0)}K
            </p>
            <p className="text-emerald-300 text-[10px] font-medium mt-0.5">
              {language === 'hi' ? 'प्राप्त' : 'Received'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('application-tracker', { applicationId: application?.id })}
            className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-center active:scale-95 transition-all"
          >
            <p className="text-white text-[18px] font-extrabold tracking-tight leading-none">
              {docFixed ? '88%' : `${conicPercent}%`}
            </p>
            <p className="text-emerald-300 text-[10px] font-medium mt-0.5">
              {language === 'hi' ? 'प्रगति' : 'Progress'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-center active:scale-95 transition-all"
          >
            <p className={`text-[18px] font-extrabold tracking-tight leading-none ${docFixed ? 'text-[#4ADE80]' : 'text-amber-300'}`}>
              {docFixed ? '6/6' : '5/6'}
            </p>
            <p className="text-emerald-300 text-[10px] font-medium mt-0.5">
              {language === 'hi' ? 'दस्तावेज़' : 'Docs'}
            </p>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pt-4 space-y-3.5">

        {/* Action Needed Banner (or Success) */}
        {!docFixed ? (
          <div
            onClick={() => onNavigate('documents')}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-amber-300 active:scale-[0.99] transition-all shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-bold text-amber-800">
                    {language === 'hi' ? 'कार्रवाई आवश्यक' : 'Action Needed'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <p className="text-[11.5px] text-slate-600 leading-snug mt-0.5 truncate">
                  {language === 'hi' ? 'आय प्रमाण पत्र नवीनीकृत करें — भुगतान रुका है' : 'Renew Income Certificate — payment on hold'}
                </p>
              </div>
            </div>
            <span className="text-[11.5px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1.5 rounded-xl border border-amber-200 shrink-0 ml-2">
              {language === 'hi' ? 'ठीक करें →' : 'Fix →'}
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-emerald-800">
                {language === 'hi' ? 'सभी दस्तावेज़ सत्यापित! 🎉' : 'All Documents Verified! 🎉'}
              </p>
              <p className="text-[11.5px] text-emerald-700 mt-0.5">
                {language === 'hi' ? 'आपका आवेदन अब पूरी तरह तैयार है।' : 'Your application is now fully ready.'}
              </p>
            </div>
          </div>
        )}

        {/* Application Status Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Card top label */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-1">
            <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'मेरा आवेदन' : 'My Application'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('application-details', { applicationId: application?.id })}
              className="text-[11px] font-semibold text-[#0E3D2F] hover:underline"
            >
              {language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
            </button>
          </div>

          <div
            onClick={() => onNavigate('application-tracker', { applicationId: application?.id })}
            className="px-4 pb-4 pt-2 cursor-pointer active:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
                  {language === 'hi' ? 'पोस्ट-मैट्रिक छात्रवृत्ति' : (application?.scholarship_name || 'Post-Matric Scholarship')}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {application?.id || 'MOTA-PMS-2026-00124'}
                </p>

                {/* Status Pill */}
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {language === 'hi' ? 'स्वीकृति प्रक्रियाधीन' : 'Sanction In Progress'}
                  </span>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="23" fill="none" stroke="#E5E7EB" strokeWidth="5" />
                  <circle
                    cx="28" cy="28" r="23" fill="none"
                    stroke="#0E3D2F" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 23 * conicPercent / 100} 999`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-extrabold text-slate-900">{conicPercent}%</span>
                </div>
              </div>
            </div>

            {/* Milestone Bar */}
            <div className="mt-4 relative">
              <div className="absolute top-3 left-2 right-2 h-0.5 bg-emerald-600 -z-0" />
              <div className="relative flex justify-between">
                {[
                  { label: language === 'hi' ? 'जमा' : 'Submitted', done: true },
                  { label: language === 'hi' ? 'सत्यापित' : 'Verified', done: true },
                  { label: language === 'hi' ? 'संस्थान' : 'Institute', done: true },
                  { label: language === 'hi' ? 'स्वीकृति' : 'Sanction', done: false, current: true },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm ${
                      step.done
                        ? 'bg-[#0E3D2F] text-white'
                        : step.current
                          ? 'bg-white border-2 border-[#0E3D2F] text-[#0E3D2F]'
                          : 'bg-slate-200 text-slate-400'
                    }`}>
                      {step.done ? '✓' : step.current ? '●' : ''}
                    </div>
                    <span className={`text-[9px] font-medium ${step.current ? 'text-[#0E3D2F] font-bold' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions — 4 in a 2x2 grid */}
        <div>
          <h2 className="text-[13px] font-bold text-slate-700 mb-2.5 px-0.5">
            {language === 'hi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                label: language === 'hi' ? 'आवेदन ट्रैक करें' : 'Track Application',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                bg: 'bg-emerald-50',
                iconColor: 'text-emerald-700',
                accent: 'border-emerald-100',
                action: () => onNavigate('application-tracker', { applicationId: application?.id }),
                badge: language === 'hi' ? 'स्वीकृति' : 'Sanction',
                badgeColor: 'bg-emerald-100 text-emerald-800',
              },
              {
                label: language === 'hi' ? 'डीबीटी भुगतान' : 'DBT Payments',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                bg: 'bg-blue-50',
                iconColor: 'text-blue-700',
                accent: 'border-blue-100',
                action: () => onNavigate('payments'),
                badge: `₹${(totalReceived / 1000).toFixed(0)}K`,
                badgeColor: 'bg-blue-100 text-blue-800',
              },
              {
                label: language === 'hi' ? 'दस्तावेज़ वॉलेट' : 'Document Wallet',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
                bg: docFixed ? 'bg-emerald-50' : 'bg-amber-50',
                iconColor: docFixed ? 'text-emerald-700' : 'text-amber-700',
                accent: docFixed ? 'border-emerald-100' : 'border-amber-100',
                action: () => onNavigate('documents'),
                badge: docFixed ? '6/6 ✓' : (language === 'hi' ? '⚠ कार्रवाई' : '⚠ Action'),
                badgeColor: docFixed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
              },
              {
                label: language === 'hi' ? 'छात्रवृत्तियां खोजें' : 'Explore Scholarships',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                  </svg>
                ),
                bg: 'bg-purple-50',
                iconColor: 'text-purple-700',
                accent: 'border-purple-100',
                action: () => onNavigate('scholarships'),
                badge: language === 'hi' ? '5 खुले' : '5 Open',
                badgeColor: 'bg-purple-100 text-purple-800',
              },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className={`${item.bg} border ${item.accent} rounded-2xl p-3.5 flex flex-col gap-2.5 text-left active:scale-[0.97] transition-all shadow-xs hover:shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <span className="text-[12.5px] font-semibold text-slate-800 leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Status Mini Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-slate-700">
              {language === 'hi' ? 'भुगतान स्थिति' : 'Payment Status'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('payments')}
              className="text-[11px] font-semibold text-[#0E3D2F] hover:underline"
            >
              {language === 'hi' ? 'सभी देखें →' : 'View All →'}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {['Jun', 'Jul', 'Aug', 'Sep'].map((month, i) => {
              const isDisbursed = i < 3;
              const isPending = i === 3;
              return (
                <div key={month} className={`rounded-xl p-2 text-center ${isDisbursed ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 text-[10px] font-bold ${isDisbursed ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-white'}`}>
                    {isDisbursed ? '✓' : '⏳'}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-600">{month}</p>
                  <p className={`text-[9px] font-medium ${isDisbursed ? 'text-emerald-700' : 'text-amber-700'}`}>
                    ₹5K
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
            <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-[11px] text-amber-800 font-medium">
              {language === 'hi' ? 'September की किस्त सत्यापन में है' : 'September installment under verification'}
            </p>
          </div>
        </div>

        {/* JAGO Banner */}
        <button
          type="button"
          onClick={() => onNavigate('jago')}
          className="w-full bg-gradient-to-r from-[#0E3D2F] via-[#145d41] to-[#0a2d21] rounded-2xl p-4 text-white flex items-center justify-between shadow-md active:scale-[0.99] transition-all"
        >
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FBBF24] text-[#0E3D2F] text-[10px] font-bold">
                {language === 'hi' ? 'एआई' : 'AI'}
              </span>
              <span className="text-[11px] font-medium text-emerald-200">
                {language === 'hi' ? 'जागो सहायक' : 'JAGO Assistant'}
              </span>
            </div>
            <h3 className="text-[15px] font-bold leading-tight">
              {language === 'hi' ? 'सवाल है? मुझसे पूछें!' : 'Have a question? Ask me!'}
            </h3>
            <p className="text-[11px] text-emerald-200 leading-snug">
              {language === 'hi'
                ? 'दस्तावेज़, भुगतान, स्थिति — हिंदी में जवाब पाएं'
                : 'Docs, payments, status — plain language answers'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 ml-3 p-1">
            <img src="/assets/jago-avatar.png" alt="JAGO" className="w-11 h-11 object-contain drop-shadow-md" />
          </div>
        </button>

        {/* Recent Notifications Preview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-slate-50">
            <h2 className="text-[13px] font-bold text-slate-700">
              {language === 'hi' ? 'हालिया सूचनाएं' : 'Recent Notifications'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="text-[11px] font-semibold text-[#0E3D2F] hover:underline"
            >
              {language === 'hi' ? 'सभी देखें →' : 'View All →'}
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {(notifications.length > 0 ? notifications.slice(0, 3) : [
              { id: 'n1', title: language === 'hi' ? 'आय प्रमाण पत्र नवीनीकरण' : 'Income Certificate Renewal', message: language === 'hi' ? '31 अक्टूबर से पहले अपलोड करें' : 'Upload before 31 October', timestamp: '2 hrs ago', is_read: false, category: 'deadlines' },
              { id: 'n2', title: language === 'hi' ? 'राज्य सत्यापन पूर्ण' : 'State Verification Complete', message: language === 'hi' ? 'आपका आवेदन राज्य से पास हो गया' : 'Application cleared state level', timestamp: '15 Jul', is_read: true, category: 'status' },
            ]).map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNavigate('notifications')}
                className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.is_read ? '' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.category === 'deadlines' ? 'bg-amber-50 text-amber-600' :
                  notif.category === 'payments' ? 'bg-green-50 text-green-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <span className="text-xs">
                    {notif.category === 'deadlines' ? '⚠' : notif.category === 'payments' ? '₹' : '✓'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-900 truncate">{notif.title}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{notif.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#0E3D2F]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MoTA Gov Badge */}
        <div className="flex items-center justify-center gap-2 py-1 pb-2">
          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
            🇮🇳
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {language === 'hi' ? 'जनजातीय कार्य मंत्रालय — PFMS / DBT प्रत्यक्ष भुगतान' : 'Ministry of Tribal Affairs — PFMS / DBT Direct Transfer'}
          </p>
        </div>

      </div>
    </div>
  );
}
