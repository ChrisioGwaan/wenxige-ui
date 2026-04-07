// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Product _$ProductFromJson(Map<String, dynamic> json) => Product(
  id: json['id'] as String,
  name: json['name'] as String,
  description: json['description'] as String?,
  productType: json['productType'] as String,
  category: json['category'] as String?,
  brand: json['brand'] as String?,
  price: (json['price'] as num).toDouble(),
  imageUrls:
      (json['imageUrls'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  stockQuantity: (json['stockQuantity'] as num).toInt(),
  minOrderQuantity: (json['minOrderQuantity'] as num?)?.toInt() ?? 1,
  maxOrderQuantity: (json['maxOrderQuantity'] as num?)?.toInt(),
  unit: json['unit'] as String? ?? 'piece',
  weightGrams: (json['weightGrams'] as num?)?.toInt(),
  featured: json['featured'] as bool? ?? false,
  active: json['active'] as bool? ?? true,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$ProductToJson(Product instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'description': instance.description,
  'productType': instance.productType,
  'category': instance.category,
  'brand': instance.brand,
  'price': instance.price,
  'imageUrls': instance.imageUrls,
  'stockQuantity': instance.stockQuantity,
  'minOrderQuantity': instance.minOrderQuantity,
  'maxOrderQuantity': instance.maxOrderQuantity,
  'unit': instance.unit,
  'weightGrams': instance.weightGrams,
  'featured': instance.featured,
  'active': instance.active,
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

TeaCategory _$TeaCategoryFromJson(Map<String, dynamic> json) => TeaCategory(
  id: json['id'] as String,
  name: json['name'] as String,
  description: json['description'] as String?,
  displayOrder: (json['displayOrder'] as num?)?.toInt() ?? 0,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$TeaCategoryToJson(TeaCategory instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'displayOrder': instance.displayOrder,
      'createdAt': instance.createdAt.toIso8601String(),
    };

Brand _$BrandFromJson(Map<String, dynamic> json) => Brand(
  id: json['id'] as String,
  name: json['name'] as String,
  description: json['description'] as String?,
  logoUrl: json['logoUrl'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$BrandToJson(Brand instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'description': instance.description,
  'logoUrl': instance.logoUrl,
  'createdAt': instance.createdAt.toIso8601String(),
};
