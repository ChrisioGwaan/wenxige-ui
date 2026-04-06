import 'package:flutter/material.dart';

import '../../shared/widgets/placeholder_page.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const PlaceholderPage(
      title: 'Your Cart',
      icon: Icons.shopping_bag_outlined,
      description:
          'Cart and checkout functionality will be available once the product catalogue is live.',
      accentColor: Color(0xFF6B4EFF),
    );
  }
}
