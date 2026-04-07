import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';

/// Generic placeholder scaffold used by unimplemented feature pages.
class PlaceholderPage extends StatelessWidget {

  const PlaceholderPage({
    required this.title,
    required this.icon,
    required this.description,
    this.accentColor = const Color(0xFF6B4EFF),
    super.key,
  });
  final String title;
  final IconData icon;
  final String description;
  final Color accentColor;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: const AppNavBar(),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 88,
                  height: 88,
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 40, color: accentColor),
                ),
                const SizedBox(height: 28),
                Text(
                  title,
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1A1A2E),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  description,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: Colors.black45,
                    height: 1.6,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 36),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    FilledButton.tonal(
                      onPressed: () => context.go('/'),
                      child: const Text('Back to Home'),
                    ),
                    const SizedBox(width: 12),
                    OutlinedButton(
                      onPressed: () => context.go('/contact'),
                      child: const Text('Contact Us'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
