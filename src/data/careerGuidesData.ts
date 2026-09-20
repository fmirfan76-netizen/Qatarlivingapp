export interface CareerGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Labour Law' | 'Career Advice' | 'Expat Life' | 'Job Safety';
  readTime: string;
  publishedDate: string;
  author: string;
  content: string;
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
}

export const CAREER_GUIDES: CareerGuide[] = [
  {
    id: 'guide-1',
    slug: 'qatar-end-of-service-gratuity-calculation',
    title: 'Qatar Labour Law: Complete Guide to End-of-Service Gratuity (EOSG) & Resignation Rules',
    excerpt: 'Understand how gratuity severance is calculated under Qatar Labour Law No. 14 of 2004, notice period requirements, and employee rights upon leaving a company.',
    category: 'Labour Law',
    readTime: '6 min read',
    publishedDate: 'January 2025 (Updated)',
    author: 'Qatar Living Jobs Editorial Team',
    keyTakeaways: [
      'Workers completing at least one full year of continuous service are legally entitled to End of Service Gratuity.',
      'The minimum legal rate is 21 basic days of salary for every full year worked.',
      'Allowances (housing, transport, phone, overtime) are excluded; calculation is based solely on the last drawn basic salary.',
      'Notice period is 1 month for service up to 2 years, and 2 months for service exceeding 2 years.'
    ],
    faqs: [
      {
        question: 'Can my employer deduct money from my gratuity if I resign voluntarily?',
        answer: 'No. Under current Qatar Labour Law amendments, an employee who resigns in compliance with contractual and statutory notice periods is entitled to their full accrued gratuity, provided they have completed at least one continuous year of service.'
      },
      {
        question: 'When must the final settlement be paid?',
        answer: 'Employers in Qatar are legally required to disburse the final wage, unused annual leave compensation, and end-of-service gratuity within the next working day after the employment ends, or at most within two weeks.'
      }
    ],
    content: `
      <h3>Introduction to Qatar Labour Law No. 14 of 2004</h3>
      <p>Under the Qatar Labour Law, End-of-Service Gratuity (EOSG) serves as a statutory severance benefit designed to reward employees for continuous service. Whether you are an engineer in West Bay, a hospitality supervisor in Lusail, or a logistics coordinator in the Industrial Area, understanding how this benefit is legally calculated protects your financial rights.</p>

      <h3>Eligibility Criteria for Gratuity</h3>
      <p>To qualify for End of Service Gratuity in Qatar, the following conditions must be met:</p>
      <ul>
        <li><strong>Minimum Service:</strong> The employee must have completed at least one continuous full year of employment with the company.</li>
        <li><strong>Lawful Termination or Resignation:</strong> The employment contract must be concluded either by completion, mutual agreement, employer termination without cause, or employee resignation adhering to standard notice periods.</li>
        <li><strong>Exclusions:</strong> Employees dismissed under Article 61 (gross misconduct, forgery, intoxication, or severe commercial breach) forfeit statutory gratuity rights.</li>
      </ul>

      <h3>The Standard Calculation Formula</h3>
      <p>The standard statutory formula mandated by Article 54 of the Labour Law is:</p>
      <blockquote><strong>Gratuity = (Last Drawn Basic Monthly Salary ÷ 30) × 21 days × Years of Continuous Service</strong></blockquote>
      <p>For fractions of a year (months and days), payment is apportioned pro-rata. For example, if you worked 3 years and 6 months at a basic salary of QAR 6,000 per month:</p>
      <ul>
        <li>Daily Basic Rate: QAR 6,000 ÷ 30 = QAR 200</li>
        <li>Gratuity per Year: 21 days × QAR 200 = QAR 4,200</li>
        <li>Total for 3.5 Years: 3.5 × QAR 4,200 = QAR 14,700</li>
      </ul>

      <h3>Notice Periods Required When Resigning</h3>
      <p>The Ministry of Labour (ADLSA) establishes strict notice periods that protect both parties:</p>
      <ul>
        <li><strong>Service Period ≤ 2 Years:</strong> The employee or employer must give at least 1 month written notice through the Ministry's electronic portal.</li>
        <li><strong>Service Period &gt; 2 Years:</strong> At least 2 months written notice must be submitted before the proposed contract conclusion date.</li>
      </ul>
      <p>You can use our interactive <strong>Qatar Gratuity Calculator</strong> in the Tools tab to compute your exact payout based on your official start date and basic salary.</p>
    `
  },
  {
    id: 'guide-2',
    slug: 'change-job-qatar-without-noc-adlsa-guide',
    title: 'How to Change Employers in Qatar Without NOC: Step-by-Step Ministry of Labour Guide',
    excerpt: 'Historic labour reforms eliminated the requirement for a No Objection Certificate (NOC). Learn the exact procedure to submit an electronic job transfer notification.',
    category: 'Labour Law',
    readTime: '7 min read',
    publishedDate: 'February 2025 (Updated)',
    author: 'Qatar Living Jobs Legal Advisory Desk',
    keyTakeaways: [
      'You no longer need a physical NOC letter from your current employer to change jobs in Qatar.',
      'The electronic transfer request must be initiated through the Ministry of Labour (ADLSA) online portal.',
      'You must serve the statutory notice period (1 month if under 2 years of service, 2 months if over 2 years).',
      'The new employer must submit a job offer through the Ministry portal before the transfer is finalized.'
    ],
    faqs: [
      {
        question: 'Can my current employer reject my job transfer request?',
        answer: 'Current employers cannot arbitrarily block a transfer if you have completed probation and served proper statutory notice through the Ministry system. If an employer files a false absconding report, you can dispute it directly with the Labour Relations Department.'
      },
      {
        question: 'What happens during the probation period?',
        answer: 'If transferring during probation (up to 6 months), you must give at least one month notice, and your new employer may be required to compensate the former employer for recruitment and visa expenses.'
      }
    ],
    content: `
      <h3>The Abolition of the Kafala NOC Requirement</h3>
      <p>With Decree Law No. 19 of 2020, the State of Qatar officially dismantled the requirement for expatriate workers to obtain a No Objection Certificate (NOC) from their employer to change jobs. This marked a monumental step forward for workforce mobility and career progression across all economic sectors in Doha.</p>

      <h3>Step-by-Step Electronic Transfer Procedure</h3>
      <ol>
        <li><strong>Secure a Genuine Job Offer:</strong> Ensure your prospective employer has an approved company registration (CR) and an available visa allocation for your nationality and job title.</li>
        <li><strong>Log in to the Ministry Portal:</strong> Access the Ministry of Labour (MoL) Electronic Services portal using your Qatar ID (QID) and registered mobile number with National Authentication System (NAS - Tawtheeq).</li>
        <li><strong>Submit the Employer Change Notification:</strong> Select "Worker Notification to Change Employer" and enter the new company establishment ID (Computer Card number).</li>
        <li><strong>Serve Your Notice Period:</strong> Continue performing your duties professionally during the mandatory notice period (30 days for service under two years; 60 days for service over two years).</li>
        <li><strong>Receive MoL Approval SMS:</strong> Both you and the new employer will receive confirmation text messages from the Ministry once the transfer is officially authorized.</li>
        <li><strong>Sign the New Digital Employment Contract:</strong> The new employer uploads the contract to the Ministry for digital verification and updates your residency permit (QID).</li>
      </ol>

      <h3>Important Tips for a Seamless Transition</h3>
      <p>Always maintain digital copies of your approved employment contract, bank salary transfer records (Wage Protection System), and formal communications. Never sign blank papers or surrender your original passport or QID card to any party.</p>
    `
  },
  {
    id: 'guide-3',
    slug: 'qatar-minimum-wage-law-allowances-explained',
    title: 'Qatar Minimum Wage Law (Law No. 17 of 2020): Basic Salary & Mandatory Allowances Explained',
    excerpt: 'Detailed breakdown of the non-discriminatory statutory minimum wage in Qatar, including mandatory food and housing allowances across all professions.',
    category: 'Labour Law',
    readTime: '5 min read',
    publishedDate: 'January 2025',
    author: 'Qatar Living Jobs Research',
    keyTakeaways: [
      'The statutory basic minimum wage in Qatar is fixed at QAR 1,000 per month.',
      'Employers who do not provide adequate accommodation must pay a minimum housing allowance of QAR 500 per month.',
      'Employers who do not provide daily meals must pay a minimum food allowance of QAR 300 per month.',
      'The minimum gross total compensation is QAR 1,800 per month if food and lodging are not supplied.'
    ],
    faqs: [
      {
        question: 'Does the minimum wage apply to domestic workers and drivers?',
        answer: 'Yes. Qatar Law No. 17 of 2020 applies universally to all workers across private companies, construction, retail, hospitality, domestic workers, and private drivers without distinction.'
      },
      {
        question: 'How does the government verify compliance?',
        answer: 'The Ministry of Labour operates the Wage Protection System (WPS), requiring companies to disburse all employee salaries electronically through licensed Qatari banks, allowing immediate auditing of underpayments.'
      }
    ],
    content: `
      <h3>Qatar's Landmark Minimum Wage Legislation</h3>
      <p>Adopted under Law No. 17 of 2020, Qatar became the first nation in the GCC region to establish a universal, non-discriminatory minimum wage. This legal safety net guarantees that every worker receives fair compensation regardless of their nationality or industry sector.</p>

      <h3>The Three Components of Minimum Compensation</h3>
      <table class="w-full text-[13px] border border-stone-200 my-3">
        <thead class="bg-stone-100 font-bold text-stone-800">
          <tr>
            <th class="p-2 text-left border">Salary Component</th>
            <th class="p-2 text-left border">Minimum Statutory Amount</th>
            <th class="p-2 text-left border">Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 border font-medium">Basic Salary</td>
            <td class="p-2 border font-bold text-[#8e1e3c]">QAR 1,000 / month</td>
            <td class="p-2 border">Mandatory for all full-time workers</td>
          </tr>
          <tr>
            <td class="p-2 border font-medium">Housing Allowance</td>
            <td class="p-2 border font-bold text-stone-800">QAR 500 / month</td>
            <td class="p-2 border">Payable if employer does not provide decent accommodation</td>
          </tr>
          <tr>
            <td class="p-2 border font-medium">Food Allowance</td>
            <td class="p-2 border font-bold text-stone-800">QAR 300 / month</td>
            <td class="p-2 border">Payable if employer does not provide quality daily meals</td>
          </tr>
          <tr class="bg-amber-50/60 font-bold">
            <td class="p-2 border">Total Minimum Gross</td>
            <td class="p-2 border text-amber-900">QAR 1,800 / month</td>
            <td class="p-2 border">Full cash package if no lodging or meals are provided</td>
          </tr>
        </tbody>
      </table>

      <h3>Overtime Wage Calculation</h3>
      <p>Standard working hours under Qatar Labour Law are 8 hours per day or 48 hours per week (reduced to 36 hours during Ramadan). When an employee works beyond normal hours, overtime must be remunerated at the basic wage plus a minimum of <strong>25% extra</strong> for daytime overtime, or <strong>50% extra</strong> for overtime performed between 9:00 PM and 6:00 AM.</p>
    `
  },
  {
    id: 'guide-4',
    slug: 'qatar-id-residence-permit-medical-commission-guide',
    title: 'Qatar ID (QID), Work Visa & Medical Commission: Essential Checklist for New Expatriates',
    excerpt: 'Step-by-step checklist on the residence permit workflow in Doha: Medical Commission screening, fingerprinting (CEID), blood grouping, and QID delivery.',
    category: 'Expat Life',
    readTime: '6 min read',
    publishedDate: 'January 2025',
    author: 'Doha Expat Community Help Desk',
    keyTakeaways: [
      'The Medical Commission test screens for infectious diseases (Chest X-ray for TB, Blood test for HIV/Hepatitis B & C).',
      'Blood group certificate is required before the Qatar ID card can be printed.',
      'Fingerprinting takes place at the Criminal Evidence and Information Department (CEID) or service centers.',
      'Employers must finalize the Qatar ID within 90 days of the employee entering Qatar to avoid visa penalties.'
    ],
    faqs: [
      {
        question: 'How can I check my QID validity and renewal status online?',
        answer: 'You can check your official QID expiration date, traffic violations, and visa status instantly using the Ministry of Interior (MOI) Qatar e-services portal or through the official Metrash2 mobile application.'
      },
      {
        question: 'Who pays the Medical Commission and QID fees?',
        answer: 'By law, all fees associated with entry visas, residency permits, medical screening, and work card issuance must be paid in full by the hiring company.'
      }
    ],
    content: `
      <h3>Arriving in Qatar on an Employment Visa</h3>
      <p>Entering Qatar for professional employment is the beginning of a structured administrative journey. Upon arrival at Hamad International Airport (HIA), your entry visa is stamped, allowing you a 30-day provisional stay while your company PRO initiates the formal Qatar ID (QID) residency workflow.</p>

      <h3>The Four Phases of Residence Permit Issuance</h3>
      <ol>
        <li><strong>Phase 1 — Medical Commission Screening:</strong> Located in Mesaimeer (or private authorized clinics), you undergo a digital chest X-ray to screen for pulmonary tuberculosis and blood tests for Hepatitis B, Hepatitis C, and HIV.</li>
        <li><strong>Phase 2 — Blood Typing:</strong> You must visit an authorized local clinic to obtain an official blood group certificate indicating your blood type (e.g., O+, A-, etc.).</li>
        <li><strong>Phase 3 — Biometric Fingerprinting (CEID):</strong> After passing the medical tests, you attend the Criminal Evidence and Information Department (CEID) or an MOI Services Center (such as Al Rayyan, Mesaimeer, or Al Wakrah) to capture your digital fingerprint records and facial biometrics.</li>
        <li><strong>Phase 4 — Residence Permit (QID) Card Printing:</strong> The Ministry of Interior prints your smart QID card, containing your unique 11-digit Qatar ID number, profession, nationality, and sponsor details.</li>
      </ol>

      <p>Your Qatar ID is the cornerstone of daily life in Doha — needed to open a bank account, sign an apartment tenancy contract, purchase a mobile SIM card, and obtain a Qatari driving license.</p>
    `
  },
  {
    id: 'guide-5',
    slug: 'how-to-spot-fake-job-scams-qatar-visa-fraud',
    title: 'Job Seeker Safety: 7 Red Flags to Identify Fake Job Offers & Visa Scams in the Gulf',
    excerpt: 'Protect your hard-earned savings. Learn how to spot fraudulent recruiters, fake employment contracts, and deceptive visa fee requests in Qatar.',
    category: 'Job Safety',
    readTime: '6 min read',
    publishedDate: 'February 2025',
    author: 'Qatar Living Jobs Fraud Prevention Unit',
    keyTakeaways: [
      'Legitimate Qatari employers NEVER ask job candidates to pay visa processing fees, interview charges, or security deposits.',
      'Under Qatari law, recruitment fees are strictly the responsibility of the employer.',
      'Be suspicious of job offers sent without a formal technical or HR interview.',
      'Always verify official company domain email addresses; legitimate HR teams do not use generic @gmail.com or @yahoo.com for corporate recruitment.'
    ],
    faqs: [
      {
        question: 'What should I do if a recruiter asks for money to process my Qatar visa?',
        answer: 'Immediately stop all communication, do not send any money or credit card numbers, and report the ad to Qatar Living Jobs administrators or the Ministry of Labour hotline (16505).'
      },
      {
        question: 'How do I verify if a Qatar visa is genuine?',
        answer: 'You can verify the authenticity of any Qatar visa online through the Ministry of Interior (MOI) website by navigating to Visa Services &gt; Visa Inquiries &gt; entering the visa number and passport number.'
      }
    ],
    content: `
      <h3>Our Commitment to Candidate Safety</h3>
      <p>At Qatar Living Jobs, we implement active moderation and admin screening to maintain a safe, trusted platform for professionals and employers alike. However, predatory international scammers often create sophisticated imitations of Qatari corporate documents to deceive unsuspecting candidates. Here are the 7 warning signs you must watch for.</p>

      <h3>The 7 Major Job Scam Red Flags</h3>
      <ol>
        <li><strong>Demand for Upfront Fees:</strong> If anyone asks you to wire funds for a "work permit", "medical processing", "embassy attestation", or "flight ticket reservation", it is 100% a scam. Legitimate employers in Qatar cover all statutory recruitment costs.</li>
        <li><strong>Unsolicited Job Offer Without an Interview:</strong> If you receive an extravagant offer with an inflated salary (e.g., QAR 25,000 for an entry-level position) without participating in video or in-person technical interviews, it is fraudulent.</li>
        <li><strong>Generic Email Addresses:</strong> Official HR representatives from established Qatari enterprises communicate from corporate domains (e.g., <em>recruitment@qatarenergy.qa</em> or <em>careers@qatarairways.com.qa</em>), never from personal Gmail, Hotmail, or Outlook accounts.</li>
        <li><strong>Requests for Personal Financial Credentials:</strong> Never share your bank account PIN, online banking passwords, or One-Time Passwords (OTP) with anyone claiming to be a recruiter.</li>
        <li><strong>Fake Hotel or Travel Agency Recommendations:</strong> Scammers often direct candidates to a fictitious travel agency in Dubai or Doha claiming you must book travel or quarantine through them.</li>
        <li><strong>Forged Ministry of Labour Stamps:</strong> Scammers frequently use low-resolution, forged government seals or altered Ministry logos on non-standard letterheads.</li>
        <li><strong>Pressure and Artificial Urgency:</strong> Demands to accept an offer within 24 hours or risk losing the opportunity are a classic manipulation technique designed to prevent you from conducting due diligence.</li>
      </ol>

      <p>If you encounter any suspicious ad or recruiter on our platform, please use the <strong>Report Ad</strong> button or contact us directly on WhatsApp so our admin team can take immediate protective action.</p>
    `
  }
];
