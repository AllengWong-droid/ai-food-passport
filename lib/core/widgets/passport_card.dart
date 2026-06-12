import 'package:flutter/material.dart';

import '../../app/theme/app_colors.dart';
import '../../features/shared/domain/models/user_model.dart';

class PassportCard extends StatelessWidget {
  const PassportCard({
    required this.user,
    this.compact = false,
    super.key,
  });

  final UserModel user;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(34, compact ? 26 : 34, 28, compact ? 26 : 32),
      decoration: BoxDecoration(
        color: AppColors.darkPanel,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: -48,
            right: -46,
            child: Container(
              width: 170,
              height: 170,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppColors.accent.withOpacity(0.52),
                  width: 2.4,
                ),
              ),
              alignment: Alignment.center,
              child: Container(
                width: 92,
                height: 92,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.accent.withOpacity(0.7)),
                ),
                child: const Icon(
                  Icons.verified_outlined,
                  color: AppColors.accent,
                  size: 34,
                ),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'TASTE PASSPORT',
                style: TextStyle(
                  color: AppColors.softInk,
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                user.displayName,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 34,
                  height: 1,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Holder since 2024',
                style: TextStyle(
                  color: Color(0xFFC6C6C8),
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 30),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _PassportMetric(value: '14', label: 'COUNTRIES'),
                  _PassportMetric(value: '287', label: 'DISHES'),
                  _PassportMetric(value: '\$412', label: 'SAVED'),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PassportMetric extends StatelessWidget {
  const _PassportMetric({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 28,
            height: 1,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.softInk,
            fontSize: 13,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.1,
          ),
        ),
      ],
    );
  }
}
