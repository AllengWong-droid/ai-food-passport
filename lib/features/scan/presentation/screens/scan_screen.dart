import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/models.dart';

class ScanScreen extends ConsumerStatefulWidget {
  const ScanScreen({super.key});

  @override
  ConsumerState<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends ConsumerState<ScanScreen> {
  final ImagePicker _imagePicker = ImagePicker();
  String? _selectedImagePath;
  Uint8List? _selectedImageBytes;
  bool _isProcessing = false;

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;
    final frameTop = screenHeight * 0.24;
    final frameHeight = (screenHeight * 0.45).clamp(320.0, 460.0).toDouble();

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const _CameraMockBackground(),
          SafeArea(
            bottom: false,
            child: Stack(
              children: [
                Positioned(
                  top: 28,
                  left: 45,
                  child: _RoundCloseButton(onTap: () => context.goNamed(RouteNames.home)),
                ),
                const Positioned(
                  top: 35,
                  left: 158,
                  right: 112,
                  child: _LanguageChip(label: 'AUTO-DETECT JAPANESE', active: true),
                ),
                const Positioned(
                  top: 88,
                  left: 158,
                  right: 112,
                  child: _LanguageChip(label: 'CHINESE - ENGLISH', active: false),
                ),
                Positioned(
                  top: frameTop,
                  left: 64,
                  right: 64,
                  height: frameHeight,
                  child: _ScanPreviewFrame(imageBytes: _selectedImageBytes),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 86,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _selectedImagePath == null ? 'FRAME THE MENU' : 'IMAGE READY',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.2,
                        ),
                      ),
                      if (_selectedImagePath != null) ...[
                        const SizedBox(height: 10),
                        _SelectedImageLabel(imagePath: _selectedImagePath!),
                      ],
                      const SizedBox(height: 26),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _ScanActionButton(
                            icon: Icons.photo_library_outlined,
                            label: 'GALLERY',
                            onTap: _selectImageFromGallery,
                          ),
                          const SizedBox(width: 24),
                          _CaptureButton(
                            isProcessing: _isProcessing,
                            onTap: () {
                              final imagePath = _selectedImagePath;
                              if (imagePath == null) {
                                _showPhotoPlaceholder();
                                return;
                              }
                              _processSelectedImage(imagePath);
                            },
                          ),
                          const SizedBox(width: 24),
                          _ScanActionButton(
                            icon: Icons.photo_camera_outlined,
                            label: 'PHOTO',
                            onTap: _showPhotoPlaceholder,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _selectImageFromGallery() async {
    final image = await _imagePicker.pickImage(source: ImageSource.gallery);
    if (image == null) {
      return;
    }

    final imageBytes = await image.readAsBytes();

    setState(() {
      _selectedImagePath = image.path;
      _selectedImageBytes = imageBytes;
    });
  }

  Future<void> _processSelectedImage(String imagePath) async {
    if (_isProcessing) {
      return;
    }

    setState(() {
      _isProcessing = true;
    });

    final scanRepository = ref.read(scanRepositoryProvider);
    final ocrRepository = ref.read(ocrRepositoryProvider);
    final aiRepository = ref.read(aiRepositoryProvider);
    final user = ref.read(currentUserProvider);
    final tastePassport = ref.read(tastePassportProvider);

    try {
      final scan = scanRepository.createScanFromImage(imagePath);
      ref.read(latestScanProvider.notifier).state = scan;

      final ocrResult = await ocrRepository.extractText(scan.imagePath);
      ref.read(latestOcrResultProvider.notifier).state = ocrResult;

      final analysisRequest = AiAnalysisRequest(
        ocrResult: ocrResult,
        tastePassport: tastePassport,
        scan: scan,
        userHomeCountry: user.homeCountry,
        userHomeCurrency: user.homeCurrency,
        restaurantCountry: scan.restaurantCountry,
        restaurantCity: scan.restaurantCity,
        localCurrency: scan.localCurrency,
      );
      ref.read(latestAiAnalysisRequestProvider.notifier).state = analysisRequest;
      ref.read(dishAnalysesProvider.notifier).state =
          await aiRepository.analyzeMenu(analysisRequest);

      if (mounted) {
        context.goNamed(RouteNames.results);
      }
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  void _showPhotoPlaceholder() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Camera capture will be connected after the capture foundation is approved.'),
      ),
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
          stops: [0, 0.2, 0.64, 1],
        ),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            top: 128,
            bottom: 86,
            child: Transform.rotate(
              angle: -0.14,
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: -32),
                padding: const EdgeInsets.fromLTRB(46, 28, 46, 28),
                decoration: BoxDecoration(
                  color: const Color(0xFFC2A77D).withOpacity(0.74),
                  boxShadow: const [
                    BoxShadow(color: Colors.black54, blurRadius: 26, offset: Offset(0, 18)),
                  ],
                ),
                child: const _MockMenuLines(),
              ),
            ),
          ),
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.18),
                    Colors.black.withOpacity(0.10),
                    Colors.black.withOpacity(0.74),
                  ],
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
                    width: i % 3 == 0 ? 92 : 132,
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
              margin: const EdgeInsets.symmetric(horizontal: 20),
              color: Colors.black.withOpacity(0.48),
            ),
        ],
      ],
    );
  }
}

class _RoundCloseButton extends StatelessWidget {
  const _RoundCloseButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: const Color(0xFF62413B).withOpacity(0.88),
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.close, color: Colors.white, size: 26),
      ),
    );
  }
}

class _LanguageChip extends StatelessWidget {
  const _LanguageChip({required this.label, required this.active});

  final String label;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      opacity: active ? 1 : 0.0,
      duration: Duration.zero,
      child: Container(
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
      ),
    );
  }
}

class _ScanFrameOverlay extends StatelessWidget {
  const _ScanFrameOverlay();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(painter: _ScanFramePainter());
  }
}

class _ScanPreviewFrame extends StatelessWidget {
  const _ScanPreviewFrame({required this.imageBytes});

  final Uint8List? imageBytes;

  @override
  Widget build(BuildContext context) {
    final bytes = imageBytes;

    return ClipRRect(
      borderRadius: BorderRadius.circular(30),
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (bytes != null)
            Image.memory(
              bytes,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: Colors.black.withOpacity(0.34),
                  alignment: Alignment.center,
                  child: const Icon(Icons.image_not_supported_outlined, color: Colors.white),
                );
              },
            ),
          if (bytes == null)
            DecoratedBox(
              decoration: BoxDecoration(color: Colors.black.withOpacity(0.08)),
            ),
          const _ScanFrameOverlay(),
        ],
      ),
    );
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
      ..color = Colors.white.withOpacity(0.76)
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

class _ScanActionButton extends StatelessWidget {
  const _ScanActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
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
      ),
    );
  }
}

class _CaptureButton extends StatelessWidget {
  const _CaptureButton({
    required this.onTap,
    required this.isProcessing,
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
                child: const Icon(Icons.document_scanner_outlined, color: Colors.black, size: 30),
              ),
      ),
    );
  }
}

class _SelectedImageLabel extends StatelessWidget {
  const _SelectedImageLabel({required this.imagePath});

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
