import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/country_stamp_grid.dart';
import '../../../../core/widgets/passport_card.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final passport = ref.watch(tastePassportProvider);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 34, 45, 42),
          children: [
            Text('Passport', style: AppTextStyles.title.copyWith(fontSize: 36)),
            const SizedBox(height: 40),
            PassportCard(user: user),
            const SizedBox(height: 40),
            _PreferenceTile(
              title: 'Taste & Allergies',
              subtitle:
                  '${passport.allergies.length} allergens - ${passport.tastePreferences.length} preferences',
            ),
            _PreferenceTile(
              title: 'Home Currency',
              subtitle: '${user.homeCurrency} - ${user.homeCountry}',
            ),
            const _PreferenceTile(
              title: 'Travel History',
              subtitle: 'Tokyo, Lisbon, Mexico City...',
            ),
            const _PreferenceTile(title: 'Notifications', subtitle: 'On'),
            _PreferenceTile(
              title: 'Email',
              subtitle: user.email,
            ),
            const SizedBox(height: 34),
            const SectionHeader('Stamps Collected'),
            const SizedBox(height: 20),
            const CountryStampGrid(),
          ],
        ),
      ),
    );
  }
}

class _PreferenceTile extends StatelessWidget {
  const _PreferenceTile({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 96,
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.ink,
                    fontSize: 21,
                    height: 1,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.mutedInk,
                    fontSize: 16,
                    height: 1,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.softInk, size: 30),
        ],
      ),
    );
  }
}
