import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_constants.dart';

class PromoSection extends StatelessWidget {
  const PromoSection({super.key});

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
          child: Container(
            padding: EdgeInsets.symmetric(
              horizontal: isDesktop ? 64 : 32,
              vertical: isDesktop ? 64 : 48,
            ),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF4A2C8F),
                  Color(0xFF6B4EFF),
                  Color(0xFF8B6FFF),
                ],
                stops: [0.0, 0.6, 1.0],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6B4EFF).withValues(alpha: 0.35),
                  blurRadius: 40,
                  offset: const Offset(0, 16),
                ),
              ],
            ),
            child: isDesktop
                ? Row(
                    children: [
                      Expanded(child: _PromoText()),
                      const SizedBox(width: 40),
                      _PromoDecoration(),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _PromoText(),
                      const SizedBox(height: 32),
                      _PromoDecoration(),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}

class _PromoText extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(4),
          ),
          child: const Text(
            'SUMMER 2026',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 2,
            ),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'New arrivals\nevery week.',
          style: TextStyle(
            color: Colors.white,
            fontSize: 44,
            fontWeight: FontWeight.w800,
            height: 1.08,
            letterSpacing: -1,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Fresh drops from our curators — be the first to discover\nwhat\'s new in the collection.',
          style: TextStyle(
            color: Colors.white70,
            fontSize: 15,
            height: 1.6,
          ),
        ),
        const SizedBox(height: 32),
        _PromoButton(),
      ],
    );
  }
}

class _PromoButton extends StatefulWidget {
  @override
  State<_PromoButton> createState() => _PromoButtonState();
}

class _PromoButtonState extends State<_PromoButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: () => context.go('/shop'),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding:
              const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          decoration: BoxDecoration(
            color: _hovered
                ? Colors.white.withValues(alpha: 0.95)
                : Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: _hovered
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.15),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    )
                  ]
                : [],
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Shop New Arrivals',
                style: TextStyle(
                  color: Color(0xFF4A2C8F),
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                ),
              ),
              SizedBox(width: 8),
              Icon(Icons.arrow_forward,
                  color: Color(0xFF4A2C8F), size: 16),
            ],
          ),
        ),
      ),
    );
  }
}

class _PromoDecoration extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 200,
      height: 180,
      child: Stack(
        children: [
          Positioned(
            top: 0,
            left: 20,
            child: _FloatingBadge(
                label: 'New In', icon: Icons.star_outline, offset: 0),
          ),
          Positioned(
            top: 70,
            left: 0,
            child: _FloatingBadge(
                label: 'Trending', icon: Icons.trending_up, offset: 1),
          ),
          Positioned(
            top: 130,
            left: 30,
            child: _FloatingBadge(
                label: 'Limited', icon: Icons.timer_outlined, offset: 2),
          ),
        ],
      ),
    );
  }
}

class _FloatingBadge extends StatelessWidget {
  final String label;
  final IconData icon;
  final int offset;

  const _FloatingBadge(
      {required this.label, required this.icon, required this.offset});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 16),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
