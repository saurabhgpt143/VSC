import React, { useState, useEffect } from 'react';
import { Download, WifiOff, CheckCircle, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallBannerProps {
  language: 'en' | 'hi';
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check standalone mode (already installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        isHindi
          ? 'ऐप इंस्टॉल करने के लिए अपने ब्राउज़र मेनू (⋮) में "Add to Home Screen" या "Install" चुनें।'
          : 'To install this Progressive Web App, tap the browser menu (⋮ or Share) and select "Add to Home Screen" or "Install".'
      );
      return;
    }

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-all animate-fadeIn">
          <WifiOff className="w-4 h-4 text-amber-950" />
          <span>
            {isHindi
              ? 'ऑफ़लाइन मोड सक्रिय: क्लिनिकल लक्षण जांचकर्ता और स्थानीय अस्पताल निर्देशिका बिना इंटरनेट के पूरी तरह उपलब्ध हैं।'
              : 'Offline Mode Active: Clinical symptom assessment & regional hospital directory are fully available offline.'}
          </span>
        </div>
      )}

      {/* PWA Floating Install Prompt / Action */}
      {!isInstalled && !isDismissed && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-3 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>{isHindi ? 'ऐप के रूप में इंस्टॉल करें' : 'Install PWA App'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.2 rounded border border-emerald-400/30">
                  {isHindi ? 'ऑफ़लाइन सक्षम' : 'Offline Ready'}
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {isHindi
                  ? 'बिना इंटरनेट तेज पहुंच और फुलस्क्रीन अनुभव के लिए होम स्क्रीन पर जोड़ें।'
                  : 'Fast offline clinical triage directly from your home screen.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHindi ? 'इंस्टॉल' : 'Install'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              title={isHindi ? 'बंद करें' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
