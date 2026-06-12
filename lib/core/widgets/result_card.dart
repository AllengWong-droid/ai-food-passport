import 'package:flutter/material.dart';

import '../../app/theme/app_colors.dart';
import '../../features/shared/domain/models/dish_analysis_model.dart';
import 'score_badge.dart';

class ResultCard extends StatelessWidget {
  const ResultCard({
    required this.dish,
    required this.onTap,
    this.elevated = false,
    super.key,
  });

  final DishAnalysisModel dish;
  final VoidCallback onTap;
  final bool elevated;

  @override
  Widget build(BuildContext context) {
    final safetyTone = dish.safetyScore >= 85 ? ScoreBadgeTone.safe : ScoreBadgeTone.warning;
    final matchTone = dish.tasteScore >= 90 ? ScoreBadgeTone.match : ScoreBadgeTone.muted;

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
                  ScoreBadge(label: '${dish.tasteScore}% MATCH', tone: matchTone),
                  const Spacer(),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '${dish.priceIntelligence.localCurrency} ${dish.priceIntelligence.localPrice}',
                        style: const TextStyle(
                          color: AppColors.ink,
                          fontSize: 18,
                          height: 1,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '\$${dish.priceIntelligence.homePrice.toStringAsFixed(2)} ${dish.priceIntelligence.homeCurrency}',
                        style: const TextStyle(
                          color: AppColors.softInk,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
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
                    label: 'SAFETY ${(dish.safetyScore / 10).round()}/10',
                    tone: safetyTone,
                  ),
                  ScoreBadge(
                    label: 'VALUE: ${dish.priceIntelligence.assessment.label.toUpperCase()}',
                    tone: ScoreBadgeTone.value,
                  ),
                  if (dish.hiddenIngredients.isNotEmpty)
                    ScoreBadge(
                      label: 'HIDDEN WATCH',
                      tone: ScoreBadgeTone.warning,
                      icon: Icons.warning_amber_rounded,
                    ),
                  if (dish.allergens.isNotEmpty)
                    ScoreBadge(
                      label: dish.allergens.join(' - ').toUpperCase(),
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
