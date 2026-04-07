import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/models/product_model.dart';

class ProductService extends ChangeNotifier {
  static final ProductService _instance = ProductService._internal();
  factory ProductService() => _instance;
  ProductService._internal();

  SupabaseClient get _client => Supabase.instance.client;

  Future<List<Product>> getProducts({
    String? searchQuery,
    String? productType,
    String? category,
    String? brand,
    double? minPrice,
    double? maxPrice,
    bool? featured,
    int limit = 50,
    int offset = 0,
  }) async {
    try {
      PostgrestFilterBuilder<PostgrestList> query = _client
          .from('products')
          .select();

      query = query.eq('active', true);

      if (searchQuery != null && searchQuery.isNotEmpty) {
        query = query.or(
          'name.ilike.%$searchQuery%,description.ilike.%$searchQuery%',
        );
      }

      if (productType != null && productType.isNotEmpty) {
        query = query.eq('product_type', productType);
      }

      if (category != null && category.isNotEmpty) {
        query = query.eq('category', category);
      }

      if (brand != null && brand.isNotEmpty) {
        query = query.eq('brand', brand);
      }

      if (minPrice != null) {
        query = query.gte('price', minPrice);
      }

      if (maxPrice != null) {
        query = query.lte('price', maxPrice);
      }

      if (featured != null) {
        query = query.eq('featured', featured);
      }

      final response = await query
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);

      return (response as List)
          .map(
            (json) => Product.fromJson(
              _convertFromSnakeCase(json as Map<String, dynamic>),
            ),
          )
          .toList();
    } catch (e) {
      debugPrint('Error fetching products: $e');
      return [];
    }
  }

  Future<Product?> getProductById(String id) async {
    try {
      final response = await _client
          .from('products')
          .select()
          .eq('id', id)
          .eq('active', true)
          .single();

      return Product.fromJson(_convertFromSnakeCase(response));
    } catch (e) {
      debugPrint('Error fetching product: $e');
      return null;
    }
  }

  Future<List<TeaCategory>> getCategories() async {
    try {
      final response = await _client
          .from('tea_categories')
          .select()
          .order('display_order', ascending: true);

      return (response as List)
          .map(
            (json) => TeaCategory.fromJson(
              _convertFromSnakeCase(json as Map<String, dynamic>),
            ),
          )
          .toList();
    } catch (e) {
      debugPrint('Error fetching categories: $e');
      return [];
    }
  }

  Future<List<Brand>> getBrands() async {
    try {
      final response = await _client
          .from('brands')
          .select()
          .order('name', ascending: true);

      return (response as List)
          .map(
            (json) => Brand.fromJson(
              _convertFromSnakeCase(json as Map<String, dynamic>),
            ),
          )
          .toList();
    } catch (e) {
      debugPrint('Error fetching brands: $e');
      return [];
    }
  }

  Map<String, dynamic> _convertFromSnakeCase(Map<String, dynamic> json) {
    return {
      'id': json['id'],
      'name': json['name'],
      'description': json['description'],
      'productType': json['product_type'],
      'category': json['category'],
      'brand': json['brand'],
      'price': json['price'] is int
          ? (json['price'] as int).toDouble()
          : json['price'],
      'imageUrls': json['image_urls'] ?? [],
      'stockQuantity': json['stock_quantity'],
      'minOrderQuantity': json['min_order_quantity'],
      'maxOrderQuantity': json['max_order_quantity'],
      'unit': json['unit'],
      'weightGrams': json['weight_grams'],
      'featured': json['featured'],
      'active': json['active'],
      'createdAt': json['created_at'],
      'updatedAt': json['updated_at'],
      'displayOrder': json['display_order'],
      'logoUrl': json['logo_url'],
    };
  }
}
