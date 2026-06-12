enum PriceAssessment {
  cheap('Cheap'),
  fair('Fair'),
  expensive('Expensive'),
  goodValue('Good Value');

  const PriceAssessment(this.label);

  final String label;
}

class PriceIntelligenceModel {
  const PriceIntelligenceModel({
    required this.localPrice,
    required this.localCurrency,
    required this.homePrice,
    required this.homeCurrency,
    required this.exchangeRate,
    required this.assessment,
  });

  final num localPrice;
  final String localCurrency;
  final num homePrice;
  final String homeCurrency;
  final num exchangeRate;
  final PriceAssessment assessment;
}
