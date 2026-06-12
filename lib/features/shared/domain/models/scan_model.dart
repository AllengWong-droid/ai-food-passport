class ScanModel {
  const ScanModel({
    required this.scanId,
    required this.imagePath,
    required this.restaurantCountry,
    required this.restaurantCity,
    required this.localCurrency,
    required this.createdAt,
  });

  final String scanId;
  final String imagePath;
  final String restaurantCountry;
  final String restaurantCity;
  final String localCurrency;
  final DateTime createdAt;
}
