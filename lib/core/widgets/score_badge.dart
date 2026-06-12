import 'package:flutter/material.dart';

import '../../app/theme/app_colors.dart';

class ScoreBadge extends StatelessWidget {
  const ScoreBadge({
    required this.label,
    required this.tone,
    this.icon,
    super.key,
  });

  final String label;
  final ScoreBadgeTone tone;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final palette = switch (tone) {
      ScoreBadgeTone.match => (AppColors.accentSoft, AppColors.accent),
      ScoreBadgeTone.safe => (AppColors.successSoft, AppColors.success),
      ScoreBadgeTone.value => (const Color(0xFFECEAE7), AppColors.ink),
      ScoreBadgeTone.warning => (AppColors.warningSoft, AppColors.warning),
      ScoreBadgeTone.muted => (const Color(0xFFE4E2DF), AppColors.mutedInk),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: palette.$1,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 13, color: palette.$2),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: palette.$2,
              fontSize: 12,
              height: 1,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

enum ScoreBadgeTone { match, safe, value, warning, muted }
