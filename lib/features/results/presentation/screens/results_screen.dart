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
              'Ranked for your\ntaste passport.',
              style: AppTextStyles.title.copyWith(fontSize: 36, height: 1.26),
            ),
            const SizedBox(height: 34),
            if (kDebugMode && ocrResult != null) ...[
              _OcrDebugSection(
                rawText: ocrResult.rawText,
                detectedLanguage: ocrResult.detectedLanguage,
                confidence: ocrResult.confidence,
                source: ocrResult.source,
              ),
              const SizedBox(height: 18),
            ],
            if (kDebugMode && aiRequest != null) ...[
              _AiDebugSection(
                ocrLanguage: aiRequest.ocrResult.detectedLanguage,
                tastePreferences: aiRequest.tastePassport.tastePreferences,
                allergies: aiRequest.tastePassport.allergies,
                dietaryPreferences: aiRequest.tastePassport.dietaryPreferences,
                dishCount: dishes.length,
              ),
              const SizedBox(height: 18),
            ],
            for (var i = 0; i < dishes.length; i++) ...[
              ResultCard(
                dish: dishes[i],
                elevated: i == 0,
                onTap: () => context.goNamed(
                  RouteNames.dishDetail,
                  pathParameters: {'dishId': dishes[i].id},
                ),
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

class _AiDebugSection extends StatelessWidget {
  const _AiDebugSection({
    required this.ocrLanguage,
    required this.tastePreferences,
    required this.allergies,
    required this.dietaryPreferences,
    required this.dishCount,
  });

  final String ocrLanguage;
  final List<String> tastePreferences;
  final List<String> allergies;
  final List<String> dietaryPreferences;
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
          const _DebugLine(label: 'AI source', value: 'mock_ai'),
          const _DebugLine(label: 'Future provider available', value: 'openai_skeleton'),
          const _DebugLine(label: 'Parser status', value: 'ready'),
          const _DebugLine(label: 'Real API enabled', value: 'false'),
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
        color: const Color(0xFFF7F4EF),
        borderRadius: BorderRadius.circular(18),
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
