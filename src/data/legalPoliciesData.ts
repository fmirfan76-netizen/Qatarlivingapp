export interface LegalDocument {
  id: 'privacy' | 'terms' | 'about' | 'contact' | 'anti-scam' | 'cookie';
  title: string;
  badge: string;
  lastUpdated: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy & Google AdSense Cookie Disclosure',
    badge: 'Mandatory Policy',
    lastUpdated: 'February 2025 (AdSense Compliant)',
    summary: 'Qatar Living Jobs (https://www.qatarlivingjobs1.com) values your privacy. This policy details how we handle user data, log files, and cookies in strict compliance with Google AdSense publisher policies, GDPR, and international data standards.',
    sections: [
      {
        heading: '1. Introduction & Scope',
        body: `Qatar Living Jobs operates as an online employment portal, classifieds directory, and career resource hub connecting jobseekers, recruiters, and residents across Doha and the State of Qatar. This Privacy Policy governs all visits to https://www.qatarlivingjobs1.com and associated mobile web services. By accessing or using our platform, you acknowledge and agree to the data collection and usage practices described herein.`
      },
      {
        heading: '2. Google AdSense & Third-Party Advertising Cookies (Crucial Disclosure)',
        body: `We partner with third-party advertising networks, prominently including Google AdSense, to serve advertisements when you visit our website. Please take note of the following statutory disclosures required by Google:
• Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
• Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
• Users may opt out of personalized advertising by visiting Google Ads Settings at https://www.google.com/settings/ads.
• Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info or the Network Advertising Initiative (NAI) opt-out page at http://optout.networkadvertising.org/.`
      },
      {
        heading: '3. Log Files and Web Analytics',
        body: `Like most standard web servers, Qatar Living Jobs employs standard log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, platform type, and number of clicks. This data is non-personally identifiable and is analyzed solely to track user movement around the site, diagnose technical anomalies, measure content popularity, and optimize mobile responsiveness.`
      },
      {
        heading: '4. User-Submitted Information (Listings & CV Services)',
        body: `When you submit a classified advertisement (Vehicle, Room, Mobile Phone, Job Vacancy) or request CV formatting assistance, we collect information you explicitly provide:
• Contact Name, Phone Number, WhatsApp Contact, and Email Address.
• Ad details including title, description, location in Qatar, and optional photographs.
All public ads undergo mandatory admin moderation before publication. We never sell, rent, or trade your contact details to third-party telemarketers.`
      },
      {
        heading: '5. GDPR and CCPA Data Subject Rights',
        body: `Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you possess specific fundamental rights regarding your personal information:
• Right to Access: You may request a summary of the personal data we hold about you.
• Right to Rectification: You may request corrections to inaccurate or incomplete records.
• Right to Erasure ("Right to be Forgotten"): You may request immediate removal of your published ads or contact details.
• Right to Restrict or Object to Processing: You may restrict how your data is utilized.
To exercise any of these statutory rights, please email us directly at support@qatarlivingjobs1.com or fmirfan76@gmail.com.`
      },
      {
        heading: '6. Children’s Online Privacy Protection (COPPA)',
        body: `Qatar Living Jobs does not knowingly collect or solicit any personal identification information from children under the age of 13. If you believe your child has submitted personal details on our platform, please contact us immediately, and we will promptly remove the information from our records.`
      },
      {
        heading: '7. Data Security and SSL Encryption',
        body: `We employ industry-standard Hypertext Transfer Protocol Secure (HTTPS) with TLS 1.3 encryption across all communication pathways, safeguarding your browsing sessions from interception or unauthorized tampering.`
      },
      {
        heading: '8. Privacy Officer Contact',
        body: `For questions, clarifications, or privacy requests regarding this policy, please reach our Data Protection team:
• Email: support@qatarlivingjobs1.com / fmirfan76@gmail.com
• Phone / WhatsApp: +974 0000 0000
• Postal Address: Qatar Living Jobs Editorial & Web Desk, C-Ring Road, Doha, State of Qatar.`
      }
    ]
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service & Community Guidelines',
    badge: 'User Agreement',
    lastUpdated: 'February 2025',
    summary: 'By using Qatar Living Jobs, you agree to our terms regarding permissible use, advertisement accuracy, anti-fraud compliance, and intellectual property.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: `By visiting, browsing, or posting content on Qatar Living Jobs (https://www.qatarlivingjobs1.com), you enter into a legally binding agreement governed by these Terms of Service and applicable laws of the State of Qatar.`
      },
      {
        heading: '2. Permissible Use & Classifieds Rules',
        body: `Users may submit advertisements for vehicles, room shares, electronics, and employment opportunities subject to strict editorial standards:
• Honesty: All prices, salaries, vehicle specs, and property details must be truthful and accurate.
• Prohibited Items: We strictly ban duplicate spamming, counterfeit electronics, non-compliant subleases, illegal narcotics, adult content, multi-level marketing (MLM) schemes, and weapons.
• Pre-Publication Moderation: All submitted ads are held in a pending queue and reviewed by an administrator before appearing live to protect the community.`
      },
      {
        heading: '3. Zero Tolerance for Recruitment Fees & Scams',
        body: `Under Qatari Labour Law, recruiters and employers are strictly prohibited from demanding or accepting any placement fees, visa costs, or administrative processing fees from jobseekers. Any advertisement or poster attempting to charge candidates will be permanently banned and referred to the Ministry of Labour.`
      },
      {
        heading: '4. Intellectual Property Rights',
        body: `All original editorial content, calculators, application code, logos, and layout designs on Qatar Living Jobs are the intellectual property of Qatar Living Jobs. Content submitted by users remains their property, but users grant Qatar Living Jobs a perpetual, royalty-free license to display and distribute the content.`
      },
      {
        heading: '5. Limitation of Liability',
        body: `Qatar Living Jobs serves as an informational platform and directory. While we actively review submissions, we do not act as an employer, landlord, or seller. Users are encouraged to conduct personal due diligence prior to executing financial transactions or signing contracts.`
      }
    ]
  },
  about: {
    id: 'about',
    title: 'About Qatar Living Jobs',
    badge: 'Our Mission & Story',
    lastUpdated: 'February 2025',
    summary: 'Learn about our editorial mission, community commitment, and how Qatar Living Jobs provides verified daily employment and classifieds for the people of Qatar.',
    sections: [
      {
        heading: '1. Who We Are',
        body: `Qatar Living Jobs is an independent digital resource and employment community portal dedicated to serving professionals, expatriates, and local residents across Doha, Al Rayyan, Lusail, Al Wakrah, and the wider State of Qatar. Founded with the mission to simplify career discovery in the Gulf, we bridge the gap between reputable Qatari employers and qualified global talent.`
      },
      {
        heading: '2. Our Core Pillars',
        body: `• Daily Verified Jobs: We curate and aggregate legitimate job vacancies spanning engineering, healthcare, hospitality, administration, retail, and construction.
• Practical Labour Tools: We provide accessible, transparent calculation tools — including our official Qatar End-of-Service Gratuity Calculator and QID validity checkers — built in strict accordance with Qatar Labour Law No. 14 of 2004.
• Community Classifieds: A transparent marketplace for residents to buy and sell verified vehicles, mobile phones, and shared accommodation with human moderation.
• Candidate Empowerment: Free, comprehensive guides covering Qatar labour reforms, minimum wage standards, NOC procedures, and CV best practices.`
      },
      {
        heading: '3. Editorial Standards & Content Integrity',
        body: `Every guide, article, and legal advisory published on Qatar Living Jobs is thoroughly fact-checked against official releases from the Ministry of Labour (ADLSA), Ministry of Interior (MOI), and Amiri Decrees. We reject sensationalism and prioritize factual, actionable clarity.`
      }
    ]
  },
  contact: {
    id: 'contact',
    title: 'Contact Us & Editorial Office',
    badge: 'Get in Touch',
    lastUpdated: 'February 2025',
    summary: 'Have an inquiry, feedback, or need assistance? Reach our Doha support and editorial desk directly.',
    sections: [
      {
        heading: '1. Official Contact Channels',
        body: `We are committed to delivering prompt assistance to job seekers, advertisers, and community members:
• Editorial & Support Email: support@qatarlivingjobs1.com / fmirfan76@gmail.com
• WhatsApp Official Helpline: +974 0000 0000 (Available Sunday through Thursday, 8:00 AM – 6:00 PM AST)
• Response Turnaround Time: We guarantee an initial reply within 24 to 48 business hours for all general inquiries, bug reports, and advertisement moderation requests.`
      },
      {
        heading: '2. Advertising & Employer Solutions',
        body: `If you are an HR manager or enterprise looking to hire top talent or place compliant Google AdSense/direct promotional banners, please specify "Corporate Hiring Inquiry" in your subject line.`
      },
      {
        heading: '3. Physical Office Location',
        body: `Qatar Living Jobs Editorial & Operations Desk
C-Ring Road, P.O. Box 24890
Doha, State of Qatar`
      }
    ]
  },
  'anti-scam': {
    id: 'anti-scam',
    title: 'Anti-Scam & Job Seeker Protection Advisory',
    badge: 'Safety First',
    lastUpdated: 'February 2025',
    summary: 'Essential warnings and safety protocols to protect yourself against fraudulent recruiters and visa fee scams in Qatar.',
    sections: [
      {
        heading: '1. Golden Rule: Never Pay for a Job',
        body: `Under the Labour Laws of the State of Qatar (Law No. 14 of 2004), hiring companies and licensed recruitment agencies are legally required to bear all costs associated with recruitment, international flights, visa issuance, and residence permit fees. ANY entity requesting payment from you for an offer letter, interview slot, or work visa is committing fraud.`
      },
      {
        heading: '2. How to Verify a Genuine Qatar Employment Visa',
        body: `You can independently verify whether a visa is authentic before travelling or making commitments:
1. Visit the Ministry of Interior (MOI) Qatar official portal at https://portal.moi.gov.qa
2. Navigate to Inquiries > Visa Services > Visa Inquiry & Printing.
3. Enter your Passport Number and Visa Application Number. If the system returns no record or displays mismatched details, do not proceed.`
      },
      {
        heading: '3. How to Report Suspicious Listings on Our App',
        body: `If you see a suspicious job, vehicle, or room ad on Qatar Living Jobs:
• Click the "Report Ad" button located inside the ad detail view.
• Message our admin team directly via WhatsApp with the Ad Title and phone number.
Our administrative team investigates and removes fraudulent postings within hours.`
      }
    ]
  },
  cookie: {
    id: 'cookie',
    title: 'Cookie Policy & Consent Settings',
    badge: 'ePrivacy & AdSense Compliance',
    lastUpdated: 'February 2025',
    summary: 'Explaining how cookies and local storage are utilized on Qatar Living Jobs, and how you can configure your browser preferences.',
    sections: [
      {
        heading: '1. What Are Cookies?',
        body: `Cookies are small text files stored on your computer or mobile device when you visit a website. They allow the website to remember your actions and preferences (such as language, search filters, and favorite jobs) over a period of time.`
      },
      {
        heading: '2. Types of Cookies We Utilize',
        body: `• Essential Cookies: Necessary for the technical operation of the application (e.g. remembering your theme, pending submissions, and cached job feeds).
• Analytics & Performance Cookies: Help us measure visitor counts and understand which job categories and career guides are most valuable.
• Google AdSense & Advertising Cookies: Used by Google and its certified partners to serve relevant advertisements based on your prior browsing history.`
      },
      {
        heading: '3. Managing Your Cookie Preferences',
        body: `You have the right to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. You can also visit https://www.aboutads.info/choices/ to opt out of third-party interest-based advertising.`
      }
    ]
  }
};
