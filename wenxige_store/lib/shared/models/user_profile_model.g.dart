// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserProfile _$UserProfileFromJson(Map<String, dynamic> json) => UserProfile(
  userId: json['userId'] as String,
  gender: json['gender'] as String?,
  billingAddress: json['billingAddress'] == null
      ? null
      : Address.fromJson(json['billingAddress'] as Map<String, dynamic>),
  shippingAddress: json['shippingAddress'] == null
      ? null
      : Address.fromJson(json['shippingAddress'] as Map<String, dynamic>),
  useBillingAsShipping: json['useBillingAsShipping'] as bool? ?? true,
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$UserProfileToJson(UserProfile instance) =>
    <String, dynamic>{
      'userId': instance.userId,
      'gender': instance.gender,
      'billingAddress': instance.billingAddress,
      'shippingAddress': instance.shippingAddress,
      'useBillingAsShipping': instance.useBillingAsShipping,
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

Address _$AddressFromJson(Map<String, dynamic> json) => Address(
  street: json['street'] as String?,
  city: json['city'] as String?,
  state: json['state'] as String?,
  postalCode: json['postalCode'] as String?,
  country: json['country'] as String,
);

Map<String, dynamic> _$AddressToJson(Address instance) => <String, dynamic>{
  'street': instance.street,
  'city': instance.city,
  'state': instance.state,
  'postalCode': instance.postalCode,
  'country': instance.country,
};
