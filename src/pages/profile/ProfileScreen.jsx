import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { BottomSheet, Toast } from '../../components/ui/Overlays';

const STUDENT_INFO = {
  name: 'Ramesh Kumar',
  nameHi: 'रमेश कुमार',
  id: 'ST202600124',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@example.com',
  dob: '14 Mar 2002',
  dobHi: '14 मार्च 2002',
  state: 'Madhya Pradesh',
  stateHi: 'मध्य प्रदेश',
  district: 'Balaghat',
  districtHi: 'बालाघाट',
  community: 'Scheduled Tribe (Gond)',
  communityHi: 'अनुसूचित जनजाति (गोंड)',
  college: 'ABC College of Technology',
  collegeHi: 'ABC कॉलेज ऑफ टेक्नोलॉजी',
  course: 'B.Tech Computer Science & Engineering',
  courseHi: 'बी.टेक कंप्यूटर साइंस',
  year: '3rd Year (2026–27)',
  yearHi: 'तृतीय वर्ष (2026-27)',
  aadhaar: '•••• •••• 4029',
  bank: 'State Bank of India — •••• 6712',
  bankHi: 'भारतीय स्टेट बैंक — •••• 6712',
};

export default function ProfileScreen({ onNavigate, onLogout }) {
  const { t, language, setLanguage } = useLanguage();
  const [student, setStudent] = useState(null);
  const [personalSheetOpen, setPersonalSheetOpen] = useState(false);
  const [aboutSheetOpen, setAboutSheetOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await api.getStudent();
        setStudent(data);
      } catch (err) {
        console.error('Error loading student profile:', err);
      }
    }
    loadStudent();
  }, []);

  const showToast = (msg, type = 'info') => setToast({ msg, type });

  const menuItems = [
    {
      icon: '👤',
      bg: 'bg-emerald-50',
      label: t.profile.menu.personal,
      sub: t.profile.menu.personalSub,
      action: () => setPersonalSheetOpen(true),
    },
    {
      icon: '📋',
      bg: 'bg-blue-50',
      label: t.profile.menu.history,
      sub: t.profile.menu.historySub,
      action: () => onNavigate('application-details'),
    },
    {
      icon: '📁',
      bg: 'bg-amber-50',
      label: t.profile.menu.docs,
      sub: t.profile.menu.docsSub,
      action: () => onNavigate('documents'),
    },
    {
      icon: '💳',
      bg: 'bg-purple-50',
      label: t.profile.menu.payments,
      sub: t.profile.menu.paymentsSub,
      action: () => onNavigate('payments'),
    },
    {
      icon: '🎓',
      bg: 'bg-indigo-50',
      label: language === 'hi' ? 'छात्रवृत्तियां' : 'Scholarships',
      sub: language === 'hi' ? '5 योजनाएं खुली हैं' : '5 schemes currently open',
      action: () => onNavigate('scholarships'),
    },
    {
      icon: '🤝',
      bg: 'bg-teal-50',
      label: t.profile.menu.support,
      sub: t.profile.menu.supportSub,
      action: () => showToast(language === 'hi' ? 'टोल-फ्री: 1800-11-8002 • सोम-शुक्र 9am–6pm' : 'Toll-free: 1800-11-8002 • Mon–Fri 9am–6pm', 'info'),
    },
    {
      icon: 'ℹ',
      bg: 'bg-slate-100',
      label: t.profile.menu.about,
      sub: t.profile.menu.aboutSub,
      action: () => setAboutSheetOpen(true),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 select-none bg-[#f7f8fc]">

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Personal Details BottomSheet */}
      <BottomSheet
        open={personalSheetOpen}
        onClose={() => setPersonalSheetOpen(false)}
        title={language === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details'}
      >
        <div className="px-5 pb-8 pt-2 space-y-4">
          {/* Avatar Header */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-[#0E3D2F] flex items-center justify-center text-white text-2xl font-bold">
              {language === 'hi' ? 'र' : 'R'}
            </div>
            <div>
              <p className="text-[16px] font-bold text-slate-900">
                {language === 'hi' ? STUDENT_INFO.nameHi : STUDENT_INFO.name}
              </p>
              <p className="text-[12px] text-slate-500 font-mono">{STUDENT_INFO.id}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                ✓ {language === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          {[
            { label: language === 'hi' ? 'मोबाइल' : 'Mobile', value: STUDENT_INFO.phone },
            { label: language === 'hi' ? 'जन्म तिथि' : 'Date of Birth', value: language === 'hi' ? STUDENT_INFO.dobHi : STUDENT_INFO.dob },
            { label: language === 'hi' ? 'राज्य' : 'State', value: language === 'hi' ? STUDENT_INFO.stateHi : STUDENT_INFO.state },
            { label: language === 'hi' ? 'जिला' : 'District', value: language === 'hi' ? STUDENT_INFO.districtHi : STUDENT_INFO.district },
            { label: language === 'hi' ? 'समुदाय' : 'Community', value: language === 'hi' ? STUDENT_INFO.communityHi : STUDENT_INFO.community },
            { label: language === 'hi' ? 'कॉलेज' : 'College', value: language === 'hi' ? STUDENT_INFO.collegeHi : STUDENT_INFO.college },
            { label: language === 'hi' ? 'पाठ्यक्रम' : 'Course', value: language === 'hi' ? STUDENT_INFO.courseHi : STUDENT_INFO.course },
            { label: language === 'hi' ? 'वर्ष' : 'Year', value: language === 'hi' ? STUDENT_INFO.yearHi : STUDENT_INFO.year },
            { label: language === 'hi' ? 'आधार' : 'Aadhaar', value: STUDENT_INFO.aadhaar },
            { label: language === 'hi' ? 'बैंक खाता' : 'Bank Account', value: language === 'hi' ? STUDENT_INFO.bankHi : STUDENT_INFO.bank },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0 gap-3">
              <span className="text-[11.5px] text-slate-400 font-medium min-w-[90px]">{item.label}</span>
              <span className="text-[12.5px] font-semibold text-slate-800 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* About BottomSheet */}
      <BottomSheet
        open={aboutSheetOpen}
        onClose={() => setAboutSheetOpen(false)}
        title={language === 'hi' ? 'सहायक के बारे में' : 'About Sahayak'}
      >
        <div className="px-5 pb-8 pt-2 space-y-4">
          <div className="flex flex-col items-center text-center py-4">
            <img
              src="/assets/sahayak-logo.png"
              alt="Sahayak"
              className="h-16 w-auto object-contain mb-1 drop-shadow-sm"
            />
            <p className="text-[12px] text-slate-500 mt-1">
              {language === 'hi' ? 'आपका एकीकृत छात्रवृत्ति मंच' : 'Your Unified Scholarship Platform'}
            </p>
            <span className="mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-full">v1.0.0 Prototype</span>
          </div>
          {[
            { label: language === 'hi' ? 'विकसित' : 'Developed by', value: language === 'hi' ? 'जनजातीय कार्य मंत्रालय (MoTA)' : 'Ministry of Tribal Affairs (MoTA)' },
            { label: 'Platform', value: 'PFMS / DBT Direct Transfer' },
            { label: language === 'hi' ? 'संस्करण' : 'Version', value: '1.0.0 (Hackathon Prototype)' },
            { label: language === 'hi' ? 'हेल्पलाइन' : 'Helpline', value: '1800-11-8002 (Toll-free)' },
            { label: 'Website', value: 'tribal.gov.in' },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0 gap-3">
              <span className="text-[11.5px] text-slate-400 font-medium">{item.label}</span>
              <span className="text-[12.5px] font-semibold text-slate-800 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#0E3D2F] to-[#145d41] px-5 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-bold text-white">{t.profile.title}</h1>
          {/* Language Toggle */}
          <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/20">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                language === 'en' ? 'bg-white text-[#0E3D2F] shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                language === 'hi' ? 'bg-white text-[#0E3D2F] shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white/10 rounded-2xl p-3.5 flex items-center gap-3.5 border border-white/10">
          <div className="w-14 h-14 rounded-xl bg-[#FBBF24] flex items-center justify-center text-[#0E3D2F] text-2xl font-bold shrink-0">
            {language === 'hi' ? 'र' : 'R'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-white truncate">
                {language === 'hi' ? STUDENT_INFO.nameHi : (student?.name || STUDENT_INFO.name)}
              </h2>
              <span className="px-1.5 py-0.5 rounded bg-[#FBBF24] text-[#0E3D2F] text-[9px] font-bold shrink-0">ST</span>
            </div>
            <p className="text-[11px] text-emerald-200 font-mono mt-0.5">{STUDENT_INFO.id}</p>
            <p className="text-[11.5px] text-emerald-300 truncate mt-0.5">
              {language === 'hi'
                ? `${STUDENT_INFO.courseHi} • ${STUDENT_INFO.collegeHi}`
                : `${student?.course || 'B.Tech CSE'} • ${student?.college || 'ABC College'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pt-4 space-y-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={item.action}
            className="w-full bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center gap-3 text-left active:scale-[0.99] hover:border-slate-200 transition-all"
          >
            <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center text-lg shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900">{item.label}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.sub}</p>
            </div>
            <span className="text-slate-300 text-base shrink-0">›</span>
          </button>
        ))}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full mt-2 bg-red-50 border border-red-200 text-red-600 py-3 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
        >
          <span>🚪</span>
          <span>{t.profile.logout}</span>
        </button>

        <p className="text-[10px] text-center text-slate-300 font-medium pb-2 pt-1">
          {t.profile.demoTag}
        </p>
      </div>
    </div>
  );
}
