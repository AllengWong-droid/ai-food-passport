import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/models.dart';

class ScanHistoryScreen extends ConsumerWidget {
  const ScanHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final history = ref.watch(scanHistoryProvider);
    final historyNotifier = ref.read(scanHistoryProvider.notifier);

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 28, 45, 42),
          children: [
            // Header with back button and title
            Row(
              children: [
                GestureDetector(
                  onTap: () => context.pop(),
                  child: Container(
                    width: 54,
                    height: 54,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEDEBE8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.chevron_left,
                        color: AppColors.ink, size: 30),
                  ),
                ),
                const Expanded(
                  child: Center(
                    child: SectionHeader('Scan History'),
                  ),
                ),
                const SizedBox(width: 54),
              ],
            ),
            const SizedBox(height: 34),

            // History list or empty state
            if (history.isEmpty) ...[
              _EmptyHistoryState(),
            ] else ...[
              // Clear history button
              _ClearHistoryButton(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Clear History'),
                      content: const Text(
                          'Are you sure you want to clear all scan history?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () {
                            historyNotifier.state = [];
                            Navigator.of(context).pop();
                          },
                          child: const Text('Clear',
                              style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),

              // History entries
              for (var i = 0; i < history.length; i++) ...[
                _HistoryEntryCard(
                  entry: history[i],
                  onTap: () {
                    // Restore the analysis state and navigate to results
                    ref.read(latestScanProvider.notifier).state =
                        history[i].scan;
                    ref.read(latestOcrResultProvider.notifier).state =
                        history[i].ocrResult;
                    ref.read(latestAiAnalysisRequestProvider.notifier).state =
                        history[i].aiAnalysisRequest;
                    ref.read(dishAnalysesProvider.notifier).state =
                        history[i].dishAnalyses;
                    context.pushNamed(RouteNames.results);
                  },
                ),
                const SizedBox(height: 16),
              ],
            ],
          ],
        ),
      ),
    );
  }
}

class _EmptyHistoryState extends StatelessWidget {
  const _EmptyHistoryState();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.history,
            size: 64,
            color: AppColors.softInk.withOpacity(0.5),
          ),
          const SizedBox(height: 24),
          Text(
            'No scan history yet',
            style: AppTextStyles.title.copyWith(
              fontSize: 24,
              color: AppColors.mutedInk,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Scan a menu to see your analysis history here.',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.softInk,
              fontSize: 15,
              height: 1.4,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _ClearHistoryButton extends StatelessWidget {
  const _ClearHistoryButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 54,
        padding: const EdgeInsets.symmetric(horizontal: 18),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.delete_outline, color: Colors.red, size: 20),
            SizedBox(width: 8),
            Flexible(
              child: Text(
                'Clear history',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.red,
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HistoryEntryCard extends StatelessWidget {
  const _HistoryEntryCard({
    required this.entry,
    required this.onTap,
  });

  final ScanHistoryEntry entry;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Timestamp and dish count
            Row(
              children: [
                Expanded(
                  child: Text(
                    _formatTimestamp(entry.timestamp),
                    style: const TextStyle(
                      color: AppColors.mutedInk,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.accentSoft,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${entry.dishCount} ${entry.dishCount == 1 ? "dish" : "dishes"}',
                    style: const TextStyle(
                      color: AppColors.ink,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Dish names summary
            Text(
              entry.dishNamesSummary,
              style: AppTextStyles.title.copyWith(
                fontSize: 18,
                height: 1.3,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),

            // Source mode
            Row(
              children: [
                Icon(
                  _sourceIcon(entry.sourceMode),
                  size: 16,
                  color: AppColors.mutedInk,
                ),
                const SizedBox(width: 6),
                Text(
                  entry.sourceMode,
                  style: const TextStyle(
                    color: AppColors.mutedInk,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Spacer(),
                const Icon(
                  Icons.chevron_right,
                  color: AppColors.softInk,
                  size: 24,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${timestamp.month}/${timestamp.day} ${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}';
    }
  }

  IconData _sourceIcon(String sourceMode) {
    if (sourceMode.toLowerCase().contains('backend')) {
      return Icons.cloud_outlined;
    }
    return Icons.phone_android_outlined;
  }
}
