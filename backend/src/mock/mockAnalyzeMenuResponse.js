const exchangeRates = {
  JPY: { EUR: 0.00622, USD: 0.00675, TWD: 0.216, SGD: 0.0091, JPY: 1 },
  TWD: { EUR: 0.0289, USD: 0.0314, JPY: 4.63, SGD: 0.042, TWD: 1 },
  USD: { EUR: 0.919, TWD: 31.8, SGD: 1.35, JPY: 148, USD: 1 },
  EUR: { USD: 1.09, TWD: 34.6, SGD: 1.47, JPY: 161, EUR: 1 },
  SGD: { EUR: 0.68, USD: 0.74, TWD: 23.6, JPY: 109.6, SGD: 1 }
};

function buildMockAnalyzeMenuResponse(requestBody = {}, latencyMs = 0) {
  const scan = requestBody.scan || {};
  const homeCurrency = requestBody.userHomeCurrency || 'EUR';
  const localCurrency = scan.localCurrency || 'JPY';
  const exchangeRate = exchangeRateFor(localCurrency, homeCurrency);

  return {
    routing: {
      mode: 'mock',
      ocrProvider: 'mock_ocr',
      analysisProvider: 'mock_ai',
      fallbackUsed: false,
      latencyMs
    },
    dishes: [
      buildDish({
        dishName: 'Tonkotsu Ramen',
        description: 'Rich pork broth with noodles, egg, scallion, and sliced chashu.',
        ingredients: ['Pork broth', 'Wheat noodles', 'Egg', 'Scallion', 'Chashu'],
        allergens: ['Wheat', 'Egg'],
        tasteScore: 96,
        safetyScore: 84,
        valueScore: 86,
        recommendationReason:
          'Mock backend selected this because it fits a savory, umami-forward traveler profile.',
        localPrice: 980,
        localCurrency,
        homeCurrency,
        exchangeRate,
        assessment: 'Fair'
      }),
      buildDish({
        dishName: 'Miso Katsu Skewers',
        description: 'Panko-fried pork skewers with hatcho miso glaze.',
        ingredients: ['Pork', 'Panko', 'Miso', 'Egg', 'Wheat'],
        allergens: ['Soy', 'Wheat', 'Egg'],
        tasteScore: 82,
        safetyScore: 70,
        valueScore: 89,
        recommendationReason:
          'Mock backend ranked this as a good value while preserving allergen warnings.',
        localPrice: 800,
        localCurrency,
        homeCurrency,
        exchangeRate,
        assessment: 'Good Value'
      })
    ]
  };
}

function buildDish({
  dishName,
  description,
  ingredients,
  allergens,
  tasteScore,
  safetyScore,
  valueScore,
  recommendationReason,
  localPrice,
  localCurrency,
  homeCurrency,
  exchangeRate,
  assessment
}) {
  return {
    dishName,
    description,
    ingredients,
    allergens,
    tasteScore,
    safetyScore,
    valueScore,
    recommendationReason,
    priceIntelligence: {
      localPrice,
      localCurrency,
      homePrice: roundMoney(localPrice * exchangeRate),
      homeCurrency,
      exchangeRate,
      assessment
    }
  };
}

function exchangeRateFor(localCurrency, homeCurrency) {
  return exchangeRates[localCurrency]?.[homeCurrency] || 1;
}

function roundMoney(value) {
  return Number(value.toFixed(2));
}

module.exports = { buildMockAnalyzeMenuResponse };
