import React, { useState } from 'react';
import { AppSettings, CvOrderForm } from '../types';
import { AdsterraBanner } from './AdsterraBanner';
import { CheckCircle2, MessageCircle, CreditCard, Clock, FileText, Sparkles, Eye, ShieldCheck } from 'lucide-react';

interface CvSectionProps {
  settings: AppSettings;
}

export const CvSection: React.FC<CvSectionProps> = ({ settings }) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState<CvOrderForm>({
    fullName: '',
    phone: '',
    email: '',
    targetRole: '',
    experienceYears: '2-4 years',
    currentVisaStatus: 'Transferable with NOC',
    notes: ''
  });

  const waNumber = settings.whatsappNumber.replace(/[^0-9]/g, '') || '97400000000';

  const defaultWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hi! I want to order the ATS CV (QAR 49).')}`;

  const handleBuyCV = () => {
    if (settings.paymentUrl && settings.paymentUrl.trim().length > 0) {
      window.open(settings.paymentUrl, '_blank');
    } else {
      setShowOrderModal(true);
    }
  };

  const handleCustomOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderText = `🇶🇦 *ATS CV ORDER (QAR 49)*
━━━━━━━━━━━━━━━━━
👤 *Name:* ${formData.fullName || 'Candidate'}
🎯 *Target Role:* ${formData.targetRole || 'Not specified'}
💼 *Experience:* ${formData.experienceYears}
🛂 *Qatar Visa Status:* ${formData.currentVisaStatus}
📱 *Phone/WA:* ${formData.phone || 'This WhatsApp'}
✉️ *Email:* ${formData.email || 'N/A'}
📝 *Notes:* ${formData.notes || 'Ready to send current CV/details for rewrite'}
━━━━━━━━━━━━━━━━━
Please share payment instructions and confirm my 24h delivery slot!`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(orderText)}`;
    window.open(url, '_blank');
    setShowOrderModal(false);
  };

  return (
    <div id="cvSection" className="p-4 max-w-xl mx-auto pb-24">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#8e1e3c] to-[#6b142c] text-white rounded-2xl p-6 text-center shadow-lg border border-red-900/40 relative overflow-hidden">
        {/* Subtle Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold text-amber-200 uppercase tracking-wide mb-2">
          <Sparkles className="w-3 h-3 text-amber-300" />
          50% Limited Offer in Qatar
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
          📄 Professional ATS CV
        </h2>
        <p className="text-[13px] text-white/90 mt-1">
          Pass automated screening & get hired faster
        </p>

        {/* Pricing */}
        <div className="text-[34px] font-extrabold my-2 text-white flex items-center justify-center gap-3">
          <span>QAR 49</span>
          <span className="text-[16px] line-through text-white/60 font-medium">
            QAR 99
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-white/85">
          <Clock className="w-3.5 h-3.5" />
          <span>Delivered to your WhatsApp within 24 hours</span>
        </div>
      </div>

      {/* Feature Checklist Box */}
      <div className="bg-white rounded-2xl p-5 mt-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-stone-200/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-[#8e1e3c] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            What you get:
          </h3>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="text-[12px] font-bold text-[#8e1e3c] hover:underline flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            View Sample
          </button>
        </div>

        <ul className="space-y-2.5 text-[13.5px] text-[#444]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e5b] shrink-0 mt-0.5" />
            <span>ATS-friendly format that passes robot screening</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e5b] shrink-0 mt-0.5" />
            <span>Professional Qatar &amp; Gulf standard layout</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e5b] shrink-0 mt-0.5" />
            <span>Written &amp; keyword-optimized by HR specialists</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e5b] shrink-0 mt-0.5" />
            <span>Free WhatsApp consultation included</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e5b] shrink-0 mt-0.5" />
            <span>Editable file format (Word .docx + PDF)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2e9e5b] shrink-0 mt-0.5" />
            <span>Guaranteed delivery within 24 hours</span>
          </li>
        </ul>

        {/* Action Buttons */}
        <button
          id="cv-buy-btn"
          onClick={handleBuyCV}
          className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#2e9e5b] hover:bg-[#27864d] active:scale-[0.99] text-white font-extrabold text-[15px] sm:text-[16px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          💳 BUY NOW — QAR 49
        </button>

        <a
          id="waOrderBtn"
          href={defaultWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2.5 py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#20b859] active:scale-[0.99] text-white font-bold text-[14.5px] sm:text-[15px] transition-all shadow-xs flex items-center justify-center gap-2 text-center"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          🟢 Order via WhatsApp
        </a>

        <p className="text-[11px] text-[#999] text-center mt-3 leading-relaxed">
          After payment, send your details on WhatsApp and receive your CV within 24h.
        </p>
      </div>

      {/* Why ATS Matters in Qatar */}
      <div className="bg-stone-50 rounded-xl p-4 mt-3 border border-stone-200/70 text-[12px] text-stone-600">
        <h4 className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#8e1e3c]" />
          Why choose a Qatar ATS-Compliant CV?
        </h4>
        <p className="leading-relaxed">
          Over 80% of top companies in Qatar (including Hamad Medical, Qatar Airways, Qatar Energy, construction giants, and hotel chains) utilize Applicant Tracking Systems (ATS). If your CV isn't formatted with standard headers, keywords, and Gulf requirements, it may be rejected before a hiring manager ever sees it.
        </p>
      </div>

      {/* Adsterra Sponsor Banner */}
      <AdsterraBanner
        adKey="43df2ac0cbaf2d78b90c39f9e38fd913"
        width={320}
        height={50}
        label="Sponsored Career Services"
      />

      {/* Interactive CV Order Form Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-[16px] font-bold text-[#8e1e3c]">
                  Order ATS CV — QAR 49
                </h3>
                <p className="text-[11.5px] text-stone-500">
                  Fill your target job details to order via WhatsApp
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomOrderSubmit} className="space-y-3 mt-3">
              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammed Irfan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Target Job in Qatar
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Light Vehicle Driver / Staff Nurse / Waiter"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                    Experience
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-2.5 py-2 text-[12.5px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white"
                  >
                    <option value="Fresh / Entry">Fresh / Entry Level</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="4-7 years">4-7 years</option>
                    <option value="8+ years">8+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                    Qatar Visa Status
                  </label>
                  <select
                    value={formData.currentVisaStatus}
                    onChange={(e) => setFormData({ ...formData, currentVisaStatus: e.target.value })}
                    className="w-full px-2.5 py-2 text-[12.5px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white"
                  >
                    <option value="Transferable with NOC">Transferable with NOC</option>
                    <option value="Visit / Tourist Visa">Visit / Tourist Visa</option>
                    <option value="Family / Residence Visa">Family / Residence Visa</option>
                    <option value="Outside Qatar (Seeking Job)">Outside Qatar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  placeholder="+974 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Special Notes / Current Job Title
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention previous companies or licenses (e.g. Qatar Driving License, QCHP, MMUP)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-[12.5px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#25d366] hover:bg-[#20b859] text-white font-bold rounded-xl text-[14.5px] shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Send Order to WhatsApp (QAR 49)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATS Sample Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-stone-200 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-[15.5px] font-bold text-[#8e1e3c]">
                  Qatar ATS CV Standard Sample
                </h3>
                <p className="text-[11px] text-stone-500">
                  Clean, robot-scannable format designed for Qatar HR systems
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Simulated Clean ATS CV */}
            <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-left font-sans text-stone-800 shadow-inner">
              <div className="border-b border-stone-300 pb-2.5 text-center">
                <h4 className="text-[16px] font-extrabold text-stone-900 tracking-wide uppercase">
                  AHMED M. KHAN
                </h4>
                <p className="text-[11.5px] text-stone-600 mt-0.5">
                  Doha, Qatar • +974 55XX XXXX • candidate@email.com
                </p>
                <p className="text-[11px] font-semibold text-[#8e1e3c] mt-0.5">
                  Qatar ID: Valid • Qatar Driving License: Valid • Visa: Transferable with NOC
                </p>
              </div>

              <div className="mt-3">
                <h5 className="text-[11.5px] font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-0.5">
                  Professional Profile
                </h5>
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                  Results-driven professional with 5+ years of verified GCC experience in fast-paced commercial operations. Proven expertise in route planning, customer engagement, and health &amp; safety compliance.
                </p>
              </div>

              <div className="mt-2.5">
                <h5 className="text-[11.5px] font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-0.5">
                  Key Skills &amp; Competencies
                </h5>
                <p className="text-[11px] text-stone-600 mt-1">
                  • Qatar Traffic Law &amp; Navigation • POS &amp; Inventory Systems • Bilingual (English &amp; Arabic) • Customer Service Excellence • Time Management
                </p>
              </div>

              <div className="mt-2.5">
                <h5 className="text-[11.5px] font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-0.5">
                  Work Experience in Qatar
                </h5>
                <div className="mt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-800">
                    <span>Operations Specialist — Al-Rayyan Trading</span>
                    <span>2023 – Present</span>
                  </div>
                  <ul className="list-disc list-inside text-[10.5px] text-stone-600 mt-0.5 space-y-0.5">
                    <li>Maintained 99.4% on-time service delivery across Doha, Lusail, and Al Wakrah.</li>
                    <li>Liaised with client managers to resolve logistics inquiries efficiently.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowOrderModal(true);
                }}
                className="flex-1 py-2.5 bg-[#8e1e3c] hover:bg-[#72152e] text-white font-bold rounded-xl text-[13px]"
              >
                Order My CV Now (QAR 49)
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-[13px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
