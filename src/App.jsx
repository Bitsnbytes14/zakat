import React, { useState, useEffect } from 'react';
import { 
  Wallet, Coins, CircleDollarSign, TrendingUp, HandCoins,
  CreditCard, Receipt, Calculator, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, RefreshCw, Moon, Sun, Info, Link, Download, Lightbulb
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { calculateZakatAPI } from './api';
import './index.css';

// ── Constants ────────────────────────────────────────────────────────────────
const GOLD_PRICE = 6000;   // ₹ per gram
const SILVER_PRICE = 70;   // ₹ per gram

// ── Translations ─────────────────────────────────────────────────────────────
const translations = {
  en: {
    appTitle: 'Smart Zakat Calculator',
    appSubtitle: 'Calculate your Zakat accurately and effortlessly',
    steps: ['Assets', 'Liabilities', 'Summary', 'Result'],
    cashInBank: 'Cash in Bank (₹)',
    cashInHand: 'Cash in Hand (₹)',
    goldGrams: 'Gold (grams)',
    silverGrams: 'Silver (grams)',
    investments: 'Investments & Stocks (₹)',
    outstandingLoans: 'Outstanding Loans (₹)',
    pendingDues: 'Pending Dues / Bills (₹)',
    yourSummary: 'Your Summary',
    assets: 'Assets',
    liabilities: 'Liabilities',
    cashInBankShort: 'Cash in Bank',
    cashInHandShort: 'Cash in Hand',
    gold: 'Gold',
    silver: 'Silver',
    investmentsShort: 'Investments',
    loans: 'Loans',
    pendingDuesShort: 'Pending Dues',
    grams: 'grams',
    nisabReached: 'Nisab Reached',
    belowNisab: 'Below Nisab Threshold',
    totalZakatDue: 'Total Zakat Due',
    eligibleMsg: 'You are eligible for Zakat.',
    eligibleDetail: 'Your net wealth exceeds the Nisab minimum. It is highly recommended to distribute your required Zakat of',
    eligibleDetail2: 'as soon as possible to those in need.',
    notEligibleMsg: 'Zakat is NOT obligatory for you.',
    notEligibleDetail: 'Your calculated net wealth',
    notEligibleDetail2: 'currently falls below the Nisab threshold of',
    zakatBreakdown: 'Zakat Component Breakdown',
    cashAssets: 'Cash Assets',
    goldValue: 'Gold Value',
    silverValue: 'Silver Value',
    liabilitiesDeduction: 'Liabilities Deduction',
    finalOverview: 'Final Accounting Overview',
    totalGrossAssets: 'Total Gross Assets',
    totalLiabilities: 'Total Liabilities',
    netWealth: 'Net Wealth Evaluated',
    categoryBreakdown: 'Zakat Category Breakdown',
    zakataOnCash: 'Zakat on Cash',
    zakataOnGold: 'Zakat on Gold',
    zakataOnInvestments: 'Zakat on Investments',
    back: 'Back',
    next: 'Next',
    calculateZakat: 'Calculate Zakat',
    calculating: 'Calculating...',
    recalculate: 'Recalculate Now',
    warningTitle: 'Warning:',
    warningMsg: "You haven't entered any assets yet. Double check that you aren't missing anything before calculating.",
    placeholder: '₹0',
    downloadPdf: 'Download PDF',
    adviceTitle: 'Smart Insights',
    adviceBelowNisab: 'You are below Nisab, no Zakat required this year.',
    adviceHighGold: 'A large portion of your Zakat comes from gold assets.',
    adviceHighLiabilities: 'Your liabilities significantly reduce your Zakat obligation.',
    adviceHighInvestments: 'Your investment portfolio contributes substantially to your Zakat.',
    adviceHighCash: 'Your liquid cash forms a significant part of your Zakat.',
  },
  ur: {
    appTitle: 'سمارٹ زکوٰۃ کیلکولیٹر',
    appSubtitle: 'درست اور آسانی سے اپنی زکوٰۃ حساب کریں',
    steps: ['اثاثے', 'ذمہ داریاں', 'خلاصہ', 'نتیجہ'],
    cashInBank: 'بینک میں رقم (₹)',
    cashInHand: 'ہاتھ میں نقد (₹)',
    goldGrams: 'سونا (گرام)',
    silverGrams: 'چاندی (گرام)',
    investments: 'سرمایہ کاری و حصص (₹)',
    outstandingLoans: 'بقایا قرضے (₹)',
    pendingDues: 'واجب الادا بِل (₹)',
    yourSummary: 'آپ کا خلاصہ',
    assets: 'اثاثے',
    liabilities: 'ذمہ داریاں',
    cashInBankShort: 'بینک میں رقم',
    cashInHandShort: 'ہاتھ میں نقد',
    gold: 'سونا',
    silver: 'چاندی',
    investmentsShort: 'سرمایہ کاری',
    loans: 'قرضے',
    pendingDuesShort: 'واجب الادا',
    grams: 'گرام',
    nisabReached: 'نصاب پورا ہوا',
    belowNisab: 'نصاب سے کم',
    totalZakatDue: 'کل زکوٰۃ واجب',
    eligibleMsg: 'آپ زکوٰۃ کے اہل ہیں۔',
    eligibleDetail: 'آپ کی خالص دولت نصاب کی حد سے زیادہ ہے۔ آپ کی زکوٰۃ',
    eligibleDetail2: 'جلد از جلد ضرورت مندوں میں تقسیم کریں۔',
    notEligibleMsg: 'آپ پر زکوٰۃ واجب نہیں ہے۔',
    notEligibleDetail: 'آپ کی خالص دولت',
    notEligibleDetail2: 'نصاب کی حد سے کم ہے جو کہ',
    zakatBreakdown: 'زکوٰۃ اجزاء کی تفصیل',
    cashAssets: 'نقد اثاثے',
    goldValue: 'سونے کی قیمت',
    silverValue: 'چاندی کی قیمت',
    liabilitiesDeduction: 'ذمہ داریوں کی کٹوتی',
    finalOverview: 'حتمی حسابی جائزہ',
    totalGrossAssets: 'کل مجموعی اثاثے',
    totalLiabilities: 'کل ذمہ داریاں',
    netWealth: 'خالص دولت',
    categoryBreakdown: 'زکوٰۃ زمرہ تفصیل',
    zakataOnCash: 'نقد پر زکوٰۃ',
    zakataOnGold: 'سونا پر زکوٰۃ',
    zakataOnInvestments: 'سرمایہ کاری پر زکوٰۃ',
    back: 'واپس',
    next: 'آگے',
    calculateZakat: 'زکوٰۃ حساب کریں',
    calculating: 'حساب ہو رہا ہے...',
    recalculate: 'دوبارہ حساب کریں',
    warningTitle: 'تنبیہ:',
    warningMsg: 'آپ نے ابھی تک کوئی اثاثہ درج نہیں کیا۔ حساب کرنے سے پہلے دوبارہ جانچ لیں۔',
    placeholder: '₹0',
    downloadPdf: 'PDF ڈاؤنلوڈ کریں',
    adviceTitle: 'سمیرت مشورے',
    adviceBelowNisab: 'آپ نصاب سے نیچے ہیں، اس سال زکوٰۃ واجب نہیں۔',
    adviceHighGold: 'آپ کی زکوٰۃ کا بڑا حصہ سونے کے اثاثوں سے آتا ہے۔',
    adviceHighLiabilities: 'آپ کے ذمہ داریوں سے آپ کی زکوٰۃ کی رقم کم ہوجاتی ہے۔',
    adviceHighInvestments: 'آپ کا سرمایہ کاری پورٹ فولیو آپ کی زکوٰۃ میں نمایاں حصہ ڈالتا ہے۔',
    adviceHighCash: 'آپ کا نقد رقم آپ کی زکوٰۃ کا اہم حصہ ہے۔',
  }
};

// ── Indian number formatter ───────────────────────────────────────────────────
const formatINR = (value) => {
  const num = Number(value);
  if (isNaN(num)) return '₹0.00';
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── InputGroup (outside App to prevent re-mount on every render) ───────────
const InputGroup = ({ label, fieldName, value, onChange, icon: Icon, isRTL }) => (
  <div className="form-group">
    <label>{label}</label>
    <div className={`input-wrapper ${isRTL ? 'rtl-input' : ''}`}>
      <Icon className="input-icon" size={20} />
      <input
        type="number"
        className="input-field"
        name={fieldName}
        value={value}
        onChange={onChange}
        placeholder="0"
        min="0"
        autoComplete="off"
      />
    </div>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const t = translations[lang];
  const isRTL = lang === 'ur';

  const [assets, setAssets] = useState({
    cashInBank: '',
    cashInHand: '',
    gold: '',
    silver: '',
    investments: ''
  });

  const [liabilities, setLiabilities] = useState({
    loans: '',
    pendingDues: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Apply dark mode theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply RTL direction
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(lang === 'en' ? 'ur' : 'en');

  // ── Input handlers (fixed: proper controlled inputs, no re-mount) ──────────
  const handleAssetChange = (field) => (e) => {
    const value = e.target.value;
    // Allow empty string or valid non-negative numbers
    if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setAssets(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLiabilityChange = (field) => (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setLiabilities(prev => ({ ...prev, [field]: value }));
    }
  };

  const resetForm = () => {
    setAssets({ cashInBank: '', cashInHand: '', gold: '', silver: '', investments: '' });
    setLiabilities({ loans: '', pendingDues: '' });
    setStep(1);
    setResult(null);
    setError(null);
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calculateZakatAPI(assets, liabilities);
      setResult(data);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isAssetsEmpty = Object.values(assets).every(v => v === '' || Number(v) === 0);

  const getCategoryBreakdown = () => {
    const cashTotal = Number(assets.cashInBank || 0) + Number(assets.cashInHand || 0);
    const goldValue = Number(assets.gold || 0) * GOLD_PRICE;
    const investmentsValue = Number(assets.investments || 0);

    return {
      cash: cashTotal * 0.025,
      gold: goldValue * 0.025,
      investments: investmentsValue * 0.025
    };
  };

  const formatPdfCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return '\u20B9 0.00';
    return '\u20B9 ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const generatePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Zakat Calculation Report', 105, 22, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Date: ${today}`, 105, 30, { align: 'center' });

    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(20, 36, 190, 36);

    let startY = 45;

    doc.autoTable({
      startY,
      head: [['Assets', '']],
      body: [
        ['Cash in Bank', formatPdfCurrency(assets.cashInBank || 0)],
        ['Cash in Hand', formatPdfCurrency(assets.cashInHand || 0)],
        ['Gold', `${assets.gold || 0} grams`],
        ['Silver', `${assets.silver || 0} grams`],
        ['Investments', formatPdfCurrency(assets.investments || 0)],
        ['Total Assets', formatPdfCurrency(result.totalAssets)],
      ],
      theme: 'plain',
      headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', fontSize: 12 },
      bodyStyles: { fontSize: 11 },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 70, halign: 'right' } },
      margin: { left: 20, right: 20 },
      didDrawPage: () => {},
    });

    const liabilitiesY = doc.lastAutoTable.finalY + 12;
    doc.autoTable({
      startY: liabilitiesY,
      head: [['Liabilities', '']],
      body: [
        ['Outstanding Loans', formatPdfCurrency(liabilities.loans || 0)],
        ['Pending Dues', formatPdfCurrency(liabilities.pendingDues || 0)],
        ['Total Liabilities', formatPdfCurrency(result.totalLiabilities)],
      ],
      theme: 'plain',
      headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', fontSize: 12 },
      bodyStyles: { fontSize: 11 },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 70, halign: 'right' } },
      margin: { left: 20, right: 20 },
    });

    const netWealthY = doc.lastAutoTable.finalY + 12;
    doc.autoTable({
      startY: netWealthY,
      head: [['Net Wealth', '']],
      body: [
        ['', formatPdfCurrency(result.netWealth)],
      ],
      theme: 'plain',
      headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', fontSize: 12 },
      bodyStyles: { fontSize: 11 },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 70, halign: 'right' } },
      margin: { left: 20, right: 20 },
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.autoTable({
      startY: finalY,
      head: [['Zakat Amount', '']],
      body: [
        ['', formatPdfCurrency(result.zakat)],
      ],
      theme: 'plain',
      headStyles: { fillColor: [220, 220, 220], fontStyle: 'bold', fontSize: 14 },
      bodyStyles: { fontSize: 13, fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 70, halign: 'right' } },
      margin: { left: 20, right: 20 },
    });

    doc.save('zakat-report.pdf');
  };

  const getAdvice = () => {
    if (!result) return [];
    const advice = [];
    
    if (!result.eligible || result.zakat === 0) {
      advice.push({ key: 'adviceBelowNisab', message: t.adviceBelowNisab });
      return advice;
    }
    
    const breakdown = getCategoryBreakdown();
    const totalZakat = result.zakat || 1;
    
    if (breakdown.gold / totalZakat > 0.4) {
      advice.push({ key: 'adviceHighGold', message: t.adviceHighGold });
    }
    
    if ((Number(liabilities.loans) || 0) + (Number(liabilities.pendingDues) || 0) > result.totalAssets * 0.3) {
      advice.push({ key: 'adviceHighLiabilities', message: t.adviceHighLiabilities });
    }
    
    if (breakdown.investments / totalZakat > 0.4) {
      advice.push({ key: 'adviceHighInvestments', message: t.adviceHighInvestments });
    }
    
    if (breakdown.cash / totalZakat > 0.4) {
      advice.push({ key: 'adviceHighCash', message: t.adviceHighCash });
    }
    
    return advice;
  };

  const getBreakdown = () => {
    const goldValue = Number(assets.gold || 0) * GOLD_PRICE;
    const silverValue = Number(assets.silver || 0) * SILVER_PRICE;
    return {
      cash: (Number(assets.cashInBank || 0) + Number(assets.cashInHand || 0)) * 0.025,
      gold: goldValue * 0.025,
      silver: silverValue * 0.025,
      investments: Number(assets.investments || 0) * 0.025
    };
  };

  const steps = t.steps.map((label, i) => ({ num: i + 1, label }));

  return (
    <div className="app-container">
      {/* ── Top control bar ── */}
      <div className="top-controls">
        <a
          href="https://www.linkedin.com/in/mohammad-ahmad-a58a90380/"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-link"
          aria-label="LinkedIn Profile"
        >
          <Link size={16} />
        </a>
        <button
          onClick={toggleLang}
          className="lang-toggle-btn"
          aria-label="Toggle language"
        >
          {lang === 'en' ? 'اردو' : 'EN'}
        </button>
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="header">
        <h1>{t.appTitle}</h1>
        <p>{t.appSubtitle}</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${((step - 1) / 3) * 100}%` }} />
      </div>

      <div className="stepper">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`step-item ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {step > s.num ? <CheckCircle2 size={16} /> : s.num}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="content-area">
        {/* ── Step 1: Assets ── */}
        {step === 1 && (
          <div className="step-content">
            <div className="form-grid">
              <InputGroup isRTL={isRTL} icon={Wallet}           label={t.cashInBank}      fieldName="cashInBank"   value={assets.cashInBank}   onChange={handleAssetChange('cashInBank')} />
              <InputGroup isRTL={isRTL} icon={HandCoins}        label={t.cashInHand}      fieldName="cashInHand"   value={assets.cashInHand}   onChange={handleAssetChange('cashInHand')} />
              <InputGroup isRTL={isRTL} icon={CircleDollarSign} label={t.goldGrams}       fieldName="gold"         value={assets.gold}         onChange={handleAssetChange('gold')} />
              <InputGroup isRTL={isRTL} icon={Coins}            label={t.silverGrams}     fieldName="silver"       value={assets.silver}       onChange={handleAssetChange('silver')} />
              <InputGroup isRTL={isRTL} icon={TrendingUp}       label={t.investments}     fieldName="investments"  value={assets.investments}  onChange={handleAssetChange('investments')} />
            </div>
          </div>
        )}

        {/* ── Step 2: Liabilities ── */}
        {step === 2 && (
          <div className="step-content">
            <div className="form-grid">
              <InputGroup isRTL={isRTL} icon={CreditCard} label={t.outstandingLoans} fieldName="loans"       value={liabilities.loans}       onChange={handleLiabilityChange('loans')} />
              <InputGroup isRTL={isRTL} icon={Receipt}    label={t.pendingDues}       fieldName="pendingDues" value={liabilities.pendingDues} onChange={handleLiabilityChange('pendingDues')} />
            </div>
          </div>
        )}

        {/* ── Step 3: Summary ── */}
        {step === 3 && (
          <div className="step-content">
            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>{t.yourSummary}</h3>

            {isAssetsEmpty && (
              <div className="smart-message warning" style={{ marginBottom: '24px' }}>
                <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                <div>
                  <strong>{t.warningTitle}</strong> {t.warningMsg}
                </div>
              </div>
            )}

            <div className="summary-grid">
              <div className="summary-section">
                <h4 className="summary-section-title">{t.assets}</h4>
                <ul className="summary-list">
                  <li className="summary-item"><span>{t.cashInBankShort}</span> <span>{formatINR(assets.cashInBank || 0)}</span></li>
                  <li className="summary-item"><span>{t.cashInHandShort}</span> <span>{formatINR(assets.cashInHand || 0)}</span></li>
                  <li className="summary-item"><span>{t.gold}</span> <span>{parseFloat(assets.gold || 0).toFixed(2)} {t.grams}</span></li>
                  <li className="summary-item"><span>{t.silver}</span> <span>{parseFloat(assets.silver || 0).toFixed(2)} {t.grams}</span></li>
                  <li className="summary-item"><span>{t.investmentsShort}</span> <span>{formatINR(assets.investments || 0)}</span></li>
                </ul>
              </div>

              <div className="summary-section">
                <h4 className="summary-section-title">{t.liabilities}</h4>
                <ul className="summary-list">
                  <li className="summary-item"><span>{t.loans}</span> <span>{formatINR(liabilities.loans || 0)}</span></li>
                  <li className="summary-item"><span>{t.pendingDuesShort}</span> <span>{formatINR(liabilities.pendingDues || 0)}</span></li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="error-banner">
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Result ── */}
        {step === 4 && result && (
          <div className="result-card">
            <div className={`result-status ${result.eligible ? 'status-eligible' : 'status-ineligible'}`}>
              {result.eligible ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> {t.nisabReached}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> {t.belowNisab}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.totalZakatDue}</p>
            <div className="result-amount">
              {formatINR(result.zakat)}
            </div>

            {result.eligible ? (
              <div className="smart-message" style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '24px' }}>
                <Info size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>{t.eligibleMsg}</strong>
                  <div style={{ marginTop: '4px', opacity: 0.9 }}>
                    {t.eligibleDetail} <strong>{formatINR(result.zakat)}</strong> {t.eligibleDetail2}
                  </div>
                </div>
              </div>
            ) : (
              <div className="smart-message ineligible" style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '24px' }}>
                <Info size={24} color="var(--error)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>{t.notEligibleMsg}</strong>
                  <div style={{ marginTop: '4px', opacity: 0.9 }}>
                    {t.notEligibleDetail} ({formatINR(result.netWealth)}) {t.notEligibleDetail2} {formatINR(result.nisab)}.
                  </div>
                </div>
              </div>
            )}

            <div className="result-details">
              {result.eligible && Number(result.zakat) > 0 && (
                <>
                  <div className="breakdown-title">{t.categoryBreakdown}</div>
                  <ul className="summary-list" style={{ marginBottom: '24px' }}>
                    <li className="summary-item" style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 500 }}>
                      <span>{t.zakataOnCash}</span> <span>{formatINR(getCategoryBreakdown().cash)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 500 }}>
                      <span>{t.zakataOnGold}</span> <span>{formatINR(getCategoryBreakdown().gold)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 500 }}>
                      <span>{t.zakataOnInvestments}</span> <span>{formatINR(getCategoryBreakdown().investments)}</span>
                    </li>
                    <li className="summary-item total" style={{ marginTop: '12px', padding: '14px 0', fontSize: '1.1rem', background: 'var(--primary)', color: '#fff', borderRadius: '8px' }}>
                      <span>{t.totalZakatDue}</span> <span>{formatINR(result.zakat)}</span>
                    </li>
                  </ul>

                  <div className="breakdown-title">{t.zakatBreakdown}</div>
                  <ul className="summary-list" style={{ marginBottom: '16px' }}>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>{t.cashAssets}</span> <span>{formatINR(getBreakdown().cash)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>{t.goldValue}</span> <span>{formatINR(getBreakdown().gold)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>{t.silverValue}</span> <span>{formatINR(getBreakdown().silver)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>{t.investmentsShort}</span> <span>{formatINR(getBreakdown().investments)}</span>
                    </li>
                    {Number(result.totalLiabilities) > 0 && (
                      <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem', color: 'var(--error)' }}>
                        <span>{t.liabilitiesDeduction}</span>
                        <span>-{formatINR(Number(result.totalLiabilities) * 0.025)}</span>
                      </li>
                    )}
                  </ul>
                </>
              )}

              <div className="breakdown-title">{t.finalOverview}</div>
              <ul className="summary-list">
                <li className="summary-item" style={{ padding: '12px 0' }}>
                  <span>{t.totalGrossAssets}</span>
                  <span>{formatINR(result.totalAssets)}</span>
                </li>
                <li className="summary-item" style={{ padding: '12px 0' }}>
                  <span>{t.totalLiabilities}</span>
                  <span style={{ color: 'var(--error)' }}>-{formatINR(result.totalLiabilities)}</span>
                </li>
                <li className="summary-item total" style={{ color: 'var(--text-main)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                  <span>{t.netWealth}</span>
                  <span>{formatINR(result.netWealth)}</span>
                </li>
              </ul>

              {getAdvice().length > 0 && (
                <div className="advice-box">
                  <div className="breakdown-title">{t.adviceTitle}</div>
                  {getAdvice().map((item) => (
                    <div key={item.key} className="advice-item">
                      <Lightbulb size={16} />
                      <span>{item.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Navigation actions ── */}
        <div className="actions">
          {step > 1 && step < 4 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)} disabled={loading}>
              {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} {t.back}
            </button>
          )}

          {step === 1 && <div />}

          {step < 3 && (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              {t.next} {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
          )}

          {step === 3 && (
            <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}>
              {loading
                ? <RefreshCw style={{ animation: 'spin 1s linear infinite' }} size={18} />
                : <Calculator size={18} />}
              {loading ? t.calculating : t.calculateZakat}
            </button>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={resetForm}>
                <RefreshCw size={18} /> {t.recalculate}
              </button>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={generatePDF}>
                <Download size={18} /> {t.downloadPdf}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
