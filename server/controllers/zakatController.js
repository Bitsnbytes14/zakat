const calculateZakat = (req, res) => {
  try {
    // Extract input fields from the request body
    const {
      cashBank = 0,
      cashHand = 0,
      goldGrams = 0,
      silverGrams = 0,
      investments = 0,
      loans = 0,
      dues = 0,
    } = req.body;

    // Constants as per the requirement
    const goldPricePerGram = 6000;
    const silverPricePerGram = 70;
    const nisabThreshold = 85000;

    // Step 1: Convert gold & silver to money
    const goldValue = Number(goldGrams) * goldPricePerGram;
    const silverValue = Number(silverGrams) * silverPricePerGram;

    // Step 2: Calculate total assets
    const totalAssets = 
      Number(cashBank) + 
      Number(cashHand) + 
      goldValue + 
      silverValue + 
      Number(investments);

    // Step 3: Calculate total liabilities
    const totalLiabilities = Number(loans) + Number(dues);

    // Step 4: Calculate net wealth
    const netWealth = totalAssets - totalLiabilities;

    // Step 5 & 6: Determine Zakat eligibility and amount
    let zakat = 0;
    let eligible = false;
    let status = "Not Eligible";

    if (netWealth >= nisabThreshold) {
      zakat = netWealth * 0.025;
      eligible = true;
      status = "Eligible";
    }

    // Build the response object exactly as required
    const response = {
      totalAssets,
      totalLiabilities,
      netWealth,
      nisab: nisabThreshold,
      eligible,
      status, 
      zakat
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error calculating Zakat:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  calculateZakat
};
