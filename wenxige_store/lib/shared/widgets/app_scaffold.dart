import 'package:flutter/material.dart';

import 'package:wenxige_store/shared/widgets/animated_gradient_background.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';

class AppScaffold extends StatelessWidget {

  const AppScaffold({
    super.key,
    required this.body,
    this.showNavBar = true,
    this.showBackground = true,
  });
  final Widget body;
  final bool showNavBar;
  final bool showBackground;

  @override
  Widget build(BuildContext context) {
    var content = body;

    if (showBackground) {
      content = AnimatedGradientBackground(
        showFloatingShapes: false,
        child: SafeArea(child: body),
      );
    }

    return Scaffold(
      appBar: showNavBar ? const AppNavBar() : null,
      body: content,
    );
  }
}
