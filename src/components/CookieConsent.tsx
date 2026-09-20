import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
  onOpenCookiePolicy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onOpenPrivacy,
  onOpenCookiePolicy
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('ql_cookie_consent');
      if (!consent) {
        // Show after a brief delay so the page renders smoothly
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('ql_cookie_consent', JSON.stringify({ status: 'accepted', timestamp: new Date().toISOString() }));
    } catch (e) {
      console.warn(e);
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('ql_cookie_consent', JSON.stringify({ status: 'essential_only', timestamp: new Date().toISOString() }));
    } catch (e) {
      console.warn(e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-stone-900/95 text-white backdrop-blur-md border-t border-stone-800 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>
          <div className="text-[12px] sm:text-[12.5px] text-stone-300 leading-relaxed">
            <span className="font-bold text-white block sm:inline">
              We value your privacy &amp; transparency:
            </span>{' '}
            Qatar Living Jobs uses cookies and localized storage to analyze site traffic, personalize content, and display Google AdSense ads in accordance with our{' '}
            <button
              onClick={onOpenPrivacy}
              className="text-amber-400 underline font-semibold hover:text-amber-300 cursor-pointer"
            >
              Privacy Policy
            </button>{' '}
            and{' '}
            <button
              onClick={onOpenCookiePolicy}
              className="text-amber-400 underline font-semibold hover:text-amber-300 cursor-pointer"
            >
              Cookie Policy
            </button>
            .
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11.5px] font-semibold transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-[12px] font-bold shadow-sm transition-all cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
