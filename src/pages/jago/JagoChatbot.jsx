import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Toast } from '../../components/ui/Overlays';

const QUICK_CARDS = [
  {
    id: 'eligible',
    labelEn: 'Am I eligible for this scholarship?',
    labelHi: 'क्या मैं इस छात्रवृत्ति के लिए पात्र हूँ?',
    iconBg: 'bg-[#EBF7EE]',
    iconColor: 'text-[#16A34A]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'missing',
    labelEn: 'Which documents are missing?',
    labelHi: 'दस्तावेज़ में क्या कमी है?',
    iconBg: 'bg-[#FEF2F2]',
    iconColor: 'text-[#EF4444]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h4m-8 5h14a2 2 0 002-2V7a2 2 0 00-2-2h-3m-8 0H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-16a2 2 0 012-2h4a2 2 0 012 2v2H8V3z" />
      </svg>
    ),
  },
  {
    id: 'where',
    labelEn: 'Where is my application now?',
    labelHi: 'मेरा आवेदन कहाँ तक पहुँचा?',
    iconBg: 'bg-[#EFF6FF]',
    iconColor: 'text-[#3B82F6]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M16.5 16.5L21 21" />
      </svg>
    ),
  },
  {
    id: 'payment',
    labelEn: 'Why is payment pending?',
    labelHi: 'मेरा पेमेंट क्यों रुका है?',
    iconBg: 'bg-[#FFFBEB]',
    iconColor: 'text-[#D97706]',
    icon: <span className="font-bold text-sm leading-none">₹</span>,
  },
  {
    id: 'status',
    labelEn: 'What does this status mean?',
    labelHi: 'इस स्थिति का क्या अर्थ है?',
    iconBg: 'bg-[#FAF5FF]',
    iconColor: 'text-[#9333EA]',
    icon: <span className="font-bold text-sm leading-none">?</span>,
  },
  {
    id: 'deficiency',
    labelEn: 'How do I fix a deficiency?',
    labelHi: 'कमी कैसे ठीक करें?',
    iconBg: 'bg-[#EEF2FF]',
    iconColor: 'text-[#6366F1]',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
  },
];

function SpeakerButton({ text, lang }) {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utt.rate = 0.92;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };
  return (
    <button
      type="button"
      onClick={speak}
      title={lang === 'hi' ? 'सुनें' : 'Listen'}
      className={`p-1 rounded-full text-slate-400 hover:text-slate-600 active:scale-90 transition-all ${
        speaking ? 'text-[#0E3D2F] animate-pulse' : ''
      }`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    </button>
  );
}

export default function JagoChatbot({ applicationId = 'MOTA-PMS-2026-00124', scholarshipId = null, onNavigate }) {
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toast, setToast] = useState(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const showToast = (msg, type = 'info') => setToast({ msg, type });

  // Auto-scroll on conversation update
  useEffect(() => {
    if (messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Web Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      };
      recognition.onerror = () => {
        setIsListening(false);
        showToast(language === 'hi' ? 'वॉइस इनपुट काम नहीं किया।' : 'Voice input failed. Please try again.', 'warning');
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoice = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      showToast(language === 'hi' ? 'यह ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता।' : 'Voice input not supported in this browser.', 'warning');
      return;
    }
    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      rec.start();
      setIsListening(true);
    }
  };

  const handleSend = useCallback(async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await api.chatWithJago({
        message: text,
        applicationId,
        scholarshipId,
        language,
        history: historyPayload,
      });

      const replyText =
        response.data?.reply ||
        response.reply ||
        response.response ||
        (language === 'hi'
          ? 'मुझे खेद है, सर्वर से उत्तर नहीं मिला। कृपया बाद में प्रयास करें।'
          : 'Sorry, I could not retrieve an answer right now. Please try again shortly.');

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: getContextualActions(text, language, onNavigate),
        },
      ]);
    } catch (err) {
      console.error('JAGO error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text:
            language === 'hi'
              ? 'क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया सुनिश्चित करें कि बैकएंड चालू है।'
              : 'Sorry, I had trouble reaching the server. Please check your backend connection.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, applicationId, scholarshipId, language, onNavigate]);

  const hasChatStarted = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F8] select-none overflow-hidden relative pb-16">
      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* COMPACT & PREMIUM JAGO HEADER */}
      <header className="bg-[#0E3D2F] px-4 pt-3 pb-3.5 shrink-0 z-10 shadow-xs">
        <div className="flex items-center justify-between">
          {/* Left: Avatar + Title + Subtitle */}
          <div className="flex items-center gap-2.5">
            {/* JAGO Avatar Face in White Circular Ring */}
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-1 border-2 border-emerald-400/40 shadow-xs shrink-0">
              <img
                src="/assets/jago-avatar.png"
                alt="JAGO"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[20px] font-black text-white tracking-tight leading-none">
                  JAGO
                </h1>
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" title="Online" />
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium tracking-tight mt-0.5">
                {language === 'hi'
                  ? 'AI सहायक • आपकी सहायता, हर कदम पर'
                  : 'AI Assistant • Your guide in every step'}
              </p>
            </div>
          </div>

          {/* Right: Language Switcher Pill */}
          <button
            type="button"
            onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[11.5px] font-semibold active:scale-95 transition-all backdrop-blur-xs"
          >
            <span>🌐</span>
            <span>{language === 'hi' ? 'हिंदी ⌵' : 'English ⌵'}</span>
          </button>
        </div>
      </header>

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-3 space-y-3">

        {/* 1. COMPACT SCHOLARSHIP / APPLICATION STATUS CARD */}
        <section
          onClick={() => onNavigate && onNavigate('application-tracker', { applicationId })}
          className="bg-white rounded-2xl p-3 border border-emerald-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all hover:border-emerald-300"
          data-purpose="application-status-card"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Green Document Icon in Mint Box */}
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#15803D] shrink-0">
              <svg className="w-5 h-5 stroke-[2] stroke-current fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-[13.5px] font-bold text-slate-900 leading-tight truncate">
                {language === 'hi' ? 'पोस्ट-मैट्रिक छात्रवृत्ति' : 'Post-Matric Scholarship'}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                {applicationId || 'MOTA-PMS-2026-00123'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {/* Amber Status Badge */}
            <span className="bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1">
              <svg className="w-3 h-3 text-[#EA580C]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 7v5l3 2" />
              </svg>
              <span>{language === 'hi' ? 'स्वीकृति प्रक्रियाधीन' : 'Sanction In Progress'}</span>
            </span>
            <span className="text-slate-300 text-sm font-semibold">›</span>
          </div>
        </section>

        {/* 2. GREETING CARD (Always shown as initial message or intro card) */}
        <section className="flex items-start gap-2.5" data-purpose="jago-welcome-bubble">
          {/* Avatar Face */}
          <div className="w-9 h-9 rounded-full bg-white border border-emerald-200/90 flex items-center justify-center p-0.5 shrink-0 shadow-2xs mt-0.5">
            <img src="/assets/jago-avatar.png" alt="JAGO" className="w-7 h-7 object-contain" />
          </div>

          {/* Welcome Card */}
          <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[14.5px] font-bold text-slate-900">
                {language === 'hi' ? 'नमस्ते रमेश कुमार! 👋' : 'Namaste Ramesh Kumar! 👋'}
              </h3>
              <SpeakerButton
                text={
                  language === 'hi'
                    ? 'नमस्ते रमेश कुमार जी! मैं जागो हूँ — आपका छात्रवृत्ति सहायक। आवेदन, दस्तावेज़ या भुगतान के बारे में कुछ भी पूछें।'
                    : 'Namaste Ramesh Kumar! I am JAGO — your scholarship assistant. Ask me anything about your application, documents, payment status, or schemes.'
                }
                lang={language}
              />
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'मैं जागो हूँ — आपका छात्रवृत्ति सहायक। अपने आवेदन, आवश्यक दस्तावेज़, भुगतान स्थिति या योजनाओं के बारे में कुछ भी पूछें।'
                : 'I am JAGO — your scholarship assistant. Ask me anything about your application, documents, payment status, or schemes.'}
            </p>
          </div>
        </section>

        {/* 3. THE 6 QUICK QUESTIONS — 2-COLUMN CLEAN CARDS */}
        <section className="space-y-2 pt-1" data-purpose="quick-questions-grid">
          <div className="grid grid-cols-2 gap-2">
            {QUICK_CARDS.map((card) => {
              const label = language === 'hi' ? card.labelHi : card.labelEn;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSend(label)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex items-center justify-between gap-2 text-left active:scale-[0.97] transition-all hover:border-emerald-200 hover:shadow-xs group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}
                    >
                      {card.icon}
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-800 leading-snug line-clamp-2">
                      {label}
                    </span>
                  </div>
                  <span className="text-slate-300 text-sm font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. CONVERSATION MESSAGE THREAD (When chat is active) */}
        {hasChatStarted && (
          <section className="space-y-3 pt-2" data-purpose="chat-messages">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[88%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    {/* Bot Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-white border border-emerald-300 flex items-center justify-center p-0.5 shrink-0 mb-0.5 shadow-2xs">
                        <img src="/assets/jago-avatar.png" alt="JAGO" className="w-6 h-6 object-contain" />
                      </div>
                    )}

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center text-xs font-bold text-[#0E3D2F] shrink-0 mb-0.5 shadow-2xs">
                        {language === 'hi' ? 'र' : 'R'}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-line shadow-2xs ${
                        isUser
                          ? 'bg-[#0E3D2F] text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <div className={`flex items-center gap-1.5 mt-0.5 ${isUser ? 'mr-10' : 'ml-10'}`}>
                    <span className="text-[9.5px] text-slate-400 font-medium">{msg.time}</span>
                    {!isUser && <SpeakerButton text={msg.text} lang={language} />}
                  </div>

                  {/* Contextual Action Chips from reply */}
                  {!isUser && msg.actions && msg.actions.length > 0 && (
                    <div className="ml-10 mt-1.5 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, ai) => (
                        <button
                          key={ai}
                          type="button"
                          onClick={act.onPress}
                          className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10.5px] font-semibold text-emerald-800 active:scale-95 transition-all shadow-2xs"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Animation */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-emerald-300 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
                  <img src="/assets/jago-avatar.png" alt="JAGO" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-2xs flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* 5. BOTTOM INPUT BAR & TOPIC CHIPS */}
      <footer className="shrink-0 bg-gradient-to-t from-white via-white/95 to-transparent px-4 pb-2 pt-1 border-t border-slate-100/70 z-20">
        {/* Horizontal Quick Topic Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            type="button"
            onClick={() => handleSend(language === 'hi' ? 'मेरा आवेदन कहाँ तक पहुँचा?' : 'Where is my application now?')}
            className="flex items-center gap-1.5 bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 active:scale-95 transition-all"
          >
            <span className="text-xs">📄</span>
            <span>{language === 'hi' ? 'मेरा आवेदन' : 'My Application'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend(language === 'hi' ? 'मेरा पेमेंट क्यों रुका है?' : 'Why is payment pending?')}
            className="flex items-center gap-1.5 bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3] px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 active:scale-95 transition-all"
          >
            <span className="text-xs font-bold">₹</span>
            <span>{language === 'hi' ? 'भुगतान स्थिति' : 'Payment Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend(language === 'hi' ? 'दस्तावेज़ में क्या कमी है?' : 'Which documents are missing?')}
            className="flex items-center gap-1.5 bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC] px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 active:scale-95 transition-all"
          >
            <span className="text-xs">📄</span>
            <span>{language === 'hi' ? 'आवश्यक दस्तावेज़' : 'Required Documents'}</span>
          </button>
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="flex items-center justify-center gap-2 mb-2 py-1.5 bg-red-50 rounded-xl border border-red-200 animate-pulse">
            <span className="text-[11px] font-bold text-red-600">
              {language === 'hi' ? '🎤 सुन रहा हूँ... बोलिए' : '🎤 Listening... Please speak'}
            </span>
          </div>
        )}

        {/* Pill-shaped Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-white rounded-full border border-slate-200/90 shadow-sm pl-3.5 pr-1.5 py-1.5 flex items-center gap-2 focus-within:border-[#0E3D2F] focus-within:ring-2 focus-within:ring-[#0E3D2F]/10 transition-all"
        >
          {/* Paperclip Attachment Icon */}
          <button
            type="button"
            onClick={() => showToast(language === 'hi' ? 'फ़ाइल संलग्नक सुविधा जल्द आ रही है' : 'Attachment feature coming soon', 'info')}
            className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform p-1 shrink-0"
            title="Attach file"
          >
            <svg width="18" height="18" className="-rotate-45" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'hi' ? 'जागो से कुछ भी पूछें...' : 'Ask JAGO anything...'}
            className="flex-1 text-[13px] text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none tracking-tight min-w-0"
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`w-8 h-8 min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all ${
              isListening ? 'bg-red-500 text-white shadow-md animate-pulse' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Voice input"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Premium Circular Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`w-9 h-9 min-w-[36px] max-w-[36px] min-h-[36px] max-h-[36px] rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm active:scale-90 ${
              input.trim() && !loading
                ? 'bg-[#0E3D2F] hover:bg-[#092b21] text-white shadow-emerald-950/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            title="Send"
            aria-label="Send message"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white transform translate-x-[1px]"
            >
              <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.49-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}

function getContextualActions(userText, language, onNavigate) {
  const lower = userText.toLowerCase();
  const actions = [];
  if (lower.includes('document') || lower.includes('दस्तावेज़') || lower.includes('certificate') || lower.includes('प्रमाण')) {
    actions.push({
      label: language === 'hi' ? '📁 दस्तावेज़ वॉलेट खोलें' : '📁 Open Document Wallet',
      onPress: () => onNavigate && onNavigate('documents'),
    });
  }
  if (lower.includes('payment') || lower.includes('भुगतान') || lower.includes('पैसे') || lower.includes('dbt')) {
    actions.push({
      label: language === 'hi' ? '💳 भुगतान विवरण देखें' : '💳 View Payment Details',
      onPress: () => onNavigate && onNavigate('payments'),
    });
  }
  if (lower.includes('application') || lower.includes('आवेदन') || lower.includes('status') || lower.includes('स्थिति') || lower.includes('where')) {
    actions.push({
      label: language === 'hi' ? '📊 आवेदन ट्रैक करें' : '📊 Track Application',
      onPress: () => onNavigate && onNavigate('application-tracker'),
    });
  }
  return actions;
}
