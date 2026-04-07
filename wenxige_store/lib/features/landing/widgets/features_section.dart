import 'package:flutter/material.dart';

import 'package:wenxige_store/core/constants/app_constants.dart';

class FeaturesSection extends StatelessWidget {
  const FeaturesSection({super.key});

  static const _items = [
    _FeatureItem(
      icon: Icons.auto_awesome_outlined,
      title: 'Premium Curation',
      body:
          'Every product passes our rigorous selection process — only goods that meet the highest standards of quality and craftsmanship make the cut.',
      accent: Color(0xFF6B4EFF),
    ),
    _FeatureItem(
      icon: Icons.public_outlined,
      title: 'Worldwide Shipping',
      body:
          'Fast, trackable international delivery to over 50 countries. Your order, wherever you are — handled with care from door to door.',
      accent: Color(0xFF06B6D4),
    ),
    _FeatureItem(
      icon: Icons.verified_outlined,
      title: 'Authenticity Guaranteed',
      body:
          'Shop with complete confidence. Every item is verified, certified, and backed by our full authenticity promise and hassle-free returns.',
      accent: Color(0xFF10B981),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= AppConstants.tabletBreakpoint;

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(
        vertical: AppConstants.sectionVerticalPadding,
        horizontal: AppConstants.pageHorizontalPadding,
      ),
      child: Center(
        child: ConstrainedBox(
          constraints:
              const BoxConstraints(maxWidth: AppConstants.maxContentWidth),
          child: Column(
            children: [
              const _SectionLabel(
                eyebrow: 'Why Choose Us',
                headline: 'Everything you need,\nnone of the compromise.',
              ),
              const SizedBox(height: 64),
              if (isDesktop)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (int i = 0; i < _items.length; i++) ...[
                      if (i > 0) const SizedBox(width: 24),
                      Expanded(child: _FeatureCard(item: _items[i])),
                    ],
                  ],
                )
              else
                Column(
                  children: [
                    for (final item in _items) ...[
                      _FeatureCard(item: item),
                      const SizedBox(height: 20),
                    ],
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Section header ──────────────────────────────────────────────────────────

class _SectionLabel extends StatelessWidget {

  const _SectionLabel({required this.eyebrow, required this.headline});
  final String eyebrow;
  final String headline;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        Text(
          eyebrow.toUpperCase(),
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontSize: 12,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          headline,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: Color(0xFF1A1A2E),
            fontSize: 38,
            fontWeight: FontWeight.w800,
            height: 1.15,
            letterSpacing: -0.8,
          ),
        ),
      ],
    );
  }
}

// ─── Feature card ─────────────────────────────────────────────────────────────

class _FeatureCard extends StatefulWidget {
  const _FeatureCard({required this.item});
  final _FeatureItem item;

  @override
  State<_FeatureCard> createState() => _FeatureCardState();
}

class _FeatureCardState extends State<_FeatureCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) => MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: _hovered
              ? widget.item.accent.withValues(alpha: 0.04)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius),
          border: Border.all(
            color: _hovered
                ? widget.item.accent.withValues(alpha: 0.3)
                : const Color(0xFFE8E8F0),
            width: 1.5,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: widget.item.accent.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(widget.item.icon,
                  color: widget.item.accent, size: 26),
            ),
            const SizedBox(height: 20),
            Text(
              widget.item.title,
              style: const TextStyle(
                color: Color(0xFF1A1A2E),
                fontSize: 19,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              widget.item.body,
              style: const TextStyle(
                color: Color(0xFF6B6B80),
                fontSize: 15,
                height: 1.65,
              ),
            ),
          ],
        ),
      ),
    );
}

class _FeatureItem {

  const _FeatureItem({
    required this.icon,
    required this.title,
    required this.body,
    required this.accent,
  });
  final IconData icon;
  final String title;
  final String body;
  final Color accent;
}
