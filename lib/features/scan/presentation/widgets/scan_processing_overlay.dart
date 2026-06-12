import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';

class ScanProcessingOverlay extends StatelessWidget {
  const ScanProcessingOverlay({required this.message, super.key});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: AbsorbPointer(
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.72),
          ),
          child: SafeArea(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 42),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      width: 54,
                      height: 54,
                      child: CircularProgressIndicator(
                        color: AppColors.accent,
                        strokeWidth: 4,
                      ),
                    ),
                    const SizedBox(height: 26),
                    Text(
                      message,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        height: 1.22,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Building your food passport match',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color(0xFFC6C6C8),
                        fontSize: 13,
                        height: 1.35,
                        fontWeight: FontWeight.w700,
                      ),
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
