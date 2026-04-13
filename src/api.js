export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const calculateZakatAPI = async (assets, liabilities) => {
  const payload = {
    cashBank: parseFloat(assets.cashInBank || 0),
    cashHand: parseFloat(assets.cashInHand || 0),
    goldGrams: parseFloat(assets.gold || 0),
    silverGrams: parseFloat(assets.silver || 0),
    investments: parseFloat(assets.investments || 0),
    loans: parseFloat(liabilities.loans || 0),
    dues: parseFloat(liabilities.pendingDues || 0),
  };

  const response = await fetch(`${API_URL}/calculate-zakat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to reach the server. Please try again later.');
  }

  return response.json();
};
