import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';

class ScanRecoveryOverlay extends StatelessWidget {
  const ScanRecoveryOverlay({
    required this.title,
    required this.message,
    required this.retryAvailable,
    required this.onRetry,
    required this.onChooseImage,
    required this.onContinueSample,
    super.key,
  });

  final String title;
  final String message;
  final bool retryAvailable;
  final VoidCallback onRetry;
  final VoidCallback onChooseImage;
  final VoidCallback onContinueSample;

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.76),
        ),
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Container(
                padding: const EdgeInsets.fromLTRB(22, 24, 22, 20),
                decoration: BoxDecoration(
                  color: const Color(0xFF2D2118).withOpacity(0.96),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: Colors.white.withOpacity(0.14)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 58,
                      height: 58,
                      decoration: const BoxDecoration(
                        color: AppColors.accent,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.travel_explore,
                        color: Colors.black,
                        size: 29,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 21,
                        height: 1.16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      message,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Color(0xFFC6C6C8),
                        fontSize: 14,
                        height: 1.36,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 22),
                    if (retryAvailable)
                      _RecoveryActionButton(
                        label: 'Try again',
                        icon: Icons.refresh,
                        onTap: onRetry,
                        emphasized: true,
                      ),
                    const SizedBox(height: 10),
                    _RecoveryActionButton(
                      label: 'Choose another image',
                      icon: Icons.photo_library_outlined,
                      onTap: onChooseImage,
                    ),
                    const SizedBox(height: 10),
                    _RecoveryActionButton(
                      label: 'Continue with sample result',
                      icon: Icons.restaurant_menu,
                      onTap: onContinueSample,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RecoveryActionButton extends StatelessWidget {
  const _RecoveryActionButton({
    required this.label,
    required this.icon,
    required this.onTap,
    this.emphasized = false,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool emphasized;

  @override
  Widget build(BuildContext context) {
    final backgroundColor = emphasized ? AppColors.accent : Colors.white.withOpacity(0.1);
    final foregroundColor = emphasized ? Colors.black : Colors.white;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(emphasized ? 0 : 0.14)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: foregroundColor, size: 20),
            const SizedBox(width: 9),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: foregroundColor,
                  fontSize: 14,
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
