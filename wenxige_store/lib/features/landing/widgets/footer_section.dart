import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/core/constants/app_constants.dart';

class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= AppConstants.tabletBreakpoint;

    return Container(
      color: const Color(0xFF0D0221),
      padding: const EdgeInsets.only(
        left: AppConstants.pageHorizontalPadding,
        right: AppConstants.pageHorizontalPadding,
        top: 80,
        bottom: 32,
      ),
      child: Center(
        child: ConstrainedBox(
          constraints:
              const BoxConstraints(maxWidth: AppConstants.maxContentWidth),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isDesktop)
                _DesktopFooterContent()
              else
                _MobileFooterContent(),
              const SizedBox(height: 56),
              const Divider(color: Colors.white12, thickness: 1),
              const SizedBox(height: 24),
              _BottomBar(),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Desktop columns ──────────────────────────────────────────────────────────

class _DesktopFooterContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 3, child: _BrandColumn()),
        const SizedBox(width: 60),
        Expanded(flex: 2, child: _LinksColumn()),
        const SizedBox(width: 60),
        Expanded(flex: 2, child: _SupportColumn()),
        const SizedBox(width: 60),
        Expanded(flex: 3, child: _NewsletterColumn()),
      ],
    );
}

// ─── Mobile stack ─────────────────────────────────────────────────────────────

class _MobileFooterContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _BrandColumn(),
        const SizedBox(height: 40),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _LinksColumn()),
            const SizedBox(width: 32),
            Expanded(child: _SupportColumn()),
          ],
        ),
        const SizedBox(height: 40),
        _NewsletterColumn(),
      ],
    );
}

// ─── Column widgets ───────────────────────────────────────────────────────────

class _BrandColumn extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: primary,
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: const Text(
                'W',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'Wenxige',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w700,
                fontSize: 17,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        const Text(
          'Refined goods, thoughtfully\ncurated for the discerning.',
          style: TextStyle(
            color: Colors.white38,
            fontSize: 14,
            height: 1.65,
          ),
        ),
        const SizedBox(height: 24),
        const Row(
          children: [
            _SocialBtn('IG'),
            SizedBox(width: 8),
            _SocialBtn('TW'),
            SizedBox(width: 8),
            _SocialBtn('WB'),
          ],
        ),
      ],
    );
  }
}

class _LinksColumn extends StatelessWidget {
  static const _links = [
    ('Home', '/'),
    ('Shop', '/shop'),
    ('Gallery', '/gallery'),
    ('About Us', '/about'),
    ('Contact', '/contact'),
  ];

  @override
  Widget build(BuildContext context) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _FooterHeading('Quick Links'),
        const SizedBox(height: 16),
        for (final (label, path) in _links) ...[
          _FooterLink(label: label, path: path),
          const SizedBox(height: 10),
        ],
      ],
    );
}

class _SupportColumn extends StatelessWidget {
  static const _items = [
    ('FAQ', '/contact'),
    ('Shipping Info', '/contact'),
    ('Returns & Exchanges', '/contact'),
    ('Track Your Order', '/contact'),
    ('Privacy Policy', '/contact'),
  ];

  @override
  Widget build(BuildContext context) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _FooterHeading('Support'),
        const SizedBox(height: 16),
        for (final (label, path) in _items) ...[
          _FooterLink(label: label, path: path),
          const SizedBox(height: 10),
        ],
      ],
    );
}

class _NewsletterColumn extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _FooterHeading('Stay in the Loop'),
        const SizedBox(height: 8),
        const Text(
          'Get early access to new collections, exclusive deals, and curator picks.',
          style: TextStyle(
            color: Colors.white38,
            fontSize: 13,
            height: 1.6,
          ),
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 46,
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Your email address',
                    hintStyle: const TextStyle(
                        color: Colors.white30, fontSize: 13),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.07),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 0),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide:
                          const BorderSide(color: Colors.white12),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide:
                          const BorderSide(color: Colors.white12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                          color: Theme.of(context).colorScheme.primary),
                    ),
                  ),
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  cursorColor: Colors.white60,
                ),
              ),
            ),
            const SizedBox(width: 8),
            SizedBox(
              height: 46,
              child: FilledButton(
                onPressed: () {},
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 18),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('Subscribe',
                    style: TextStyle(fontSize: 13)),
              ),
            ),
          ],
        ),
      ],
    );
}

// ─── Bottom copyright bar ─────────────────────────────────────────────────────

class _BottomBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Wrap(
      alignment: WrapAlignment.spaceBetween,
      spacing: 16,
      runSpacing: 8,
      children: [
        const Text(
          '© 2026 Wenxige Store. All rights reserved.',
          style: TextStyle(color: Colors.white24, fontSize: 12),
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _FooterLink(label: 'Terms', path: '/contact'),
            const SizedBox(width: 16),
            _FooterLink(label: 'Privacy', path: '/contact'),
            const SizedBox(width: 16),
            _FooterLink(label: 'Cookies', path: '/contact'),
          ],
        ),
      ],
    );
}

// ─── Reusable footer primitives ───────────────────────────────────────────────

class _FooterHeading extends StatelessWidget {
  const _FooterHeading(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Text(
      text,
      style: const TextStyle(
        color: Colors.white,
        fontWeight: FontWeight.w600,
        fontSize: 14,
        letterSpacing: 0.2,
      ),
    );
}

class _FooterLink extends StatefulWidget {
  const _FooterLink({required this.label, required this.path});
  final String label;
  final String path;

  @override
  State<_FooterLink> createState() => _FooterLinkState();
}

class _FooterLinkState extends State<_FooterLink> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) => MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: () => context.go(widget.path),
        child: Text(
          widget.label,
          style: TextStyle(
            color: _hovered ? Colors.white70 : Colors.white38,
            fontSize: 13,
          ),
        ),
      ),
    );
}

class _SocialBtn extends StatefulWidget {
  const _SocialBtn(this.label);
  final String label;

  @override
  State<_SocialBtn> createState() => _SocialBtnState();
}

class _SocialBtnState extends State<_SocialBtn> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: _hovered
              ? primary.withValues(alpha: 0.8)
              : Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: _hovered ? primary : Colors.white12,
          ),
        ),
        alignment: Alignment.center,
        child: Text(
          widget.label,
          style: TextStyle(
            color: _hovered ? Colors.white : Colors.white38,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}
