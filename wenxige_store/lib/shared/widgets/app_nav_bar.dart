import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/core/constants/app_constants.dart';

/// Sticky navigation bar that implements [PreferredSizeWidget] so it can be
/// used as a [Scaffold.appBar].
///
/// When a [scrollController] is provided the bar begins transparent (ideal for
/// pages whose hero fills the screen) and transitions to an opaque surface as
/// the user scrolls.  Without a [scrollController] it is always opaque.
class AppNavBar extends StatefulWidget implements PreferredSizeWidget {

  const AppNavBar({this.scrollController, super.key});
  final ScrollController? scrollController;

  static const double height = AppConstants.navBarHeight;

  @override
  Size get preferredSize => const Size.fromHeight(height);

  @override
  State<AppNavBar> createState() => _AppNavBarState();
}

class _AppNavBarState extends State<AppNavBar> {
  bool _scrolled = false;

  @override
  void initState() {
    super.initState();
    widget.scrollController?.addListener(_onScroll);
  }

  @override
  void dispose() {
    widget.scrollController?.removeListener(_onScroll);
    super.dispose();
  }

  void _onScroll() {
    final isScrolled = widget.scrollController!.offset > 24;
    if (isScrolled != _scrolled) setState(() => _scrolled = isScrolled);
  }

  bool get _transparent => widget.scrollController != null && !_scrolled;

  @override
  Widget build(BuildContext context) {
    final path = GoRouterState.of(context).uri.path;
    final width = MediaQuery.of(context).size.width;
    final isMobile = width < AppConstants.tabletBreakpoint;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeInOut,
      height: AppNavBar.height,
      decoration: BoxDecoration(
        color: _transparent
            ? Colors.transparent
            : Colors.white.withValues(alpha: 0.97),
        boxShadow: _transparent
            ? const []
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.07),
                  blurRadius: 24,
                  offset: const Offset(0, 4),
                ),
              ],
        border: _transparent
            ? null
            : Border(
                bottom: BorderSide(
                  color: Colors.black.withValues(alpha: 0.06),
                ),
              ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppConstants.pageHorizontalPadding,
        ),
        child: isMobile
            ? _MobileNavRow(isLight: _transparent, currentPath: path)
            : _DesktopNavRow(isLight: _transparent, currentPath: path),
      ),
    );
  }
}

// ─── Desktop ────────────────────────────────────────────────────────────────

class _DesktopNavRow extends StatelessWidget {

  const _DesktopNavRow({required this.isLight, required this.currentPath});
  final bool isLight;
  final String currentPath;

  static const _links = [
    ('Home', '/'),
    ('Shop', '/shop'),
    ('Gallery', '/gallery'),
    ('About Us', '/about'),
    ('Contact', '/contact'),
  ];

  @override
  Widget build(BuildContext context) => Row(
      children: [
        _Logo(isLight: isLight),
        const Spacer(),
        for (final (label, path) in _links)
          _NavLink(
            label: label,
            path: path,
            isActive: currentPath == path,
            isLight: isLight,
          ),
        const SizedBox(width: 20),
        _CartButton(isLight: isLight),
      ],
    );
}

// ─── Mobile ─────────────────────────────────────────────────────────────────

class _MobileNavRow extends StatelessWidget {

  const _MobileNavRow({required this.isLight, required this.currentPath});
  final bool isLight;
  final String currentPath;

  @override
  Widget build(BuildContext context) => Row(
      children: [
        _Logo(isLight: isLight),
        const Spacer(),
        _CartButton(isLight: isLight),
        const SizedBox(width: 4),
        _HamburgerButton(isLight: isLight, currentPath: currentPath),
      ],
    );
}

// ─── Shared sub-widgets ──────────────────────────────────────────────────────

class _Logo extends StatelessWidget {
  const _Logo({required this.isLight});
  final bool isLight;

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => context.go('/'),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: primary,
                borderRadius: BorderRadius.circular(9),
              ),
              alignment: Alignment.center,
              child: const Text(
                'W',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                  letterSpacing: -0.5,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Text(
              'Wenxige',
              style: TextStyle(
                color: isLight ? Colors.white : const Color(0xFF1A1A2E),
                fontWeight: FontWeight.w700,
                fontSize: 18,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavLink extends StatefulWidget {

  const _NavLink({
    required this.label,
    required this.path,
    required this.isActive,
    required this.isLight,
  });
  final String label;
  final String path;
  final bool isActive;
  final bool isLight;

  @override
  State<_NavLink> createState() => _NavLinkState();
}

class _NavLinkState extends State<_NavLink> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    final textColor = widget.isLight ? Colors.white : const Color(0xFF2D2D2D);
    final indicatorColor = widget.isLight ? Colors.white : primary;
    final show = _hovered || widget.isActive;

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: () => context.go(widget.path),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                widget.label,
                style: TextStyle(
                  color: textColor,
                  fontWeight: widget.isActive
                      ? FontWeight.w600
                      : FontWeight.w400,
                  fontSize: 14.5,
                ),
              ),
              const SizedBox(height: 3),
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                curve: Curves.easeOut,
                height: 2,
                width: show ? 18 : 0,
                decoration: BoxDecoration(
                  color: indicatorColor,
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CartButton extends StatelessWidget {
  const _CartButton({required this.isLight});
  final bool isLight;

  @override
  Widget build(BuildContext context) => MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => context.go('/cart'),
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Icon(
            Icons.shopping_bag_outlined,
            color: isLight ? Colors.white : const Color(0xFF2D2D2D),
            size: 22,
          ),
        ),
      ),
    );
}

// ─── Mobile hamburger + full-screen drawer ───────────────────────────────────

class _HamburgerButton extends StatelessWidget {
  const _HamburgerButton({required this.isLight, required this.currentPath});
  final bool isLight;
  final String currentPath;

  @override
  Widget build(BuildContext context) => IconButton(
      icon: Icon(
        Icons.menu,
        color: isLight ? Colors.white : const Color(0xFF2D2D2D),
      ),
      onPressed: () {
        showDialog(
          context: context,
          builder: (_) => _MobileNavDialog(currentPath: currentPath),
        );
      },
    );
}

class _MobileNavDialog extends StatelessWidget {
  const _MobileNavDialog({required this.currentPath});
  final String currentPath;

  static const _links = [
    (Icons.home_outlined, 'Home', '/'),
    (Icons.storefront_outlined, 'Shop', '/shop'),
    (Icons.photo_library_outlined, 'Gallery', '/gallery'),
    (Icons.info_outlined, 'About Us', '/about'),
    (Icons.mail_outlined, 'Contact', '/contact'),
    (Icons.shopping_bag_outlined, 'Cart', '/cart'),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Dialog.fullscreen(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: Row(
            children: [
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(7),
                ),
                alignment: Alignment.center,
                child: const Text(
                  'W',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 15,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Wenxige',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
            ],
          ),
        ),
        body: ListView(
          padding: const EdgeInsets.symmetric(vertical: 16),
          children: [
            for (final (icon, label, path) in _links)
              ListTile(
                leading: Icon(
                  icon,
                  color: currentPath == path
                      ? theme.colorScheme.primary
                      : Colors.black54,
                ),
                title: Text(
                  label,
                  style: TextStyle(
                    fontWeight: currentPath == path
                        ? FontWeight.w600
                        : FontWeight.w400,
                    color: currentPath == path
                        ? theme.colorScheme.primary
                        : const Color(0xFF2D2D2D),
                  ),
                ),
                onTap: () {
                  Navigator.of(context).pop();
                  context.go(path);
                },
              ),
          ],
        ),
      ),
    );
  }
}
