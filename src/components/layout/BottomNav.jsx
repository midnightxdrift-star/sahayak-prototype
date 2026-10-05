import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function BottomNav({ activeTab, onTabChange }) {
  const { t } = useLanguage();

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100/90 z-30 select-none shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      data-purpose="persistent-bottom-nav"
    >
      <div className="flex items-center justify-around relative h-[60px] px-2">

        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeTab === 'home' ? 'text-[#0E3D2F]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={activeTab === 'home' ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.25L12 3l9 7.25V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.75z" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold' : 'font-medium'} tracking-tight`}>
            {t.nav.home}
          </span>
        </button>

        {/* Tab 2: Scholarships */}
        <button
          type="button"
          onClick={() => onTabChange('scholarships')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeTab === 'scholarships' ? 'text-[#0E3D2F]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'scholarships' ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'scholarships' ? 'font-bold' : 'font-medium'} tracking-tight`}>
            {t.nav.scholarships}
          </span>
        </button>

        {/* Tab 3: JAGO Center Button (Highlighted Avatar with Mint Glow Ring) */}
        <div className="flex flex-col items-center justify-center relative" style={{ flex: '0 0 76px' }}>
          <button
            type="button"
            onClick={() => onTabChange('jago')}
            aria-label="JAGO AI Assistant"
            className={`w-12 h-12 -mt-4 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90 transition-all ${
              activeTab === 'jago'
                ? 'ring-[2.5px] ring-emerald-400 ring-offset-2 ring-offset-white shadow-emerald-500/20'
                : 'ring-1 ring-slate-200/80 hover:ring-emerald-300'
            }`}
          >
            <img
              src="/assets/jago-avatar.png"
              alt="JAGO"
              className="w-9 h-9 object-contain"
            />
          </button>
          <span className={`text-[10px] mt-0.5 tracking-tight ${
            activeTab === 'jago' ? 'font-extrabold text-[#0E3D2F]' : 'font-semibold text-slate-600'
          }`}>
            {t.nav.jago}
          </span>
        </div>

        {/* Tab 4: Documents */}
        <button
          type="button"
          onClick={() => onTabChange('documents')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeTab === 'documents' ? 'text-[#0E3D2F]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'documents' ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="M7 8h10M7 12h6" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'documents' ? 'font-bold' : 'font-medium'} tracking-tight`}>
            {t.nav.documents}
          </span>
        </button>

        {/* Tab 5: Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeTab === 'profile' ? 'text-[#0E3D2F]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'profile' ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0113 0" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold' : 'font-medium'} tracking-tight`}>
            {t.nav.profile}
          </span>
        </button>

      </div>
    </nav>
  );
}
