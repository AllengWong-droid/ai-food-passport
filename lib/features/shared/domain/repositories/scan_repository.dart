import '../models/scan_model.dart';

abstract class ScanRepository {
  ScanModel captureDemoScan();

  ScanModel createScanFromImage(String imagePath);
}
