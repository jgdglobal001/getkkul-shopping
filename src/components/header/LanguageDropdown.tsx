"use client";
import { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: "ko", name: "한국어", flag: "🇰🇷", available: true },
  { code: "en", name: "English", flag: "🇺🇸", available: true },
  { code: "zh", name: "中文", flag: "🇨🇳", available: true },
];

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: (typeof languages)[0]) => {
    if (!language.available) return;
    setIsOpen(false);

    // 현재 경로에서 locale 부분을 교체하거나 추가
    let newPath;
    if (pathname.startsWith('/ko') || pathname.startsWith('/en') || pathname.startsWith('/zh')) {
      newPath = pathname.replace(/^\/(ko|en|zh)/, `/${language.code}`);
    } else {
      newPath = `/${language.code}${pathname}`;
    }

    // Next.js 클라이언트 사이드 라우팅 사용
    router.replace(newPath);
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="headerTopMenu cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <span className="md:hidden">{currentLanguage.code.toUpperCase()}</span>
        <IoChevronDownSharp
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 py-2"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              disabled={!language.available}
              className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors ${
                language.available
                  ? "text-gray-700 hover:bg-gray-50 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed bg-gray-50/50"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className={language.available ? "" : "opacity-50"}>
                  {language.flag}
                </span>
                <span className="text-sm">{language.name}</span>
                {!language.available && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {t('language.comingSoon')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {locale === language.code &&
                  language.available && (
                    <FiCheck className="text-theme-color text-sm" />
                  )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
