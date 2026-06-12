import '../domain/models/price_intelligence_model.dart';

class LocalizedResultCopy {
  const LocalizedResultCopy(this.outputLanguage);

  final String outputLanguage;

  bool get _traditionalChinese => outputLanguage == 'Traditional Chinese';
  bool get _simplifiedChinese => outputLanguage == 'Simplified Chinese';
  bool get _japanese => outputLanguage == 'Japanese';

  String get resultsTitle {
    if (_traditionalChinese) return '依照口味、\n安全與價值排序。';
    if (_simplifiedChinese) return '按口味、\n安全和价值排序。';
    if (_japanese) return '好み、\n安全性、価値で並べ替え。';
    return 'Ranked by taste,\nsafety, and value.';
  }

  String pricesConvertedTo(String currency) {
    if (_traditionalChinese) return '價格已換算為 $currency';
    if (_simplifiedChinese) return '价格已换算为 $currency';
    if (_japanese) return '価格を $currency に換算';
    return 'Prices converted to $currency';
  }

  String basedOnTravelerProfile(String country) {
    if (_traditionalChinese) return '根據你在 $country 的旅人設定';
    if (_simplifiedChinese) return '基于你在 $country 的旅行者设置';
    if (_japanese) return '$country の旅行者設定に基づく';
    return 'Based on your traveler profile from $country';
  }

  String get approximate {
    if (_traditionalChinese) return '約';
    if (_simplifiedChinese) return '约';
    if (_japanese) return '約';
    return 'approx';
  }

  String get tasteLabel {
    if (_traditionalChinese) return '口味';
    if (_simplifiedChinese) return '口味';
    if (_japanese) return '好み';
    return 'TASTE';
  }

  String get safetyLabel {
    if (_traditionalChinese) return '安全';
    if (_simplifiedChinese) return '安全';
    if (_japanese) return '安全';
    return 'SAFETY';
  }

  String get valueLabel {
    if (_traditionalChinese) return '價值';
    if (_simplifiedChinese) return '价值';
    if (_japanese) return '価値';
    return 'VALUE';
  }

  String get confidenceLabel {
    if (_traditionalChinese) return '信心';
    if (_simplifiedChinese) return '信心';
    if (_japanese) return '信頼度';
    return 'CONFIDENCE';
  }

  String get hiddenWatchLabel {
    if (_traditionalChinese) return '隱藏成分';
    if (_simplifiedChinese) return '隐藏成分';
    if (_japanese) return '隠れ成分';
    return 'HIDDEN WATCH';
  }

  String get dishDetailTitle {
    if (_traditionalChinese) return '餐點詳情';
    if (_simplifiedChinese) return '菜品详情';
    if (_japanese) return '料理詳細';
    return 'Dish Detail';
  }

  String get recommendationTitle {
    if (_traditionalChinese) return '推薦原因';
    if (_simplifiedChinese) return '推荐原因';
    if (_japanese) return 'おすすめ理由';
    return 'Recommendation Reason';
  }

  String get ingredientsTitle {
    if (_traditionalChinese) return '食材';
    if (_simplifiedChinese) return '食材';
    if (_japanese) return '材料';
    return 'Ingredients';
  }

  String get hiddenIngredientTitle {
    if (_traditionalChinese) return '隱藏成分提醒';
    if (_simplifiedChinese) return '隐藏成分提醒';
    if (_japanese) return '隠れ成分の注意';
    return 'Hidden Ingredient Watch';
  }

  String get priceIntelligenceTitle {
    if (_traditionalChinese) return '價格參考';
    if (_simplifiedChinese) return '价格参考';
    if (_japanese) return '価格情報';
    return 'Price Intelligence';
  }

  String get localMenuPriceLabel {
    if (_traditionalChinese) return '當地菜單價格';
    if (_simplifiedChinese) return '当地菜单价格';
    if (_japanese) return '現地メニュー価格';
    return 'Local menu price';
  }

  String yourCurrencyPriceLabel(String currency) {
    if (_traditionalChinese) return '你的 $currency 價格';
    if (_simplifiedChinese) return '你的 $currency 价格';
    if (_japanese) return 'あなたの $currency 価格';
    return 'Your $currency price';
  }

  String get exchangeRateLabel {
    if (_traditionalChinese) return '使用匯率';
    if (_simplifiedChinese) return '使用汇率';
    if (_japanese) return '使用レート';
    return 'Exchange rate';
  }

  String get valueSignalLabel {
    if (_traditionalChinese) return '價值訊號';
    if (_simplifiedChinese) return '价值信号';
    if (_japanese) return '価値シグナル';
    return 'VALUE SIGNAL';
  }

  String assessmentLabel(PriceAssessment assessment) {
    return switch (assessment) {
      PriceAssessment.cheap => _traditionalChinese
          ? '便宜'
          : _simplifiedChinese
              ? '便宜'
              : _japanese
                  ? '安い'
                  : 'CHEAP',
      PriceAssessment.fair => _traditionalChinese
          ? '合理'
          : _simplifiedChinese
              ? '合理'
              : _japanese
                  ? '妥当'
                  : 'FAIR',
      PriceAssessment.expensive => _traditionalChinese
          ? '偏貴'
          : _simplifiedChinese
              ? '偏贵'
              : _japanese
                  ? '高め'
                  : 'EXPENSIVE',
      PriceAssessment.goodValue => _traditionalChinese
          ? '划算'
          : _simplifiedChinese
              ? '划算'
              : _japanese
                  ? 'お得'
                  : 'GOOD VALUE',
    };
  }

  String valueExplanation(PriceAssessment assessment) {
    return switch (assessment) {
      PriceAssessment.cheap => _traditionalChinese
          ? '這在當地菜單中看起來很實惠，適合預算友善的選擇。'
          : _simplifiedChinese
              ? '这在当地菜单中看起来很实惠，适合预算友好的选择。'
              : _japanese
                  ? '現地メニューの中では手頃で、予算を抑えたい時に選びやすいです。'
                  : 'This looks inexpensive for the local menu context and may be a budget-friendly pick.',
      PriceAssessment.fair => _traditionalChinese
          ? '換算成你的設定貨幣後，這個價格看起來合理。'
          : _simplifiedChinese
              ? '换算成你的设置货币后，这个价格看起来合理。'
              : _japanese
                  ? '選択した通貨に換算すると、妥当な価格に見えます。'
                  : 'This price looks reasonable after converting it into your selected home currency.',
      PriceAssessment.expensive => _traditionalChinese
          ? '這相對偏貴，較適合為了體驗而點。'
          : _simplifiedChinese
              ? '这相对偏贵，较适合为了体验而点。'
              : _japanese
                  ? 'やや高めなので、価値より体験を重視する時に向いています。'
                  : 'This is relatively expensive, so order it for experience rather than pure value.',
      PriceAssessment.goodValue => _traditionalChinese
          ? '這看起來很划算，換算後的價格和份量期待相當不錯。'
          : _simplifiedChinese
              ? '这看起来很划算，换算后的价格和分量预期相当不错。'
              : _japanese
                  ? '換算後の価格に対して、品質や量の期待値が高くお得に見えます。'
                  : 'This looks like a strong value: the converted price is low for the dish quality and portion expectation.',
    };
  }
}
