import '../models/price_intelligence_model.dart';

abstract class PriceRepository {
  PriceIntelligenceModel assessPrice({
    required num localPrice,
    required String localCurrency,
    required String homeCurrency,
  });
}
