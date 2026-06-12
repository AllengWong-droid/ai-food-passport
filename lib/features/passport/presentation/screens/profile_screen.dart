import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/country_stamp_grid.dart';
import '../../../../core/widgets/passport_card.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/models.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final passport = ref.watch(tastePassportProvider);
    final travelerSettings = ref.watch(travelerSettingsProvider);

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
            const SectionHeader('Traveler Locale'),
            const SizedBox(height: 14),
            _SettingsDropdownTile<String>(
              title: 'Home Country',
              value: travelerSettings.homeCountry,
              values: const ['Taiwan', 'Singapore', 'Japan', 'Germany', 'United States'],
              labelFor: (value) => value,
              onChanged: (value) {
                _updateTravelerSettings(
                  ref,
                  travelerSettings.copyWith(homeCountry: value),
                );
              },
            ),
            _SettingsDropdownTile<String>(
              title: 'Home Currency',
              value: travelerSettings.homeCurrency,
              values: const ['TWD', 'SGD', 'JPY', 'EUR', 'USD'],
              labelFor: (value) => value,
              onChanged: (value) {
                _updateTravelerSettings(
                  ref,
                  travelerSettings.copyWith(homeCurrency: value),
                );
              },
            ),
            _SettingsDropdownTile<String>(
              title: 'Output Language',
              value: travelerSettings.outputLanguage,
              values: const [
                'English',
                'Traditional Chinese',
                'Simplified Chinese',
                'Japanese',
              ],
              labelFor: (value) => value,
              onChanged: (value) {
                _updateTravelerSettings(
                  ref,
                  travelerSettings.copyWith(outputLanguage: value),
                );
              },
            ),
            _SettingsDropdownTile<AiProviderMode>(
              title: 'AI Provider Mode',
              value: travelerSettings.providerMode,
              values: AiProviderMode.values,
              labelFor: _providerModeLabel,
              onChanged: (value) {
                _updateTravelerSettings(
                  ref,
                  travelerSettings.copyWith(providerMode: value),
                );
              },
            ),
            const SizedBox(height: 28),
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

void _updateTravelerSettings(WidgetRef ref, TravelerSettingsModel settings) {
  ref.read(travelerSettingsProvider.notifier).state = settings;
}

String _providerModeLabel(AiProviderMode mode) {
  return switch (mode) {
    AiProviderMode.auto => 'Auto',
    AiProviderMode.china => 'China',
    AiProviderMode.global => 'Global',
    AiProviderMode.mock => 'Mock',
  };
}

class _SettingsDropdownTile<T> extends StatelessWidget {
  const _SettingsDropdownTile({
    required this.title,
    required this.value,
    required this.values,
    required this.labelFor,
    required this.onChanged,
  });

  final String title;
  final T value;
  final List<T> values;
  final String Function(T value) labelFor;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 86,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.ink,
                fontSize: 18,
                height: 1,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Flexible(
            child: DropdownButtonHideUnderline(
              child: DropdownButton<T>(
                value: value,
                borderRadius: BorderRadius.circular(18),
                alignment: Alignment.centerRight,
                icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.softInk),
                selectedItemBuilder: (context) {
                  return values
                      .map(
                        (item) => Align(
                          alignment: Alignment.centerRight,
                          child: Text(
                            labelFor(item),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.right,
                            style: const TextStyle(
                              color: AppColors.mutedInk,
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      )
                      .toList();
                },
                items: [
                  for (final item in values)
                    DropdownMenuItem<T>(
                      value: item,
                      child: Text(labelFor(item)),
                    ),
                ],
                onChanged: (value) {
                  if (value != null) {
                    onChanged(value);
                  }
                },
              ),
            ),
          ),
        ],
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
