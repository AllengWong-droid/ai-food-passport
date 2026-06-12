import '../models/user_model.dart';

abstract class AuthRepository {
  UserModel currentUser();

  UserModel signInWithApple();

  UserModel signInWithGoogle();

  UserModel continueAsGuest();
}
