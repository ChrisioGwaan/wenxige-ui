import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/core/constants/app_constants.dart';

class CategoriesSection extends StatelessWidget {
  const CategoriesSection({super.key});

  static const _categories = [
    _Category(
      label: 'Books & Literature',
      sub: 'Curated reads',
      gradientColors: [Color(0xFF667EEA), Color(0xFF764BA2)],
    ),
    _Category(
      label: 'Art & Stationery',
      sub: 'Premium supplies',
      gradientColors: [Color(0xFFF093FB), Color(0xFFF5576C)],
    ),
    _Category(
      label: 'Home & Décor',
      sub: 'Refined living',
      gradientColors: [Color(0xFF4FACFE), Color(0xFF00C6FB)],
    ),
    _Category(
      label: 'Gifts & Collectibles',
      sub: 'Thoughtful finds',
      gradientColors: [Color(0xFF43E97B), Color(0xFF38F9D7)],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= AppConstants.tabletBreakpoint;

    return Container(
      color: const Color(0xFFF6F4FF),
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
              Column(
                children: [
                  Text(
                    'COLLECTIONS'.toUpperCase(),
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Browse by category.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Color(0xFF1A1A2E),
                      fontSize: 38,
                      fontWeight: FontWeight.w800,
                      height: 1.15,
                      letterSpacing: -0.8,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 56),
              if (isDesktop)
                const _DesktopGrid(categories: _categories)
              else
                const _MobileGrid(categories: _categories),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Desktop: 2-column asymmetric layout ─────────────────────────────────────

class _DesktopGrid extends StatelessWidget {
  const _DesktopGrid({required this.categories});
  final List<_Category> categories;

  @override
  Widget build(BuildContext context) => Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left column: one tall tile
        Expanded(
          child: _CategoryTile(
            category: categories[0],
            height: 460,
          ),
        ),
        const SizedBox(width: 16),
        // Middle column: two stacked tiles
        Expanded(
          child: Column(
            children: [
              _CategoryTile(category: categories[1], height: 218),
              const SizedBox(height: 16),
              _CategoryTile(category: categories[2], height: 218),
            ],
          ),
        ),
        const SizedBox(width: 16),
        // Right column: one tall tile
        Expanded(
          child: _CategoryTile(
            category: categories[3],
            height: 460,
          ),
        ),
      ],
    );
}

// ─── Mobile: 2×2 grid ────────────────────────────────────────────────────────

class _MobileGrid extends StatelessWidget {
  const _MobileGrid({required this.categories});
  final List<_Category> categories;

  @override
  Widget build(BuildContext context) => Column(
      children: [
        Row(
          children: [
            Expanded(child: _CategoryTile(category: categories[0], height: 180)),
            const SizedBox(width: 12),
            Expanded(child: _CategoryTile(category: categories[1], height: 180)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _CategoryTile(category: categories[2], height: 180)),
            const SizedBox(width: 12),
            Expanded(child: _CategoryTile(category: categories[3], height: 180)),
          ],
        ),
      ],
    );
}

// ─── Individual tile ──────────────────────────────────────────────────────────

class _CategoryTile extends StatefulWidget {
  const _CategoryTile({required this.category, required this.height});
  final _Category category;
  final double height;

  @override
  State<_CategoryTile> createState() => _CategoryTileState();
}

class _CategoryTileState extends State<_CategoryTile> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) => MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: () => context.go('/shop'),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          height: widget.height,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: widget.category.gradientColors,
            ),
            borderRadius: BorderRadius.circular(AppConstants.cardBorderRadius),
            boxShadow: _hovered
                ? [
                    BoxShadow(
                      color: widget.category.gradientColors.last
                          .withValues(alpha: 0.4),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ]
                : const [],
          ),
          child: AnimatedScale(
            scale: _hovered ? 1.02 : 1.0,
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeOut,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    widget.category.sub.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.category.label,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Text(
                        'Explore',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 4),
                      AnimatedSlide(
                        offset: _hovered
                            ? const Offset(0.2, 0)
                            : Offset.zero,
                        duration: const Duration(milliseconds: 220),
                        child: const Icon(Icons.arrow_forward,
                            color: Colors.white, size: 14),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
}

class _Category {

  const _Category({
    required this.label,
    required this.sub,
    required this.gradientColors,
  });
  final String label;
  final String sub;
  final List<Color> gradientColors;
}
