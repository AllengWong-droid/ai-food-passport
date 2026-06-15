import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/bottom_nav_shell.dart';
import '../../features/auth/presentation/screens/auth_screen.dart';
import '../../features/dietary/presentation/screens/dietary_preferences_screen.dart';
import '../../features/history/presentation/screens/scan_history_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/onboarding/presentation/screens/onboarding_screen.dart';
import '../../features/passport/presentation/screens/passport_setup_screen.dart';
import '../../features/passport/presentation/screens/profile_screen.dart';
import '../../features/results/presentation/screens/dish_detail_screen.dart';
import '../../features/results/presentation/screens/results_screen.dart';
import '../../features/scan/presentation/screens/scan_screen.dart';
import 'route_names.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/onboarding',
    routes: [
      GoRoute(
        path: '/onboarding',
        name: RouteNames.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/auth',
        name: RouteNames.auth,
        builder: (context, state) => const AuthScreen(),
      ),
      GoRoute(
        path: '/passport-setup',
        name: RouteNames.passportSetup,
        builder: (context, state) => const PassportSetupScreen(),
      ),
      GoRoute(
        path: '/results',
        name: RouteNames.results,
        builder: (context, state) => const ResultsScreen(),
      ),
      GoRoute(
        path: '/dish/:dishId',
        name: RouteNames.dishDetail,
        builder: (context, state) {
          return DishDetailScreen(dishId: state.pathParameters['dishId']!);
        },
      ),
      GoRoute(
        path: '/history',
        name: RouteNames.history,
        builder: (context, state) => const ScanHistoryScreen(),
      ),
      GoRoute(
        path: '/dietary-preferences',
        name: RouteNames.dietaryPreferences,
        builder: (context, state) => const DietaryPreferencesScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return BottomNavShell(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            navigatorKey: _shellNavigatorKey,
            routes: [
              GoRoute(
                path: '/home',
                name: RouteNames.home,
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/scan',
                name: RouteNames.scan,
                builder: (context, state) => const ScanScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                name: RouteNames.profile,
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
