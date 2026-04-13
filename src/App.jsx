import React, { useState, useEffect } from 'react';
import { 
  Wallet, Coins, CircleDollarSign, TrendingUp, HandCoins,
  CreditCard, Receipt, Calculator, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, RefreshCw, Moon, Sun, Info
} from 'lucide-react';
import { calculateZakatAPI } from './api';
import './index.css';

// Constants used to show local breakdown (matching backend assumptions)
const GOLD_PRICE = 6000;
const SILVER_PRICE = 70;

function App() {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAssetChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string or numeric inputs (preventing negative naturally)
    if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setAssets(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLiabilityChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setLiabilities(prev => ({ ...prev, [name]: value }));
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

  // Validation Checkers
  const isAssetsEmpty = Object.values(assets).every(v => v === '' || Number(v) === 0);

  // Utility to determine categorized gross zakat values for UI Breakdown
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

  // UI Components
  const InputGroup = ({ label, name, value, onChange, icon: Icon, placeholder = '0.00' }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-wrapper">
        <Icon className="input-icon" size={20} />
        <input
          type="text"
          className="input-field"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    </div>
  );

  const steps = [
    { num: 1, label: 'Assets' },
    { num: 2, label: 'Liabilities' },
    { num: 3, label: 'Summary' },
    { num: 4, label: 'Result' }
  ];

  return (
    <div className="app-container">
      <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="header">
        <h1>Smart Zakat Calculator</h1>
        <p>Calculate your Zakat accurately and effortlessly</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
      </div>

      <div className="stepper">
        {steps.map((s) => (
          <div key={s.num} className={`step-item ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > s.num ? <CheckCircle2 size={16} /> : s.num}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="content-area">
        {step === 1 && (
          <div className="step-content">
            <InputGroup icon={Wallet} label="Cash in Bank" name="cashInBank" value={assets.cashInBank} onChange={handleAssetChange} />
            <InputGroup icon={HandCoins} label="Cash in Hand" name="cashInHand" value={assets.cashInHand} onChange={handleAssetChange} />
            <InputGroup icon={CircleDollarSign} label="Gold (grams)" name="gold" value={assets.gold} onChange={handleAssetChange} />
            <InputGroup icon={Coins} label="Silver (grams)" name="silver" value={assets.silver} onChange={handleAssetChange} />
            <InputGroup icon={TrendingUp} label="Investments & Stocks" name="investments" value={assets.investments} onChange={handleAssetChange} />
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <InputGroup icon={CreditCard} label="Outstanding Loans" name="loans" value={liabilities.loans} onChange={handleLiabilityChange} />
            <InputGroup icon={Receipt} label="Pending Dues / Bills" name="pendingDues" value={liabilities.pendingDues} onChange={handleLiabilityChange} />
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Your Summary</h3>

            {isAssetsEmpty && (
              <div className="smart-message warning" style={{ marginBottom: '24px' }}>
                <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Warning:</strong> You haven't entered any assets yet. Double check that you aren't missing anything before calculating.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Assets</h4>
                <ul className="summary-list">
                  <li className="summary-item"><span>Cash in Bank</span> <span>${parseFloat(assets.cashInBank || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Cash in Hand</span> <span>${parseFloat(assets.cashInHand || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Gold</span> <span>{parseFloat(assets.gold || 0).toFixed(2)} grams</span></li>
                  <li className="summary-item"><span>Silver</span> <span>{parseFloat(assets.silver || 0).toFixed(2)} grams</span></li>
                  <li className="summary-item"><span>Investments</span> <span>${parseFloat(assets.investments || 0).toFixed(2)}</span></li>
                </ul>
              </div>
              
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Liabilities</h4>
                <ul className="summary-list">
                  <li className="summary-item"><span>Loans</span> <span>${parseFloat(liabilities.loans || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Pending Dues</span> <span>${parseFloat(liabilities.pendingDues || 0).toFixed(2)}</span></li>
                </ul>
              </div>

              {error && (
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> {error}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="result-card">
            <div className={`result-status ${result.eligible ? 'status-eligible' : 'status-ineligible'}`}>
              {result.eligible ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Nisab Reached
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> Below Nisab Threshold
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Total Zakat Due</p>
            <div className="result-amount">
              ${Number(result.zakat).toFixed(2)}
            </div>

            {/* Smart Messages Box */}
            {result.eligible ? (
              <div className="smart-message" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <Info size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>You are eligible for Zakat.</strong>
                  <div style={{ marginTop: '4px', opacity: 0.9 }}>
                    Your net wealth exceeds the Nisab minimum. It is highly recommended to distribute your required Zakat of <strong>${Number(result.zakat).toFixed(2)}</strong> as soon as possible to those in need.
                  </div>
                </div>
              </div>
            ) : (
              <div className="smart-message ineligible" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <Info size={24} color="var(--error)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Zakat is NOT obligatory for you.</strong>
                  <div style={{ marginTop: '4px', opacity: 0.9 }}>
                    Your calculated net wealth (${Number(result.netWealth).toFixed(2)}) currently falls below the Nisab threshold of ${Number(result.nisab).toFixed(2)}.
                  </div>
                </div>
              </div>
            )}

            <div className="result-details">
              {/* Detailed Breakdown */}
              {result.eligible && Number(result.zakat) > 0 && (
                <>
                  <div className="breakdown-title">Zakat Component Breakdown</div>
                  <ul className="summary-list" style={{ marginBottom: '16px' }}>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>Cash Assets</span> <span>${getBreakdown().cash.toFixed(2)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>Gold Value</span> <span>${getBreakdown().gold.toFixed(2)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>Silver Value</span> <span>${getBreakdown().silver.toFixed(2)}</span>
                    </li>
                    <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem' }}>
                      <span>Investments</span> <span>${getBreakdown().investments.toFixed(2)}</span>
                    </li>
                    {Number(result.totalLiabilities) > 0 && (
                      <li className="summary-item" style={{ padding: '8px 0', fontSize: '0.9rem', color: 'var(--error)' }}>
                        <span>Liabilities Deduction</span> 
                        <span>-${(Number(result.totalLiabilities) * 0.025).toFixed(2)}</span>
                      </li>
                    )}
                  </ul>
                </>
              )}

              <div className="breakdown-title">Final Accounting Overview</div>
              <ul className="summary-list">
                <li className="summary-item" style={{ padding: '12px 0' }}>
                  <span>Total Gross Assets</span> 
                  <span>${Number(result.totalAssets).toFixed(2)}</span>
                </li>
                <li className="summary-item" style={{ padding: '12px 0' }}>
                  <span>Total Liabilities</span> 
                  <span style={{ color: 'var(--error)' }}>-${Number(result.totalLiabilities).toFixed(2)}</span>
                </li>
                <li className="summary-item total" style={{ color: 'var(--text-main)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                  <span>Net Wealth Evaluated</span> 
                  <span>${Number(result.netWealth).toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="actions">
          {step > 1 && step < 4 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)} disabled={loading}>
              <ArrowLeft size={18} /> Back
            </button>
          )}
          
          {step === 1 && <div />} {/* Spacer */}

          {step < 3 && (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Next <ArrowRight size={18} />
            </button>
          )}

          {step === 3 && (
            <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} size={18} /> : <Calculator size={18} />}
              {loading ? 'Calculating...' : 'Calculate Zakat'}
            </button>
          )}

          {step === 4 && (
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={resetForm}>
              <RefreshCw size={18} /> Recalculate Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
