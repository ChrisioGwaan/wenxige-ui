import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_constants.dart';
import '../../../shared/widgets/app_nav_bar.dart';

/// Full-viewport hero section with animated entrance, gradient background,
/// floating decorative shapes, headline, and CTAs.
class HeroSection extends StatefulWidget {
  const HeroSection({super.key});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;
  late final Animation<double> _eyebrowFade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    );

    _eyebrowFade = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.4, curve: Curves.easeOut),
    );
    _fade = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.15, 0.75, curve: Curves.easeOut),
    );
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.18),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _ctrl,
        curve: const Interval(0.1, 0.75, curve: Curves.easeOutCubic),
      ),
    );

    // Small delay so the page transition completes first.
    Future.delayed(const Duration(milliseconds: 80), () {
      if (mounted) _ctrl.forward();
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width >= AppConstants.tabletBreakpoint;

    return SizedBox(
      height: size.height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // ── Background gradient ──────────────────────────────────────────
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF0D0221),
                  Color(0xFF1C0845),
                  Color(0xFF2D1670),
                ],
                stops: [0.0, 0.55, 1.0],
              ),
            ),
          ),

          // ── Decorative blurred circles ───────────────────────────────────
          Positioned(
            top: -120,
            right: -120,
            child: _GlowCircle(
              size: 480,
              color: const Color(0xFF7C3AED).withValues(alpha: 0.28),
            ),
          ),
          Positioned(
            bottom: 60,
            left: -80,
            child: _GlowCircle(
              size: 320,
              color: const Color(0xFF4F46E5).withValues(alpha: 0.2),
            ),
          ),
          Positioned(
            top: size.height * 0.35,
            right: size.width * 0.12,
            child: _GlowCircle(
              size: 140,
              color: const Color(0xFFEC4899).withValues(alpha: 0.18),
            ),
          ),

          // ── Subtle grid / noise overlay ──────────────────────────────────
          Opacity(
            opacity: 0.04,
            child: CustomPaint(
              painter: _GridPainter(),
              child: const SizedBox.expand(),
            ),
          ),

          // ── Main content ─────────────────────────────────────────────────
          Padding(
            padding: EdgeInsets.only(
              top: AppNavBar.height,
              left: AppConstants.pageHorizontalPadding,
              right: AppConstants.pageHorizontalPadding,
            ),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                    maxWidth: AppConstants.maxContentWidth),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Eyebrow pill
                    FadeTransition(
                      opacity: _eyebrowFade,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 7),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.09),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: Colors.white.withValues(alpha: 0.18)),
                        ),
                        child: const Text(
                          '✦  New Collection 2026',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 13,
                            letterSpacing: 0.6,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Headline
                    FadeTransition(
                      opacity: _fade,
                      child: SlideTransition(
                        position: _slide,
                        child: Text(
                          'Refined Elegance,\nDelivered to You.',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: isDesktop ? 72 : 42,
                            fontWeight: FontWeight.w800,
                            height: 1.08,
                            letterSpacing: isDesktop ? -2.0 : -1.0,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Subtitle
                    FadeTransition(
                      opacity: _fade,
                      child: SlideTransition(
                        position: _slide,
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 560),
                          child: const Text(
                            'Discover our curated collection of premium goods, handpicked for the discerning shopper who values quality above all.',
                            style: TextStyle(
                              color: Colors.white60,
                              fontSize: 18,
                              height: 1.65,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 44),

                    // CTAs
                    FadeTransition(
                      opacity: _fade,
                      child: Wrap(
                        spacing: 14,
                        runSpacing: 12,
                        children: [
                          FilledButton(
                            onPressed: () => context.go('/shop'),
                            style: FilledButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: const Color(0xFF1C0845),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 32, vertical: 18),
                              textStyle: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text('Explore Collection'),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward, size: 16),
                              ],
                            ),
                          ),
                          OutlinedButton(
                            onPressed: () => context.go('/about'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white,
                              side: const BorderSide(
                                  color: Colors.white38, width: 1.5),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 32, vertical: 18),
                              textStyle: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500),
                            ),
                            child: const Text('Our Story'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ── Scroll hint ──────────────────────────────────────────────────
          Positioned(
            bottom: 28,
            left: 0,
            right: 0,
            child: FadeTransition(
              opacity: _fade,
              child: const Column(
                children: [
                  Text(
                    'Scroll to explore',
                    style: TextStyle(
                      color: Colors.white30,
                      fontSize: 11,
                      letterSpacing: 1.2,
                    ),
                  ),
                  SizedBox(height: 6),
                  Icon(Icons.keyboard_arrow_down,
                      color: Colors.white30, size: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Decorative helpers ───────────────────────────────────────────────────────

class _GlowCircle extends StatelessWidget {
  final double size;
  final Color color;
  const _GlowCircle({required this.size, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 1;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_GridPainter old) => false;
}
