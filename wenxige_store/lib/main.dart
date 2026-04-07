import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/core/router/app_router.dart';
import 'package:wenxige_store/core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables (only works for native builds, not web)
  // For web, variables are injected at build time via --dart-define
  if (!kIsWeb) {
    await dotenv.load();
  }

  // Initialize Supabase
  // On web: use compile-time constants from --dart-define
  // On native: use .env file
  await Supabase.initialize(
    url: kIsWeb
        ? const String.fromEnvironment('SUPABASE_URL')
        : dotenv.env['SUPABASE_URL']!,
    anonKey: kIsWeb
        ? const String.fromEnvironment('SUPABASE_KEY')
        : dotenv.env['SUPABASE_KEY']!,
  );

  if (kIsWeb) usePathUrlStrategy();
  runApp(const WenxigeApp());
}

class WenxigeApp extends StatelessWidget {
  const WenxigeApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp.router(
    title: 'Wenxige Store',
    debugShowCheckedModeBanner: false,
    theme: AppTheme.lightTheme,
    routerConfig: AppRouter.router,
    scrollBehavior: const _WebScrollBehavior(),
  );
}

/// Enables mouse-drag scrolling on web in addition to touch and mouse wheel.
class _WebScrollBehavior extends MaterialScrollBehavior {
  const _WebScrollBehavior();

  @override
  Set<PointerDeviceKind> get dragDevices => {
    PointerDeviceKind.touch,
    PointerDeviceKind.mouse,
  };

  @override
  Widget buildScrollbar(
    BuildContext context,
    Widget child,
    ScrollableDetails details,
  ) => child; // Hide default scrollbar for a cleaner web aesthetic.
}
