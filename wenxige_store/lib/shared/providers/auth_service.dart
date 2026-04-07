import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/models/user_model.dart';

/// Supabase authentication service.
class AuthService extends ChangeNotifier {
  factory AuthService() => _instance;
  AuthService._internal();
  static final AuthService _instance = AuthService._internal();

  SupabaseClient get _client => Supabase.instance.client;

  User? get currentUser => _client.auth.currentUser;

  bool get isSignedIn => currentUser != null;

  UserModel? get user {
    final u = currentUser;
    if (u == null) return null;

    final displayName =
        u.userMetadata?['display_name'] as String? ?? u.email ?? 'User';
    return UserModel(
      id: u.id,
      displayName: displayName,
      email: u.email ?? '',
      avatarUrl: u.userMetadata?['avatar_url'] as String?,
    );
  }

  /// Sign up with email and password.
  /// Optional [firstName], [lastName], and [phone] are stored in user metadata.
  Future<AuthResponse> signUp({
    required String email,
    required String password,
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    String? displayName;
    if (firstName != null && firstName.isNotEmpty) {
      displayName = firstName;
      if (lastName != null && lastName.isNotEmpty) {
        displayName = '$firstName $lastName';
      }
    }

    final response = await _client.auth.signUp(
      email: email,
      password: password,
      data: {
        'display_name': ?displayName,
        if (phone != null && phone.isNotEmpty) 'phone': phone,
      },
    );

    notifyListeners();
    return response;
  }

  /// Sign in with email and password.
  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );

    notifyListeners();
    return response;
  }

  /// Sign out the current user.
  Future<void> signOut() async {
    await _client.auth.signOut();
    notifyListeners();
  }

  /// Listen to auth state changes.
  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;
}
