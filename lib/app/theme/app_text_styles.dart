import 'package:flutter/material.dart';

import 'app_colors.dart';

class AppTextStyles {
  const AppTextStyles._();

  static const display = TextStyle(
    fontSize: 40,
    height: 1.04,
    fontWeight: FontWeight.w900,
    color: AppColors.ink,
  );

  static const title = TextStyle(
    fontSize: 28,
    height: 1.12,
    fontWeight: FontWeight.w900,
    color: AppColors.ink,
  );

  static const sectionLabel = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w800,
    letterSpacing: 1.8,
    color: AppColors.softInk,
  );

  static const body = TextStyle(
    fontSize: 16,
    height: 1.45,
    fontWeight: FontWeight.w500,
    color: AppColors.ink,
  );
}
