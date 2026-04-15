export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://zakat-x20w.onrender.com/api";

export const calculateZakatAPI = async (assets, liabilities) => {
  try {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Failed to reach the server. Please try again later."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Zakat API Error:", error);
    throw error;
  }
};