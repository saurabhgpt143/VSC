import React from 'react';
import { SymptomItem } from '../types';
import { AlertOctagon, PhoneCall, ShieldAlert, ArrowRight } from 'lucide-react';

interface RedFlagAlertProps {
  redFlagSymptoms: SymptomItem[];
  language: 'en' | 'hi';
}

export const RedFlagAlert: React.FC<RedFlagAlertProps> = ({ redFlagSymptoms, language }) => {
  const isHindi = language === 'hi';

  if (redFlagSymptoms.length === 0) return null;

  return (
    <div className="bg-red-500 text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-red-600 animate-pulse-subtle">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-red-600 rounded-xl text-white shrink-0 mt-0.5">
            <AlertOctagon className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                {isHindi ? 'आपातकालीन चेतावनी' : 'CRITICAL RED FLAG'}
              </span>
              <h4 className="font-bold text-base sm:text-lg text-white">
                {isHindi ? 'संभावित आपातकालीन लक्षण पाया गया' : 'Potential Emergency Symptoms Detected'}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl">
              {isHindi
                ? 'आपके द्वारा चुने गए लक्षणों में ऐसे संकेत शामिल हैं जिन्हें तुरंत अस्पताल में चिकित्सीय जांच की आवश्यकता हो सकती है:'
                : 'You have selected symptoms that represent high-risk clinical red flags requiring immediate medical evaluation:'}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {redFlagSymptoms.map((s) => (
                <span
                  key={s.id}
                  className="bg-red-700/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-red-400/40"
                >
                  • {isHindi ? s.hindiName : s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Direct Dial Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <a
            href="tel:108"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white text-red-700 hover:bg-red-50 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>{isHindi ? '108 एम्बुलेंस डायल करें' : 'Call 108 Ambulance'}</span>
          </a>
          <a
            href="tel:+915652442400"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold px-3 py-2.5 rounded-xl text-xs border border-red-400/50 transition-all"
          >
            <span>{isHindi ? 'रामकृष्ण मिशन इमरजेंसी' : 'RKM Emergency'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
