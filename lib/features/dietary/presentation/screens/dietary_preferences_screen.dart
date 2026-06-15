import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/dietary_preferences_provider.dart';
import '../../../shared/domain/models/dietary_preferences_model.dart';

/// Screen for editing user's dietary preferences and allergen settings.
class DietaryPreferencesScreen extends ConsumerWidget {
  const DietaryPreferencesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final preferences = ref.watch(dietaryPreferencesProvider);

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(45, 28, 45, 42),
          children: [
            // Back button and title
            Row(
              children: [
                GestureDetector(
                  onTap: () => context.pop(),
                  child: Container(
                    width: 54,
                    height: 54,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEDEBE8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.chevron_left,
                        color: AppColors.ink, size: 30),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Text(
                    'Dietary Preferences',
                    style: AppTextStyles.title.copyWith(fontSize: 36),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 34),

            // Disclaimer
            _DisclaimerBanner(),
            const SizedBox(height: 28),

            // Allergens section
            const SectionHeader('Allergens to Avoid'),
            const SizedBox(height: 14),
            Text(
              'Dishes containing these allergens will be marked in your scan results.',
              style: TextStyle(
                color: AppColors.mutedInk,
                fontSize: 14,
                height: 1.35,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 18),
            _AllergenGrid(preferences: preferences, ref: ref),
            const SizedBox(height: 34),

            // Dietary restrictions section
            const SectionHeader('Dietary Restrictions'),
            const SizedBox(height: 14),
            Text(
              'Optional dietary preferences for personalized recommendations.',
              style: TextStyle(
                color: AppColors.mutedInk,
                fontSize: 14,
                height: 1.35,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 18),
            _DietaryRestrictionList(preferences: preferences, ref: ref),
            const SizedBox(height: 34),

            // Clear all button
            if (preferences.hasPreferences)
              _ClearPreferencesButton(ref: ref),
          ],
        ),
      ),
    );
  }
}

/// Grid of common allergen options.
class _AllergenGrid extends StatelessWidget {
  const _AllergenGrid({required this.preferences, required this.ref});

  final DietaryPreferencesModel preferences;
  final WidgetRef ref;

  static const _allergenOptions = [
    _AllergenOption('gluten', 'Gluten', Icons.bakery_dining),
    _AllergenOption('dairy', 'Dairy', Icons.icecream_outlined),
    _AllergenOption('eggs', 'Eggs', Icons.egg_outlined),
    _AllergenOption('nuts', 'Tree Nuts', Icons.park_outlined),
    _AllergenOption('peanuts', 'Peanuts', Icons.spa_outlined),
    _AllergenOption('soy', 'Soy', Icons.eco_outlined),
    _AllergenOption('fish', 'Fish', Icons.set_meal_outlined),
    _AllergenOption('shellfish', 'Shellfish', Icons.water_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 2.8,
      children: _allergenOptions.map((option) {
        final isSelected = preferences.selectedAllergens.contains(option.key);
        return _AllergenToggle(
          option: option,
          isSelected: isSelected,
          onTap: () {
            ref
                .read(dietaryPreferencesProvider.notifier)
                .toggleAllergen(option.key);
          },
        );
      }).toList(),
    );
  }
}

class _AllergenOption {
  const _AllergenOption(this.key, this.label, this.icon);
  final String key;
  final String label;
  final IconData icon;
}

/// Toggle button for a single allergen.
class _AllergenToggle extends StatelessWidget {
  const _AllergenToggle({
    required this.option,
    required this.isSelected,
    required this.onTap,
  });

  final _AllergenOption option;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.accent : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.accent : AppColors.border,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              option.icon,
              color: isSelected ? Colors.white : AppColors.ink,
              size: 20,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                option.label,
                style: TextStyle(
                  color: isSelected ? Colors.white : AppColors.ink,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// List of dietary restriction options.
class _DietaryRestrictionList extends StatelessWidget {
  const _DietaryRestrictionList({
    required this.preferences,
    required this.ref,
  });

  final DietaryPreferencesModel preferences;
  final WidgetRef ref;

  static const _restrictionOptions = [
    _RestrictionOption('vegetarian', 'Vegetarian'),
    _RestrictionOption('vegan', 'Vegan'),
    _RestrictionOption('pork-free', 'Pork-Free'),
    _RestrictionOption('alcohol-free', 'Alcohol-Free'),
    _RestrictionOption('shellfish-free', 'Shellfish-Free'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: _restrictionOptions.map((option) {
        final isSelected =
            preferences.dietaryRestrictions.contains(option.key);
        return _RestrictionToggle(
          option: option,
          isSelected: isSelected,
          onTap: () {
            ref
                .read(dietaryPreferencesProvider.notifier)
                .toggleDietaryRestriction(option.key);
          },
        );
      }).toList(),
    );
  }
}

class _RestrictionOption {
  const _RestrictionOption(this.key, this.label);
  final String key;
  final String label;
}

/// Toggle for a single dietary restriction.
class _RestrictionToggle extends StatelessWidget {
  const _RestrictionToggle({
    required this.option,
    required this.isSelected,
    required this.onTap,
  });

  final _RestrictionOption option;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.accent : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                option.label,
                style: TextStyle(
                  color: AppColors.ink,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle : Icons.circle_outlined,
              color: isSelected ? AppColors.accent : AppColors.softInk,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }
}

/// Clear all preferences button.
class _ClearPreferencesButton extends StatelessWidget {
  const _ClearPreferencesButton({required this.ref});

  final WidgetRef ref;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _confirmClear(context, ref),
      child: Container(
        height: 54,
        padding: const EdgeInsets.symmetric(horizontal: 18),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.clear_all, color: AppColors.ink, size: 20),
            SizedBox(width: 8),
            Flexible(
              child: Text(
                'Clear all preferences',
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

  void _confirmClear(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Preferences'),
        content: const Text(
          'This will remove all your dietary preferences and allergen settings. This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(dietaryPreferencesProvider.notifier).clear();
              Navigator.of(context).pop();
            },
            child: const Text('Clear', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

/// Disclaimer banner for dietary preferences screen.
class _DisclaimerBanner extends StatelessWidget {
  const _DisclaimerBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 18, 14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E1),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFFE082)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline, color: Color(0xFFF57F17), size: 20),
          const SizedBox(width: 10),
          const Expanded(
            child: Text(
              'This app provides information for reference only. Always verify ingredients and consult with restaurant staff about allergens. This is not a medical diagnosis.',
              style: TextStyle(
                color: Color(0xFFF57F17),
                fontSize: 12,
                height: 1.35,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
