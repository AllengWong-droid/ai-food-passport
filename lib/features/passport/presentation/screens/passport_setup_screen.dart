import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';

class PassportSetupScreen extends StatefulWidget {
  const PassportSetupScreen({super.key});

  @override
  State<PassportSetupScreen> createState() => _PassportSetupScreenState();
}

class _PassportSetupScreenState extends State<PassportSetupScreen> {
  final selected = <String>{'Standard Traveler', 'Soy', 'Savory', 'Mild'};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: () => context.goNamed(RouteNames.auth),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(28, 8, 28, 24),
          children: [
            const Text('TASTE PASSPORT', style: AppTextStyles.sectionLabel),
            const SizedBox(height: 16),
            const Text('Tell us how you eat.', style: AppTextStyles.title),
            const SizedBox(height: 22),
            _Section(title: 'Home Currency', options: ['USD', 'EUR', 'GBP', 'CAD']),
            _Section(
              title: 'Travel Style',
              options: ['Budget Traveler', 'Standard Traveler', 'Luxury Traveler'],
              selected: selected,
              onTap: _toggle,
            ),
            _Section(
              title: 'Dietary Preferences',
              options: ['Vegetarian', 'Vegan', 'Halal', 'Kosher'],
              selected: selected,
              onTap: _toggle,
            ),
            _Section(
              title: 'Allergies',
              options: ['Peanut', 'Shellfish', 'Dairy', 'Soy', 'Fish', 'Egg'],
              selected: selected,
              onTap: _toggle,
            ),
            _Section(
              title: 'Taste Preferences',
              options: ['Spicy', 'Sweet', 'Savory', 'Mild'],
              selected: selected,
              onTap: _toggle,
            ),
            const SizedBox(height: 18),
            AppButton(
              label: 'SAVE PASSPORT',
              icon: Icons.check,
              onPressed: () => context.goNamed(RouteNames.home),
            ),
          ],
        ),
      ),
    );
  }

  void _toggle(String value) {
    setState(() {
      selected.contains(value) ? selected.remove(value) : selected.add(value);
    });
  }
}

class _Section extends StatelessWidget {
  const _Section({
    required this.title,
    required this.options,
    this.selected = const {},
    this.onTap,
  });

  final String title;
  final List<String> options;
  final Set<String> selected;
  final ValueChanged<String>? onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTextStyles.sectionLabel),
          const SizedBox(height: 10),
          Wrap(
            spacing: 9,
            runSpacing: 9,
            children: [
              for (final option in options)
                ChoiceChip(
                  selected: selected.contains(option),
                  label: Text(option),
                  selectedColor: AppColors.accentSoft,
                  labelStyle: TextStyle(
                    color: selected.contains(option) ? AppColors.accent : AppColors.ink,
                    fontWeight: FontWeight.w800,
                  ),
                  side: const BorderSide(color: AppColors.border),
                  onSelected: (_) => onTap?.call(option),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
