import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/theme/app_colors.dart';
import '../../features/shared/domain/models/dish_analysis_model.dart';
import '../../features/shared/domain/models/price_intelligence_model.dart';
import '../../features/shared/presentation/localized_result_copy.dart';
import '../../features/shared/data/dietary_preferences_provider.dart';
import 'score_badge.dart';

class ResultCard extends ConsumerWidget {
  const ResultCard({
    required this.dish,
    required this.onTap,
    this.elevated = false,
    this.copy = const LocalizedResultCopy('English'),
    super.key,
  });

  final DishAnalysisModel dish;
  final VoidCallback onTap;
  final bool elevated;
  final LocalizedResultCopy copy;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final safetyTone = dish.safetyScore >= 85 ? ScoreBadgeTone.safe : ScoreBadgeTone.warning;
    final matchTone = dish.tasteScore >= 90 ? ScoreBadgeTone.match : ScoreBadgeTone.muted;
    final price = dish.priceIntelligence;

    // Check if dish allergens match user's dietary preferences
    final dietaryPreferences = ref.watch(dietaryPreferencesProvider);
    final hasAllergenMatch = dietaryPreferences.matchesDishAllergens(dish.allergens);
    final matchingAllergens = dietaryPreferences.getMatchingAllergens(dish.allergens);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.fromLTRB(24, 22, 18, 20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: const Color(0xFFECE9E5)),
            boxShadow: elevated
                ? const [
                    BoxShadow(
                      color: Color(0x19000000),
                      blurRadius: 10,
                      offset: Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ScoreBadge(label: '${copy.tasteLabel} ${dish.tasteScore}%', tone: matchTone),
                  const Spacer(),
                  _PriceSummary(price: price, copy: copy),
                ],
              ),
              const SizedBox(height: 22),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _DishThumbnail(seed: dish.imageSeed),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          dish.dishName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.ink,
                            fontSize: 21,
                            height: 1.05,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 7),
                        Text(
                          dish.localName ?? dish.dishName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.mutedInk,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          dish.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Color(0xFF4E4F52),
                            fontSize: 15,
                            height: 1.28,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Icon(Icons.chevron_right, color: AppColors.softInk),
                ],
              ),
              const SizedBox(height: 18),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ScoreBadge(
                    label: '${copy.safetyLabel} ${dish.safetyScore}%',
                    tone: safetyTone,
                  ),
                  ScoreBadge(
                    label: '${copy.valueLabel} ${dish.valueScore}%',
                    tone: ScoreBadgeTone.value,
                  ),
                  ScoreBadge(
                    label: copy.assessmentLabel(price.assessment),
                    tone: ScoreBadgeTone.value,
                  ),
                  if (dish.hiddenIngredients.isNotEmpty)
                    ScoreBadge(
                      label: copy.hiddenWatchLabel,
                      tone: ScoreBadgeTone.warning,
                      icon: Icons.warning_amber_rounded,
                    ),
                  if (dish.allergens.isNotEmpty)
                    ScoreBadge(
                      label: dish.allergens.join(' - ').toUpperCase(),
                      tone: ScoreBadgeTone.warning,
                      icon: Icons.warning_amber_rounded,
                    ),
                  // Show warning if dish contains user's selected allergens
                  if (hasAllergenMatch)
                    ScoreBadge(
                      label: matchingAllergens.length == 1
                          ? 'Contains ${matchingAllergens.first}'
                          : 'Contains: ${matchingAllergens.join(', ')}',
                      tone: ScoreBadgeTone.warning,
                      icon: Icons.warning_amber_rounded,
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                dish.recommendationReason,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.mutedInk,
                  fontSize: 13,
                  height: 1.25,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PriceSummary extends StatelessWidget {
  const _PriceSummary({required this.price, required this.copy});

  final PriceIntelligenceModel price;
  final LocalizedResultCopy copy;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          _formatMoney(price.localPrice, price.localCurrency),
          style: const TextStyle(
            color: AppColors.ink,
            fontSize: 18,
            height: 1,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          '${copy.approximate} ${_formatMoney(price.homePrice, price.homeCurrency)}',
          style: const TextStyle(
            color: AppColors.softInk,
            fontSize: 13,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

String _formatMoney(num amount, String currency) {
  final symbol = switch (currency.toUpperCase()) {
    'JPY' => '¥',
    'TWD' => 'NT\$',
    'CNY' => '¥',
    'USD' => '\$',
    'EUR' => '€',
    'GBP' => '£',
    _ => '$currency ',
  };
  final decimals = amount % 1 == 0 ? 0 : 2;
  return '$symbol${amount.toStringAsFixed(decimals)}';
}

class _DishThumbnail extends StatelessWidget {
  const _DishThumbnail({required this.seed});

  final String seed;

  @override
  Widget build(BuildContext context) {
    final colors = switch (seed) {
      'cod' => [const Color(0xFF111315), const Color(0xFFB8462F)],
      'skewer' => [const Color(0xFF3B190E), const Color(0xFFE49A21)],
      _ => [const Color(0xFF1B1D1E), const Color(0xFFE8A641)],
    };

    return Container(
      width: 84,
      height: 84,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: RadialGradient(
          center: Alignment.center,
          radius: 0.9,
          colors: colors,
        ),
      ),
      child: const Icon(Icons.restaurant_menu, color: Colors.white, size: 34),
    );
  }
}
