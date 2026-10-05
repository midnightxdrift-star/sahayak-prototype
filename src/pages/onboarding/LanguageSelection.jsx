import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'hi', native: 'हिन्दी', label: 'Hindi', glyph: 'अ', bg: 'bg-[#faeae1]', color: 'text-[#d96534]' },
  { code: 'en', native: 'English', label: 'English', glyph: 'A', bg: 'bg-[#e3eefc]', color: 'text-[#2563eb]' },
  { code: 'mr', native: 'मराठी', label: 'Marathi', glyph: 'म', bg: 'bg-[#faede6]', color: 'text-[#ea580c]' },
  { code: 'te', native: 'తెలుగు', label: 'Telugu', glyph: 'తె', bg: 'bg-[#e6f4ea]', color: 'text-[#16a34a]' },
  { code: 'or', native: 'ଓଡ଼ିଆ', label: 'Odia', glyph: 'ଓ', bg: 'bg-[#f0f4f8]', color: 'text-[#0284c7]' },
  { code: 'sat', native: 'ᱥᱟᱱᱛᱟᱲᱤ', label: 'Santhali (Ol Chiki)', glyph: 'ᱥ', bg: 'bg-[#fef3c7]', color: 'text-[#b45309]' }
];

export default function LanguageSelection({ onSelectLanguage, onBack }) {
  const { language, setLanguage, t } = useLanguage();
  const [selected, setSelected] = useState(language || 'hi');

  const handleSelect = (code) => {
    setSelected(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    onSelectLanguage(selected);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#fbfdfc] select-none relative overflow-hidden h-full">
      {/* Top Header - Fixed & Shrink-0 */}
      <div className="px-6 pt-2 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1.5 text-slate-800 hover:text-slate-600 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          {/* Sahayak Logo Emblem */}
          <div>
            <img src="/assets/sahayak-emblem.png" alt="Sahayak" className="w-8 h-7 object-contain" />
          </div>
        </div>

        <h1 className="text-[24px] leading-tight font-extrabold text-[#0b1c3d] tracking-tight">
          {t.languageSelection.title}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-0.5">
          {t.languageSelection.subtitle}
        </p>
      </div>

      {/* Language List - Flex-1 Min-H-0 Overflow-Y-Auto (Smooth Scroll) */}
      <div className="flex-1 min-h-0 px-6 space-y-2 overflow-y-auto py-2">
        {LANGUAGES.map((lang) => {
          const isChecked = selected === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all active:scale-[0.99] border ${
                isChecked
                  ? 'bg-white border-2 border-emerald-700 shadow-sm'
                  : 'bg-white border-slate-100 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${lang.bg} flex items-center justify-center ${lang.color} font-bold text-lg`}>
                  {lang.glyph}
                </div>
                <div>
                  <div className="text-[15px] font-bold text-gray-900 leading-tight">
                    {lang.native}
                  </div>
                  <div className="text-[12px] font-normal text-slate-500">
                    {lang.label}
                  </div>
                </div>
              </div>

              {/* Radio checkmark */}
              {isChecked ? (
                <div className="w-5 h-5 rounded-full bg-[#0E3D2F] flex items-center justify-center text-white shadow-xs">
                  <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA - Sticky & Shrink-0 */}
      <div className="px-6 py-3 bg-white border-t border-slate-100 shrink-0 z-20">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-[#0E3D2F] hover:bg-[#092b21] active:scale-95 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <span>{selected === 'hi' ? 'आगे बढ़ें / Continue' : 'Continue / आगे बढ़ें'}</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
