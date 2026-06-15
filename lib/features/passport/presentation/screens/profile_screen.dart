import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/country_stamp_grid.dart';
import '../../../../core/widgets/passport_card.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/config/developer_controls_config.dart';
import '../../../shared/data/ai/backend_endpoint_config.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/models.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final passport = ref.watch(tastePassportProvider);
    final travelerSettings = ref.watch(travelerSettingsProvider);
    final backendMockEnabled = ref.watch(backendMockModeProvider);
    final backendDebugScenario = ref.watch(backendDebugScenarioProvider);

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
              values: const [
                'Taiwan',
                'Singapore',
                'Japan',
                'Germany',
                'United States'
              ],
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
            if (DeveloperControlsConfig.areVisible) ...[
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
              const SizedBox(height: 8),
              const _SettingsHelperText(
                text:
                    'Provider routing is planned for a future release. All scans currently use preview data.',
              ),
            ],
            if (DeveloperControlsConfig.areVisible) ...[
              const SizedBox(height: 10),
              _DeveloperToggleTile(
                title: 'Backend Mock Mode',
                subtitle: backendMockEnabled
                    ? 'Connected to: ${BackendEndpointConfig.currentBaseUrl}'
                    : 'Using offline preview data. No server required. Backend URL: ${BackendEndpointConfig.currentBaseUrl}',
                value: backendMockEnabled,
                onChanged: (value) {
                  ref.read(backendMockModeProvider.notifier).state = value;
                },
              ),
              const SizedBox(height: 8),
              _SettingsDropdownTile<String>(
                title: 'Backend Scenario',
                value: backendDebugScenario,
                values: _backendScenarioValues,
                labelFor: _backendScenarioLabel,
                onChanged: (value) {
                  ref.read(backendDebugScenarioProvider.notifier).state = value;
                },
                compact: true,
                muted: true,
              ),
              const SizedBox(height: 8),
              const _SettingsHelperText(
                text:
                    'Backend scenario is developer-only and only applies when Backend Mock Mode is on.',
              ),
            ],
            const SizedBox(height: 12),
            _ResetTravelerSettingsButton(
              onTap: () => _resetTravelerSettings(ref),
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
            _PreferenceTile(
              title: 'Scan History',
              subtitle: 'View past menu analyses',
              onTap: () => context.pushNamed(RouteNames.history),
            ),
            _PreferenceTile(
              title: 'Dietary Preferences',
              subtitle: 'Allergens and dietary restrictions',
              onTap: () => context.pushNamed(RouteNames.dietaryPreferences),
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

const _backendScenarioValues = [
  'normal',
  'ocr_low_confidence',
  'ocr_empty_text',
  'ocr_failure',
  'analysis_low_quality',
  'analysis_empty_result',
  'analysis_failure',
];

String _backendScenarioLabel(String value) {
  return switch (value) {
    'normal' => 'Normal',
    'ocr_low_confidence' => 'OCR low confidence',
    'ocr_empty_text' => 'OCR empty text',
    'ocr_failure' => 'OCR failure',
    'analysis_low_quality' => 'Analysis low quality',
    'analysis_empty_result' => 'Analysis empty result',
    'analysis_failure' => 'Analysis failure',
    _ => value,
  };
}

void _updateTravelerSettings(WidgetRef ref, TravelerSettingsModel settings) {
  ref.read(travelerSettingsProvider.notifier).update(settings);
}

void _resetTravelerSettings(WidgetRef ref) {
  ref.read(travelerSettingsProvider.notifier).reset();
}

String _providerModeLabel(AiProviderMode mode) {
  return switch (mode) {
    AiProviderMode.auto => 'Auto',
    AiProviderMode.china => 'China',
    AiProviderMode.global => 'Global',
    AiProviderMode.mock => 'Mock',
  };
}

class _SettingsHelperText extends StatelessWidget {
  const _SettingsHelperText({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: AppColors.mutedInk,
        fontSize: 13,
        height: 1.35,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}

class _DeveloperToggleTile extends StatelessWidget {
  const _DeveloperToggleTile({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 14, 14),
      decoration: BoxDecoration(
        color: AppColors.accentSoft,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          const Icon(Icons.science_outlined, color: AppColors.ink, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.ink,
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.mutedInk,
                    fontSize: 12,
                    height: 1.25,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            activeColor: AppColors.accent,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}

class _ResetTravelerSettingsButton extends StatelessWidget {
  const _ResetTravelerSettingsButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 54,
        padding: const EdgeInsets.symmetric(horizontal: 18),
        decoration: BoxDecoration(
          color: AppColors.accentSoft,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.restart_alt, color: AppColors.ink, size: 20),
            SizedBox(width: 8),
            Flexible(
              child: Text(
                'Reset traveler settings',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: AppColors.ink,
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsDropdownTile<T> extends StatelessWidget {
  const _SettingsDropdownTile({
    required this.title,
    required this.value,
    required this.values,
    required this.labelFor,
    required this.onChanged,
    this.compact = false,
    this.muted = false,
  });

  final String title;
  final T value;
  final List<T> values;
  final String Function(T value) labelFor;
  final ValueChanged<T> onChanged;
  final bool compact;
  final bool muted;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: compact ? 74 : 86,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 22),
      decoration: BoxDecoration(
        color: muted ? AppColors.accentSoft : AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: muted ? Border.all(color: AppColors.border) : null,
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
                icon: const Icon(Icons.keyboard_arrow_down,
                    color: AppColors.softInk),
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
  const _PreferenceTile({
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
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
            if (onTap != null)
              const Icon(Icons.chevron_right,
                  color: AppColors.softInk, size: 30),
          ],
        ),
      ),
    );
  }
}
