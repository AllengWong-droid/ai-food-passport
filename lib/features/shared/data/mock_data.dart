import '../domain/models/models.dart';

const mockUser = UserModel(
  id: 'guest-demo',
  email: 'sarah.demo@example.com',
  displayName: 'Sarah Lin',
  homeCountry: 'United States',
  homeCurrency: 'USD',
);

const mockPassport = TastePassportModel(
  travelStyle: TravelStyle.standard,
  dietaryPreferences: ['Vegetarian-friendly', 'Mild spice'],
  allergies: ['Soy', 'Shellfish', 'Peanut'],
  tastePreferences: ['Savory', 'Mild', 'Umami'],
);

final mockScan = ScanModel(
  scanId: 'demo-scan-tokyo-001',
  imagePath: 'assets/demo/tokyo-menu.jpg',
  restaurantCountry: 'Japan',
  restaurantCity: 'Tokyo',
  localCurrency: 'JPY',
  createdAt: DateTime(2026, 6, 12, 10, 0),
);

const mockRecentCrossings = [
  RecentCrossingModel(
    restaurant: 'Izakaya Gonpachi',
    location: 'Tokyo',
    summary: '8 dishes scanned - 2h ago',
    imageSeed: 'ramen',
  ),
  RecentCrossingModel(
    restaurant: 'Tasca do Chico',
    location: 'Lisbon',
    summary: '12 dishes scanned - 3 days ago',
    imageSeed: 'cod',
  ),
];

const mockJapaneseMenuText = '''
居酒屋 権八
鶏雑炊 1200円
銀だら西京焼き 2400円
味噌串カツ 800円
だし巻き卵 900円
アレルギー表示: 卵, 小麦, 大豆, 魚介だし
''';

const mockChineseMenuText = '''
老街小馆
宫保鸡丁 RMB 58
清炒时蔬 RMB 38
麻婆豆腐 RMB 42
葱油拌面 RMB 32
过敏原提示: 花生, 大豆, 小麦, 芝麻
''';

const mockEnglishMenuText = '''
Harbor Market Kitchen
Grilled salmon with lemon butter 24
Roasted mushroom risotto 18
Chicken noodle soup 14
Peanut sesame slaw 12
Allergen notes: fish, dairy, wheat, peanut, sesame
''';

const mockDishAnalyses = [
  DishAnalysisModel(
    dishName: 'Tori-Zousui',
    localName: 'Chicken & Egg Porridge',
    description: 'Chicken and egg porridge with seasonal leeks.',
    tasteScore: 98,
    safetyScore: 100,
    valueScore: 91,
    foodConfidenceScore: 94,
    priceIntelligence: PriceIntelligenceModel(
      localPrice: 1200,
      localCurrency: 'JPY',
      homePrice: 8.10,
      homeCurrency: 'USD',
      exchangeRate: 0.00675,
      assessment: PriceAssessment.fair,
    ),
    recommendationReason:
        'A warm, savory match for your mild umami preference with no detected declared allergens.',
    ingredients: ['Chicken', 'Egg', 'Rice', 'Leek', 'Dashi'],
    allergens: [],
    dietaryFlags: ['Contains egg'],
    hiddenIngredients: ['Dashi may include fish stock'],
    imageSeed: 'porridge',
  ),
  DishAnalysisModel(
    dishName: 'Saikyo Miso Cod',
    localName: 'Gindara no Saikyo-yaki',
    description: 'Black cod marinated three days in sweet white miso.',
    tasteScore: 94,
    safetyScore: 90,
    valueScore: 72,
    foodConfidenceScore: 88,
    priceIntelligence: PriceIntelligenceModel(
      localPrice: 2400,
      localCurrency: 'JPY',
      homePrice: 16.20,
      homeCurrency: 'USD',
      exchangeRate: 0.00675,
      assessment: PriceAssessment.expensive,
    ),
    recommendationReason:
        'Strong taste match, but the miso marinade can contain soy and trace alcohol.',
    ingredients: ['Black cod', 'White miso', 'Mirin', 'Sake'],
    allergens: ['Soy'],
    dietaryFlags: ['Fish'],
    hiddenIngredients: ['Mirin', 'Sake', 'Soy in miso paste'],
    imageSeed: 'cod',
  ),
  DishAnalysisModel(
    dishName: 'Miso Katsu Skewers',
    localName: 'Miso Kushikatsu',
    description: 'Panko-fried pork skewers with hatcho miso glaze.',
    tasteScore: 82,
    safetyScore: 70,
    valueScore: 86,
    foodConfidenceScore: 80,
    priceIntelligence: PriceIntelligenceModel(
      localPrice: 800,
      localCurrency: 'JPY',
      homePrice: 5.40,
      homeCurrency: 'USD',
      exchangeRate: 0.00675,
      assessment: PriceAssessment.cheap,
    ),
    recommendationReason:
        'Good value, though breading and glaze introduce several hidden allergen risks.',
    ingredients: ['Pork', 'Panko', 'Miso', 'Egg', 'Wheat'],
    allergens: ['Soy', 'Wheat', 'Egg'],
    dietaryFlags: ['Pork'],
    hiddenIngredients: ['Fryer cross-contact', 'Wheat in panko', 'Egg wash'],
    imageSeed: 'skewer',
  ),
];
