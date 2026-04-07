import 'package:json_annotation/json_annotation.dart';

part 'product_model.g.dart';

@JsonSerializable()
class Product {
  final String id;
  final String name;
  final String? description;
  final String productType;
  final String? category;
  final String? brand;
  final double price;
  final List<String> imageUrls;
  final int stockQuantity;
  final int minOrderQuantity;
  final int? maxOrderQuantity;
  final String unit;
  final int? weightGrams;
  final bool featured;
  final bool active;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Product({
    required this.id,
    required this.name,
    this.description,
    required this.productType,
    this.category,
    this.brand,
    required this.price,
    this.imageUrls = const [],
    required this.stockQuantity,
    this.minOrderQuantity = 1,
    this.maxOrderQuantity,
    this.unit = 'piece',
    this.weightGrams,
    this.featured = false,
    this.active = true,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);

  bool get inStock => stockQuantity > 0;

  int getMaxAllowedQuantity() {
    if (maxOrderQuantity != null) {
      return maxOrderQuantity! < stockQuantity
          ? maxOrderQuantity!
          : stockQuantity;
    }
    return stockQuantity;
  }

  String get displayPrice => '\$${price.toStringAsFixed(2)}';
}

@JsonSerializable()
class TeaCategory {
  final String id;
  final String name;
  final String? description;
  final int displayOrder;
  final DateTime createdAt;

  const TeaCategory({
    required this.id,
    required this.name,
    this.description,
    this.displayOrder = 0,
    required this.createdAt,
  });

  factory TeaCategory.fromJson(Map<String, dynamic> json) =>
      _$TeaCategoryFromJson(json);
  Map<String, dynamic> toJson() => _$TeaCategoryToJson(this);
}

@JsonSerializable()
class Brand {
  final String id;
  final String name;
  final String? description;
  final String? logoUrl;
  final DateTime createdAt;

  const Brand({
    required this.id,
    required this.name,
    this.description,
    this.logoUrl,
    required this.createdAt,
  });

  factory Brand.fromJson(Map<String, dynamic> json) => _$BrandFromJson(json);
  Map<String, dynamic> toJson() => _$BrandToJson(this);
}

enum ProductType {
  tea,
  teapot,
  artwork,
  accessory;

  String get displayName {
    switch (this) {
      case ProductType.tea:
        return 'Tea';
      case ProductType.teapot:
        return 'Teapot';
      case ProductType.artwork:
        return 'Artwork';
      case ProductType.accessory:
        return 'Accessory';
    }
  }
}
