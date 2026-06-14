import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(28, 28, 28, 24),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('AI FOOD PASSPORT', style: AppTextStyles.sectionLabel),
                const SizedBox(height: 28),
                const Text(
                  'Travel smarter.\nEat better.',
                  style: AppTextStyles.display,
                ),
                const SizedBox(height: 18),
                const Text(
                  'Scan foreign menus, spot food risks, and find dishes that match your taste passport.',
                  style: AppTextStyles.body,
                ),
                const SizedBox(height: 24),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.darkPanel,
                    borderRadius: BorderRadius.circular(28),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.public, color: AppColors.accent, size: 36),
                      SizedBox(height: 44),
                      Text(
                        'Menu confidence for Tokyo, Lisbon, Mexico City and beyond.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 23,
                          height: 1.18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 22),
                AppButton(
                  label: 'START PASSPORT',
                  icon: Icons.arrow_forward,
                  onPressed: () => context.goNamed(RouteNames.auth),
                ),
                const SizedBox(height: 12),
                AppButton(
                  label: 'TRY DEMO SCAN',
                  icon: Icons.center_focus_strong,
                  isPrimary: false,
                  onPressed: () => context.goNamed(RouteNames.home),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
