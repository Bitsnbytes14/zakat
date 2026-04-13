import React, { useState } from 'react';
import { 
  Wallet, Coins, CircleDollarSign, TrendingUp, HandCoins,
  CreditCard, Receipt, Calculator, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import './index.css';

// Nisab threshold (approximate current value in USD, can be adjusted)
const NISAB_THRESHOLD = 5000; 

function App() {
  const [step, setStep] = useState(1);
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

  const handleAssetChange = (e) => {
    const { name, value } = e.target;
    // Allow only numeric input or decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAssets(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLiabilityChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLiabilities(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotal = (obj) => {
    return Object.values(obj).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  };

  const totalAssets = calculateTotal(assets);
  const totalLiabilities = calculateTotal(liabilities);
  const netWealth = totalAssets - totalLiabilities;
  const isEligible = netWealth >= NISAB_THRESHOLD;
  const zakatAmount = isEligible ? (netWealth * 0.025) : 0;

  const resetForm = () => {
    setAssets({ cashInBank: '', cashInHand: '', gold: '', silver: '', investments: '' });
    setLiabilities({ loans: '', pendingDues: '' });
    setStep(1);
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
      <div className="header">
        <h1>Smart Zakat Calculator</h1>
        <p>Calculate your Zakat accurately and effortlessly</p>
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
            <InputGroup icon={CircleDollarSign} label="Gold Value" name="gold" value={assets.gold} onChange={handleAssetChange} />
            <InputGroup icon={Coins} label="Silver Value" name="silver" value={assets.silver} onChange={handleAssetChange} />
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
            <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Assets</h4>
                <ul className="summary-list">
                  <li className="summary-item"><span>Cash in Bank</span> <span>${parseFloat(assets.cashInBank || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Cash in Hand</span> <span>${parseFloat(assets.cashInHand || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Gold</span> <span>${parseFloat(assets.gold || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Silver</span> <span>${parseFloat(assets.silver || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Investments</span> <span>${parseFloat(assets.investments || 0).toFixed(2)}</span></li>
                  <li className="summary-item total"><span>Total Assets</span> <span>${totalAssets.toFixed(2)}</span></li>
                </ul>
              </div>
              
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Liabilities</h4>
                <ul className="summary-list">
                  <li className="summary-item"><span>Loans</span> <span>${parseFloat(liabilities.loans || 0).toFixed(2)}</span></li>
                  <li className="summary-item"><span>Pending Dues</span> <span>${parseFloat(liabilities.pendingDues || 0).toFixed(2)}</span></li>
                  <li className="summary-item total" style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.05)' }}>
                    <span>Total Liabilities</span> <span>-${totalLiabilities.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="result-card">
            <div className={`result-status ${isEligible ? 'status-eligible' : 'status-ineligible'}`}>
              {isEligible ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Nisab Reached
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> Below Nisab Threshold
                </span>
              )}
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Your Estimated Zakat</p>
            <div className="result-amount">
              ${zakatAmount.toFixed(2)}
            </div>

            <div className="result-details">
              <ul className="summary-list">
                <li className="summary-item"><span>Total Assets</span> <span>${totalAssets.toFixed(2)}</span></li>
                <li className="summary-item"><span>Total Liabilities</span> <span style={{ color: 'var(--error)' }}>-${totalLiabilities.toFixed(2)}</span></li>
                <li className="summary-item total" style={{ color: 'var(--text-main)', background: 'var(--border-color)' }}>
                  <span>Net Wealth</span> <span>${netWealth.toFixed(2)}</span>
                </li>
              </ul>
              
              {!isEligible && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Your net wealth (${netWealth.toFixed(2)}) is below the estimated Nisab threshold (${NISAB_THRESHOLD.toFixed(2)}). Zakat is not obligatory at this time.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="actions">
          {step > 1 && step < 4 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
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
            <button className="btn btn-primary" onClick={() => setStep(4)}>
              <Calculator size={18} /> Calculate Zakat
            </button>
          )}

          {step === 4 && (
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={resetForm}>
              <RefreshCw size={18} /> Recalculate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
