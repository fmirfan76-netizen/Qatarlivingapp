import React, { useState, useEffect } from 'react';
import { UserListing, AppSettings, ListingType } from '../types';
import { submitNewListing } from '../services/listingService';
import { ImageUploadInput } from './ImageUploadInput';
import {
  X,
  Smartphone,
  Car,
  Home,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ShieldAlert,
  Zap,
  Gauge,
  Calendar
} from 'lucide-react';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newListing: UserListing) => void;
  settings: AppSettings;
  defaultType?: ListingType;
}

const MOBILE_BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'Huawei', 'OnePlus', 'Honor', 'Other'];
const VEHICLE_BRANDS = ['Toyota', 'Nissan', 'Hyundai', 'Kia', 'Lexus', 'Honda', 'Ford', 'Mitsubishi', 'BMW', 'Mercedes', 'Other'];
const ROOM_TYPES = ['Bed Space', 'Single Room', 'Master Bedroom', 'Studio Apartment', 'Partition Room', '1BHK Flat'];
const FURNISHED_OPTIONS = ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];
const CONDITIONS = ['Brand New Sealed', 'Like New (95%+)', 'Excellent Condition', 'Good Condition', 'Fair / Used'];
const STORAGES = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const VEHICLE_BODY_TYPES = ['SUV', 'Sedan', 'Pickup Truck', 'Coupe', 'Hatchback', 'Van'];
const QATAR_CITIES = [
  'Doha (Al Sadd)',
  'Doha (Mansoura)',
  'Doha (West Bay)',
  'Doha (Najma)',
  'Doha (Matar Qadeem)',
  'Doha (Bin Mahmoud)',
  'Doha (The Pearl)',
  'Al Rayyan',
  'Al Wakrah',
  'Lusail',
  'Al Khor',
  'Industrial Area',
  'Other Qatar'
];
const JOB_CATEGORIES = ['Driver', 'Office & Admin', 'Hospitality', 'Healthcare', 'Engineering', 'Sales & Retail', 'Security', 'Finance & Accounting', 'General'];

const DEFAULT_PHONE_IMAGES: Record<string, string> = {
  Apple: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
  Samsung: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
  Xiaomi: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80'
};

const DEFAULT_VEHICLE_IMAGES: Record<string, string> = {
  Toyota: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
  Nissan: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
  Hyundai: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
  Lexus: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80'
};

const DEFAULT_ROOM_IMAGES: Record<string, string> = {
  'Bed Space': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80',
  'Master Bedroom': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
  'Single Room': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=600&auto=format&fit=crop&q=80',
  'Studio Apartment': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80'
};

const DEFAULT_JOB_IMAGES: Record<string, string> = {
  Driver: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
  'Office & Admin': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
  Hospitality: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
  Healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
  Engineering: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=600&auto=format&fit=crop&q=80',
  'Sales & Retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
};

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  settings,
  defaultType = 'mobile'
}) => {
  const [listingType, setListingType] = useState<ListingType>(defaultType);
  const [title, setTitle] = useState('');
  const [categoryOrBrand, setCategoryOrBrand] = useState('Apple');
  const [priceOrSalary, setPriceOrSalary] = useState('');
  const [location, setLocation] = useState('Doha (Al Sadd)');
  const [condition, setCondition] = useState('Like New (95%+)');
  const [storage, setStorage] = useState('256GB');
  
  // Specific for Vehicles
  const [yearModel, setYearModel] = useState('2023');
  const [mileage, setMileage] = useState('45,000 km');
  const [vehicleBody, setVehicleBody] = useState('SUV');

  // Specific for Rooms & Bed Space
  const [furnished, setFurnished] = useState('Fully Furnished');
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(true);

  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<UserListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync default type when opened
  useEffect(() => {
    if (isOpen) {
      setListingType(defaultType);
      handleCategoryDefaults(defaultType);
    }
  }, [isOpen, defaultType]);

  const handleCategoryDefaults = (type: ListingType) => {
    if (type === 'mobile') {
      setCategoryOrBrand('Apple');
    } else if (type === 'vehicle') {
      setCategoryOrBrand('Toyota');
      setCondition('Excellent Condition');
    } else if (type === 'room') {
      setCategoryOrBrand('Bed Space');
      setLocation('Doha (Mansoura)');
    } else if (type === 'job') {
      setCategoryOrBrand('Driver');
    }
  };

  const handleTypeSelect = (type: ListingType) => {
    setListingType(type);
    handleCategoryDefaults(type);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a descriptive title.');
      return;
    }
    if (!priceOrSalary.trim()) {
      setError(
        listingType === 'room'
          ? 'Please enter monthly rent in QAR.'
          : listingType === 'job'
          ? 'Please enter salary offer in QAR.'
          : 'Please enter selling price in QAR.'
      );
      return;
    }
    if (!contactPhone.trim()) {
      setError('Please enter your WhatsApp contact phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      let selectedImage = customImageUrl.trim();
      if (!selectedImage) {
        if (listingType === 'mobile') {
          selectedImage = DEFAULT_PHONE_IMAGES[categoryOrBrand] || DEFAULT_PHONE_IMAGES.Other;
        } else if (listingType === 'vehicle') {
          selectedImage = DEFAULT_VEHICLE_IMAGES[categoryOrBrand] || DEFAULT_VEHICLE_IMAGES.Other;
        } else if (listingType === 'room') {
          selectedImage = DEFAULT_ROOM_IMAGES[categoryOrBrand] || DEFAULT_ROOM_IMAGES.Other;
        } else if (listingType === 'job') {
          selectedImage = DEFAULT_JOB_IMAGES[categoryOrBrand] || DEFAULT_JOB_IMAGES.Other;
        }
      }

      // Format price string cleanly with QAR
      let formattedPrice = priceOrSalary.trim();
      if (listingType === 'room' && !formattedPrice.toLowerCase().includes('/ month') && !formattedPrice.toLowerCase().includes('/month')) {
        formattedPrice = formattedPrice.toUpperCase().includes('QAR')
          ? `${formattedPrice} / month`
          : `${formattedPrice} QAR / month`;
      } else if (!formattedPrice.toUpperCase().includes('QAR')) {
        formattedPrice = `${formattedPrice} QAR`;
      }

      const payload: Partial<UserListing> = {
        type: listingType,
        title: title.trim(),
        categoryOrBrand,
        priceOrSalary: formattedPrice,
        location,
        condition: listingType === 'mobile' || listingType === 'vehicle' ? condition : undefined,
        storage: listingType === 'mobile' ? storage : undefined,
        yearModel: listingType === 'vehicle' ? yearModel : undefined,
        mileage: listingType === 'vehicle' ? mileage : undefined,
        subCategory: listingType === 'vehicle' ? vehicleBody : (listingType === 'room' ? categoryOrBrand : undefined),
        furnished: listingType === 'room' ? furnished : undefined,
        utilitiesIncluded: listingType === 'room' ? utilitiesIncluded : undefined,
        description: description.trim(),
        contactName: contactName.trim() || 'Advertiser',
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim() || undefined,
        imageUrl: selectedImage || undefined,
        status: 'pending' // strictly awaits admin permission
      };

      const result = await submitNewListing(payload);
      if (result.success && result.listing) {
        setSubmittedListing(result.listing);
        onSuccess(result.listing);
      } else {
        throw new Error(result.message || 'Submission error');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setPriceOrSalary('');
    setDescription('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setCustomImageUrl('');
    setSubmittedListing(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8e1e3c] to-[#72152e] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] sm:text-[17px] flex items-center gap-2">
              <span>+ Post Ad (Separated by Category)</span>
            </h3>
            <p className="text-[11.5px] text-stone-200">
              Vehicles, Rooms, Bed Space, Mobiles &amp; Jobs (Admin Verified)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {submittedListing ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-[18px] font-black text-stone-900">
                Ad Submitted Successfully!
              </h4>
              <p className="text-[13px] text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Your{' '}
                <span className="font-bold text-[#8e1e3c]">
                  {submittedListing.type === 'vehicle' && '🚗 Vehicle Listing'}
                  {submittedListing.type === 'room' && '🛏️ Room / Bed Space Listing'}
                  {submittedListing.type === 'mobile' && '📱 Mobile Phone Listing'}
                  {submittedListing.type === 'job' && '💼 Job Vacancy Listing'}
                </span>{' '}
                is placed in <span className="font-bold text-amber-600">Pending Review</span>. It will be published live in its separated category once approved by the admin.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-[12.5px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Category:</span>
                <span className="font-bold text-stone-800 uppercase text-[11px] tracking-wide">
                  {submittedListing.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Title:</span>
                <span className="font-bold text-stone-800 line-clamp-1">{submittedListing.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Price / Rent:</span>
                <span className="font-extrabold text-[#8e1e3c]">{submittedListing.priceOrSalary}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                <span className="text-stone-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  🟡 Awaiting Admin Approval
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '') || '97400000000'}?text=${encodeURIComponent(
                  `Hi Qatar Living Jobs Admin! I just submitted a ${submittedListing.type} ad: "${submittedListing.title}" (${submittedListing.priceOrSalary}). Please review and approve it.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#20b859] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Notify Admin on WhatsApp for Fast Approval
              </a>

              <button
                onClick={() => {
                  handleResetForm();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[13px] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* 4 Category Selection Cards */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1.5">
                Select Category (Ads are separated by category):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Mobile */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('mobile')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    listingType === 'mobile'
                      ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span className="text-[12px] font-bold">Mobile Phone</span>
                </button>

                {/* 2. Vehicle */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('vehicle')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    listingType === 'vehicle'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Car className="w-5 h-5 text-amber-600" />
                  <span className="text-[12px] font-bold">Vehicle / Car</span>
                </button>

                {/* 3. Room / Bed Space */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('room')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    listingType === 'room'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="text-[12px] font-bold">Room / Bed</span>
                </button>

                {/* 4. Job */}
                <button
                  type="button"
                  onClick={() => handleTypeSelect('job')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    listingType === 'job'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="text-[12px] font-bold">Job Vacancy</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[12px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                {listingType === 'mobile' && 'Phone Model Title *'}
                {listingType === 'vehicle' && 'Car Make & Model Title *'}
                {listingType === 'room' && 'Accommodation Title *'}
                {listingType === 'job' && 'Job Vacancy Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  listingType === 'mobile'
                    ? 'e.g. iPhone 15 Pro Max Natural Titanium 256GB'
                    : listingType === 'vehicle'
                    ? 'e.g. Toyota Land Cruiser 2023 GXR V6 Twin Turbo'
                    : listingType === 'room'
                    ? 'e.g. Executive Bed Space in Mansoura (Near Metro)'
                    : 'e.g. Heavy Duty Driver with Qatar Driving License'
                }
                className="w-full px-3 py-2 text-[13.5px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
              />
            </div>

            {/* Category / Brand Specific Selectors */}
            {listingType === 'vehicle' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Car Make / Brand *
                  </label>
                  <select
                    value={categoryOrBrand}
                    onChange={(e) => setCategoryOrBrand(e.target.value)}
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                  >
                    {VEHICLE_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Body Type
                  </label>
                  <select
                    value={vehicleBody}
                    onChange={(e) => setVehicleBody(e.target.value)}
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                  >
                    {VEHICLE_BODY_TYPES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Model Year
                  </label>
                  <input
                    type="text"
                    value={yearModel}
                    onChange={(e) => setYearModel(e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Mileage (km)
                  </label>
                  <input
                    type="text"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="e.g. 45,000 km"
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                  />
                </div>
              </div>
            )}

            {listingType === 'room' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Room Type *
                  </label>
                  <select
                    value={categoryOrBrand}
                    onChange={(e) => setCategoryOrBrand(e.target.value)}
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                  >
                    {ROOM_TYPES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Furnishing
                  </label>
                  <select
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value)}
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                  >
                    {FURNISHED_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={utilitiesIncluded}
                      onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[12px] font-bold text-emerald-900">
                      ⚡ Kahramaa (Water &amp; Electricity) and High-Speed WiFi included in rent
                    </span>
                  </label>
                </div>
              </div>
            )}

            {listingType === 'mobile' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Phone Brand *
                  </label>
                  <select
                    value={categoryOrBrand}
                    onChange={(e) => setCategoryOrBrand(e.target.value)}
                    className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                  >
                    {MOBILE_BRANDS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-stone-700 mb-1">
                    Storage Capacity
                  </label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full px-2.5 py-2 text-[12.5px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                  >
                    {STORAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {listingType === 'job' && (
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  Job Profession / Industry *
                </label>
                <select
                  value={categoryOrBrand}
                  onChange={(e) => setCategoryOrBrand(e.target.value)}
                  className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Price / Rent / Salary & Condition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  {listingType === 'room' ? 'Monthly Rent (QAR) *' : listingType === 'job' ? 'Salary Offer (QAR) *' : 'Selling Price (QAR) *'}
                </label>
                <input
                  type="text"
                  required
                  value={priceOrSalary}
                  onChange={(e) => setPriceOrSalary(e.target.value)}
                  placeholder={
                    listingType === 'room'
                      ? 'e.g. 650 QAR / month'
                      : listingType === 'vehicle'
                      ? 'e.g. 45,000 QAR'
                      : listingType === 'mobile'
                      ? 'e.g. 3,200 QAR'
                      : 'e.g. 3,500 QAR'
                  }
                  className="w-full px-3 py-2 text-[13.5px] font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  {listingType === 'job' ? 'Visa / Transfer Status' : 'Condition'}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-2.5 py-2 text-[12.5px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white font-medium"
                >
                  {listingType === 'job' ? (
                    <>
                      <option value="Visa Transfer with NOC">Visa Transfer with NOC</option>
                      <option value="Free Visa / Freelancer">Free Visa / Freelancer</option>
                      <option value="Husband / Family Visa">Husband / Family Visa</option>
                      <option value="Visa Provided by Company">Visa Provided by Company</option>
                    </>
                  ) : (
                    CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                Location in Qatar
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c] bg-white"
              >
                {QATAR_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                {listingType === 'vehicle' && 'Vehicle Details (Service history, accident free, features)'}
                {listingType === 'room' && 'Accommodation Details (Metro distance, washing machine, cooking allowed)'}
                {listingType === 'mobile' && 'Phone Details (Warranty, battery health, charger included)'}
                {listingType === 'job' && 'Job Requirements &amp; Working Hours'}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  listingType === 'vehicle'
                    ? 'e.g. Istimara valid for 1 year, new tires, clean interior, non-smoker owner.'
                    : listingType === 'room'
                    ? 'e.g. 2 minutes walk to Metro, quiet flat with automatic washing machine and cooking allowed.'
                    : listingType === 'mobile'
                    ? 'e.g. Original box, cable, and receipt included. 99% battery health.'
                    : 'e.g. Minimum 2 years experience in Qatar, transferable visa with NOC.'
                }
                className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  Your Name / Contact *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ahmed / Tariq"
                  className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 97455123456"
                  className="w-full px-3 py-2 text-[13px] border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
              </div>
            </div>

            {/* Picture / Photo Upload (Camera, Device Gallery, Drag & Drop, URL, or Curated Samples) */}
            <div className="pt-1">
              <ImageUploadInput
                value={customImageUrl}
                onChange={setCustomImageUrl}
                listingType={listingType}
                categoryOrBrand={categoryOrBrand}
                label="Ad Picture / Photo"
              />
            </div>

            {/* Moderation Policy Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11.5px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Admin Moderation Notice:</span> Every submission is placed in <strong>Pending Status</strong> and reviewed by our admin team before appearing live in its dedicated category section.
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-[13.5px] hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-3 px-4 rounded-xl bg-[#8e1e3c] hover:bg-[#72152e] text-white font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Submit for Admin Approval</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
