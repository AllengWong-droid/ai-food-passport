import 'package:flutter/material.dart';

import '../../app/theme/app_colors.dart';

class CountryStampGrid extends StatelessWidget {
  const CountryStampGrid({super.key});

  @override
  Widget build(BuildContext context) {
    const stamps = ['JP', 'PT', 'MX', 'TH', 'FR', 'IT', 'VN', 'ES'];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: stamps.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: 18,
        crossAxisSpacing: 18,
        childAspectRatio: 1,
      ),
      itemBuilder: (context, index) {
        final collected = index < 5;
        return CustomPaint(
          painter: _DashedStampPainter(collected: collected),
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: collected ? AppColors.accentSoft.withOpacity(0.52) : Colors.transparent,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Center(
              child: Text(
                stamps[index],
                style: TextStyle(
                  color: collected ? AppColors.accent : const Color(0xFFC8C7C5),
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _DashedStampPainter extends CustomPainter {
  const _DashedStampPainter({required this.collected});

  final bool collected;

  @override
  void paint(Canvas canvas, Size size) {
    final radius = Radius.circular(20);
    final rect = RRect.fromRectAndRadius(Offset.zero & size, radius);
    final path = Path()..addRRect(rect.deflate(1));
    final metric = path.computeMetrics().first;
    final paint = Paint()
      ..color = collected ? const Color(0xFFFFA996) : const Color(0xFFE1DEDA)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2;

    const dash = 5.0;
    const gap = 5.0;
    var distance = 0.0;
    while (distance < metric.length) {
      canvas.drawPath(metric.extractPath(distance, distance + dash), paint);
      distance += dash + gap;
    }
  }

  @override
  bool shouldRepaint(covariant _DashedStampPainter oldDelegate) {
    return oldDelegate.collected != collected;
  }
}
