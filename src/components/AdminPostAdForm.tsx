import React, { useState } from 'react';
import { UserListing, ListingType } from '../types';
import { SafeHtmlRenderer, containsHtml } from '../utils/htmlRenderer';
import { ImageUploadInput } from './ImageUploadInput';
import {
  Code2,
  Eye,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  Sparkles,
  Smartphone,
  Briefcase,
  Car,
  Home,
  Star,
  Send,
  HelpCircle,
  FileCode
} from 'lucide-react';

interface AdminPostAdFormProps {
  adminPin: string;
  fallbackConfigPin?: string;
  onSubmit: (listing: Partial<UserListing>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SAMPLE_HTML_TEMPLATES: Record<ListingType, { title: string; category: string; price: string; location: string; html: string }> = {
  job: {
    title: 'Executive Sales Consultant (Luxury Retail / Automobiles)',
    category: 'Sales & Retail',
    price: '8,500 - 12,000 QAR + Commission',
    location: 'Doha (West Bay / The Pearl)',
    html: `<h3><strong>Role Overview</strong></h3>
<p>A premier luxury automotive distributor in Doha is urgently seeking an experienced, bilingual <strong>Executive Sales Consultant</strong> to handle high-net-worth client accounts.</p>

<h3><strong>Key Responsibilities</strong></h3>
<ul>
  <li>Cultivate relationships with corporate and VIP clients across Qatar.</li>
  <li>Conduct vehicle demonstrations and lead showroom sales presentations.</li>
  <li>Negotiate contracts and achieve monthly sales targets.</li>
</ul>

<h3><strong>Candidate Requirements</strong></h3>
<ul>
  <li>Minimum <strong>3+ years</strong> of GCC sales experience.</li>
  <li>Valid Qatar Driving License is required.</li>
  <li>Transferable visa with NOC preferred.</li>
</ul>

<p><strong>Package:</strong> Attractive basic salary, performance bonus, private medical insurance, and annual flight ticket.</p>`
  },
  mobile: {
    title: 'iPhone 16 Pro Max 256GB Desert Titanium (Brand New Sealed)',
    category: 'Apple',
    price: '4,450 QAR',
    location: 'Doha (Al Sadd)',
    html: `<p><strong>Brand New Sealed Box</strong> with official 1-Year Apple warranty.</p>

<h3><strong>Key Specifications</strong></h3>
<ul>
  <li><strong>Color:</strong> Desert Titanium</li>
  <li><strong>Storage:</strong> 256 GB</li>
  <li><strong>Condition:</strong> 100% Factory Sealed with official store invoice</li>
  <li><strong>Warranty:</strong> 12 Months Apple Middle East warranty</li>
</ul>

<p><em>Immediate pickup available in Al Sadd or free home delivery across Doha. Cash or bank transfer accepted. Serious buyers only.</em></p>`
  },
  vehicle: {
    title: '2023 Toyota Land Cruiser VXR Twin Turbo (First Owner)',
    category: 'Toyota',
    price: '285,000 QAR',
    location: 'Lusail City',
    html: `<p>Flawless <strong>Toyota Land Cruiser VXR 3.5L Twin Turbo</strong> in Pearl White. Full dealership service history with Al Abdulghani Motors.</p>

<h3><strong>Vehicle Highlights</strong></h3>
<ul>
  <li><strong>Mileage:</strong> 32,000 km only (under warranty until 2028)</li>
  <li><strong>Color:</strong> Pearl White exterior / Tan leather interior</li>
  <li><strong>Features:</strong> Sunroof, 360 Camera, Radar Cruise, JBL Premium Audio, Cool Box</li>
  <li><strong>Accidents:</strong> Zero accidents, original paint 100%</li>
  <li><strong>Istamarah:</strong> Valid until November 2026 with full comprehensive insurance</li>
</ul>

<p>Inspection report ready. Price slightly negotiable for cash buyers upon viewing.</p>`
  },
  room: {
    title: 'Executive Master Bedroom with Balcony & Attached Bath',
    category: 'Master Bedroom',
    price: '2,200 QAR / month',
    location: 'Doha (Mansoura, near Metro)',
    html: `<p>Spacious, sunlit <strong>Executive Master Bedroom</strong> available in a clean, quiet family building in Mansoura (2 mins walk to Metro station).</p>

<h3><strong>Amenities Included (Free of Charge)</strong></h3>
<ul>
  <li>✅ Free Kahramaa (Water &amp; Electricity)</li>
  <li>✅ High-speed 500 Mbps Ooredoo Fiber WiFi</li>
  <li>✅ Central AC with individual temperature controller</li>
  <li>✅ Fully equipped shared kitchen (washing machine, fridge, gas stove, microwave)</li>
  <li>✅ Weekly common area cleaning</li>
</ul>

<p>Suitable for single executive or working couple. No commission. Monthly payment on 1st of each month.</p>`
  }
};

export const AdminPostAdForm: React.FC<AdminPostAdFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [activeMode, setActiveMode] = useState<'compose' | 'html'>('compose');
  const [adType, setAdType] = useState<ListingType>('job');
  const [title, setTitle] = useState('');
  const [categoryOrBrand, setCategoryOrBrand] = useState('Sales & Retail');
  const [priceOrSalary, setPriceOrSalary] = useState('');
  const [location, setLocation] = useState('Doha (West Bay)');
  const [contactName, setContactName] = useState('Qatar Living Admin');
  const [contactPhone, setContactPhone] = useState('97455500000');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(true);
  const [publishStatus, setPublishStatus] = useState<'approved' | 'pending'>('approved');

  // Specific attributes
  const [condition, setCondition] = useState('Brand New Sealed');
  const [storage, setStorage] = useState('256GB');
  const [yearModel, setYearModel] = useState('2023');
  const [mileage, setMileage] = useState('35,000 km');
  const [furnished, setFurnished] = useState('Fully Furnished');
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(true);

  // Description content (HTML string)
  const [descriptionContent, setDescriptionContent] = useState('');

  // Handle template insertion
  const applyTemplate = (type: ListingType) => {
    const tmpl = SAMPLE_HTML_TEMPLATES[type];
    if (tmpl) {
      setAdType(type);
      setTitle(tmpl.title);
      setCategoryOrBrand(tmpl.category);
      setPriceOrSalary(tmpl.price);
      setLocation(tmpl.location);
      setDescriptionContent(tmpl.html);
    }
  };

  // Helper formatting buttons for Compose Mode
  const wrapTextWithTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('admin-ad-desc-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = `${openTag}${selectedText || 'Text'}${closeTag}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setDescriptionContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + (selectedText.length || 4));
    }, 50);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      type: adType,
      title: title.trim(),
      categoryOrBrand: categoryOrBrand.trim(),
      priceOrSalary: priceOrSalary.trim(),
      location: location.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      featured,
      status: publishStatus,
      condition: adType === 'mobile' || adType === 'vehicle' ? condition : undefined,
      storage: adType === 'mobile' ? storage : undefined,
      yearModel: adType === 'vehicle' ? yearModel : undefined,
      mileage: adType === 'vehicle' ? mileage : undefined,
      furnished: adType === 'room' ? furnished : undefined,
      utilitiesIncluded: adType === 'room' ? utilitiesIncluded : undefined,
      description: descriptionContent.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8e1e3c] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-[15px] leading-tight flex items-center gap-2">
              <span>Admin Direct Ad Publisher</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                HTML + Compose Mode
              </span>
            </h3>
            <p className="text-stone-300 text-[11.5px] mt-0.5">
              Publish rich, formatted ads directly to Qatar Living classifieds and jobs
            </p>
          </div>
        </div>

        {/* Templates quick-load chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-stone-400">Insert Sample:</span>
          <button
            type="button"
            onClick={() => applyTemplate('job')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-stone-800 hover:bg-stone-700 text-blue-300 border border-stone-700 cursor-pointer flex items-center gap-1"
          >
            <Briefcase className="w-3 h-3" /> Job
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('mobile')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-stone-800 hover:bg-stone-700 text-purple-300 border border-stone-700 cursor-pointer flex items-center gap-1"
          >
            <Smartphone className="w-3 h-3" /> Mobile
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('vehicle')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 cursor-pointer flex items-center gap-1"
          >
            <Car className="w-3 h-3" /> Car
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('room')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700 cursor-pointer flex items-center gap-1"
          >
            <Home className="w-3 h-3" /> Room
          </button>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-5">
        {/* Step 1: Select Type & Publication Mode */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-stone-700 mb-1.5">
              Listing Category *
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'job', label: 'Job', icon: Briefcase, color: 'text-blue-600' },
                  { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-purple-600' },
                  { id: 'vehicle', label: 'Vehicle', icon: Car, color: 'text-amber-600' },
                  { id: 'room', label: 'Room', icon: Home, color: 'text-emerald-600' }
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isSelected = adType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setAdType(tab.id);
                      if (tab.id === 'job') setCategoryOrBrand('Sales & Retail');
                      if (tab.id === 'mobile') setCategoryOrBrand('Apple');
                      if (tab.id === 'vehicle') setCategoryOrBrand('Toyota');
                      if (tab.id === 'room') setCategoryOrBrand('Master Bedroom');
                    }}
                    className={`py-2 px-2 rounded-xl text-[12px] font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1.5">
              Publish Status
            </label>
            <select
              value={publishStatus}
              onChange={(e: any) => setPublishStatus(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[13px] font-bold text-stone-800 focus:outline-hidden focus:border-[#8e1e3c]"
            >
              <option value="approved">🟢 Instant Live (Approved)</option>
              <option value="pending">🟡 Save as Draft / Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1.5">
              Featured Badge
            </label>
            <label className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-300 rounded-xl cursor-pointer hover:bg-stone-100">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[#8e1e3c] focus:ring-0 cursor-pointer"
              />
              <span className="text-[12px] font-extrabold text-amber-900 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Featured Ad
              </span>
            </label>
          </div>
        </div>

        {/* Step 2: Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              Ad Title / Role Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Executive Sales Consultant, iPhone 16 Pro Max, Toyota Prado V6..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[13.5px] font-semibold text-stone-900 focus:outline-hidden focus:border-[#8e1e3c] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              {adType === 'job' ? 'Category / Profession *' : 'Brand / Sub-category *'}
            </label>
            <input
              type="text"
              required
              value={categoryOrBrand}
              onChange={(e) => setCategoryOrBrand(e.target.value)}
              placeholder="e.g. Driver, Apple, Toyota, Bed Space..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[13px] text-stone-900 focus:outline-hidden focus:border-[#8e1e3c] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              {adType === 'job' ? 'Salary Offered (QAR) *' : 'Price (QAR) *'}
            </label>
            <input
              type="text"
              required
              value={priceOrSalary}
              onChange={(e) => setPriceOrSalary(e.target.value)}
              placeholder="e.g. 5,000 QAR or 45,000 QAR or 650 QAR / month"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[13.5px] font-extrabold text-[#8e1e3c] focus:outline-hidden focus:border-[#8e1e3c] focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              Location in Qatar *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Doha (Al Sadd), West Bay, Lusail, Al Wakrah"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[13px] text-stone-900 focus:outline-hidden focus:border-[#8e1e3c] focus:bg-white"
            />
          </div>
        </div>

        {/* Step 2b: Picture / Photo Upload (Camera, Device Gallery, Drag & Drop, URL, or Curated Samples) */}
        <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <ImageUploadInput
            value={imageUrl}
            onChange={setImageUrl}
            listingType={adType}
            categoryOrBrand={categoryOrBrand}
            label="Ad Picture / Banner Photo"
          />
        </div>

        {/* Step 2b: Category-specific metadata */}
        {adType === 'vehicle' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
            <div>
              <label className="block text-[11.5px] font-bold text-amber-900 mb-1">Year Model</label>
              <input
                type="text"
                value={yearModel}
                onChange={(e) => setYearModel(e.target.value)}
                placeholder="2024"
                className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-[12.5px]"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-amber-900 mb-1">Mileage</label>
              <input
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="35,000 km"
                className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-[12.5px]"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-amber-900 mb-1">Condition</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Flawless / Dealer Maintained"
                className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-[12.5px]"
              />
            </div>
          </div>
        )}

        {adType === 'mobile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-200">
            <div>
              <label className="block text-[11.5px] font-bold text-purple-900 mb-1">Storage</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="128GB, 256GB, 512GB"
                className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-[12.5px]"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-purple-900 mb-1">Condition</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Brand New Sealed or 95%+ Like New"
                className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-[12.5px]"
              />
            </div>
          </div>
        )}

        {adType === 'room' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <div>
              <label className="block text-[11.5px] font-bold text-emerald-900 mb-1">Furnishing</label>
              <input
                type="text"
                value={furnished}
                onChange={(e) => setFurnished(e.target.value)}
                placeholder="Fully Furnished / Semi-Furnished"
                className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-[12.5px]"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="admin-kahramaa-cb"
                checked={utilitiesIncluded}
                onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="admin-kahramaa-cb" className="text-[12.5px] font-bold text-emerald-950 cursor-pointer">
                Kahramaa &amp; WiFi Included in Rent
              </label>
            </div>
          </div>
        )}

        {/* Step 3: THE COMPOSE & HTML VIEW EDITOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <label className="text-[13px] font-extrabold text-stone-900">
                Ad Description &amp; Specifications *
              </label>
              <span className="text-[11px] text-stone-500">
                (Supports HTML formatting and rich layout)
              </span>
            </div>

            {/* Mode Switcher: Compose View vs. HTML View */}
            <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-[12px] font-bold">
              <button
                type="button"
                onClick={() => setActiveMode('compose')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'compose'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#8e1e3c]" />
                <span>Compose / Visual Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('html')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'html'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                <span>HTML Code View</span>
              </button>
            </div>
          </div>

          {/* Quick formatting toolbar */}
          <div className="flex items-center flex-wrap gap-1 p-1.5 bg-stone-100 border border-stone-200 rounded-t-xl text-[12px]">
            <button
              type="button"
              onClick={() => wrapTextWithTag('<strong>', '</strong>')}
              title="Bold <strong>"
              className="p-1.5 px-2 bg-white rounded border border-stone-200 hover:bg-stone-50 font-bold text-stone-700 cursor-pointer flex items-center gap-1"
            >
              <Bold className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => wrapTextWithTag('<em>', '</em>')}
              title="Italic <em>"
              className="p-1.5 px-2 bg-white rounded border border-stone-200 hover:bg-stone-50 font-serif italic text-stone-700 cursor-pointer flex items-center gap-1"
            >
              <Italic className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => wrapTextWithTag('<h3>', '</h3>')}
              title="Heading <h3>"
              className="p-1.5 px-2 bg-white rounded border border-stone-200 hover:bg-stone-50 font-bold text-stone-700 cursor-pointer flex items-center gap-0.5 text-[11px]"
            >
              <Heading2 className="w-3 h-3" /> H3
            </button>
            <button
              type="button"
              onClick={() => wrapTextWithTag('<ul>\n  <li>', '</li>\n  <li>Item 2</li>\n</ul>')}
              title="Unordered List <ul><li>"
              className="p-1.5 px-2 bg-white rounded border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer flex items-center gap-1"
            >
              <List className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => wrapTextWithTag('<p>', '</p>')}
              title="Paragraph <p>"
              className="p-1.5 px-2 bg-white rounded border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer font-mono text-[11px]"
            >
              &lt;p&gt;
            </button>
            <button
              type="button"
              onClick={() => wrapTextWithTag('<span class="bg-amber-100 px-1 rounded font-bold">', '</span>')}
              title="Highlight Tag"
              className="p-1.5 px-2 bg-amber-50 rounded border border-amber-300 hover:bg-amber-100 text-amber-900 cursor-pointer font-semibold text-[11px]"
            >
              Highlight
            </button>
            <button
              type="button"
              onClick={() => wrapTextWithTag('<a href="https://wa.me/97400000000" target="_blank" class="text-[#8e1e3c] font-bold underline">', '</a>')}
              title="Insert Link <a>"
              className="p-1.5 px-2 bg-white rounded border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" /> Link
            </button>

            <span className="ml-auto text-[11px] text-stone-500 pr-1 flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-stone-400" />
              <span>{containsHtml(descriptionContent) ? 'HTML active' : 'Plain text'}</span>
            </span>
          </div>

          {/* Editor Body */}
          {activeMode === 'html' ? (
            <div>
              <textarea
                id="admin-ad-desc-textarea"
                rows={9}
                required
                value={descriptionContent}
                onChange={(e) => setDescriptionContent(e.target.value)}
                placeholder="<p>Enter HTML code here. Example: <h3>Overview</h3> <ul><li>Point 1</li></ul></p>"
                className="w-full p-3 font-mono text-[12.5px] leading-relaxed bg-stone-900 text-emerald-400 border border-t-0 border-stone-300 rounded-b-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Tip: You can paste any standard HTML snippet with &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, and &lt;a&gt; tags.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-t-0 border-stone-200 rounded-b-xl overflow-hidden bg-stone-50/40 p-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-stone-500 mb-1 px-1">
                  ✏️ Edit Text / HTML
                </span>
                <textarea
                  id="admin-ad-desc-textarea"
                  rows={8}
                  required
                  value={descriptionContent}
                  onChange={(e) => setDescriptionContent(e.target.value)}
                  placeholder="Type your ad description or paste HTML tags here..."
                  className="w-full flex-1 p-3 text-[13px] bg-white border border-stone-200 rounded-lg focus:outline-hidden focus:border-[#8e1e3c] leading-relaxed"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-stone-500 mb-1 px-1 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-emerald-600" />
                  <span>Real-time Live Preview</span>
                </span>
                <div className="w-full flex-1 p-3.5 bg-white border border-stone-200 rounded-lg overflow-y-auto max-h-[220px]">
                  {descriptionContent.trim() ? (
                    <SafeHtmlRenderer content={descriptionContent} />
                  ) : (
                    <p className="text-stone-400 italic text-[12px]">
                      Live preview of your styled description will appear here as you type.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-stone-200">
          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              Contact / Employer Name *
            </label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Qatar Living Admin or HR Dept"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[13px] focus:outline-hidden focus:border-[#8e1e3c]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              WhatsApp Contact Number *
            </label>
            <input
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="97455500000"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[13px] font-mono focus:outline-hidden focus:border-[#8e1e3c]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-stone-700 mb-1">
              Email / Apply Link (Optional)
            </label>
            <input
              type="text"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hr@company.qa or https://..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[13px] focus:outline-hidden focus:border-[#8e1e3c]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#8e1e3c] hover:bg-[#72152e] active:scale-[0.98] text-white text-[13.5px] font-extrabold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing Ad...' : publishStatus === 'approved' ? 'Publish Ad Live Now 🚀' : 'Save as Draft'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
