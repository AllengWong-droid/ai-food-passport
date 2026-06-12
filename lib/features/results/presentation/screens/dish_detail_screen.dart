import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/disclaimer_banner.dart';
import '../../../../core/widgets/score_badge.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/dish_analysis_model.dart';

class DishDetailScreen extends ConsumerWidget {
  const DishDetailScreen({required this.dishId, super.key});

  final String dishId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dish = ref.watch(dishByIdProvider(dishId));

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.chevron_left, size: 32),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        top: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 4, 45, 40),
          children: [
            const SectionHeader('Dish Detail'),
            const SizedBox(height: 12),
            Text(dish.dishName, style: AppTextStyles.title.copyWith(fontSize: 36)),
            const SizedBox(height: 8),
            Text(
              dish.localName ?? dish.dishName,
              style: const TextStyle(
                color: AppColors.mutedInk,
                fontSize: 17,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 24),
            _HeroDishPanel(dish: dish),
            const SizedBox(height: 18),
            const DisclaimerBanner(),
            const SizedBox(height: 18),
            _InfoPanel(
              title: 'Recommendation Reason',
              child: Text(dish.recommendationReason, style: AppTextStyles.body),
            ),
            _InfoPanel(title: 'Ingredients', child: _TokenWrap(values: dish.ingredients)),
            _InfoPanel(
              title: 'Hidden Ingredient Watch',
              child: _TokenWrap(values: dish.hiddenIngredients, tone: ScoreBadgeTone.warning),
            ),
            _InfoPanel(
              title: 'Price Intelligence',
              child: Text(
                'Local price ${dish.priceIntelligence.localCurrency} ${dish.priceIntelligence.localPrice} converts to \$${dish.priceIntelligence.homePrice.toStringAsFixed(2)} ${dish.priceIntelligence.homeCurrency}. Value assessment: ${dish.priceIntelligence.assessment.label}.',
                style: AppTextStyles.body,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroDishPanel extends StatelessWidget {
  const _HeroDishPanel({required this.dish});

  final DishAnalysisModel dish;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(dish.description, style: AppTextStyles.body)),
              const SizedBox(width: 16),
              Container(
                width: 78,
                height: 78,
                decoration: BoxDecoration(
                  color: AppColors.darkPanel,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(Icons.restaurant_menu, color: AppColors.accent, size: 34),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ScoreBadge(label: 'TASTE ${dish.tasteScore}%', tone: ScoreBadgeTone.match),
              ScoreBadge(label: 'SAFETY ${dish.safetyScore}%', tone: ScoreBadgeTone.safe),
              ScoreBadge(label: 'VALUE ${dish.valueScore}%', tone: ScoreBadgeTone.value),
              ScoreBadge(
                label: 'CONFIDENCE ${dish.foodConfidenceScore}%',
                tone: ScoreBadgeTone.muted,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoPanel extends StatelessWidget {
  const _InfoPanel({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHeader(title),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}

class _TokenWrap extends StatelessWidget {
  const _TokenWrap({required this.values, this.tone = ScoreBadgeTone.muted});

  final List<String> values;
  final ScoreBadgeTone tone;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final value in values)
          ScoreBadge(
            label: value.toUpperCase(),
            tone: tone,
            icon: tone == ScoreBadgeTone.warning ? Icons.warning_amber_rounded : null,
          ),
      ],
    );
  }
}
