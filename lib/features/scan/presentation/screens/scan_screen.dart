import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../app/router/route_names.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/models.dart';
import '../widgets/scan_controls.dart';
import '../widgets/scan_frame_overlay.dart';
import '../widgets/scan_processing_overlay.dart';
import '../widgets/scan_recovery_overlay.dart';
import '../widgets/scanner_background.dart';

class ScanScreen extends ConsumerStatefulWidget {
  const ScanScreen({super.key});

  @override
  ConsumerState<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends ConsumerState<ScanScreen> {
  static const _mockScanImagePath = 'mock-menu-image';

  final ImagePicker _imagePicker = ImagePicker();
  String? _selectedImagePath;
  Uint8List? _selectedImageBytes;
  String? _processingMessage;
  _ScanRecoveryState? _recoveryState;
  bool _isProcessing = false;

  bool get _hasSelectedImage => _selectedImageBytes != null;

  @override
  Widget build(BuildContext context) {
    final viewportHeight = MediaQuery.sizeOf(context).height;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 430),
          child: SizedBox(
            width: double.infinity,
            height: viewportHeight,
            child: LayoutBuilder(
              builder: (context, constraints) {
                final height = constraints.maxHeight;
                final frameTop = (height * 0.24).clamp(145.0, 205.0).toDouble();
                final frameHeight = (height * 0.38).clamp(260.0, 380.0).toDouble();

                return Stack(
                  fit: StackFit.expand,
                  children: [
                    ScannerBackground(imageBytes: _selectedImageBytes),
                    SafeArea(
                      bottom: false,
                      child: Stack(
                        children: [
                          Positioned(
                            top: 20,
                            left: 24,
                            child: ScanRoundCloseButton(
                              onTap: () => context.goNamed(RouteNames.home),
                            ),
                          ),
                          const Positioned(
                            top: 26,
                            left: 0,
                            right: 0,
                            child: Center(
                              child: SizedBox(
                                width: 250,
                                child: ScanLanguageChip(label: 'AUTO-DETECT JAPANESE'),
                              ),
                            ),
                          ),
                          Positioned(
                            top: frameTop,
                            left: 54,
                            right: 54,
                            height: frameHeight,
                            child: const ScanFrameOverlay(),
                          ),
                          Positioned(
                            left: 0,
                            right: 0,
                            bottom: 58,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  _hasSelectedImage ? 'IMAGE READY' : 'FRAME THE MENU',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1.2,
                                  ),
                                ),
                                if (_hasSelectedImage && _selectedImagePath != null) ...[
                                  const SizedBox(height: 10),
                                  SelectedImageLabel(imagePath: _selectedImagePath!),
                                ],
                                const SizedBox(height: 28),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    ScanActionButton(
                                      icon: Icons.photo_library_outlined,
                                      label: 'GALLERY',
                                      onTap: _selectImageFromGallery,
                                    ),
                                    const SizedBox(width: 24),
                                    CaptureButton(
                                      isProcessing: _isProcessing,
                                      onTap: _startScan,
                                    ),
                                    const SizedBox(width: 24),
                                    const DisabledScanActionButton(
                                      icon: Icons.photo_camera_outlined,
                                      label: 'PHOTO',
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (_isProcessing)
                      ScanProcessingOverlay(
                        message: _processingMessage ?? 'Reading menu image',
                      ),
                    if (_recoveryState != null)
                      ScanRecoveryOverlay(
                        title: _recoveryState!.title,
                        message: _recoveryState!.message,
                        retryAvailable: _recoveryState!.retryAvailable,
                        onRetry: _retryScan,
                        onChooseImage: _chooseAnotherImage,
                        onContinueSample: _continueWithSampleResult,
                      ),
                  ],
                );
              },
            ),
          ),
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
    final imagePath = image.path.trim().isNotEmpty ? image.path : image.name;

    setState(() {
      _selectedImagePath = imagePath;
      _selectedImageBytes = imageBytes;
      _recoveryState = null;
    });
  }

  void _startScan() {
    _processSelectedImage(_selectedImagePath ?? _mockScanImagePath);
  }

  void _retryScan() {
    _clearRecoveryState();
    _startScan();
  }

  void _chooseAnotherImage() {
    _clearRecoveryState();
    _selectImageFromGallery();
  }

  void _continueWithSampleResult() {
    _clearRecoveryState();
    _processSelectedImage(_mockScanImagePath);
  }

  void _clearRecoveryState() {
    if (!mounted) {
      return;
    }

    setState(() {
      _recoveryState = null;
    });
  }

  Future<void> _processSelectedImage(String imagePath) async {
    if (_isProcessing) {
      return;
    }

    setState(() {
      _isProcessing = true;
      _processingMessage = 'Reading menu image';
      _recoveryState = null;
    });

    final scanRepository = ref.read(scanRepositoryProvider);
    final ocrRepository = ref.read(ocrRepositoryProvider);
    final aiRepository = ref.read(aiRepositoryProvider);
    final user = ref.read(currentUserProvider);
    final tastePassport = ref.read(tastePassportProvider);

    try {
      await _showProcessingStage('Reading menu image');
      final scan = scanRepository.createScanFromImage(imagePath);
      ref.read(latestScanProvider.notifier).state = scan;

      await _showProcessingStage('Recognizing dishes', pause: Duration.zero);
      final OcrResult ocrResult;
      try {
        ocrResult = await ocrRepository.extractText(scan.imagePath);
      } catch (_) {
        _showRecoveryState(_ScanRecoveryKind.ocrFailed);
        return;
      }
      ref.read(latestOcrResultProvider.notifier).state = ocrResult;

      await _showProcessingStage('Checking taste and allergy fit', pause: Duration.zero);
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
      try {
        ref.read(dishAnalysesProvider.notifier).state =
            await aiRepository.analyzeMenu(analysisRequest);
      } catch (_) {
        _showRecoveryState(_ScanRecoveryKind.aiAnalysisFailed);
        return;
      }

      await _showProcessingStage('Comparing local prices');
      await _showProcessingStage('Preparing recommendations');

      if (mounted) {
        context.goNamed(RouteNames.results);
      }
    } catch (_) {
      _showRecoveryState(_ScanRecoveryKind.providerUnavailable);
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
          _processingMessage = null;
        });
      }
    }
  }

  Future<void> _showProcessingStage(
    String message, {
    Duration pause = const Duration(milliseconds: 180),
  }) async {
    if (!mounted) {
      return;
    }

    setState(() {
      _processingMessage = message;
    });

    if (pause != Duration.zero) {
      await Future<void>.delayed(pause);
    }
  }

  void _showRecoveryState(_ScanRecoveryKind kind) {
    if (!mounted) {
      return;
    }

    setState(() {
      _recoveryState = _ScanRecoveryState(kind);
    });
  }
}

enum _ScanRecoveryKind {
  ocrFailed,
  aiAnalysisFailed,
  networkUnavailable,
  providerUnavailable,
  fallbackUsed,
}

class _ScanRecoveryState {
  const _ScanRecoveryState(this.kind);

  final _ScanRecoveryKind kind;
  bool get retryAvailable => true;

  String get title {
    switch (kind) {
      case _ScanRecoveryKind.ocrFailed:
        return 'We could not read this menu clearly';
      case _ScanRecoveryKind.aiAnalysisFailed:
        return 'We could not finish the food match';
      case _ScanRecoveryKind.networkUnavailable:
        return 'Connection looks unavailable';
      case _ScanRecoveryKind.providerUnavailable:
        return 'Menu analysis is taking too long';
      case _ScanRecoveryKind.fallbackUsed:
        return 'We used a backup route';
    }
  }

  String get message {
    switch (kind) {
      case _ScanRecoveryKind.ocrFailed:
        return 'Try another photo or continue with a sample analysis.';
      case _ScanRecoveryKind.aiAnalysisFailed:
        return 'You can retry the analysis or continue with sample recommendations.';
      case _ScanRecoveryKind.networkUnavailable:
        return 'Check your connection, try again, or continue with sample results.';
      case _ScanRecoveryKind.providerUnavailable:
        return 'Try again in a moment or continue with sample recommendations.';
      case _ScanRecoveryKind.fallbackUsed:
        return 'A primary provider was unavailable, so a backup route prepared the result.';
    }
  }
}
