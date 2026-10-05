import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Toast } from '../../components/ui/Overlays';

const CATEGORIES = [
  { id: 'all', en: 'All', hi: 'सभी' },
  { id: 'deadlines', en: 'Deadlines', hi: 'अंतिम तिथियां' },
  { id: 'status', en: 'Status', hi: 'स्थिति' },
  { id: 'payments', en: 'Payments', hi: 'भुगतान' }
];

export default function NotificationsScreen({ onBack, onNavigate }) {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const data = await api.getNotifications(category);
        setNotifications(data);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [category]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setToast({
      msg: language === 'hi' ? 'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं' : 'All notifications marked as read',
      type: 'success'
    });
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'deadlines':
        return '⚠️';
      case 'payments':
        return '💰';
      case 'status':
        return '✅';
      default:
        return '🔔';
    }
  };

  const getNotifTitle = (notif) => {
    if (language === 'hi') {
      if (notif.title.includes('Income Certificate')) return 'आय प्रमाण पत्र नवीनीकरण आवश्यक';
      if (notif.title.includes('Institute Verification')) return 'संस्थान सत्यापन पूर्ण हुआ';
      if (notif.title.includes('Payment Batch')) return 'डीबीटी भुगतान बैच संसाधित हुआ';
      if (notif.title.includes('State Verification')) return 'राज्य स्तर सत्यापन पूर्ण हुआ';
      if (notif.title.includes('DigiLocker')) return 'DigiLocker सिंक सक्रिय';
      return notif.title;
    }
    return notif.title;
  };

  const getNotifMessage = (notif) => {
    if (language === 'hi') {
      if (notif.title.includes('Income Certificate') || notif.message.includes('income certificate')) {
        return 'भुगतान में देरी से बचने के लिए कृपया 31 अक्टूबर से पहले अपना नवीनीकृत आय प्रमाण पत्र अपलोड करें।';
      }
      if (notif.title.includes('Institute Verification') || notif.message.includes('college')) {
        return 'एबीसी कॉलेज ने आपके नामांकन और शैक्षणिक विवरण का सत्यापन कर दिया है।';
      }
      if (notif.title.includes('Payment Batch') || notif.message.includes('credited')) {
        return 'अगस्त माह की ₹5,000 की किस्त आपके आधार-लिंक्ड एसबीआई खाते में जमा कर दी गई है।';
      }
      if (notif.title.includes('State Verification') || notif.message.includes('State')) {
        return 'राज्य जनजातीय कल्याण विभाग द्वारा आपका पोस्ट-मैट्रिक आवेदन स्वीकृत कर दिया गया है।';
      }
      return notif.message;
    }
    return notif.message;
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f7f8fc] select-none relative overflow-hidden">
      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-100 bg-white shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5 stroke-[2.2] stroke-current fill-none" viewBox="0 0 24 24">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="text-sm font-bold text-slate-800">{t.notifications.title}</span>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllRead}
            className="text-[11px] font-bold text-[#0E3D2F] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 active:scale-95"
          >
            {language === 'hi' ? 'सभी पढ़ें' : 'Mark all read'}
          </button>
        ) : (
          <span className="text-xs text-slate-400">✓ All read</span>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-6 space-y-3">
        {/* Titles */}
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-slate-900">{t.notifications.title}</h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
            {language === 'hi' ? 'अपने आवेदन की नवीनतम स्थिति से अवगत रहें।' : 'Stay updated on your scholarship milestones.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            const label = language === 'hi' ? cat.hi : cat.en;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#0E3D2F] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2.5 text-slate-400">
              <div className="w-6 h-6 border-2 border-[#0E3D2F] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-500">{t.common.loading}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-100 shadow-xs">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm font-bold text-slate-700">{language === 'hi' ? 'कोई सूचना नहीं' : 'No notifications'}</p>
              <p className="text-xs text-slate-400 mt-1">{t.notifications.emptyMessage}</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.title.includes('Income Certificate')) {
                    onNavigate('documents');
                  } else if (notif.title.includes('Payment') || notif.category === 'payments') {
                    onNavigate('payments');
                  } else {
                    onNavigate('application-tracker');
                  }
                }}
                className={`p-3.5 rounded-2xl bg-white border shadow-xs flex items-start space-x-3 cursor-pointer active:scale-[0.99] transition-all hover:border-emerald-200 ${
                  !notif.is_read ? 'border-emerald-200 ring-1 ring-[#0E3D2F]/10' : 'border-slate-100'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate pr-2">
                      {getNotifTitle(notif)}
                    </h3>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#0E3D2F] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-600 leading-snug mt-1">
                    {getNotifMessage(notif)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {notif.timestamp}
                    </span>
                    <span className="text-[10.5px] font-semibold text-[#0E3D2F]">
                      {language === 'hi' ? 'देखें →' : 'View →'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
