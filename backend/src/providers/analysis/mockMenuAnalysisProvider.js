const { AnalysisProviderMode, AnalysisProviderName } = require('./analysisProviderTypes');

const exchangeRates = {
  JPY: { EUR: 0.00622, USD: 0.00675, TWD: 0.216, SGD: 0.0091, JPY: 1 },
  TWD: { EUR: 0.0289, USD: 0.0314, JPY: 4.63, SGD: 0.042, TWD: 1 },
  USD: { EUR: 0.919, TWD: 31.8, SGD: 1.35, JPY: 148, USD: 1 },
  EUR: { USD: 1.09, TWD: 34.6, SGD: 1.47, JPY: 161, EUR: 1 },
  SGD: { EUR: 0.68, USD: 0.74, TWD: 23.6, JPY: 109.6, SGD: 1 }
};

async function analyzeMenuText({ requestBody = {}, ocrResult }) {
  const scan = requestBody.scan || {};
  const homeCurrency = requestBody.userHomeCurrency || 'EUR';
  const localCurrency = scan.localCurrency || 'JPY';
  const exchangeRate = exchangeRateFor(localCurrency, homeCurrency);

  return {
    provider: AnalysisProviderName.MOCK_AI,
    mode: AnalysisProviderMode.MOCK,
    dishes: dishesForOcrText({
      text: ocrResult?.text || '',
      localCurrency,
      homeCurrency,
      exchangeRate
    }),
    warnings: []
  };
}

function dishesForOcrText({ text, localCurrency, homeCurrency, exchangeRate }) {
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes('beef noodle') || normalizedText.includes('nt$')) {
    return [
      buildDish({
        dishName: 'Beef Noodle Soup',
        description: 'Braised beef noodle soup with rich broth and tender wheat noodles.',
        ingredients: ['Beef', 'Wheat noodles', 'Soy-braised broth', 'Scallion'],
        allergens: ['Wheat', 'Soy'],
        tasteScore: 94,
        safetyScore: 88,
        valueScore: 93,
        recommendationReason:
          'Mock backend selected this from OCR-first menu text as a strong savory value pick.',
        localPrice: 180,
        localCurrency,
        homeCurrency,
        exchangeRate,
        assessment: 'Good Value'
      }),
      buildDish({
        dishName: 'Stir-Fried Greens',
        description: 'Seasonal vegetables quickly fried with garlic.',
        ingredients: ['Seasonal vegetables', 'Garlic', 'Cooking oil'],
        allergens: [],
        tasteScore: 86,
        safetyScore: 92,
        valueScore: 84,
        recommendationReason:
          'Mock backend kept this as a lighter option with fewer allergen flags.',
        localPrice: 120,
        localCurrency,
        homeCurrency,
        exchangeRate,
        assessment: 'Cheap'
      })
    ];
  }

  if (normalizedText.includes('fish and chips') || normalizedText.includes('$14.90')) {
    return [
      buildDish({
        dishName: 'Fish and Chips',
        description: 'Crisp battered fish with fries and tartar sauce.',
        ingredients: ['White fish', 'Wheat batter', 'Potato', 'Tartar sauce'],
        allergens: ['Fish', 'Wheat', 'Egg'],
        tasteScore: 87,
        safetyScore: 84,
        valueScore: 80,
        recommendationReason:
          'Mock backend selected this familiar seafood option after OCR-first parsing.',
        localPrice: 14.90,
        localCurrency,
        homeCurrency,
        exchangeRate,
        assessment: 'Fair'
      }),
      buildDish({
        dishName: 'Peanut Sesame Slaw',
        description: 'Crisp vegetable slaw with peanut sesame dressing.',
        ingredients: ['Cabbage', 'Carrot', 'Peanut', 'Sesame'],
        allergens: ['Peanut', 'Sesame'],
        tasteScore: 76,
        safetyScore: 82,
        valueScore: 86,
        recommendationReason:
          'Mock backend preserved peanut and sesame warnings from the OCR-first flow.',
        localPrice: 12,
        localCurrency,
        homeCurrency,
        exchangeRate,
        assessment: 'Cheap'
      })
    ];
  }

  return [
    buildDish({
      dishName: 'Tonkotsu Ramen',
      description: 'Rich pork broth with noodles, egg, scallion, and sliced chashu.',
      ingredients: ['Pork broth', 'Wheat noodles', 'Egg', 'Scallion', 'Chashu'],
      allergens: ['Wheat', 'Egg'],
      tasteScore: 96,
      safetyScore: 84,
      valueScore: 86,
      recommendationReason:
        'Mock backend selected this because OCR-first text matched a savory, umami-forward menu item.',
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
  ];
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

module.exports = {
  analyzeMenuText
};
