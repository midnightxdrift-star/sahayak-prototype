import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginScreen({ onLoginSuccess, onBack }) {
  const { t, language } = useLanguage();
  const [phone, setPhone] = useState('98765 43210');
  const [otpSent, setOtpSent] = useState(true);
  const [otp, setOtp] = useState(['4', '8', '2', '9']);

  const handleVerify = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FAF8F5] select-none relative overflow-hidden h-full">
      {/* Top Bar */}
      <div className="px-6 pt-2 pb-1 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-950 active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 flex flex-col justify-start overflow-y-auto no-scrollbar pt-1 min-h-0">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-3 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mb-1.5 p-1.5">
            <img src="/assets/sahayak-emblem.png" alt="Sahayak" className="w-9 h-8 object-contain" />
          </div>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-2xl font-bold text-[#0E3D2F] tracking-tight">{t.common.appName}</h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E5EFE7] text-[#0E3D2F]">{t.login.brandSub}</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.login.welcomeTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
            {t.login.welcomeSub}
          </p>
        </div>

        {/* Phone Input Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="phone-input">
              {t.login.phoneLabel}
            </label>
            <div className="relative flex items-center border border-slate-300 rounded-xl bg-white px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#14533D]">
              <div className="flex items-center space-x-1.5 pr-2.5 border-r border-slate-200">
                {/* Indian Flag */}
                <div className="w-5 h-3.5 rounded-xs overflow-hidden flex flex-col border border-slate-100">
                  <div className="h-1/3 bg-[#FF9933]" />
                  <div className="h-1/3 bg-white flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#000080]" />
                  </div>
                  <div className="h-1/3 bg-[#138808]" />
                </div>
                <span className="text-sm font-semibold text-slate-800 tracking-tight">+91</span>
              </div>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-3 border-0 focus:ring-0 text-sm font-medium text-slate-900 tracking-wide bg-transparent outline-none"
                placeholder={t.login.phonePlaceholder}
              />
            </div>
          </div>

          {/* OTP Input Section */}
          {otpSent && (
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-600">{t.login.enterOtpLabel}</label>
                <span className="text-[11px] font-semibold text-[#14533D] cursor-pointer">{t.login.resendOtp}</span>
              </div>
              <div className="flex justify-between gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14533D] focus:border-[#14533D] outline-none shadow-xs"
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 text-center pt-0.5">
                {language === 'hi' ? 'डेमो ओटीपी: 4829 (स्वतः भरा हुआ)' : 'Demo OTP: 4829 (auto-filled)'}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0E3D2F] hover:bg-[#092b21] active:scale-95 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <span>{t.login.verifyBtn}</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-4">
          {t.login.termsNotice}
        </p>
      </div>
    </div>
  );
}
