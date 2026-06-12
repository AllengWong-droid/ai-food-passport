import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';

class ScanFrameOverlay extends StatelessWidget {
  const ScanFrameOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(painter: _ScanFramePainter());
  }
}

class _ScanFramePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final rect = RRect.fromRectAndRadius(
      Offset.zero & size,
      const Radius.circular(30),
    );
    final whitePaint = Paint()
      ..color = Colors.white.withOpacity(0.72)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    final accentPaint = Paint()
      ..color = AppColors.accent
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.square;

    canvas.drawRRect(rect, whitePaint);

    const corner = 48.0;
    final path = Path()
      ..moveTo(0, corner)
      ..lineTo(0, 18)
      ..quadraticBezierTo(0, 0, 18, 0)
      ..lineTo(corner, 0)
      ..moveTo(size.width - corner, 0)
      ..lineTo(size.width - 18, 0)
      ..quadraticBezierTo(size.width, 0, size.width, 18)
      ..lineTo(size.width, corner)
      ..moveTo(0, size.height - corner)
      ..lineTo(0, size.height - 18)
      ..quadraticBezierTo(0, size.height, 18, size.height)
      ..lineTo(corner, size.height)
      ..moveTo(size.width - corner, size.height)
      ..lineTo(size.width - 18, size.height)
      ..quadraticBezierTo(size.width, size.height, size.width, size.height - 18)
      ..lineTo(size.width, size.height - corner);
    canvas.drawPath(path, accentPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
