import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/core/constants/app_constants.dart';
import 'package:wenxige_store/shared/models/user_model.dart';
import 'package:wenxige_store/shared/providers/auth_service.dart';

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
      crossAxisAlignment: CrossAxisAlignment.center,
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
        const SizedBox(width: 8),
        _AuthArea(isLight: isLight),
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

class _AuthArea extends StatelessWidget {
  const _AuthArea({required this.isLight});
  final bool isLight;

  @override
  Widget build(BuildContext context) {
    final user = AuthService().user;
    if (user != null) return _UserChip(user: user, isLight: isLight);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _TextNavButton(
          label: 'Log in',
          isLight: isLight,
          onTap: () => context.go('/login'),
        ),
        const SizedBox(width: 8),
        FilledButton(
          onPressed: () => context.go('/signup'),
          style: FilledButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
            textStyle: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          child: const Text('Sign Up'),
        ),
      ],
    );
  }
}

class _UserChip extends StatefulWidget {
  const _UserChip({required this.user, required this.isLight});
  final UserModel user;
  final bool isLight;

  @override
  State<_UserChip> createState() => _UserChipState();
}

class _UserChipState extends State<_UserChip> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textColor = widget.isLight ? Colors.white : const Color(0xFF2D2D2D);

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: () => context.go('/profile'),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              widget.user.displayName,
              style: TextStyle(
                color: textColor,
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 10),
            AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: EdgeInsets.all(_hovered ? 2 : 0),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: _hovered
                      ? theme.colorScheme.primary
                      : Colors.transparent,
                  width: 2,
                ),
              ),
              child: widget.user.avatarUrl != null
                  ? CircleAvatar(
                      radius: 17,
                      backgroundImage: NetworkImage(widget.user.avatarUrl!),
                      onBackgroundImageError: (_, _) {},
                      backgroundColor: theme.colorScheme.primaryContainer,
                      child: widget.user.avatarUrl == null
                          ? Text(
                              widget.user.initials,
                              style: TextStyle(
                                color: theme.colorScheme.onPrimaryContainer,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            )
                          : null,
                    )
                  : CircleAvatar(
                      radius: 17,
                      backgroundColor: theme.colorScheme.primaryContainer,
                      child: Text(
                        widget.user.initials,
                        style: TextStyle(
                          color: theme.colorScheme.onPrimaryContainer,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TextNavButton extends StatefulWidget {
  const _TextNavButton({
    required this.label,
    required this.isLight,
    required this.onTap,
  });
  final String label;
  final bool isLight;
  final VoidCallback onTap;

  @override
  State<_TextNavButton> createState() => _TextNavButtonState();
}

class _TextNavButtonState extends State<_TextNavButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) => MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: Text(
          widget.label,
          style: TextStyle(
            color: (widget.isLight ? Colors.white : const Color(0xFF2D2D2D))
                .withValues(alpha: _hovered ? 0.7 : 1.0),
            fontWeight: FontWeight.w500,
            fontSize: 14,
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
    final user = AuthService().user;

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
            const Divider(indent: 16, endIndent: 16),
            if (user != null)
              ListTile(
                onTap: () {
                  Navigator.of(context).pop();
                  context.go('/profile');
                },
                leading: CircleAvatar(
                  radius: 16,
                  backgroundColor: theme.colorScheme.primaryContainer,
                  backgroundImage: user.avatarUrl != null
                      ? NetworkImage(user.avatarUrl!)
                      : null,
                  child: user.avatarUrl == null
                      ? Text(
                          user.initials,
                          style: TextStyle(
                            color: theme.colorScheme.onPrimaryContainer,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        )
                      : null,
                ),
                title: Text(
                  user.displayName,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                subtitle: Text(
                  user.email,
                  style: const TextStyle(fontSize: 12),
                ),
                trailing: const Icon(Icons.chevron_right),
              )
            else ...[
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: FilledButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.go('/login');
                  },
                  child: const Text('Log in'),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 4,
                ),
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.go('/signup');
                  },
                  child: const Text('Sign Up'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
