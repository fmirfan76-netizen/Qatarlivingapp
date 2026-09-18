import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  client = 'ca-pub-5776525398556337',
  slot,
  format = 'auto',
  className = '',
  label = 'Advertisement'
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);
  const [adFailed, setAdFailed] = useState(false);

  // Validate slot: must exist and not be dummy placeholder
  const isValidSlot = Boolean(
    slot &&
    slot.trim().length > 5 &&
    slot !== '1234567890' &&
    slot !== '0000000000'
  );

  useEffect(() => {
    if (!isValidSlot) return;
    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        // Load AdSense library once
        if (!document.getElementById('adsense-script')) {
          const script = document.createElement('script');
          script.id = 'adsense-script';
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Defer push to ensure <ins> DOM node is mounted and not yet initialized
        const timer = setTimeout(() => {
          try {
            if (
              adRef.current &&
              !adRef.current.getAttribute('data-adsbygoogle-status') &&
              !pushedRef.current
            ) {
              pushedRef.current = true;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const adsbygoogle = ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
              adsbygoogle.push({});
            }
          } catch (pushErr) {
            // Suppress benign AdSense double-push in React StrictMode
            console.warn('AdSense notice:', pushErr);
            setAdFailed(true);
          }
        }, 150);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.warn('AdSense initialization notice:', err);
      setAdFailed(true);
    }
  }, [client, isValidSlot]);

  return (
    <div
      className={`my-3 p-2 bg-stone-50/80 rounded-xl border border-stone-200/80 text-center overflow-hidden transition-all ${className}`}
    >
      <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-[9px] text-stone-300">Qatar Living Ads</span>
      </div>

      {isValidSlot && !adFailed ? (
        <div className="min-h-[90px] flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle block w-full"
            style={{ display: 'block' }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        /* Direct Advertiser & Sponsored Vacancies Banner */
        <div className="p-3 bg-gradient-to-r from-stone-100 to-stone-50 rounded-lg border border-dashed border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8e1e3c]/10 text-[#8e1e3c] flex items-center justify-center font-black text-sm shrink-0">
              AD
            </div>
            <div>
              <p className="text-[12px] font-bold text-stone-800">
                Promote Your Qatar Vacancy or Business
              </p>
              <p className="text-[11px] text-stone-500">
                Reach 50,000+ active jobseekers &amp; professionals across Doha.
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/97400000000?text=${encodeURIComponent(
              'Hi Qatar Living Jobs, I would like to advertise a job opening or banner ad on your app.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#8e1e3c] hover:bg-[#72152e] text-white text-[11px] font-bold shrink-0 transition-colors"
          >
            Inquire on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};
