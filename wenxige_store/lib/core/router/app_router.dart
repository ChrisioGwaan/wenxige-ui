import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/features/about/about_page.dart';
import 'package:wenxige_store/features/auth/forgot_password_page.dart';
import 'package:wenxige_store/features/auth/login_page.dart';
import 'package:wenxige_store/features/auth/signup_page.dart';
import 'package:wenxige_store/features/cart/cart_page.dart';
import 'package:wenxige_store/features/checkout/checkout_page.dart';
import 'package:wenxige_store/features/checkout/order_confirmation_page.dart';
import 'package:wenxige_store/features/contact/contact_page.dart';
import 'package:wenxige_store/features/gallery/gallery_page.dart';
import 'package:wenxige_store/features/landing/landing_page.dart';
import 'package:wenxige_store/features/profile/profile_settings_page.dart';
import 'package:wenxige_store/features/shop/product_detail_page.dart';
import 'package:wenxige_store/features/shop/shop_page.dart';

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
        path: '/product/:id',
        pageBuilder: (context, state) {
          final id = state.pathParameters['id']!;
          return _fade(state, ProductDetailPage(productId: id));
        },
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
        path: '/checkout',
        pageBuilder: (context, state) => _fade(state, const CheckoutPage()),
      ),
      GoRoute(
        path: '/order-confirmation/:orderNumber',
        pageBuilder: (context, state) {
          final orderNumber = state.pathParameters['orderNumber']!;
          return _fade(state, OrderConfirmationPage(orderNumber: orderNumber));
        },
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

  static CustomTransitionPage<void> _fade(GoRouterState state, Widget child) => CustomTransitionPage<void>(
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
