import React from 'react';
import {
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  AlertTriangle,
  Cookie,
  ExternalLink,
  BookOpen,
  Briefcase,
  Car,
  Home,
  Smartphone,
  Calculator,
  Download
} from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'jobs' | 'vehicles' | 'rooms' | 'mobiles' | 'tools' | 'cv' | 'apk' | 'guides') => void;
  onOpenLegal: (docId: 'privacy' | 'terms' | 'about' | 'contact' | 'anti-scam' | 'cookie') => void;
  whatsappNumber: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onOpenLegal,
  whatsappNumber
}) => {
  return (
    <footer className="mt-8 bg-stone-900 text-stone-300 border-t border-stone-800 text-[12.5px] leading-relaxed">
      {/* Top Banner with Trust Badges */}
      <div className="bg-stone-950/70 border-b border-stone-800 py-3.5 px-4">
        <div className="max-w-xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11.5px] text-stone-400">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Google AdSense Verified Publisher</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Publisher: <code className="text-stone-300 font-mono">ca-pub-5776525398556337</code></span>
            <span>•</span>
            <a
              href="/ads.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-amber-300 underline font-mono text-[10.5px]"
            >
              ads.txt
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-7">
        {/* Brand & Mission Statement */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <img
              src="/apk-icon.png"
              alt="Qatar Living Jobs"
              className="w-8 h-8 rounded-lg bg-white p-0.5"
            />
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Qatar Living Jobs
              </h3>
              <p className="text-[11px] text-stone-400">
                Independent Daily Employment, Classifieds &amp; Labour Law Portal in Doha
              </p>
            </div>
          </div>
          <p className="text-stone-400 text-[12px] leading-relaxed">
            Connecting professionals and jobseekers with verified daily job openings across Qatar. Providing free statutory calculators and advice in strict adherence to Qatar Labour Law No. 14 of 2004.
          </p>
        </div>

        {/* Quick Links Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2 border-t border-stone-800">
          {/* Column 1: Main Categories */}
          <div className="space-y-2">
            <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-white">
              Explore Portal
            </h4>
            <ul className="space-y-1.5 text-[12px]">
              <li>
                <button
                  onClick={() => onNavigateTab('jobs')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                  <span>Jobs in Qatar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('vehicles')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5 text-stone-500" />
                  <span>Used Cars &amp; SUVs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('rooms')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-stone-500" />
                  <span>Rooms &amp; Bed Spaces</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('mobiles')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Mobiles &amp; Devices</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tools')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-stone-500" />
                  <span>Gratuity Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('apk')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>Download APK</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Qatar Labour Guides */}
          <div className="space-y-2">
            <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-white">
              Labour Guides
            </h4>
            <ul className="space-y-1.5 text-[12px]">
              <li>
                <button
                  onClick={() => onNavigateTab('guides')}
                  className="hover:text-amber-400 transition-colors text-left flex items-start gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <span>End of Service Gratuity</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('guides')}
                  className="hover:text-amber-400 transition-colors text-left flex items-start gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <span>Change Job Without NOC</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('guides')}
                  className="hover:text-amber-400 transition-colors text-left flex items-start gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <span>Qatar Minimum Wage</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('guides')}
                  className="hover:text-amber-400 transition-colors text-left flex items-start gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <span>QID &amp; Medical Tests</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('anti-scam')}
                  className="hover:text-amber-400 transition-colors text-left flex items-start gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Avoid Job Scams</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust Policies (AdSense Mandatory) */}
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-white">
              Legal &amp; AdSense Policy
            </h4>
            <ul className="space-y-1.5 text-[12px]">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer font-medium text-stone-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('about')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span>Contact &amp; Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('cookie')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Cookie className="w-3.5 h-3.5 text-stone-500" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  <span>Sitemap XML</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* AdSense Mandatory Disclosure & Anti-Scam Notice */}
        <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-[11.5px] text-stone-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-stone-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Google AdSense &amp; Advertising Disclaimer:</span>
          </div>
          <p>
            Qatar Living Jobs displays advertisements served by Google AdSense and accredited advertising partners. Third-party vendors, including Google, use cookies to serve ads based on your prior visits. To opt out of personalized ads, visit{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              Google Ads Settings
            </a>{' '}
            or{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              AboutAds.info
            </a>
            .
          </p>
          <p className="text-amber-300/80 pt-1 border-t border-stone-800">
            <strong>Job Seeker Protection:</strong> Never pay any recruiter or agency for visa fees, offer letters, or interview processing. Under Qatar Labour Law, all recruitment costs must be covered by the employer.
          </p>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Qatar Living Jobs. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-stone-300 underline cursor-pointer"
            >
              Privacy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-stone-300 underline cursor-pointer"
            >
              Terms
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('contact')}
              className="hover:text-stone-300 underline cursor-pointer"
            >
              Support
            </button>
            <span>•</span>
            <a
              href="/ads.txt"
              target="_blank"
              className="hover:text-stone-300 underline font-mono"
            >
              ads.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
