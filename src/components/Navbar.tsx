import React from 'react';
import { Stethoscope, Globe, PhoneCall, Building2, RotateCcw, ShieldAlert, HeartPulse } from 'lucide-react';

interface NavbarProps {
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  activeView: 'checker' | 'directory' | 'report';
  onNavigate: (view: 'checker' | 'directory') => void;
  onReset: () => void;
  hasSelectedSymptoms: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  activeView,
  onNavigate,
  onReset,
  hasSelectedSymptoms,
}) => {
  const isHindi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('checker')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                    Vrindavan
                  </span>
                  <span className="font-bold text-base sm:text-lg text-blue-600">
                    Symptom Checker
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                    AI Triage
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {isHindi ? 'इंटरएक्टिव शारीरिक मानचित्र एवं स्वास्थ्य ट्रायज' : 'Interactive Body Map Clinical Triage'}
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links & Global Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher Tabs */}
            <div className="hidden sm:inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onNavigate('checker')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'checker' || activeView === 'report'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'लक्षण जांच' : 'Symptom Checker'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('directory')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'directory'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'लोकेशन व अस्पताल निर्देशिका' : 'Location & Health Directory'}
              </button>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Emergency 108 SOS Quick Button */}
            <a
              href="tel:108"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden xs:inline">108</span>
              <span className="hidden md:inline">{isHindi ? 'इमरजेंसी' : 'SOS'}</span>
            </a>

            {/* Reset Form Button */}
            {hasSelectedSymptoms && (
              <button
                type="button"
                onClick={onReset}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all"
                title={isHindi ? 'नया फॉर्म भरें' : 'Reset Form'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
