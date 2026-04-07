import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/models/cart_model.dart';
import 'package:wenxige_store/shared/models/order_model.dart';

class OrderService extends ChangeNotifier {
  factory OrderService() => _instance;
  OrderService._internal();
  static final OrderService _instance = OrderService._internal();

  SupabaseClient get _client => Supabase.instance.client;

  Future<Order?> createOrder({
    required Cart cart,
    required String firstName,
    required String lastName,
    required String email,
    required String shippingStreet,
    required String shippingCity,
    required String shippingPostalCode,
    required String shippingCountry,
    String? phone,
    String? shippingState,
    bool billingSameAsShipping = true,
    String? billingStreet,
    String? billingCity,
    String? billingState,
    String? billingPostalCode,
    String? billingCountry,
    PaymentMethod? paymentMethod,
    String? customerNotes,
    double shippingCost = 0,
    double taxAmount = 0,
    double discountAmount = 0,
  }) async {
    try {
      final user = _client.auth.currentUser;
      String? guestCustomerId;

      if (user == null) {
        final guestResponse = await _client
            .from('guest_customers')
            .insert({
              'email': email,
              'first_name': firstName,
              'last_name': lastName,
              'phone': phone,
              'shipping_street': shippingStreet,
              'shipping_city': shippingCity,
              'shipping_state': shippingState,
              'shipping_postal_code': shippingPostalCode,
              'shipping_country': shippingCountry,
              'billing_same_as_shipping': billingSameAsShipping,
              'billing_street': billingStreet,
              'billing_city': billingCity,
              'billing_state': billingState,
              'billing_postal_code': billingPostalCode,
              'billing_country': billingCountry,
            })
            .select()
            .single();

        guestCustomerId = guestResponse['id'] as String?;
      }

      final subtotal = cart.subtotal;
      final totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

      final orderResponse = await _client
          .from('orders')
          .insert({
            'user_id': user?.id,
            'guest_customer_id': guestCustomerId,
            'shipping_first_name': firstName,
            'shipping_last_name': lastName,
            'shipping_email': email,
            'shipping_phone': phone,
            'shipping_street': shippingStreet,
            'shipping_city': shippingCity,
            'shipping_state': shippingState,
            'shipping_postal_code': shippingPostalCode,
            'shipping_country': shippingCountry,
            'billing_same_as_shipping': billingSameAsShipping,
            'billing_street': billingStreet,
            'billing_city': billingCity,
            'billing_state': billingState,
            'billing_postal_code': billingPostalCode,
            'billing_country': billingCountry,
            'subtotal': subtotal,
            'shipping_cost': shippingCost,
            'tax_amount': taxAmount,
            'discount_amount': discountAmount,
            'total_amount': totalAmount,
            'payment_method': paymentMethod?.name,
            'customer_notes': customerNotes,
          })
          .select()
          .single();

      final orderId = orderResponse['id'];

      for (final item in cart.items) {
        await _client.from('order_items').insert({
          'order_id': orderId,
          'product_id': item.productId,
          'product_name': item.productName,
          'product_image_url': item.productImageUrl,
          'unit_price': item.unitPrice,
          'quantity': item.quantity,
          'total_price': item.totalPrice,
          'unit': item.unit,
        });
      }

      return Order(
        id: orderResponse['id'] as String?,
        orderNumber: orderResponse['order_number'] as String?,
        userId: orderResponse['user_id'] as String?,
        guestCustomerId: orderResponse['guest_customer_id'] as String?,
        shippingFirstName: firstName,
        shippingLastName: lastName,
        shippingEmail: email,
        shippingPhone: phone,
        shippingStreet: shippingStreet,
        shippingCity: shippingCity,
        shippingState: shippingState,
        shippingPostalCode: shippingPostalCode,
        shippingCountry: shippingCountry,
        billingSameAsShipping: billingSameAsShipping,
        billingStreet: billingStreet,
        billingCity: billingCity,
        billingState: billingState,
        billingPostalCode: billingPostalCode,
        billingCountry: billingCountry,
        subtotal: subtotal,
        shippingCost: shippingCost,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        customerNotes: customerNotes,
        createdAt: DateTime.now(),
      );
    } on Exception catch (e) {
      debugPrint('Error creating order: $e');
      return null;
    }
  }

  Future<bool> processPayment({
    required String orderId,
    required PaymentMethod paymentMethod,
  }) async {
    try {
      // Simulate successful payment (integrate with Stripe later)
      await Future<void>.delayed(const Duration(seconds: 2));

      final fakeTransactionId = 'TXN-${DateTime.now().millisecondsSinceEpoch}';

      await _client
          .from('orders')
          .update({
            'payment_status': 'completed',
            'order_status': 'confirmed',
            'payment_transaction_id': fakeTransactionId,
            'paid_at': DateTime.now().toIso8601String(),
          })
          .eq('id', orderId);

      return true;
    } on Exception catch (e) {
      debugPrint('Error processing payment: $e');
      return false;
    }
  }

  Future<List<Order>> getUserOrders() async {
    try {
      final user = _client.auth.currentUser;
      if (user == null) {
        return [];
      }

      final response = await _client
          .from('orders')
          .select()
          .eq('user_id', user.id)
          .order('created_at', ascending: false);

      return (response as List)
          .map(
            (json) => Order.fromJson(
              _convertFromSnakeCase(json as Map<String, dynamic>),
            ),
          )
          .toList();
    } on Exception catch (e) {
      debugPrint('Error fetching orders: $e');
      return [];
    }
  }

  Future<Order?> getOrderById(String orderId) async {
    try {
      final response = await _client
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single();

      return Order.fromJson(_convertFromSnakeCase(response));
    } on Exception catch (e) {
      debugPrint('Error fetching order: $e');
      return null;
    }
  }

  Map<String, dynamic> _convertFromSnakeCase(Map<String, dynamic> json) => {
    'id': json['id'],
    'orderNumber': json['order_number'],
    'userId': json['user_id'],
    'guestCustomerId': json['guest_customer_id'],
    'shippingFirstName': json['shipping_first_name'],
    'shippingLastName': json['shipping_last_name'],
    'shippingEmail': json['shipping_email'],
    'shippingPhone': json['shipping_phone'],
    'shippingStreet': json['shipping_street'],
    'shippingCity': json['shipping_city'],
    'shippingState': json['shipping_state'],
    'shippingPostalCode': json['shipping_postal_code'],
    'shippingCountry': json['shipping_country'],
    'billingSameAsShipping': json['billing_same_as_shipping'],
    'billingStreet': json['billing_street'],
    'billingCity': json['billing_city'],
    'billingState': json['billing_state'],
    'billingPostalCode': json['billing_postal_code'],
    'billingCountry': json['billing_country'],
    'subtotal': (json['subtotal'] as num?)?.toDouble() ?? 0,
    'shippingCost': (json['shipping_cost'] as num?)?.toDouble() ?? 0,
    'taxAmount': (json['tax_amount'] as num?)?.toDouble() ?? 0,
    'discountAmount': (json['discount_amount'] as num?)?.toDouble() ?? 0,
    'totalAmount': (json['total_amount'] as num?)?.toDouble() ?? 0,
    'currency': json['currency'],
    'orderStatus': json['order_status'],
    'paymentStatus': json['payment_status'],
    'paymentMethod': json['payment_method'],
    'paymentIntentId': json['payment_intent_id'],
    'paymentTransactionId': json['payment_transaction_id'],
    'customerNotes': json['customer_notes'],
    'createdAt': json['created_at'],
    'paidAt': json['paid_at'],
  };
}
