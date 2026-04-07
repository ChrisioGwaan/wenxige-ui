import 'package:json_annotation/json_annotation.dart';

part 'user_profile_model.g.dart';

/// Extended user profile information stored in Supabase database
/// (separate from auth.users metadata)
@JsonSerializable()
class UserProfile {

  const UserProfile({
    required this.userId,
    this.gender,
    this.billingAddress,
    this.shippingAddress,
    this.useBillingAsShipping = true,
    this.updatedAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) =>
      _$UserProfileFromJson(json);
  final String userId;
  final String? gender;
  final Address? billingAddress;
  final Address? shippingAddress;
  final bool useBillingAsShipping;
  final DateTime? updatedAt;

  Map<String, dynamic> toJson() => _$UserProfileToJson(this);

  UserProfile copyWith({
    String? userId,
    String? gender,
    Address? billingAddress,
    Address? shippingAddress,
    bool? useBillingAsShipping,
    DateTime? updatedAt,
  }) => UserProfile(
      userId: userId ?? this.userId,
      gender: gender ?? this.gender,
      billingAddress: billingAddress ?? this.billingAddress,
      shippingAddress: shippingAddress ?? this.shippingAddress,
      useBillingAsShipping: useBillingAsShipping ?? this.useBillingAsShipping,
      updatedAt: updatedAt ?? this.updatedAt,
    );
}

@JsonSerializable()
class Address {

  const Address({
    this.street,
    this.city,
    this.state,
    this.postalCode,
    required this.country,
  });

  factory Address.fromJson(Map<String, dynamic> json) =>
      _$AddressFromJson(json);
  final String? street;
  final String? city;
  final String? state;
  final String? postalCode;
  final String country;

  Map<String, dynamic> toJson() => _$AddressToJson(this);

  Address copyWith({
    String? street,
    String? city,
    String? state,
    String? postalCode,
    String? country,
  }) => Address(
      street: street ?? this.street,
      city: city ?? this.city,
      state: state ?? this.state,
      postalCode: postalCode ?? this.postalCode,
      country: country ?? this.country,
    );

  bool get isComplete => street != null &&
        street!.isNotEmpty &&
        city != null &&
        city!.isNotEmpty &&
        postalCode != null &&
        postalCode!.isNotEmpty &&
        country.isNotEmpty;
}

/// Common shipping countries for tea business starting from China
class ShippingCountries {
  static const List<String> countries = [
    'China',
    'Hong Kong',
    'Macau',
    'Taiwan',
    'Japan',
    'South Korea',
    'Singapore',
    'Malaysia',
    'Thailand',
    'Vietnam',
    'Philippines',
    'Indonesia',
    'Australia',
    'New Zealand',
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Netherlands',
    'Switzerland',
    'Austria',
    'Italy',
    'Spain',
    'Belgium',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
  ];

  static bool isSupported(String country) => countries.contains(country);
}
