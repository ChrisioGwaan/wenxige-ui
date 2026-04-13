// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GuestCustomer _$GuestCustomerFromJson(Map<String, dynamic> json) =>
    GuestCustomer(
      id: json['id'] as String?,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      phone: json['phone'] as String?,
      shippingStreet: json['shippingStreet'] as String,
      shippingCity: json['shippingCity'] as String,
      shippingState: json['shippingState'] as String?,
      shippingPostalCode: json['shippingPostalCode'] as String,
      shippingCountry: json['shippingCountry'] as String,
      billingSameAsShipping: json['billingSameAsShipping'] as bool? ?? true,
      billingStreet: json['billingStreet'] as String?,
      billingCity: json['billingCity'] as String?,
      billingState: json['billingState'] as String?,
      billingPostalCode: json['billingPostalCode'] as String?,
      billingCountry: json['billingCountry'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$GuestCustomerToJson(GuestCustomer instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'phone': instance.phone,
      'shippingStreet': instance.shippingStreet,
      'shippingCity': instance.shippingCity,
      'shippingState': instance.shippingState,
      'shippingPostalCode': instance.shippingPostalCode,
      'shippingCountry': instance.shippingCountry,
      'billingSameAsShipping': instance.billingSameAsShipping,
      'billingStreet': instance.billingStreet,
      'billingCity': instance.billingCity,
      'billingState': instance.billingState,
      'billingPostalCode': instance.billingPostalCode,
      'billingCountry': instance.billingCountry,
      'createdAt': instance.createdAt?.toIso8601String(),
    };

OrderItem _$OrderItemFromJson(Map<String, dynamic> json) => OrderItem(
  id: json['id'] as String?,
  orderId: json['orderId'] as String,
  productId: json['productId'] as String,
  productName: json['productName'] as String,
  productSku: json['productSku'] as String?,
  productImageUrl: json['productImageUrl'] as String?,
  unitPrice: (json['unitPrice'] as num).toDouble(),
  quantity: (json['quantity'] as num).toInt(),
  totalPrice: (json['totalPrice'] as num).toDouble(),
  unit: json['unit'] as String?,
);

Map<String, dynamic> _$OrderItemToJson(OrderItem instance) => <String, dynamic>{
  'id': instance.id,
  'orderId': instance.orderId,
  'productId': instance.productId,
  'productName': instance.productName,
  'productSku': instance.productSku,
  'productImageUrl': instance.productImageUrl,
  'unitPrice': instance.unitPrice,
  'quantity': instance.quantity,
  'totalPrice': instance.totalPrice,
  'unit': instance.unit,
};

Order _$OrderFromJson(Map<String, dynamic> json) => Order(
  id: json['id'] as String?,
  orderNumber: json['orderNumber'] as String?,
  guestCustomerId: json['guestCustomerId'] as String?,
  shippingFirstName: json['shippingFirstName'] as String,
  shippingLastName: json['shippingLastName'] as String,
  shippingEmail: json['shippingEmail'] as String,
  shippingPhone: json['shippingPhone'] as String?,
  shippingStreet: json['shippingStreet'] as String,
  shippingCity: json['shippingCity'] as String,
  shippingState: json['shippingState'] as String?,
  shippingPostalCode: json['shippingPostalCode'] as String,
  shippingCountry: json['shippingCountry'] as String,
  billingSameAsShipping: json['billingSameAsShipping'] as bool? ?? true,
  billingStreet: json['billingStreet'] as String?,
  billingCity: json['billingCity'] as String?,
  billingState: json['billingState'] as String?,
  billingPostalCode: json['billingPostalCode'] as String?,
  billingCountry: json['billingCountry'] as String?,
  subtotal: (json['subtotal'] as num).toDouble(),
  shippingCost: (json['shippingCost'] as num?)?.toDouble() ?? 0,
  taxAmount: (json['taxAmount'] as num?)?.toDouble() ?? 0,
  discountAmount: (json['discountAmount'] as num?)?.toDouble() ?? 0,
  totalAmount: (json['totalAmount'] as num).toDouble(),
  currency: json['currency'] as String? ?? 'CNY',
  orderStatus:
      $enumDecodeNullable(_$OrderStatusEnumMap, json['orderStatus']) ??
      OrderStatus.pending,
  paymentStatus:
      $enumDecodeNullable(_$PaymentStatusEnumMap, json['paymentStatus']) ??
      PaymentStatus.pending,
  paymentMethod: $enumDecodeNullable(
    _$PaymentMethodEnumMap,
    json['paymentMethod'],
  ),
  paymentIntentId: json['paymentIntentId'] as String?,
  paymentTransactionId: json['paymentTransactionId'] as String?,
  customerNotes: json['customerNotes'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  paidAt: json['paidAt'] == null
      ? null
      : DateTime.parse(json['paidAt'] as String),
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$OrderToJson(Order instance) => <String, dynamic>{
  'id': instance.id,
  'orderNumber': instance.orderNumber,
  'guestCustomerId': instance.guestCustomerId,
  'shippingFirstName': instance.shippingFirstName,
  'shippingLastName': instance.shippingLastName,
  'shippingEmail': instance.shippingEmail,
  'shippingPhone': instance.shippingPhone,
  'shippingStreet': instance.shippingStreet,
  'shippingCity': instance.shippingCity,
  'shippingState': instance.shippingState,
  'shippingPostalCode': instance.shippingPostalCode,
  'shippingCountry': instance.shippingCountry,
  'billingSameAsShipping': instance.billingSameAsShipping,
  'billingStreet': instance.billingStreet,
  'billingCity': instance.billingCity,
  'billingState': instance.billingState,
  'billingPostalCode': instance.billingPostalCode,
  'billingCountry': instance.billingCountry,
  'subtotal': instance.subtotal,
  'shippingCost': instance.shippingCost,
  'taxAmount': instance.taxAmount,
  'discountAmount': instance.discountAmount,
  'totalAmount': instance.totalAmount,
  'currency': instance.currency,
  'orderStatus': _$OrderStatusEnumMap[instance.orderStatus]!,
  'paymentStatus': _$PaymentStatusEnumMap[instance.paymentStatus]!,
  'paymentMethod': _$PaymentMethodEnumMap[instance.paymentMethod],
  'paymentIntentId': instance.paymentIntentId,
  'paymentTransactionId': instance.paymentTransactionId,
  'customerNotes': instance.customerNotes,
  'createdAt': instance.createdAt?.toIso8601String(),
  'paidAt': instance.paidAt?.toIso8601String(),
  'items': instance.items,
};

const _$OrderStatusEnumMap = {
  OrderStatus.pending: 'pending',
  OrderStatus.confirmed: 'confirmed',
  OrderStatus.processing: 'processing',
  OrderStatus.shipped: 'shipped',
  OrderStatus.delivered: 'delivered',
  OrderStatus.cancelled: 'cancelled',
  OrderStatus.refunded: 'refunded',
};

const _$PaymentStatusEnumMap = {
  PaymentStatus.pending: 'pending',
  PaymentStatus.processing: 'processing',
  PaymentStatus.completed: 'completed',
  PaymentStatus.failed: 'failed',
  PaymentStatus.refunded: 'refunded',
};

const _$PaymentMethodEnumMap = {
  PaymentMethod.stripe: 'stripe',
  PaymentMethod.paypal: 'paypal',
  PaymentMethod.bankTransfer: 'bank_transfer',
  PaymentMethod.cashOnDelivery: 'cash_on_delivery',
};
