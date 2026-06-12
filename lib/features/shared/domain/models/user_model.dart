class UserModel {
  const UserModel({
    required this.id,
    required this.email,
    required this.displayName,
    required this.homeCountry,
    required this.homeCurrency,
  });

  final String id;
  final String email;
  final String displayName;
  final String homeCountry;
  final String homeCurrency;
}
