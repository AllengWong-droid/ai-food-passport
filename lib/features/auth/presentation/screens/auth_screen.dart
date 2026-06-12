import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../shared/data/mock_repositories.dart';

class AuthScreen extends ConsumerWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authRepository = ref.watch(authRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: () => context.goNamed(RouteNames.onboarding),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(28, 8, 28, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('PASSPORT ENTRY', style: AppTextStyles.sectionLabel),
              const SizedBox(height: 20),
              const Text('Choose how you want to travel.', style: AppTextStyles.title),
              const SizedBox(height: 14),
              const Text(
                'Apple and Google sign-in will connect your future scan history. Guest mode lets you try the flow instantly.',
                style: AppTextStyles.body,
              ),
              const Spacer(),
              AppButton(
                label: 'CONTINUE WITH APPLE',
                icon: Icons.apple,
                onPressed: () {
                  authRepository.signInWithApple();
                  context.goNamed(RouteNames.passportSetup);
                },
              ),
              const SizedBox(height: 12),
              AppButton(
                label: 'CONTINUE WITH GOOGLE',
                icon: Icons.g_mobiledata,
                isPrimary: false,
                onPressed: () {
                  authRepository.signInWithGoogle();
                  context.goNamed(RouteNames.passportSetup);
                },
              ),
              const SizedBox(height: 12),
              AppButton(
                label: 'CONTINUE AS GUEST',
                icon: Icons.travel_explore,
                isPrimary: false,
                onPressed: () {
                  authRepository.continueAsGuest();
                  context.goNamed(RouteNames.home);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
