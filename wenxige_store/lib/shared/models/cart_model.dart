import 'package:json_annotation/json_annotation.dart';

part 'cart_model.g.dart';

@JsonSerializable()
class CartItem {
  final String productId;
  final String productName;
  final String? productImageUrl;
  final double unitPrice;
  final String? unit;
  final int quantity;
  final int minOrderQuantity;
  final int? maxOrderQuantity;
  final int stockQuantity;

  CartItem({
    required this.productId,
    required this.productName,
    this.productImageUrl,
    required this.unitPrice,
    this.unit,
    required this.quantity,
    this.minOrderQuantity = 1,
    this.maxOrderQuantity,
    required this.stockQuantity,
  });

  double get totalPrice => unitPrice * quantity;

  int get maxAllowedQuantity {
    if (maxOrderQuantity != null) {
      return maxOrderQuantity! < stockQuantity
          ? maxOrderQuantity!
          : stockQuantity;
    }
    return stockQuantity;
  }

  CartItem copyWith({
    String? productId,
    String? productName,
    String? productImageUrl,
    double? unitPrice,
    String? unit,
    int? quantity,
    int? minOrderQuantity,
    int? maxOrderQuantity,
    int? stockQuantity,
  }) {
    return CartItem(
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      productImageUrl: productImageUrl ?? this.productImageUrl,
      unitPrice: unitPrice ?? this.unitPrice,
      unit: unit ?? this.unit,
      quantity: quantity ?? this.quantity,
      minOrderQuantity: minOrderQuantity ?? this.minOrderQuantity,
      maxOrderQuantity: maxOrderQuantity ?? this.maxOrderQuantity,
      stockQuantity: stockQuantity ?? this.stockQuantity,
    );
  }

  factory CartItem.fromJson(Map<String, dynamic> json) =>
      _$CartItemFromJson(json);
  Map<String, dynamic> toJson() => _$CartItemToJson(this);
}

@JsonSerializable()
class Cart {
  final List<CartItem> items;
  final DateTime? lastUpdated;

  Cart({this.items = const [], this.lastUpdated});

  double get subtotal => items.fold(0, (sum, item) => sum + item.totalPrice);

  int get totalItems => items.fold(0, (sum, item) => sum + item.quantity);

  int get uniqueItems => items.length;

  bool get isEmpty => items.isEmpty;

  Cart copyWith({List<CartItem>? items, DateTime? lastUpdated}) {
    return Cart(
      items: items ?? this.items,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }

  factory Cart.fromJson(Map<String, dynamic> json) => _$CartFromJson(json);
  Map<String, dynamic> toJson() => _$CartToJson(this);
}
