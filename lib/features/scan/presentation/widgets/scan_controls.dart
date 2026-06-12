import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';

class ScanRoundCloseButton extends StatelessWidget {
  const ScanRoundCloseButton({required this.onTap, super.key});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: const Color(0xFF4D413F).withOpacity(0.88),
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.close, color: Colors.white, size: 26),
      ),
    );
  }
}

class ScanLanguageChip extends StatelessWidget {
  const ScanLanguageChip({required this.label, super.key});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 42,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: const Color(0xFF4D413F).withOpacity(0.94),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.bolt, color: AppColors.accent, size: 17),
          const SizedBox(width: 7),
          Flexible(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ScanActionButton extends StatelessWidget {
  const ScanActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    super.key,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: _ScanActionButtonContent(icon: icon, label: label),
    );
  }
}

class DisabledScanActionButton extends StatelessWidget {
  const DisabledScanActionButton({
    required this.icon,
    required this.label,
    super.key,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: 0.42,
      child: _ScanActionButtonContent(icon: icon, label: label),
    );
  }
}

class CaptureButton extends StatelessWidget {
  const CaptureButton({
    required this.onTap,
    required this.isProcessing,
    super.key,
  });

  final VoidCallback onTap;
  final bool isProcessing;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 116,
        height: 116,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 6),
        ),
        alignment: Alignment.center,
        child: isProcessing
            ? const SizedBox(
                width: 42,
                height: 42,
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 4),
              )
            : Container(
                width: 78,
                height: 78,
                decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                child: const Icon(
                  Icons.document_scanner_outlined,
                  color: Colors.black,
                  size: 30,
                ),
              ),
      ),
    );
  }
}

class SelectedImageLabel extends StatelessWidget {
  const SelectedImageLabel({required this.imagePath, super.key});

  final String imagePath;

  @override
  Widget build(BuildContext context) {
    final normalizedPath = imagePath.replaceAll('\\', '/');
    final fileName = normalizedPath.split('/').last;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 44),
      child: Text(
        fileName,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Color(0xFFC6C6C8),
          fontSize: 13,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _ScanActionButtonContent extends StatelessWidget {
  const _ScanActionButtonContent({
    required this.icon,
    required this.label,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 54,
          height: 54,
          decoration: BoxDecoration(
            color: const Color(0xFF4D413F).withOpacity(0.94),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.white, size: 24),
        ),
        const SizedBox(height: 9),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 11,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.1,
          ),
        ),
      ],
    );
  }
}
