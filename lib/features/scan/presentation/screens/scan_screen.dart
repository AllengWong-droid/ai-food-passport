import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/section_header.dart';
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
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 28, 45, 42),
          children: [
            Row(
              children: [
                GestureDetector(
                  onTap: () => context.goNamed(RouteNames.home),
                  child: Container(
                    width: 54,
                    height: 54,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEDEBE8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.close, color: AppColors.ink, size: 26),
                  ),
                ),
                const Expanded(
                  child: Center(child: SectionHeader('Menu Scan')),
                ),
                const SizedBox(width: 54),
              ],
            ),
            const SizedBox(height: 32),
            Text(
              'Choose a menu\nphoto to analyze.',
              style: AppTextStyles.title.copyWith(fontSize: 36, height: 1.22),
            ),
            const SizedBox(height: 14),
            const Text(
              'Use a clear menu image. The MVP Alpha keeps OCR and AI mocked while the capture flow stays real.',
              style: AppTextStyles.body,
            ),
            const SizedBox(height: 28),
            _ImagePreviewCard(
              imageBytes: _selectedImageBytes,
              imagePath: _selectedImagePath,
            ),
            const SizedBox(height: 24),
            AppButton(
              label: _selectedImagePath == null ? 'SELECT IMAGE' : 'CHANGE IMAGE',
              icon: Icons.photo_library_outlined,
              isPrimary: false,
              onPressed: _selectImageFromGallery,
            ),
            const SizedBox(height: 12),
            AppButton(
              label: _isProcessing ? 'ANALYZING MENU' : 'ANALYZE MENU',
              icon: Icons.document_scanner_outlined,
              onPressed: () {
                final imagePath = _selectedImagePath;
                if (imagePath == null) {
                  _showSelectImageMessage();
                  return;
                }
                _processSelectedImage(imagePath);
              },
            ),
            const SizedBox(height: 12),
            AppButton(
              label: 'TAKE PHOTO',
              icon: Icons.photo_camera_outlined,
              isPrimary: false,
              onPressed: _showPhotoPlaceholder,
            ),
          ],
        ),
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

  void _showSelectImageMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Select a menu image first.')),
    );
  }

  void _showPhotoPlaceholder() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Camera capture placeholder. Use gallery selection in this MVP Alpha.'),
      ),
    );
  }
}

class _ImagePreviewCard extends StatelessWidget {
  const _ImagePreviewCard({
    required this.imageBytes,
    required this.imagePath,
  });

  final Uint8List? imageBytes;
  final String? imagePath;

  @override
  Widget build(BuildContext context) {
    final bytes = imageBytes;
    final path = imagePath;

    return Container(
      height: 360,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (bytes != null)
              Image.memory(
                bytes,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return const _EmptyPreview();
                },
              )
            else
              const _EmptyPreview(),
            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white.withOpacity(0.35), width: 2),
                  borderRadius: BorderRadius.circular(28),
                ),
              ),
            ),
            if (path != null)
              Positioned(
                left: 18,
                right: 18,
                bottom: 18,
                child: _SelectedImageLabel(imagePath: path),
              ),
          ],
        ),
      ),
    );
  }
}

class _EmptyPreview extends StatelessWidget {
  const _EmptyPreview();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFEDEBE8),
      child: const Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.restaurant_menu, color: AppColors.accent, size: 44),
          SizedBox(height: 16),
          Text(
            'No menu image selected',
            style: TextStyle(
              color: AppColors.ink,
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Gallery images preview here',
            style: TextStyle(
              color: AppColors.mutedInk,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
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

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.darkPanel.withOpacity(0.82),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        fileName,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 13,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
