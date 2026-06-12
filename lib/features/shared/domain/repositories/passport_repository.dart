import '../models/taste_passport_model.dart';

abstract class PassportRepository {
  TastePassportModel loadPassport();

  TastePassportModel saveDemoPassport();
}
