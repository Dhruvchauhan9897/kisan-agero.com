import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LanguageCode } from '../types/kisan';
import { LANGUAGES, TranslationStrings } from '../i18n/translations';

export type ActiveSection = 'home' | 'compare' | 'map' | 'alerts' | 'mockups';

interface TopNavProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  t: TranslationStrings;
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  language,
  onChangeLanguage,
  t,
  activeSection,
  onNavigate,
}) => {
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const navItems: { id: ActiveSection; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'compare', label: t.navCompare },
    { id: 'map', label: t.navMap },
    { id: 'alerts', label: t.navAlerts },
    { id: 'mockups', label: t.navMockups },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-lg font-bold tracking-tight text-[#142019] whitespace-nowrap shrink-0 text-left"
        >
          KisanMargin
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A5951]"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  isActive
                    ? 'text-[#142019] border-[#166534] font-semibold'
                    : 'border-transparent hover:text-[#142019] hover:border-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action — Language Switcher */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setLangOpen((prev) => !prev)}
            aria-expanded={langOpen}
            aria-haspopup="listbox"
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-sm font-medium text-[#142019] flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors"
          >
            <Globe className="w-4 h-4 text-[#166534]" aria-hidden="true" />
            <span>{currentLang.nativeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#4A5951]" aria-hidden="true" />
          </button>

          {langOpen && (
            <div
              role="listbox"
              aria-label="Select language"
              className="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-50"
            >
              {LANGUAGES.map((lang) => {
                const selected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChangeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full min-h-[44px] px-3.5 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                      selected
                        ? 'bg-[#166534]/10 text-[#166534] font-semibold'
                        : 'text-[#142019] hover:bg-stone-50'
                    }`}
                  >
                    <span>{lang.nativeLabel}</span>
                    <span className="text-xs text-[#4A5951]">{lang.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
