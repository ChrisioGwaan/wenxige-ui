// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cart_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CartItem _$CartItemFromJson(Map<String, dynamic> json) => CartItem(
  productId: json['productId'] as String,
  productName: json['productName'] as String,
  productImageUrl: json['productImageUrl'] as String?,
  unitPrice: (json['unitPrice'] as num).toDouble(),
  unit: json['unit'] as String?,
  quantity: (json['quantity'] as num).toInt(),
  minOrderQuantity: (json['minOrderQuantity'] as num?)?.toInt() ?? 1,
  maxOrderQuantity: (json['maxOrderQuantity'] as num?)?.toInt(),
  stockQuantity: (json['stockQuantity'] as num).toInt(),
);

Map<String, dynamic> _$CartItemToJson(CartItem instance) => <String, dynamic>{
  'productId': instance.productId,
  'productName': instance.productName,
  'productImageUrl': instance.productImageUrl,
  'unitPrice': instance.unitPrice,
  'unit': instance.unit,
  'quantity': instance.quantity,
  'minOrderQuantity': instance.minOrderQuantity,
  'maxOrderQuantity': instance.maxOrderQuantity,
  'stockQuantity': instance.stockQuantity,
};

Cart _$CartFromJson(Map<String, dynamic> json) => Cart(
  items:
      (json['items'] as List<dynamic>?)
          ?.map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  lastUpdated: json['lastUpdated'] == null
      ? null
      : DateTime.parse(json['lastUpdated'] as String),
);

Map<String, dynamic> _$CartToJson(Cart instance) => <String, dynamic>{
  'items': instance.items,
  'lastUpdated': instance.lastUpdated?.toIso8601String(),
};
