import 'package:flutter/material.dart';

import '../../shared/widgets/placeholder_page.dart';

class ShopPage extends StatelessWidget {
  const ShopPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const PlaceholderPage(
      title: 'Shop',
      icon: Icons.storefront_outlined,
      description:
          'Our curated product catalogue is coming soon. Browse premium goods handpicked for the discerning shopper.',
      accentColor: Color(0xFF6B4EFF),
    );
  }
}
