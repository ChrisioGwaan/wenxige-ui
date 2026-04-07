import 'package:flutter/material.dart';

import 'package:wenxige_store/shared/widgets/placeholder_page.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) => const PlaceholderPage(
      title: 'About Us',
      icon: Icons.auto_awesome_outlined,
      description:
          'The story behind Wenxige — our values, our team, and our commitment to refined elegance.',
      accentColor: Color(0xFFF59E0B),
    );
}
