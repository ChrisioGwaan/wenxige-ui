import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/about/about_page.dart';
import '../../features/auth/forgot_password_page.dart';
import '../../features/auth/login_page.dart';
import '../../features/auth/signup_page.dart';
import '../../features/cart/cart_page.dart';
import '../../features/contact/contact_page.dart';
import '../../features/gallery/gallery_page.dart';
import '../../features/landing/landing_page.dart';
import '../../features/profile/profile_settings_page.dart';
import '../../features/shop/shop_page.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        pageBuilder: (context, state) => _fade(state, const LandingPage()),
      ),
      GoRoute(
        path: '/shop',
        pageBuilder: (context, state) => _fade(state, const ShopPage()),
      ),
      GoRoute(
        path: '/gallery',
        pageBuilder: (context, state) => _fade(state, const GalleryPage()),
      ),
      GoRoute(
        path: '/about',
        pageBuilder: (context, state) => _fade(state, const AboutPage()),
      ),
      GoRoute(
        path: '/contact',
        pageBuilder: (context, state) => _fade(state, const ContactPage()),
      ),
      GoRoute(
        path: '/cart',
        pageBuilder: (context, state) => _fade(state, const CartPage()),
      ),
      GoRoute(
        path: '/login',
        pageBuilder: (context, state) => _fade(state, const LoginPage()),
      ),
      GoRoute(
        path: '/signup',
        pageBuilder: (context, state) => _fade(state, const SignUpPage()),
      ),
      GoRoute(
        path: '/forgot-password',
        pageBuilder: (context, state) =>
            _fade(state, const ForgotPasswordPage()),
      ),
      GoRoute(
        path: '/profile',
        pageBuilder: (context, state) =>
            _fade(state, const ProfileSettingsPage()),
      ),
    ],
  );

  static CustomTransitionPage<void> _fade(GoRouterState state, Widget child) {
    return CustomTransitionPage<void>(
      key: state.pageKey,
      child: child,
      transitionDuration: const Duration(milliseconds: 220),
      transitionsBuilder: (context, animation, _, child) {
        return FadeTransition(
          opacity: CurvedAnimation(parent: animation, curve: Curves.easeInOut),
          child: child,
        );
      },
    );
  }
}
