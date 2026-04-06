import 'package:flutter/material.dart';

import '../../shared/widgets/placeholder_page.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const PlaceholderPage(
      title: 'About Us',
      icon: Icons.auto_awesome_outlined,
      description:
          'The story behind Wenxige — our values, our team, and our commitment to refined elegance.',
      accentColor: Color(0xFFF59E0B),
    );
  }
}
