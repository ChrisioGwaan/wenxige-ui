import 'package:wenxige_store/shared/models/user_model.dart';

/// Mock authentication state.
/// Replace with Supabase auth integration when backend is ready.
class MockAuth {
  // Set to false to preview the signed-out UI state.
  static const bool isSignedIn = true;

  static const UserModel _mockUser = UserModel(
    id: 'mock-user-001',
    displayName: 'Alex Chen',
    email: 'alex.chen@example.com',
  );

  static UserModel? get user => isSignedIn ? _mockUser : null;
}
