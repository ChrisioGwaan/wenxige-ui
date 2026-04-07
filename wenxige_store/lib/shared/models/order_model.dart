import 'package:json_annotation/json_annotation.dart';

part 'order_model.g.dart';

enum OrderStatus {
  pending,
  confirmed,
  processing,
  shipped,
  delivered,
  cancelled,
  refunded,
}

enum PaymentStatus { pending, processing, completed, failed, refunded }

enum PaymentMethod {
  stripe,
  paypal,
  @JsonValue('bank_transfer')
  bankTransfer,
  @JsonValue('cash_on_delivery')
  cashOnDelivery,
}

@JsonSerializable()
class GuestCustomer {
  final String? id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;

  final String shippingStreet;
  final String shippingCity;
  final String? shippingState;
  final String shippingPostalCode;
  final String shippingCountry;

  final bool billingSameAsShipping;
  final String? billingStreet;
  final String? billingCity;
  final String? billingState;
  final String? billingPostalCode;
  final String? billingCountry;

  final DateTime? createdAt;

  GuestCustomer({
    this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    required this.shippingStreet,
    required this.shippingCity,
    this.shippingState,
    required this.shippingPostalCode,
    required this.shippingCountry,
    this.billingSameAsShipping = true,
    this.billingStreet,
    this.billingCity,
    this.billingState,
    this.billingPostalCode,
    this.billingCountry,
    this.createdAt,
  });

  factory GuestCustomer.fromJson(Map<String, dynamic> json) =>
      _$GuestCustomerFromJson(json);
  Map<String, dynamic> toJson() => _$GuestCustomerToJson(this);
}

@JsonSerializable()
class OrderItem {
  final String? id;
  final String orderId;
  final String productId;
  final String productName;
  final String? productSku;
  final String? productImageUrl;
  final double unitPrice;
  final int quantity;
  final double totalPrice;
  final String? unit;

  OrderItem({
    this.id,
    required this.orderId,
    required this.productId,
    required this.productName,
    this.productSku,
    this.productImageUrl,
    required this.unitPrice,
    required this.quantity,
    required this.totalPrice,
    this.unit,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);
  Map<String, dynamic> toJson() => _$OrderItemToJson(this);
}

@JsonSerializable()
class Order {
  final String? id;
  final String? orderNumber;
  final String? userId;
  final String? guestCustomerId;

  final String shippingFirstName;
  final String shippingLastName;
  final String shippingEmail;
  final String? shippingPhone;
  final String shippingStreet;
  final String shippingCity;
  final String? shippingState;
  final String shippingPostalCode;
  final String shippingCountry;

  final bool billingSameAsShipping;
  final String? billingStreet;
  final String? billingCity;
  final String? billingState;
  final String? billingPostalCode;
  final String? billingCountry;

  final double subtotal;
  final double shippingCost;
  final double taxAmount;
  final double discountAmount;
  final double totalAmount;
  final String currency;

  final OrderStatus orderStatus;
  final PaymentStatus paymentStatus;
  final PaymentMethod? paymentMethod;

  final String? paymentIntentId;
  final String? paymentTransactionId;

  final String? customerNotes;

  final DateTime? createdAt;
  final DateTime? paidAt;

  final List<OrderItem>? items;

  Order({
    this.id,
    this.orderNumber,
    this.userId,
    this.guestCustomerId,
    required this.shippingFirstName,
    required this.shippingLastName,
    required this.shippingEmail,
    this.shippingPhone,
    required this.shippingStreet,
    required this.shippingCity,
    this.shippingState,
    required this.shippingPostalCode,
    required this.shippingCountry,
    this.billingSameAsShipping = true,
    this.billingStreet,
    this.billingCity,
    this.billingState,
    this.billingPostalCode,
    this.billingCountry,
    required this.subtotal,
    this.shippingCost = 0,
    this.taxAmount = 0,
    this.discountAmount = 0,
    required this.totalAmount,
    this.currency = 'CNY',
    this.orderStatus = OrderStatus.pending,
    this.paymentStatus = PaymentStatus.pending,
    this.paymentMethod,
    this.paymentIntentId,
    this.paymentTransactionId,
    this.customerNotes,
    this.createdAt,
    this.paidAt,
    this.items,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
  Map<String, dynamic> toJson() => _$OrderToJson(this);
}
