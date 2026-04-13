import 'dart:math' as math;

import 'package:flutter/material.dart';

/// An animated gradient background with floating shapes.
/// Optimized for performance with RepaintBoundary and reduced complexity.
class AnimatedGradientBackground extends StatefulWidget {

  const AnimatedGradientBackground({
    required this.child,
    this.colors,
    this.showFloatingShapes = true,
    super.key,
  });
  final Widget child;
  final List<Color>? colors;
  final bool showFloatingShapes;

  @override
  State<AnimatedGradientBackground> createState() =>
      _AnimatedGradientBackgroundState();
}

class _AnimatedGradientBackgroundState extends State<AnimatedGradientBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<_FloatingShape> _shapes;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    )..repeat();

    // Fewer shapes for better performance
    _shapes = List.generate(4, _FloatingShape.random);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors =
        widget.colors ??
        [
          theme.colorScheme.primary.withValues(alpha: 0.8),
          theme.colorScheme.secondary.withValues(alpha: 0.6),
          theme.colorScheme.tertiary.withValues(alpha: 0.7),
        ];

    return Stack(
      fit: StackFit.expand,
      children: [
        // Static gradient (no animation on gradient for perf)
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: colors,
            ),
          ),
        ),

        // Floating shapes with RepaintBoundary
        if (widget.showFloatingShapes)
          RepaintBoundary(
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, _) => CustomPaint(
                  painter: _ShapesPainter(
                    shapes: _shapes,
                    progress: _controller.value,
                    primaryColor: theme.colorScheme.onPrimary.withValues(
                      alpha: 0.08,
                    ),
                  ),
                  size: Size.infinite,
                  isComplex: true,
                  willChange: true,
                ),
            ),
          ),

        // Content
        widget.child,
      ],
    );
  }
}

class _FloatingShape {

  _FloatingShape({
    required this.startX,
    required this.startY,
    required this.size,
    required this.speedMultiplier,
    required this.shapeType,
  });

  factory _FloatingShape.random(int seed) {
    final random = math.Random(seed * 42);
    return _FloatingShape(
      startX: random.nextDouble(),
      startY: random.nextDouble(),
      size: 50 + random.nextDouble() * 60,
      speedMultiplier: 0.3 + random.nextDouble() * 0.5,
      shapeType: random.nextInt(3),
    );
  }
  final double startX;
  final double startY;
  final double size;
  final double speedMultiplier;
  final int shapeType;
}

class _ShapesPainter extends CustomPainter {

  _ShapesPainter({
    required this.shapes,
    required this.progress,
    required this.primaryColor,
  });
  final List<_FloatingShape> shapes;
  final double progress;
  final Color primaryColor;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = primaryColor
      ..style = PaintingStyle.fill;

    for (final shape in shapes) {
      final adjustedProgress = (progress * shape.speedMultiplier) % 1.0;
      final x = size.width * ((shape.startX + adjustedProgress * 0.4) % 1.0);
      final y =
          size.height *
          ((shape.startY +
                  math.sin(adjustedProgress * math.pi * 2) * 0.06) %
              1.0);

      canvas.save();
      canvas.translate(x, y);

      switch (shape.shapeType) {
        case 0:
          canvas.drawCircle(Offset.zero, shape.size / 2, paint);
          break;
        case 1:
          canvas.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromCenter(
                center: Offset.zero,
                width: shape.size,
                height: shape.size * 0.6,
              ),
              Radius.circular(shape.size * 0.2),
            ),
            paint,
          );
          break;
        case 2:
          final path = Path()
            ..moveTo(0, -shape.size / 2)
            ..lineTo(shape.size / 2, 0)
            ..lineTo(0, shape.size / 2)
            ..lineTo(-shape.size / 2, 0)
            ..close();
          canvas.drawPath(path, paint);
          break;
      }

      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_ShapesPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

/// A simpler wave background variant
class AnimatedWaveBackground extends StatefulWidget {

  const AnimatedWaveBackground({required this.child, super.key});
  final Widget child;

  @override
  State<AnimatedWaveBackground> createState() => _AnimatedWaveBackgroundState();
}

class _AnimatedWaveBackgroundState extends State<AnimatedWaveBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Stack(
      fit: StackFit.expand,
      children: [
        // Static base gradient
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                theme.colorScheme.primaryContainer,
                theme.colorScheme.surface,
              ],
            ),
          ),
        ),

        // Animated waves with RepaintBoundary
        RepaintBoundary(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, _) => CustomPaint(
                painter: _WavePainter(
                  progress: _controller.value,
                  colors: [
                    theme.colorScheme.primary.withValues(alpha: 0.1),
                    theme.colorScheme.secondary.withValues(alpha: 0.07),
                  ],
                ),
                size: Size.infinite,
                isComplex: true,
                willChange: true,
              ),
          ),
        ),

        // Content
        widget.child,
      ],
    );
  }
}

class _WavePainter extends CustomPainter {

  _WavePainter({required this.progress, required this.colors});
  final double progress;
  final List<Color> colors;

  @override
  void paint(Canvas canvas, Size size) {
    // Only 2 waves, fewer points
    for (var i = 0; i < colors.length; i++) {
      final paint = Paint()
        ..color = colors[i]
        ..style = PaintingStyle.fill;

      final path = Path();
      final waveHeight = size.height * (0.05 + i * 0.02);
      final baseY = size.height * (0.4 + i * 0.18);
      final phase = progress * math.pi * 2 + i * math.pi / 2;

      path.moveTo(0, size.height);
      path.lineTo(0, baseY);

      // Fewer points for better perf
      for (double x = 0; x <= size.width; x += 25) {
        final y =
            baseY + math.sin((x / size.width * math.pi * 2) + phase) * waveHeight;
        path.lineTo(x, y);
      }

      path.lineTo(size.width, size.height);
      path.close();
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(_WavePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
