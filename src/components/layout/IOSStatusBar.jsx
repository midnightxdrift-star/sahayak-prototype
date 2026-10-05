import React from 'react';

// Live clock hook
function useLiveClock() {
  const [time, setTime] = React.useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  });
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export default function IOSStatusBar({ dark = true }) {
  const time = useLiveClock();
  const textColor = dark ? 'text-slate-900' : 'text-stone-800';

  return (
    <header className={`w-full pt-3 px-6 pb-1.5 flex justify-between items-center z-30 select-none shrink-0 ${textColor}`}>
      {/* Current Time — Live */}
      <span className="text-[15px] font-semibold tracking-tight">{time}</span>

      {/* Dynamic Island placeholder */}
      <div className="w-28 h-7 bg-black rounded-full mx-auto flex items-center justify-center" />

      {/* Right Status Indicators */}
      <div className="flex items-center space-x-1.5">
        {/* Cellular Signal */}
        <svg className="w-4 h-3 fill-current" viewBox="0 0 17 12">
          <rect height="4" rx="0.5" width="2.5" x="0" y="8" />
          <rect height="6.5" rx="0.5" width="2.5" x="4.5" y="5.5" />
          <rect height="9" rx="0.5" width="2.5" x="9" y="3" />
          <rect height="11.5" rx="0.5" width="2.5" x="13.5" y="0.5" />
        </svg>

        {/* WiFi */}
        <svg className="w-3.5 h-3 fill-current" viewBox="0 0 16 12">
          <path d="M8 2.2a9.5 9.5 0 016.3 2.4.7.7 0 01-.05 1.05l-1.07.97a.7.7 0 01-.96-.04 6.7 6.7 0 00-8.54 0 .7.7 0 01-.96.04l-1.07-.97a.7.7 0 01-.05-1.05A9.5 9.5 0 018 2.2Zm-4.14 6.3a5 5 0 018.28 0 .7.7 0 01-.16.98l-3.55 2.76a.7.7 0 01-.86 0L4 9.48a.7.7 0 01-.14-.98Z" fillRule="evenodd" />
        </svg>

        {/* Battery */}
        <div className="flex items-center">
          <div className="w-5 h-2.5 border-[1.5px] border-current rounded-[3px] p-[1.5px] flex items-center">
            <div className="h-full w-full bg-current rounded-[1px]" />
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-sm" />
        </div>
      </div>
    </header>
  );
}
