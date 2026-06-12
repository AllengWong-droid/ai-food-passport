import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';

class ScannerBackground extends StatelessWidget {
  const ScannerBackground({required this.imageBytes, super.key});

  final Uint8List? imageBytes;

  @override
  Widget build(BuildContext context) {
    final bytes = imageBytes;

    return Stack(
      fit: StackFit.expand,
      children: [
        if (bytes != null)
          Image.memory(
            bytes,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => const _CameraMockBackground(),
          )
        else
          const _CameraMockBackground(),
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withOpacity(0.18),
                Colors.black.withOpacity(0.34),
                Colors.black.withOpacity(0.78),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _CameraMockBackground extends StatelessWidget {
  const _CameraMockBackground();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1A0804),
            Color(0xFF7E331C),
            Color(0xFF2D2118),
            Color(0xFF030303),
          ],
          stops: [0, 0.22, 0.64, 1],
        ),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            top: 128,
            bottom: 104,
            child: Transform.rotate(
              angle: -0.14,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: DecoratedBox(
                  decoration: const BoxDecoration(
                    color: Color(0xBDC2A77D),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black54,
                        blurRadius: 26,
                        offset: Offset(0, 18),
                      ),
                    ],
                  ),
                  child: const Padding(
                    padding: EdgeInsets.fromLTRB(24, 28, 24, 28),
                    child: _MockMenuLines(),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MockMenuLines extends StatelessWidget {
  const _MockMenuLines();

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var column = 0; column < 3; column++) ...[
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(height: 4, color: Colors.black.withOpacity(0.55)),
                const SizedBox(height: 18),
                for (var i = 0; i < 15; i++) ...[
                  Container(
                    height: i % 4 == 0 ? 18 : 9,
                    width: i % 3 == 0 ? 78 : 112,
                    color: i % 7 == 0
                        ? AppColors.accent.withOpacity(0.55)
                        : Colors.black.withOpacity(0.58),
                  ),
                  SizedBox(height: i % 4 == 0 ? 13 : 9),
                ],
              ],
            ),
          ),
          if (column < 2)
            Container(
              width: 1,
              height: 650,
              margin: const EdgeInsets.symmetric(horizontal: 14),
              color: Colors.black.withOpacity(0.48),
            ),
        ],
      ],
    );
  }
}
