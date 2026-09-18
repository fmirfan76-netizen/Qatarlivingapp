export interface Job {
  id: string;
  title: string;
  link: string;
  img?: string;
  date: string;
  snippet: string;
  category?: string;
  location?: string;
  salary?: string;
  company?: string;
}

export interface AppSettings {
  blogUrl: string;
  whatsappNumber: string;
  paymentUrl: string;
  apkUrl: string;
  lastSynced?: string;
  sourcePage?: string;
  adminPin?: string;
  apkDirectDownloadUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  type: 'job' | 'classified' | 'update' | 'general';
  actionUrl?: string;
  read?: boolean;
}

export interface CvOrderForm {
  fullName: string;
  phone: string;
  email: string;
  targetRole: string;
  experienceYears: string;
  currentVisaStatus: string;
  notes: string;
}

export type ListingType = 'mobile' | 'vehicle' | 'room' | 'job';

export interface UserListing {
  id: string;
  type: ListingType;
  title: string;
  categoryOrBrand: string; // e.g. "Toyota", "Apple", "Executive Bed Space", "Driver"
  priceOrSalary: string; // e.g. "45,000 QAR" or "650 QAR / month" or "3,500 QAR"
  location: string; // e.g. "Doha (Al Sadd)", "Mansoura", "Al Rayyan"
  condition?: string; // e.g. "Brand New Sealed", "Like New", "Good Condition", "Used"
  storage?: string; // e.g. "128GB", "256GB", "512GB", "1TB"
  subCategory?: string; // e.g. for vehicle: "SUV", "Sedan"; for room: "Bed Space", "Master Room", "Single Room"
  mileage?: string; // e.g. "45,000 km"
  yearModel?: string; // e.g. "2023"
  furnished?: string; // e.g. "Fully Furnished", "Semi-Furnished", "Unfurnished"
  utilitiesIncluded?: boolean; // e.g. true (Water/Electricity/WiFi included)
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNotes?: string;
  featured?: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company?: string;
  applicantName: string;
  phone: string;
  email: string;
  currentVisaStatus: string;
  experienceYears: string;
  expectedSalary?: string;
  coverNote?: string;
  cvFileName?: string;
  appliedAt: string;
  status: 'submitted' | 'reviewed' | 'contacted' | 'shortlisted';
}
