import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/models/user_profile_model.dart';

/// Service for managing extended user profile data in Supabase
class UserProfileService extends ChangeNotifier {
  factory UserProfileService() => _instance;
  UserProfileService._internal();
  static final UserProfileService _instance = UserProfileService._internal();

  SupabaseClient get _client => Supabase.instance.client;

  /// Load user profile from database
  Future<UserProfile?> loadProfile(String userId) async {
    try {
      final response = await _client
          .from('user_profiles')
          .select()
          .eq('user_id', userId)
          .maybeSingle();

      if (response == null) return null;

      // Convert snake_case to camelCase for JSON parsing
      final data = {
        'userId': response['user_id'],
        'gender': response['gender'],
        'billingAddress': response['billing_address'],
        'shippingAddress': response['shipping_address'],
        'useBillingAsShipping': response['use_billing_as_shipping'] ?? true,
        'updatedAt': response['updated_at'],
      };

      return UserProfile.fromJson(data);
    } catch (e) {
      debugPrint('Error loading user profile: $e');
      return null;
    }
  }

  /// Save or update user profile
  Future<void> saveProfile(UserProfile profile) async {
    try {
      final data = {
        'user_id': profile.userId,
        'gender': profile.gender,
        'billing_address': profile.billingAddress?.toJson(),
        'shipping_address': profile.shippingAddress?.toJson(),
        'use_billing_as_shipping': profile.useBillingAsShipping,
        'updated_at': DateTime.now().toIso8601String(),
      };

      await _client.from('user_profiles').upsert(data);
      notifyListeners();
    } catch (e) {
      debugPrint('Error saving user profile: $e');
      rethrow;
    }
  }

  /// Get current user profile
  Future<UserProfile?> getProfile() async {
    final user = _client.auth.currentUser;
    if (user == null) return null;
    return loadProfile(user.id);
  }

  /// Delete user profile
  Future<void> deleteProfile(String userId) async {
    try {
      await _client.from('user_profiles').delete().eq('user_id', userId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error deleting user profile: $e');
      rethrow;
    }
  }
}
