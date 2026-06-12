import 'package:flutter/material.dart';

import '../../app/theme/app_colors.dart';

class AppScoreChip extends StatelessWidget {
  const AppScoreChip({
    required this.label,
    required this.kind,
    super.key,
  });

  final String label;
  final ScoreChipKind kind;

  @override
  Widget build(BuildContext context) {
    final colors = switch (kind) {
      ScoreChipKind.match => (AppColors.accentSoft, AppColors.accent),
      ScoreChipKind.safety => (AppColors.successSoft, AppColors.success),
      ScoreChipKind.value => (const Color(0xFFEDEBE8), AppColors.ink),
      ScoreChipKind.warning => (AppColors.warningSoft, AppColors.warning),
      ScoreChipKind.neutral => (const Color(0xFFEDEBE8), AppColors.mutedInk),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: colors.$1,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: colors.$2,
          fontSize: 12,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}

enum ScoreChipKind { match, safety, value, warning, neutral }
