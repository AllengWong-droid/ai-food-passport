import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/disclaimer_banner.dart';
import '../../../../core/widgets/result_card.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';

class ResultsScreen extends ConsumerWidget {
  const ResultsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dishes = ref.watch(dishAnalysesProvider);
    final ocrResult = ref.watch(latestOcrResultProvider);
    final aiRequest = ref.watch(latestAiAnalysisRequestProvider);

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 28, 45, 42),
          children: [
            Row(
              children: [
                GestureDetector(
                  onTap: () => context.goNamed(RouteNames.home),
                  child: Container(
                    width: 54,
                    height: 54,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEDEBE8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.chevron_left, color: AppColors.ink, size: 30),
                  ),
                ),
                const Expanded(
                  child: Center(child: SectionHeader('8 of 14 Match')),
                ),
                const SizedBox(width: 54),
              ],
            ),
            const SizedBox(height: 34),
            const SectionHeader('Tokyo - Izakaya Gonpachi'),
            const SizedBox(height: 14),
            Text(
              'Ranked by taste,\nsafety, and value.',
              style: AppTextStyles.title.copyWith(fontSize: 36, height: 1.26),
            ),
            if (aiRequest != null) ...[
              const SizedBox(height: 18),
              _TravelerContextSummary(
                homeCurrency: aiRequest.userHomeCurrency,
                homeCountry: aiRequest.userHomeCountry,
              ),
            ],
            const SizedBox(height: 34),
            for (var i = 0; i < dishes.length; i++) ...[
              ResultCard(
                dish: dishes[i],
                elevated: i == 0,
                onTap: () => context.pushNamed(
                  RouteNames.dishDetail,
                  pathParameters: {'dishId': dishes[i].id},
                ),
              ),
              const SizedBox(height: 18),
            ],
            if (kDebugMode && (ocrResult != null || aiRequest != null)) ...[
              const SizedBox(height: 8),
              const SectionHeader('Developer Debug'),
              const SizedBox(height: 12),
              if (ocrResult != null) ...[
                _OcrDebugSection(
                  rawText: ocrResult.rawText,
                  detectedLanguage: ocrResult.detectedLanguage,
                  confidence: ocrResult.confidence,
                  source: ocrResult.source,
                ),
                const SizedBox(height: 10),
              ],
              if (aiRequest != null)
                _AiDebugSection(
                  ocrLanguage: aiRequest.ocrResult.detectedLanguage,
                  tastePreferences: aiRequest.tastePassport.tastePreferences,
                  allergies: aiRequest.tastePassport.allergies,
                  dietaryPreferences: aiRequest.tastePassport.dietaryPreferences,
                  homeCountry: aiRequest.userHomeCountry,
                  homeCurrency: aiRequest.userHomeCurrency,
                  outputLanguage: aiRequest.outputLanguage,
                  providerMode: aiRequest.providerMode.name,
                  dishCount: dishes.length,
                ),
              const SizedBox(height: 18),
            ],
            const SizedBox(height: 2),
            const DisclaimerBanner(),
          ],
        ),
      ),
    );
  }
}

class _TravelerContextSummary extends StatelessWidget {
  const _TravelerContextSummary({
    required this.homeCurrency,
    required this.homeCountry,
  });

  final String homeCurrency;
  final String homeCountry;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
      decoration: BoxDecoration(
        color: AppColors.accentSoft,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: const BoxDecoration(
              color: AppColors.accent,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.payments_outlined, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 13),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Prices converted to $homeCurrency',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.ink,
                    fontSize: 16,
                    height: 1.1,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Based on your traveler profile from $homeCountry',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.mutedInk,
                    fontSize: 13,
                    height: 1.25,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AiDebugSection extends StatelessWidget {
  const _AiDebugSection({
    required this.ocrLanguage,
    required this.tastePreferences,
    required this.allergies,
    required this.dietaryPreferences,
    required this.homeCountry,
    required this.homeCurrency,
    required this.outputLanguage,
    required this.providerMode,
    required this.dishCount,
  });

  final String ocrLanguage;
  final List<String> tastePreferences;
  final List<String> allergies;
  final List<String> dietaryPreferences;
  final String homeCountry;
  final String homeCurrency;
  final String outputLanguage;
  final String providerMode;
  final int dishCount;

  @override
  Widget build(BuildContext context) {
    return _DebugExpansionPanel(
      title: 'AI Debug',
      subtitle: '$dishCount dishes - mock_ai',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _DebugLine(label: 'OCR language', value: ocrLanguage),
          _DebugLine(label: 'Taste preferences', value: _joinValues(tastePreferences)),
          _DebugLine(label: 'Allergies', value: _joinValues(allergies)),
          _DebugLine(label: 'Dietary preferences', value: _joinValues(dietaryPreferences)),
          _DebugLine(label: 'Home country', value: homeCountry),
          _DebugLine(label: 'Home currency', value: homeCurrency),
          _DebugLine(label: 'Output language', value: outputLanguage),
          const _DebugLine(label: 'Active provider', value: 'mock_ai'),
          _DebugLine(label: 'Provider mode', value: providerMode),
          const _DebugLine(label: 'Backend routing planned', value: 'true'),
          const _DebugLine(label: 'OCR-first pipeline planned', value: 'true'),
          const _DebugLine(label: 'Qwen enabled', value: 'false'),
          const _DebugLine(label: 'DeepSeek enabled', value: 'false'),
          const _DebugLine(label: 'OpenAI enabled', value: 'false'),
          const _DebugLine(label: 'Real OCR enabled', value: 'false'),
        ],
      ),
    );
  }

  String _joinValues(List<String> values) {
    return values.isEmpty ? 'None' : values.join(', ');
  }
}

class _OcrDebugSection extends StatelessWidget {
  const _OcrDebugSection({
    required this.rawText,
    required this.detectedLanguage,
    required this.confidence,
    required this.source,
  });

  final String rawText;
  final String detectedLanguage;
  final double confidence;
  final String source;

  @override
  Widget build(BuildContext context) {
    return _DebugExpansionPanel(
      title: 'OCR Debug',
      subtitle: '$detectedLanguage - ${(confidence * 100).round()}% - $source',
      child: Align(
        alignment: Alignment.centerLeft,
        child: SelectableText(
          rawText,
          style: const TextStyle(
            color: AppColors.ink,
            fontSize: 13,
            height: 1.35,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

class _DebugExpansionPanel extends StatelessWidget {
  const _DebugExpansionPanel({
    required this.title,
    required this.subtitle,
    required this.child,
  });

  final String title;
  final String subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF0EDE8),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 18),
        childrenPadding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
        title: Text(
          title,
          style: const TextStyle(
            color: AppColors.ink,
            fontSize: 15,
            fontWeight: FontWeight.w900,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(
            color: AppColors.mutedInk,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
        children: [child],
      ),
    );
  }
}

class _DebugLine extends StatelessWidget {
  const _DebugLine({
    required this.label,
    required this.value,
  });

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        '$label: $value',
        style: const TextStyle(
          color: AppColors.ink,
          fontSize: 13,
          height: 1.35,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
