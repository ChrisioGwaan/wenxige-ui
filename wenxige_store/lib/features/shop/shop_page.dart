import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:wenxige_store/shared/models/product_model.dart';
import 'package:wenxige_store/shared/services/product_service.dart';
import 'package:wenxige_store/shared/widgets/animated_gradient_background.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';

class ShopPage extends StatefulWidget {
  const ShopPage({super.key});

  @override
  State<ShopPage> createState() => _ShopPageState();
}

class _ShopPageState extends State<ShopPage> {
  final _productService = ProductService();
  final _searchController = TextEditingController();

  List<Product> _products = [];
  List<TeaCategory> _categories = [];
  List<Brand> _brands = [];
  bool _isLoading = true;
  bool _isGridView = true;

  String? _selectedProductType;
  String? _selectedCategory;
  String? _selectedBrand;
  double? _minPrice;
  double? _maxPrice;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    final results = await Future.wait([
      _productService.getProducts(),
      _productService.getCategories(),
      _productService.getBrands(),
    ]);

    if (mounted) {
      setState(() {
        _products = results[0] as List<Product>;
        _categories = results[1] as List<TeaCategory>;
        _brands = results[2] as List<Brand>;
        _isLoading = false;
      });
    }
  }

  Future<void> _applyFilters() async {
    setState(() => _isLoading = true);

    final products = await _productService.getProducts(
      searchQuery: _searchQuery.isEmpty ? null : _searchQuery,
      productType: _selectedProductType,
      category: _selectedCategory,
      brand: _selectedBrand,
      minPrice: _minPrice,
      maxPrice: _maxPrice,
    );

    if (mounted) {
      setState(() {
        _products = products;
        _isLoading = false;
      });
    }
  }

  void _clearFilters() {
    setState(() {
      _searchController.clear();
      _searchQuery = '';
      _selectedProductType = null;
      _selectedCategory = null;
      _selectedBrand = null;
      _minPrice = null;
      _maxPrice = null;
    });
    _loadData();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: const AppNavBar(),
      body: AnimatedWaveBackground(
        child: Column(
          children: [
            _buildSearchBar(theme),
            _buildFilters(theme),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _products.isEmpty
                  ? _buildEmptyState(theme)
                  : _isGridView
                  ? _buildGridView(theme)
                  : _buildListView(theme),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar(ThemeData theme) => Container(
      padding: const EdgeInsets.all(16),
      color: theme.colorScheme.surface.withValues(alpha: 0.9),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search products...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                          _applyFilters();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: theme.colorScheme.surface,
              ),
              onSubmitted: (value) {
                setState(() => _searchQuery = value);
                _applyFilters();
              },
            ),
          ),
          const SizedBox(width: 12),
          IconButton(
            icon: Icon(_isGridView ? Icons.view_list : Icons.grid_view),
            onPressed: () => setState(() => _isGridView = !_isGridView),
            tooltip: _isGridView ? 'List View' : 'Grid View',
          ),
        ],
      ),
    );

  Widget _buildFilters(ThemeData theme) {
    final hasActiveFilters =
        _selectedProductType != null ||
        _selectedCategory != null ||
        _selectedBrand != null ||
        _minPrice != null ||
        _maxPrice != null;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: theme.colorScheme.surface.withValues(alpha: 0.9),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            _buildFilterChip(
              label: 'Type: ${_selectedProductType ?? 'All'}',
              onTap: () => _showProductTypeFilter(theme),
              selected: _selectedProductType != null,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              label: 'Category: ${_selectedCategory ?? 'All'}',
              onTap: () => _showCategoryFilter(theme),
              selected: _selectedCategory != null,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              label: 'Brand: ${_selectedBrand ?? 'All'}',
              onTap: () => _showBrandFilter(theme),
              selected: _selectedBrand != null,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              label: 'Price',
              onTap: () => _showPriceFilter(theme),
              selected: _minPrice != null || _maxPrice != null,
            ),
            if (hasActiveFilters) ...[
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: _clearFilters,
                icon: const Icon(Icons.clear_all, size: 18),
                label: const Text('Clear'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required VoidCallback onTap,
    bool selected = false,
  }) => FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
    );

  void _showProductTypeFilter(ThemeData theme) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Product Type', style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            ...ProductType.values.map(
              (type) => ListTile(
                title: Text(type.displayName),
                trailing: _selectedProductType == type.name
                    ? const Icon(Icons.check)
                    : null,
                onTap: () {
                  setState(() => _selectedProductType = type.name);
                  Navigator.pop(context);
                  _applyFilters();
                },
              ),
            ),
            ListTile(
              title: const Text('All Types'),
              trailing: _selectedProductType == null
                  ? const Icon(Icons.check)
                  : null,
              onTap: () {
                setState(() => _selectedProductType = null);
                Navigator.pop(context);
                _applyFilters();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showCategoryFilter(ThemeData theme) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Tea Category', style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            ..._categories.map(
              (category) => ListTile(
                title: Text(category.name),
                subtitle: category.description != null
                    ? Text(category.description!)
                    : null,
                trailing: _selectedCategory == category.name
                    ? const Icon(Icons.check)
                    : null,
                onTap: () {
                  setState(() => _selectedCategory = category.name);
                  Navigator.pop(context);
                  _applyFilters();
                },
              ),
            ),
            ListTile(
              title: const Text('All Categories'),
              trailing: _selectedCategory == null
                  ? const Icon(Icons.check)
                  : null,
              onTap: () {
                setState(() => _selectedCategory = null);
                Navigator.pop(context);
                _applyFilters();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showBrandFilter(ThemeData theme) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Brand', style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            ..._brands.map(
              (brand) => ListTile(
                title: Text(brand.name),
                subtitle: brand.description != null
                    ? Text(brand.description!)
                    : null,
                trailing: _selectedBrand == brand.name
                    ? const Icon(Icons.check)
                    : null,
                onTap: () {
                  setState(() => _selectedBrand = brand.name);
                  Navigator.pop(context);
                  _applyFilters();
                },
              ),
            ),
            ListTile(
              title: const Text('All Brands'),
              trailing: _selectedBrand == null ? const Icon(Icons.check) : null,
              onTap: () {
                setState(() => _selectedBrand = null);
                Navigator.pop(context);
                _applyFilters();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showPriceFilter(ThemeData theme) {
    final minController = TextEditingController(
      text: _minPrice?.toString() ?? '',
    );
    final maxController = TextEditingController(
      text: _maxPrice?.toString() ?? '',
    );

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Price Range'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: minController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Min Price',
                prefixText: r'$',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: maxController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Max Price',
                prefixText: r'$',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              setState(() {
                _minPrice = double.tryParse(minController.text);
                _maxPrice = double.tryParse(maxController.text);
              });
              Navigator.pop(context);
              _applyFilters();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }

  Widget _buildGridView(ThemeData theme) => GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 300,
        childAspectRatio: 0.75,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) =>
          _buildProductCard(_products[index], theme),
    );

  Widget _buildListView(ThemeData theme) => ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _products.length,
      itemBuilder: (context, index) =>
          _buildProductListItem(_products[index], theme),
    );

  Widget _buildProductCard(Product product, ThemeData theme) => Card(
      elevation: 2,
      child: InkWell(
        onTap: () => context.go('/product/${product.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                ),
                child: product.imageUrls.isNotEmpty
                    ? Image.network(
                        product.imageUrls.first,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            const Icon(Icons.image_not_supported, size: 64),
                      )
                    : const Icon(Icons.image_not_supported, size: 64),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  if (product.brand != null)
                    Text(
                      product.brand!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        product.displayPrice,
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '/${product.unit}',
                        style: theme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                  if (!product.inStock)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        'Out of Stock',
                        style: TextStyle(
                          color: theme.colorScheme.error,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

  Widget _buildProductListItem(Product product, ThemeData theme) => Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => context.go('/product/${product.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: product.imageUrls.isNotEmpty
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          product.imageUrls.first,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              const Icon(Icons.image_not_supported),
                        ),
                      )
                    : const Icon(Icons.image_not_supported),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (product.brand != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        product.brand!,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                    if (product.description != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        product.description!,
                        style: theme.textTheme.bodySmall,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          product.displayPrice,
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '/${product.unit}',
                          style: theme.textTheme.bodySmall,
                        ),
                        const Spacer(),
                        if (!product.inStock)
                          Text(
                            'Out of Stock',
                            style: TextStyle(
                              color: theme.colorScheme.error,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );

  Widget _buildEmptyState(ThemeData theme) => Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.shopping_bag_outlined,
            size: 64,
            color: theme.colorScheme.onSurfaceVariant,
          ),
          const SizedBox(height: 16),
          Text('No products found', style: theme.textTheme.titleLarge),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your filters',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
}
