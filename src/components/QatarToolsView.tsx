import React, { useState, useEffect } from 'react';
import { AdsterraBanner } from './AdsterraBanner';
import {
  Calculator,
  DollarSign,
  Briefcase,
  ExternalLink,
  MessageCircle,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface RatesResponse {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_utc?: string;
}

const DEFAULT_RATES: Record<string, number> = {
  INR: 23.85,
  PKR: 76.5,
  PHP: 15.65,
  BDT: 32.8,
  NPR: 38.15,
  EGP: 13.8,
  LKR: 81.2,
  USD: 0.274,
  EUR: 0.262,
  GBP: 0.219
};

const CURRENCY_LIST = [
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'PKR', flag: '🇵🇰', name: 'Pakistani Rupee' },
  { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso' },
  { code: 'BDT', flag: '🇧🇩', name: 'Bangladeshi Taka' },
  { code: 'NPR', flag: '🇳🇵', name: 'Nepalese Rupee' },
  { code: 'EGP', flag: '🇪🇬', name: 'Egyptian Pound' },
  { code: 'LKR', flag: '🇱🇰', name: 'Sri Lankan Rupee' },
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' }
];

export const QatarToolsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'eos' | 'ot' | 'currency' | 'faq'>('eos');

  // 1. EOS & Leave Salary State
  const [eosBasic, setEosBasic] = useState<number | ''>(3500);
  const [eosYears, setEosYears] = useState<number | ''>(3);
  const [eosUsedLeave, setEosUsedLeave] = useState<number | ''>(30);
  const [eosLoan, setEosLoan] = useState<number | ''>(0);

  // 2. Overtime State
  const [otBasic, setOtBasic] = useState<number | ''>(2500);
  const [otReg, setOtReg] = useState<number | ''>(20);
  const [otNight, setOtNight] = useState<number | ''>(10);
  const [otRest, setOtRest] = useState<number | ''>(8);

  // 3. Currency Rates State
  const [qarAmount, setQarAmount] = useState<number | ''>(1000);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [rateUpdatedDate, setRateUpdatedDate] = useState<string>('Daily Live Feed');

  // Load live currency rates
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/QAR')
      .then((res) => res.json())
      .then((data: RatesResponse) => {
        if (data && data.result === 'success' && data.rates) {
          setRates(data.rates);
          if (data.time_last_update_utc) {
            const d = new Date(data.time_last_update_utc);
            setRateUpdatedDate(
              d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            );
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch open.er-api rates, using cached rates:', err);
      });
  }, []);

  const fmt = (n: number) => {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' QAR';
  };

  // EOS Calculations (exact formula from qatarlivingjobs1.com)
  const basicEosVal = typeof eosBasic === 'number' ? eosBasic : 0;
  const yearsEosVal = typeof eosYears === 'number' ? eosYears : 0;
  const usedLeaveVal = typeof eosUsedLeave === 'number' ? eosUsedLeave : 0;
  const loanVal = typeof eosLoan === 'number' ? eosLoan : 0;

  const eosDaily = basicEosVal / 30;
  const eosGratuity = yearsEosVal >= 1 ? eosDaily * 21 * yearsEosVal : 0;
  const annualLeaveDaysPerYear = yearsEosVal > 5 ? 28 : 21;
  const unusedLeaveDays = Math.max(0, annualLeaveDaysPerYear * yearsEosVal - usedLeaveVal);
  const leavePay = eosDaily * unusedLeaveDays;
  const totalEosPayout = Math.max(0, eosGratuity + leavePay - loanVal);

  // Overtime Calculations (exact formula from qatarlivingjobs1.com)
  const basicOtVal = typeof otBasic === 'number' ? otBasic : 0;
  const regHoursVal = typeof otReg === 'number' ? otReg : 0;
  const nightHoursVal = typeof otNight === 'number' ? otNight : 0;
  const restHoursVal = typeof otRest === 'number' ? otRest : 0;

  const otDaily = basicOtVal / 30;
  const otHourly = otDaily / 8;
  const payReg = otHourly * 1.25 * regHoursVal;
  const payNight = otHourly * 1.5 * nightHoursVal;
  const payRest = otHourly * 1.5 * restHoursVal;
  const totalOtPay = payReg + payNight + payRest;

  // Currency conversion calculation
  const currentRate = rates[selectedCurrency] || DEFAULT_RATES[selectedCurrency] || 1;
  const amtVal = typeof qarAmount === 'number' ? qarAmount : 0;
  const convertedTotal = amtVal * currentRate;

  return (
    <div className="p-4 max-w-xl mx-auto pb-24 space-y-4">
      {/* Sub-navigation bar */}
      <div className="bg-white rounded-xl p-1.5 shadow-xs border border-stone-200 flex overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveSubTab('eos')}
          className={`flex-1 py-2 px-3 text-[12.5px] font-bold rounded-lg shrink-0 transition-all ${
            activeSubTab === 'eos'
              ? 'bg-[#8e1e3c] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          End of Service
        </button>
        <button
          onClick={() => setActiveSubTab('ot')}
          className={`flex-1 py-2 px-3 text-[12.5px] font-bold rounded-lg shrink-0 transition-all ${
            activeSubTab === 'ot'
              ? 'bg-[#8e1e3c] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Overtime Calc
        </button>
        <button
          onClick={() => setActiveSubTab('currency')}
          className={`flex-1 py-2 px-3 text-[12.5px] font-bold rounded-lg shrink-0 transition-all ${
            activeSubTab === 'currency'
              ? 'bg-[#8e1e3c] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Exchange Rates
        </button>
        <button
          onClick={() => setActiveSubTab('faq')}
          className={`py-2 px-3 text-[12.5px] font-bold rounded-lg shrink-0 transition-all ${
            activeSubTab === 'faq'
              ? 'bg-[#8e1e3c] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Tips &amp; Help
        </button>
      </div>

      {/* 1. END OF SERVICE CALCULATOR */}
      {activeSubTab === 'eos' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#8e1e3c]" />
            <div>
              <h3 className="text-[16px] font-bold text-stone-900">
                End of Service &amp; Leave Salary Calculator
              </h3>
              <p className="text-[11.5px] text-stone-500">
                Qatar Labor Law Law No. 14 / 2004 Official Gratuity Formula
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                Monthly Basic Salary (QAR)
              </label>
              <input
                type="number"
                value={eosBasic}
                onChange={(e) => setEosBasic(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 3500"
                className="w-full px-3 py-2 text-[14px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Basic salary only (do not include food, accommodation, or transportation allowances)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  Years of Service
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={eosYears}
                  onChange={(e) => setEosYears(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-2 text-[14px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Eligible after completing 1 full year
                </span>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-stone-700 mb-1">
                  Leave Days Already Taken
                </label>
                <input
                  type="number"
                  value={eosUsedLeave}
                  onChange={(e) => setEosUsedLeave(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 30"
                  className="w-full px-3 py-2 text-[14px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Total days used across tenure
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                Outstanding Company Loan / Deductions (QAR)
              </label>
              <input
                type="number"
                value={eosLoan}
                onChange={(e) => setEosLoan(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-[14px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-[13px] font-bold text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
              Calculation Breakdown
            </h4>

            <div className="space-y-2 text-[12.5px]">
              <div className="flex justify-between text-stone-600">
                <span>Daily Wage (Basic / 30):</span>
                <span className="font-semibold text-stone-800">{fmt(eosDaily)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Gratuity (21 days/yr):</span>
                <span className="font-semibold text-stone-800">{fmt(eosGratuity)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Remaining Unused Leave:</span>
                <span className="font-semibold text-stone-800">{unusedLeaveDays.toFixed(1)} days ({fmt(leavePay)})</span>
              </div>
              {loanVal > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Loan / Deductions:</span>
                  <span className="font-semibold">- {fmt(loanVal)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <span className="text-[13.5px] font-bold text-stone-900">Total Net Settlement:</span>
                <span className="text-[17px] font-black text-[#8e1e3c]">{fmt(totalEosPayout)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. OVERTIME CALCULATOR */}
      {activeSubTab === 'ot' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#8e1e3c]" />
            <div>
              <h3 className="text-[16px] font-bold text-stone-900">
                Qatar Overtime Pay Calculator
              </h3>
              <p className="text-[11.5px] text-stone-500">
                Qatar Labor Law: Normal OT 1.25x • Night &amp; Rest Day OT 1.50x
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                Monthly Basic Salary (QAR)
              </label>
              <input
                type="number"
                value={otBasic}
                onChange={(e) => setOtBasic(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 2500"
                className="w-full px-3 py-2 text-[14px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Regular OT (Hrs)
                </label>
                <input
                  type="number"
                  value={otReg}
                  onChange={(e) => setOtReg(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1.25x rate"
                  className="w-full px-2.5 py-2 text-[13px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
                <span className="text-[9.5px] text-stone-400 mt-0.5 block">Daytime (125%)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Night OT (Hrs)
                </label>
                <input
                  type="number"
                  value={otNight}
                  onChange={(e) => setOtNight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1.50x rate"
                  className="w-full px-2.5 py-2 text-[13px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
                <span className="text-[9.5px] text-stone-400 mt-0.5 block">9pm-6am (150%)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Rest Day OT (Hrs)
                </label>
                <input
                  type="number"
                  value={otRest}
                  onChange={(e) => setOtRest(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1.50x rate"
                  className="w-full px-2.5 py-2 text-[13px] font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
                />
                <span className="text-[9.5px] text-stone-400 mt-0.5 block">Friday/Holiday (150%)</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-[13px] font-bold text-stone-900 mb-2.5 pb-1 border-b border-stone-200">
              Overtime Pay Breakdown
            </h4>

            <div className="space-y-2 text-[12.5px]">
              <div className="flex justify-between text-stone-600">
                <span>Standard Hourly Rate:</span>
                <span className="font-semibold text-stone-800">{fmt(otHourly)} / hr</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Regular OT Pay (125%):</span>
                <span className="font-semibold text-stone-800">{fmt(payReg)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Night OT Pay (150%):</span>
                <span className="font-semibold text-stone-800">{fmt(payNight)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Friday / Rest Day OT Pay (150%):</span>
                <span className="font-semibold text-stone-800">{fmt(payRest)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <span className="text-[13.5px] font-bold text-stone-900">Total Overtime Pay:</span>
                <span className="text-[17px] font-black text-[#2e9e5b]">{fmt(totalOtPay)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CURRENCY CONVERTER */}
      {activeSubTab === 'currency' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#8e1e3c]" />
              <div>
                <h3 className="text-[16px] font-bold text-stone-900">
                  QAR Currency Converter
                </h3>
                <p className="text-[11px] text-stone-500">{rateUpdatedDate}</p>
              </div>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Rates
            </span>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-[12px] font-bold text-stone-700 mb-1">
                Amount in Qatari Riyal (QAR)
              </label>
              <input
                type="number"
                value={qarAmount}
                onChange={(e) => setQarAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="1000"
                className="w-full px-3 py-2 text-[15px] font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#8e1e3c]"
              />
            </div>

            {/* Quick Currency Selection */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1.5 uppercase">
                Select Target Currency:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {CURRENCY_LIST.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCurrency(c.code)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedCurrency === c.code
                        ? 'bg-[#8e1e3c] text-white border-[#8e1e3c] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base block">{c.flag}</span>
                    <span className="text-[11px] font-bold block mt-0.5">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rate Result Box */}
          <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white text-center shadow-md">
            <p className="text-[12px] text-stone-300">
              1 QAR = {currentRate.toLocaleString('en-US', { maximumFractionDigits: 4 })} {selectedCurrency}
            </p>
            <h4 className="text-2xl sm:text-3xl font-black mt-1 text-emerald-400">
              {convertedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-lg text-white font-bold">{selectedCurrency}</span>
            </h4>
            <p className="text-[11.5px] text-stone-400 mt-1">
              {amtVal.toLocaleString('en-US')} QAR converted to {selectedCurrency}
            </p>
          </div>
        </div>
      )}

      {/* 4. CAREER TIPS & FAQ */}
      {activeSubTab === 'faq' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
            <h3 className="text-[15px] font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8e1e3c]" />
              Tip of the Day for Qatar Jobseekers
            </h3>
            <p className="text-[12.5px] text-stone-600 leading-relaxed">
              When applying for jobs in Qatar (especially Qatar Airways, hospitality, or engineering), always tailor your resume to the exact keywords in the vacancy listing. Modern employers in Doha use automated ATS (Applicant Tracking Systems) to filter resumes before human HR reviews them.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
            <h3 className="text-[15px] font-bold text-stone-900 mb-2">
              Qatar Visa Transfer &amp; NOC Guidelines
            </h3>
            <ul className="space-y-2 text-[12px] text-stone-600 list-disc list-inside">
              <li>Under Qatar Labor Law, changing jobs no longer requires a No Objection Certificate (NOC) if you give proper notice.</li>
              <li>Provide notice via the Ministry of Labour ADLSA electronic notification portal.</li>
              <li>Notice period: 1 month if employed less than 2 years; 2 months if employed more than 2 years.</li>
            </ul>
          </div>

          <a
            href="https://whatsapp.com/channel/0029Va8yJ8H1Hsq3"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between shadow-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5 text-white" />
              <div>
                <p className="text-[13px] font-bold">Join Qatar Living Jobs WhatsApp Channel</p>
                <p className="text-[11px] text-emerald-100">Get daily vacancy notifications directly on your phone</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
      {/* Adsterra Sponsor Banner */}
      <AdsterraBanner
        adKey="43df2ac0cbaf2d78b90c39f9e38fd913"
        width={320}
        height={50}
        label="Qatar Deals &amp; Announcements"
      />
    </div>
  );
};
