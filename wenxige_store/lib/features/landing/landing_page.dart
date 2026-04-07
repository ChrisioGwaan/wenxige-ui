import 'package:flutter/material.dart';
import 'package:wenxige_store/features/landing/widgets/categories_section.dart';
import 'package:wenxige_store/features/landing/widgets/features_section.dart';
import 'package:wenxige_store/features/landing/widgets/footer_section.dart';
import 'package:wenxige_store/features/landing/widgets/hero_section.dart';
import 'package:wenxige_store/features/landing/widgets/promo_section.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      // extendBodyBehindAppBar lets the hero section fill the full screen
      // while the transparent nav bar floats over it.
      extendBodyBehindAppBar: true,
      appBar: AppNavBar(scrollController: _scrollController),
      body: SingleChildScrollView(
        controller: _scrollController,
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            HeroSection(),
            FeaturesSection(),
            CategoriesSection(),
            PromoSection(),
            FooterSection(),
          ],
        ),
      ),
    );
}
