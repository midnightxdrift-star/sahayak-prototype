import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SplashScreen({ onProceed }) {
  const { t, language, setLanguage } = useLanguage();

  const isHindi = language === 'hi';

  const toggleLanguage = () => {
    setLanguage(isHindi ? 'en' : 'hi');
  };

  return (
    <div
      className="flex-1 flex flex-col justify-between text-center select-none bg-[#FCFBF8] relative overflow-hidden h-full"
      data-purpose="sahayak-splash-screen"
    >
      {/* Subtle watercolor ambient glow in corners */}
      <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#E8F5EE]/40 blur-2xl pointer-events-none" />
      <div className="absolute top-12 -right-10 w-40 h-40 rounded-full bg-[#FEF3C7]/35 blur-2xl pointer-events-none" />

      {/* TOP HEADER: Language Switcher Pill */}
      <div className="relative z-20 px-5 pt-2 pb-1 flex justify-end shrink-0">
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-slate-200/90 shadow-2xs text-slate-700 text-[11.5px] font-semibold active:scale-95 transition-all"
        >
          <span className="text-xs">文A</span>
          <span>{isHindi ? 'हिंदी ⌵' : 'English ⌵'}</span>
        </button>
      </div>

      {/* SCROLLABLE / FLEXIBLE CONTENT AREA */}
      <div className="relative z-10 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">

        {/* 1. BRAND LOGO & SUBTITLE */}
        <section className="flex flex-col items-center pt-0 px-6 shrink-0" data-purpose="brand-header">
          <img
            src="/assets/sahayak-logo.png"
            alt="Sahayak Logo"
            className="h-16 w-auto object-contain drop-shadow-xs"
          />
          <p className="text-[12px] font-semibold text-[#4B6358] tracking-tight mt-0.5">
            {t.splash.tagline}
          </p>
        </section>

        {/* 2. TYPOGRAPHIC HEADLINE (Your education. Your opportunity. Your future.) */}
        <section className="px-6 pt-3 pb-2 shrink-0" data-purpose="core-value-proposition">
          <div className="text-center">
            <h1 className="text-[25px] sm:text-[27px] font-black text-[#0D382A] tracking-tight leading-tight">
              {isHindi ? 'आपकी शिक्षा।' : 'Your education.'}
            </h1>
            <h1 className="text-[25px] sm:text-[27px] font-black text-[#E65100] tracking-tight leading-tight mt-0.5">
              {isHindi ? 'आपका अवसर।' : 'Your opportunity.'}
            </h1>
            <h1 className="text-[25px] sm:text-[27px] font-black text-[#0D382A] tracking-tight leading-tight mt-0.5">
              {isHindi ? 'आपका भविष्य।' : 'Your future.'}
            </h1>
          </div>
          <p className="text-[12px] sm:text-[12.5px] text-slate-600 font-medium tracking-tight mt-1.5 max-w-[280px] mx-auto leading-snug">
            {isHindi
              ? 'छात्रवृत्तियां, दस्तावेज़ एवं मार्गदर्शन — सब एक ही स्थान पर।'
              : 'Scholarships, documents and guidance — all in one place.'}
          </p>
        </section>

        {/* 3. THREE FEATURE PILLARS (3 Columns with vertical dividers) */}
        <section className="px-4 py-2 shrink-0" data-purpose="three-pillars">
          <div className="flex items-center justify-around max-w-[340px] mx-auto">
            {/* Pillar 1: Find Scholarships */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/90 flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L2 8.5l10 5.5 10-5.5L12 3z" fill="#059669" />
                  <path d="M6 10.8V16c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5.2" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22 8.5v7" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="22" cy="15.5" r="1.5" fill="#047857" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-700 tracking-tight leading-tight mt-1.5">
                {isHindi ? 'छात्रवृत्तियां' : 'Find Scholarships'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-8 bg-slate-200/90 self-center" />

            {/* Pillar 2: Manage Documents */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200/90 flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3h8l5 5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.8" />
                  <path d="M14 3v5h5" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M8 12h5M8 15h7M8 18h4" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="17.5" cy="17.5" r="3.5" fill="#10B981" />
                  <path d="M16 17.5l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-700 tracking-tight leading-tight mt-1.5">
                {isHindi ? 'दस्तावेज़' : 'Manage Documents'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-8 bg-slate-200/90 self-center" />

            {/* Pillar 3: Get Guidance */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-emerald-50/70 border border-emerald-200/90 flex items-center justify-center shadow-xs p-1">
                <img
                  src="/assets/jago-avatar.png"
                  alt="JAGO AI"
                  className="w-7 h-7 object-contain drop-shadow-xs"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 tracking-tight leading-tight mt-1.5">
                {isHindi ? 'मार्गदर्शन' : 'Get Guidance'}
              </span>
            </div>
          </div>
        </section>

        {/* 4. HERO PHOTO (Tribal Students with Laptop & Village Backdrop) */}
        <section className="w-full px-0 mt-1 shrink-0 overflow-hidden" data-purpose="hero-illustration">
          <img
            src="/assets/splash-hero.png"
            alt="Students studying with Sahayak"
            className="w-full h-auto max-h-[220px] sm:max-h-[240px] object-contain"
          />
        </section>

        {/* 5. BOTTOM ACTION: Button + Dots + Warli Border */}
        <section className="w-full pt-3 pb-1 px-6 shrink-0 flex flex-col items-center" data-purpose="bottom-cta">
          {/* Large Pill CTA Button */}
          <button
            type="button"
            onClick={onProceed}
            className="w-[86%] max-w-[320px] bg-[#0E3D2F] hover:bg-[#092b21] active:scale-[0.97] text-white font-bold py-3.5 px-6 rounded-full shadow-md transition-all flex items-center justify-center space-x-2 text-[15px] tracking-wide"
          >
            <span>{isHindi ? 'शुरू करें' : 'Get Started'}</span>
            <span className="text-base font-bold">→</span>
          </button>

          {/* 3 Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-1">
            <span className="w-5 h-1.5 rounded-full bg-[#0E3D2F]" />
            <span className="w-2.5 h-1.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-1.5 rounded-full bg-slate-300" />
          </div>
        </section>

      </div>

      {/* Traditional Tribal Warli Art Border at the Very Bottom */}
      <div className="w-full h-4 overflow-hidden opacity-50 shrink-0 select-none pointer-events-none">
        <img
          src="/assets/warli-border.png"
          alt="Warli Border"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
}
