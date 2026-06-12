import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/passport_card.dart';
import '../../../../core/widgets/section_header.dart';
import '../../../shared/data/mock_repositories.dart';
import '../../../shared/domain/models/recent_crossing_model.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final recentCrossings = ref.watch(recentCrossingsProvider);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(48, 24, 48, 34),
          children: [
            const Row(
              children: [
                Icon(Icons.location_on_outlined, color: AppColors.accent, size: 20),
                SizedBox(width: 8),
                Text(
                  'CURRENT MISSION - TOKYO',
                  style: TextStyle(
                    color: AppColors.accent,
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.7,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Irashaimase,\n${user.displayName.split(' ').first}.',
              style: AppTextStyles.display.copyWith(fontSize: 42),
            ),
            const SizedBox(height: 52),
            _CurrentMissionCard(onTap: () => context.goNamed(RouteNames.scan)),
            const SizedBox(height: 50),
            const SectionHeader('Recent Crossings'),
            const SizedBox(height: 26),
            for (final crossing in recentCrossings) ...[
              _RecentCrossingTile(crossing: crossing),
              const SizedBox(height: 18),
            ],
            const SizedBox(height: 30),
            _PassportTipCard(),
            const SizedBox(height: 18),
            _HomeCurrencyCard(homeCurrency: user.homeCurrency),
            const SizedBox(height: 18),
            PassportCard(user: user, compact: true),
          ],
        ),
      ),
    );
  }
}

class _CurrentMissionCard extends StatelessWidget {
  const _CurrentMissionCard({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(34),
        onTap: onTap,
        child: Container(
          height: 254,
          decoration: BoxDecoration(
            color: AppColors.darkPanel,
            borderRadius: BorderRadius.circular(34),
            border: Border.all(color: const Color(0xFF2D3034), width: 2),
            boxShadow: const [
              BoxShadow(color: Color(0x22000000), offset: Offset(0, 4), blurRadius: 2),
            ],
          ),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFF74777B),
                      width: 3,
                    ),
                  ),
                  child: const Icon(Icons.add, color: Colors.white, size: 34),
                ),
                const SizedBox(height: 25),
                const Text(
                  'SCAN MENU',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RecentCrossingTile extends StatelessWidget {
  const _RecentCrossingTile({required this.crossing});

  final RecentCrossingModel crossing;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 96,
      padding: const EdgeInsets.symmetric(horizontal: 18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFEDEAE6)),
      ),
      child: Row(
        children: [
          _FoodThumb(seed: crossing.imageSeed, size: 62),
          const SizedBox(width: 18),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${crossing.restaurant}, ${crossing.location}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.ink,
                    fontSize: 17,
                    height: 1,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  crossing.summary,
                  style: const TextStyle(
                    color: AppColors.mutedInk,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PassportTipCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(26, 24, 26, 24),
      decoration: const BoxDecoration(
        color: Color(0xFFEAE7E2),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
          bottomRight: Radius.circular(24),
          bottomLeft: Radius.circular(4),
        ),
        border: Border(left: BorderSide(color: AppColors.accent, width: 2)),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PASSPORT TIP',
            style: TextStyle(
              color: AppColors.accent,
              fontSize: 14,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.4,
            ),
          ),
          SizedBox(height: 12),
          Text(
            'Tap-water safe in Tokyo. Average dinner runs JPY 1,800-3,500 in Roppongi. Cash still preferred at smaller izakaya.',
            style: TextStyle(
              color: AppColors.ink,
              fontSize: 17,
              height: 1.5,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _HomeCurrencyCard extends StatelessWidget {
  const _HomeCurrencyCard({required this.homeCurrency});

  final String homeCurrency;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          const Icon(Icons.auto_awesome, color: AppColors.accent, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'Demo passport active - home currency $homeCurrency',
              style: const TextStyle(
                color: AppColors.mutedInk,
                fontSize: 13,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FoodThumb extends StatelessWidget {
  const _FoodThumb({required this.seed, required this.size});

  final String seed;
  final double size;

  @override
  Widget build(BuildContext context) {
    final colors = switch (seed) {
      'cod' => [const Color(0xFF0E1113), const Color(0xFFC64A2E)],
      _ => [const Color(0xFF191B1B), const Color(0xFFE8A641)],
    };

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(17),
        gradient: RadialGradient(colors: colors),
      ),
      child: const Icon(Icons.restaurant, color: Colors.white, size: 28),
    );
  }
}
