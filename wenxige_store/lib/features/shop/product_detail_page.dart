import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/shared/models/product_model.dart';
import 'package:wenxige_store/shared/services/cart_service.dart';
import 'package:wenxige_store/shared/services/product_service.dart';
import 'package:wenxige_store/shared/widgets/animated_gradient_background.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';

class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage({super.key, required this.productId});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  final _productService = ProductService();
  final _cartService = CartService();
  Product? _product;
  bool _isLoading = true;
  int _quantity = 1;
  int _selectedImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    await _cartService.init();
    final product = await _productService.getProductById(widget.productId);
    if (mounted) {
      setState(() {
        _product = product;
        _isLoading = false;
        if (_product != null) {
          _quantity = _product!.minOrderQuantity;
        }
      });
    }
  }

  void _incrementQuantity() {
    if (_product == null) return;
    final maxAllowed = _product!.getMaxAllowedQuantity();
    if (_quantity < maxAllowed) {
      setState(() => _quantity++);
    }
  }

  void _decrementQuantity() {
    if (_product == null) return;
    if (_quantity > _product!.minOrderQuantity) {
      setState(() => _quantity--);
    }
  }

  Future<void> _addToCart() async {
    if (_product == null) return;
    await _cartService.addToCart(_product!, _quantity);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Added ${_product!.name} (x$_quantity) to cart'),
          action: SnackBarAction(
            label: 'View Cart',
            onPressed: () => context.go('/cart'),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isLoading) {
      return Scaffold(
        appBar: const AppNavBar(),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_product == null) {
      return Scaffold(
        appBar: const AppNavBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64),
              const SizedBox(height: 16),
              const Text('Product not found'),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () => context.go('/shop'),
                child: const Text('Back to Shop'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: const AppNavBar(),
      body: AnimatedWaveBackground(
        child: SingleChildScrollView(
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1200),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  LayoutBuilder(
                    builder: (context, constraints) {
                      if (constraints.maxWidth > 800) {
                        return _buildDesktopLayout(theme);
                      } else {
                        return _buildMobileLayout(theme);
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDesktopLayout(ThemeData theme) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(child: _buildImageGallery(theme)),
        const SizedBox(width: 32),
        Expanded(child: _buildProductInfo(theme)),
      ],
    );
  }

  Widget _buildMobileLayout(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildImageGallery(theme),
        const SizedBox(height: 24),
        _buildProductInfo(theme),
      ],
    );
  }

  Widget _buildImageGallery(ThemeData theme) {
    final images = _product!.imageUrls.isNotEmpty ? _product!.imageUrls : [''];

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            AspectRatio(
              aspectRatio: 1,
              child: Container(
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: images[_selectedImageIndex].isNotEmpty
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          images[_selectedImageIndex],
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              const Icon(Icons.image_not_supported, size: 120),
                        ),
                      )
                    : const Icon(Icons.image_not_supported, size: 120),
              ),
            ),
            if (images.length > 1) ...[
              const SizedBox(height: 16),
              SizedBox(
                height: 80,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: images.length,
                  itemBuilder: (context, index) => GestureDetector(
                    onTap: () => setState(() => _selectedImageIndex = index),
                    child: Container(
                      width: 80,
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: _selectedImageIndex == index
                              ? theme.colorScheme.primary
                              : Colors.transparent,
                          width: 2,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.network(
                          images[index],
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              const Icon(Icons.image_not_supported),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildProductInfo(ThemeData theme) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              _product!.name,
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            if (_product!.brand != null)
              Text(
                _product!.brand!,
                style: theme.textTheme.titleMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            const SizedBox(height: 16),
            Row(
              children: [
                Text(
                  _product!.displayPrice,
                  style: theme.textTheme.headlineLarge?.copyWith(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(' /${_product!.unit}', style: theme.textTheme.titleMedium),
              ],
            ),
            const SizedBox(height: 24),
            const Divider(),
            const SizedBox(height: 16),
            _buildInfoRow(theme, 'Type', _product!.productType),
            if (_product!.category != null)
              _buildInfoRow(theme, 'Category', _product!.category!),
            if (_product!.weightGrams != null)
              _buildInfoRow(theme, 'Weight', '${_product!.weightGrams}g'),
            _buildInfoRow(
              theme,
              'Stock',
              _product!.stockQuantity > 0
                  ? '${_product!.stockQuantity} available'
                  : 'Out of stock',
            ),
            const SizedBox(height: 24),
            if (_product!.description != null) ...[
              Text(
                'Description',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(_product!.description!, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 24),
            ],
            if (_product!.inStock) ...[
              const Divider(),
              const SizedBox(height: 16),
              Row(
                children: [
                  Text(
                    'Quantity:',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: _decrementQuantity,
                    icon: const Icon(Icons.remove),
                    style: IconButton.styleFrom(
                      backgroundColor:
                          theme.colorScheme.surfaceContainerHighest,
                    ),
                  ),
                  Container(
                    width: 60,
                    alignment: Alignment.center,
                    child: Text(
                      '$_quantity',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: _incrementQuantity,
                    icon: const Icon(Icons.add),
                    style: IconButton.styleFrom(
                      backgroundColor:
                          theme.colorScheme.surfaceContainerHighest,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Min: ${_product!.minOrderQuantity}, Max: ${_product!.maxOrderQuantity ?? 'Unlimited'}',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: _addToCart,
                icon: const Icon(Icons.shopping_cart),
                label: Text(
                  'Add to Cart - ${(_product!.price * _quantity).toStringAsFixed(2)}',
                ),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ] else
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error_outline, color: theme.colorScheme.error),
                    const SizedBox(width: 8),
                    Text(
                      'Out of Stock',
                      style: TextStyle(
                        color: theme.colorScheme.error,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () => context.go('/shop'),
              icon: const Icon(Icons.arrow_back),
              label: const Text('Continue Shopping'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(ThemeData theme, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Text(
            '$label:',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            value,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
