import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:wenxige_store/shared/models/cart_model.dart';
import 'package:wenxige_store/shared/models/product_model.dart';

class CartService extends ChangeNotifier {
  static final CartService _instance = CartService._internal();
  factory CartService() => _instance;
  CartService._internal();

  static const String _cartKey = 'wenxige_cart';

  Cart _cart = Cart(items: [], lastUpdated: DateTime.now());
  Cart get cart => _cart;

  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;
    await _loadCart();
    _isInitialized = true;
  }

  Future<void> _loadCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartJson = prefs.getString(_cartKey);
      if (cartJson != null) {
        final decoded = jsonDecode(cartJson) as Map<String, dynamic>;
        _cart = Cart.fromJson(decoded);
      }
    } catch (e) {
      debugPrint('Error loading cart: $e');
      _cart = Cart(items: [], lastUpdated: DateTime.now());
    }
    notifyListeners();
  }

  Future<void> _saveCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartJson = jsonEncode(_cart.toJson());
      await prefs.setString(_cartKey, cartJson);
    } catch (e) {
      debugPrint('Error saving cart: $e');
    }
  }

  Future<void> addToCart(Product product, int quantity) async {
    final existingIndex = _cart.items.indexWhere(
      (item) => item.productId == product.id,
    );

    List<CartItem> updatedItems = List.from(_cart.items);

    if (existingIndex >= 0) {
      final existing = updatedItems[existingIndex];
      final newQuantity = existing.quantity + quantity;
      final maxAllowed = existing.maxAllowedQuantity;

      updatedItems[existingIndex] = existing.copyWith(
        quantity: newQuantity > maxAllowed ? maxAllowed : newQuantity,
      );
    } else {
      updatedItems.add(
        CartItem(
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrls.isNotEmpty
              ? product.imageUrls.first
              : null,
          unitPrice: product.price,
          unit: product.unit,
          quantity: quantity,
          minOrderQuantity: product.minOrderQuantity,
          maxOrderQuantity: product.maxOrderQuantity,
          stockQuantity: product.stockQuantity,
        ),
      );
    }

    _cart = Cart(items: updatedItems, lastUpdated: DateTime.now());
    await _saveCart();
    notifyListeners();
  }

  Future<void> updateQuantity(String productId, int quantity) async {
    final index = _cart.items.indexWhere((item) => item.productId == productId);
    if (index < 0) return;

    final item = _cart.items[index];
    final maxAllowed = item.maxAllowedQuantity;
    final minAllowed = item.minOrderQuantity;

    int newQuantity = quantity;
    if (newQuantity > maxAllowed) newQuantity = maxAllowed;
    if (newQuantity < minAllowed) newQuantity = minAllowed;

    List<CartItem> updatedItems = List.from(_cart.items);
    updatedItems[index] = item.copyWith(quantity: newQuantity);

    _cart = Cart(items: updatedItems, lastUpdated: DateTime.now());
    await _saveCart();
    notifyListeners();
  }

  Future<void> removeFromCart(String productId) async {
    List<CartItem> updatedItems = _cart.items
        .where((item) => item.productId != productId)
        .toList();

    _cart = Cart(items: updatedItems, lastUpdated: DateTime.now());
    await _saveCart();
    notifyListeners();
  }

  Future<void> clearCart() async {
    _cart = Cart(items: [], lastUpdated: DateTime.now());
    await _saveCart();
    notifyListeners();
  }

  int getItemQuantity(String productId) {
    final item = _cart.items
        .where((item) => item.productId == productId)
        .firstOrNull;
    return item?.quantity ?? 0;
  }

  bool isInCart(String productId) {
    return _cart.items.any((item) => item.productId == productId);
  }
}
