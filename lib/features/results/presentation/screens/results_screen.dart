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
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF7F4EF),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 18),
        childrenPadding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
        title: const Text(
          'OCR Debug',
          style: TextStyle(
            color: AppColors.ink,
            fontSize: 15,
            fontWeight: FontWeight.w900,
          ),
        ),
        subtitle: Text(
          '$detectedLanguage - ${(confidence * 100).round()}% - $source',
          style: const TextStyle(
            color: AppColors.mutedInk,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
        children: [
          Align(
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
        ],
      ),
    );
  }
}
