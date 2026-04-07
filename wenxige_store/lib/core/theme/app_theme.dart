import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color seedColor = Color(0xFF6B4EFF);
  static const Color heroDark = Color(0xFF0D0221);

  static ThemeData get lightTheme {
    final base = ThemeData.light();
    final colorScheme = ColorScheme.fromSeed(seedColor: seedColor);

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      // Use Poppins font (closest alternative to Google Sans)
      textTheme: GoogleFonts.poppinsTextTheme(base.textTheme),
      fontFamilyFallback: const ['Roboto', 'Arial', 'sans-serif'],
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: colorScheme.outlineVariant),
        ),
      ),
    );
  }
}
