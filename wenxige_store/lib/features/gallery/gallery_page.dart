import 'package:flutter/material.dart';

import 'package:wenxige_store/shared/widgets/placeholder_page.dart';

class GalleryPage extends StatelessWidget {
  const GalleryPage({super.key});

  @override
  Widget build(BuildContext context) => const PlaceholderPage(
      title: 'Gallery',
      icon: Icons.photo_library_outlined,
      description:
          'A visual showcase of our collections and behind-the-scenes moments — launching soon.',
      accentColor: Color(0xFFEC4899),
    );
}
