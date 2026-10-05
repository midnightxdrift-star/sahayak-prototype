import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORIES = [
  { id: 'all', en: 'All', hi: 'सभी' },
  { id: 'school', en: 'School', hi: 'स्कूल' },
  { id: 'college', en: 'College', hi: 'कॉलेज' },
  { id: 'fellowship', en: 'Fellowship', hi: 'फ़ेलोशिप' }
];

export default function ScholarshipsList({ onNavigate }) {
  const { t, language } = useLanguage();
  const [scholarships, setScholarships] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const getSchemeName = (scheme) => {
    if (language === 'hi') {
      if (scheme.name_hi) return scheme.name_hi;
      if (scheme.id === 'mota-post-matric') return 'पोस्ट-मैट्रिक छात्रवृत्ति (कक्षा 11वीं से उच्च शिक्षा)';
      if (scheme.id === 'mota-pre-matric') return 'एसटी छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति (कक्षा 9-10)';
      if (scheme.id === 'mota-national-scholarship') return 'शीर्ष संस्थानों में राष्ट्रीय छात्रवृत्ति';
      if (scheme.id === 'mota-national-fellowship') return 'एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (उच्च शिक्षा)';
      if (scheme.id === 'mota-national-overseas') return 'एसटी उम्मीदवारों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति';
    }
    return scheme.name;
  };

  const getSchemeDesc = (scheme) => {
    if (language === 'hi') {
      if (scheme.short_description_hi) return scheme.short_description_hi;
      if (scheme.id === 'mota-post-matric') return 'कक्षा 11वीं, 12वीं, डिप्लोमा एवं उच्च शिक्षा के लिए वित्तीय सहायता।';
      if (scheme.id === 'mota-pre-matric') return 'कक्षा 9वीं और 10वीं के आदिवासी छात्रों के लिए वित्तीय सहायता।';
      if (scheme.id === 'mota-national-scholarship') return 'आईआईटी, एनआईटी, आईआईएम आदि में पूर्ण शिक्षण शुल्क प्रतिपूर्ति।';
      if (scheme.id === 'mota-national-fellowship') return 'एम.फिल. और पीएच.डी. शोधार्थियों हेतु उच्च शिक्षा फैलोशिप।';
      if (scheme.id === 'mota-national-overseas') return 'विदेश के शीर्ष विश्वविद्यालयों में उच्च शिक्षा हेतु पूर्ण सहायता।';
    }
    return scheme.short_description;
  };

  useEffect(() => {
    async function fetchSchemes() {
      setLoading(true);
      try {
        const data = await api.getScholarships(activeCategory);
        setScholarships(data);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchemes();
  }, [activeCategory]);

  const filteredSchemes = scholarships.filter((scheme) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = getSchemeName(scheme).toLowerCase();
    const desc = getSchemeDesc(scheme).toLowerCase();
    return name.includes(query) || desc.includes(query);
  });

  const getSchemeIcon = (type) => {
    switch (type) {
      case 'school':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#FFF3E8] flex items-center justify-center text-[#E65100] shrink-0 text-xl shadow-2xs">
            🎒
          </div>
        );
      case 'college':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#E8F5EE] flex items-center justify-center text-[#0E3D2F] shrink-0 text-xl shadow-2xs">
            🎓
          </div>
        );
      case 'certificate':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 text-xl shadow-2xs">
            🏛️
          </div>
        );
      case 'research':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#FAF5FF] flex items-center justify-center text-[#7E22CE] shrink-0 text-xl shadow-2xs">
            🔬
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#15803D] shrink-0 text-xl shadow-2xs">
            🌍
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative bg-[#f7f8fc] select-none" data-purpose="main-screen-content">
      {/* Header Section */}
      <section className="px-5 pt-3 pb-2 bg-white border-b border-slate-100" data-purpose="screen-header">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
              {language === 'hi' ? 'जनजातीय कार्य मंत्रालय' : 'Ministry of Tribal Affairs'}
            </p>
            <h1 className="text-[24px] font-bold tracking-tight text-[#0D382A]">
              {t.scholarships.title}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center text-slate-700"
          >
            <svg className="w-4.5 h-4.5 stroke-[2.2] stroke-current fill-none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <line strokeLinecap="round" x1="16.5" x2="21.5" y1="16.5" y2="21.5" />
            </svg>
          </button>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="mt-2.5 animate-[fadeIn_0.2s_ease-out]">
            <div className="relative flex items-center">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'छात्रवृत्ति खोजें...' : 'Search scholarships...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2F]"
              />
              <span className="absolute left-3 text-slate-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-[12.5px] text-[#556987] font-normal mt-1 tracking-tight">
          {t.scholarships.subtitle}
        </p>

        {/* Filter Chips Section */}
        <div className="pt-3 pb-1 overflow-x-auto no-scrollbar flex items-center gap-2" data-purpose="filter-pills">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const label = language === 'hi' ? cat.hi : cat.en;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#0E3D2F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Scholarship Card List */}
      <section className="px-4 pt-3 flex flex-col space-y-3" data-purpose="scholarship-card-list">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2.5 text-slate-400">
            <div className="w-6 h-6 border-2 border-[#0E3D2F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">{t.common.loading}</p>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-100 shadow-xs">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm font-bold text-slate-700">
              {language === 'hi' ? 'कोई छात्रवृत्ति नहीं मिली' : 'No scholarships found'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'hi' ? 'कृपया अपनी खोज या फ़िल्टर बदलें' : 'Try searching with different keywords'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1 bg-slate-100 text-xs font-semibold text-slate-700 rounded-full"
              >
                {language === 'hi' ? 'खोज हटाएं' : 'Clear search'}
              </button>
            )}
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <article
              key={scheme.id}
              onClick={() => onNavigate('scholarship-details', { scholarshipId: scheme.id })}
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3 cursor-pointer active:scale-[0.99] transition-all hover:border-emerald-200 hover:shadow-sm"
            >
              <div className="flex items-start gap-3 min-w-0">
                {getSchemeIcon(scheme.icon_type || scheme.category)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0E3D2F] border border-emerald-100">
                      {scheme.category?.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {scheme.academic_year || '2026–27'}
                    </span>
                  </div>

                  <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                    {getSchemeName(scheme)}
                  </h2>
                  <p className="text-[12px] text-slate-500 mt-1 font-normal leading-snug line-clamp-2">
                    {getSchemeDesc(scheme)}
                  </p>
                </div>
              </div>

              {/* Card Footer: Grant Amount + View Details CTA */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {language === 'hi' ? 'अनुदान सहायता' : 'Grant Amount'}
                  </span>
                  <span className="text-[13px] font-bold text-[#0E3D2F]">
                    {scheme.amount || 'Up to ₹25,000/yr'}
                  </span>
                </div>

                <div className="inline-flex items-center text-[#0E3D2F] text-[12px] font-bold bg-[#E8F5EE] px-3 py-1.5 rounded-xl group hover:bg-[#d5eee0] transition-colors">
                  <span>{t.scholarships.viewDetails}</span>
                  <span className="ml-1 tracking-tight">→</span>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
