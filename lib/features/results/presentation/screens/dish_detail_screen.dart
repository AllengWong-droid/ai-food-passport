import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/disclaimer_banner.dart';
import '../../../../core/widgets/score_badge.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/dish_analysis_model.dart';
import '../../../shared/domain/models/price_intelligence_model.dart';
import '../../../shared/presentation/localized_result_copy.dart';

class DishDetailScreen extends ConsumerWidget {
  const DishDetailScreen({required this.dishId, super.key});

  final String dishId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dish = ref.watch(dishByIdProvider(dishId));
    final aiRequest = ref.watch(latestAiAnalysisRequestProvider);
    final copy = LocalizedResultCopy(aiRequest?.outputLanguage ?? 'English');

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.chevron_left, size: 32),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
              return;
            }

            context.goNamed(RouteNames.results);
          },
        ),
      ),
      body: SafeArea(
        top: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 4, 45, 40),
          children: [
            SectionHeader(copy.dishDetailTitle),
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
            _HeroDishPanel(dish: dish, copy: copy),
            const SizedBox(height: 18),
            const DisclaimerBanner(),
            const SizedBox(height: 18),
            _InfoPanel(
              title: copy.recommendationTitle,
              child: Text(dish.recommendationReason, style: AppTextStyles.body),
            ),
            _InfoPanel(title: copy.ingredientsTitle, child: _TokenWrap(values: dish.ingredients)),
            _InfoPanel(
              title: copy.hiddenIngredientTitle,
              child: _TokenWrap(values: dish.hiddenIngredients, tone: ScoreBadgeTone.warning),
            ),
            _InfoPanel(
              title: copy.priceIntelligenceTitle,
              child: _PriceIntelligenceDetail(price: dish.priceIntelligence, copy: copy),
            ),
          ],
        ),
      ),
    );
  }
}

class _PriceIntelligenceDetail extends StatelessWidget {
  const _PriceIntelligenceDetail({required this.price, required this.copy});

  final PriceIntelligenceModel price;
  final LocalizedResultCopy copy;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ScoreBadge(label: copy.assessmentLabel(price.assessment), tone: ScoreBadgeTone.value),
            ScoreBadge(label: copy.valueSignalLabel, tone: ScoreBadgeTone.muted),
          ],
        ),
        const SizedBox(height: 18),
        _PriceLine(
          label: copy.localMenuPriceLabel,
          value: _formatMoney(price.localPrice, price.localCurrency),
        ),
        _PriceLine(
          label: copy.yourCurrencyPriceLabel(price.homeCurrency),
          value: '${copy.approximate} ${_formatMoney(price.homePrice, price.homeCurrency)}',
        ),
        _PriceLine(
          label: copy.exchangeRateLabel,
          value: '1 ${price.localCurrency} = ${price.exchangeRate} ${price.homeCurrency}',
        ),
        const SizedBox(height: 12),
        Text(copy.valueExplanation(price.assessment), style: AppTextStyles.body),
      ],
    );
  }
}

class _PriceLine extends StatelessWidget {
  const _PriceLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                color: AppColors.mutedInk,
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: AppColors.ink,
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ],
      ),
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

class _HeroDishPanel extends StatelessWidget {
  const _HeroDishPanel({required this.dish, required this.copy});

  final DishAnalysisModel dish;
  final LocalizedResultCopy copy;

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
              ScoreBadge(label: '${copy.tasteLabel} ${dish.tasteScore}%', tone: ScoreBadgeTone.match),
              ScoreBadge(label: '${copy.safetyLabel} ${dish.safetyScore}%', tone: ScoreBadgeTone.safe),
              ScoreBadge(label: '${copy.valueLabel} ${dish.valueScore}%', tone: ScoreBadgeTone.value),
              ScoreBadge(
                label: '${copy.confidenceLabel} ${dish.foodConfidenceScore}%',
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
