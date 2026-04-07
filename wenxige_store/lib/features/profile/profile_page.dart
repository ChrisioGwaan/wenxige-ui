import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/providers/auth_service.dart';
import 'package:wenxige_store/shared/widgets/animated_gradient_background.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';
import 'package:wenxige_store/shared/widgets/country_code_picker.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _authService = AuthService();

  bool _isLoading = false;
  bool _isUploadingAvatar = false;
  String? _errorMessage;
  String? _successMessage;
  Country _selectedCountry = Country.findByCode('AU');
  String? _avatarUrl;
  Uint8List? _avatarBytes;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() {
    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      final metadata = user.userMetadata ?? {};
      final displayName = metadata['display_name'] as String? ?? '';
      final phone = metadata['phone'] as String? ?? '';
      _avatarUrl = metadata['avatar_url'] as String?;

      // Parse display name into first and last name
      final nameParts = displayName.split(' ');
      if (nameParts.isNotEmpty) {
        _firstNameController.text = nameParts.first;
        if (nameParts.length > 1) {
          _lastNameController.text = nameParts.sublist(1).join(' ');
        }
      }

      // Parse phone to extract country code and number
      if (phone.isNotEmpty) {
        // Try to match country code
        for (final country in Country.all) {
          if (phone.startsWith(country.dialCode)) {
            _selectedCountry = country;
            _phoneController.text = phone
                .substring(country.dialCode.length)
                .trim();
            break;
          }
        }
        // If no match, just use the phone number as-is
        if (_phoneController.text.isEmpty && phone.isNotEmpty) {
          _phoneController.text = phone;
        }
      }
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickAvatar() async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 512,
        maxHeight: 512,
        imageQuality: 85,
      );

      if (pickedFile == null) return;

      final bytes = await pickedFile.readAsBytes();
      setState(() {
        _avatarBytes = bytes;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to pick image: $e';
      });
    }
  }

  Future<String?> _uploadAvatar() async {
    if (_avatarBytes == null) return _avatarUrl;

    setState(() {
      _isUploadingAvatar = true;
    });

    try {
      final user = Supabase.instance.client.auth.currentUser;
      if (user == null) throw Exception('Not authenticated');

      final fileName =
          '${user.id}/avatar_${DateTime.now().millisecondsSinceEpoch}.jpg';

      // Upload to Supabase Storage (avatars bucket)
      await Supabase.instance.client.storage
          .from('avatars')
          .uploadBinary(
            fileName,
            _avatarBytes!,
            fileOptions: const FileOptions(
              contentType: 'image/jpeg',
              upsert: true,
            ),
          );

      // Get public URL
      final publicUrl = Supabase.instance.client.storage
          .from('avatars')
          .getPublicUrl(fileName);

      return publicUrl;
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to upload avatar: $e';
      });
      return null;
    } finally {
      setState(() {
        _isUploadingAvatar = false;
      });
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      // Upload avatar if changed
      var avatarUrl = _avatarUrl;
      if (_avatarBytes != null) {
        avatarUrl = await _uploadAvatar();
        if (avatarUrl == null && _avatarBytes != null) {
          // Upload failed
          return;
        }
      }

      // Combine first and last name
      final firstName = _firstNameController.text.trim();
      final lastName = _lastNameController.text.trim();
      final displayName = '$firstName $lastName'.trim();

      // Combine country code and phone
      String? phone;
      if (_phoneController.text.trim().isNotEmpty) {
        phone = '${_selectedCountry.dialCode}${_phoneController.text.trim()}';
      }

      // Update user metadata
      await Supabase.instance.client.auth.updateUser(
        UserAttributes(
          data: {
            'display_name': displayName,
            'phone': ?phone,
            'avatar_url': ?avatarUrl,
          },
        ),
      );

      _authService.notifyListeners();

      if (mounted) {
        setState(() {
          _avatarUrl = avatarUrl;
          _avatarBytes = null;
          _successMessage = 'Profile updated successfully!';
        });
      }
    } on AuthException catch (e) {
      setState(() {
        _errorMessage = e.message;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'An unexpected error occurred: $e';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleSignOut() async {
    await _authService.signOut();
    if (mounted) {
      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = _authService.user;

    if (user == null) {
      return Scaffold(
        appBar: const AppNavBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Please sign in to view your profile'),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () => context.go('/login'),
                child: const Text('Sign In'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: const AppNavBar(),
      body: AnimatedWaveBackground(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 480),
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface.withValues(alpha: 0.95),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Avatar section
                  Center(
                    child: Stack(
                      children: [
                        GestureDetector(
                          onTap: _pickAvatar,
                          child: Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: theme.colorScheme.primary,
                                width: 3,
                              ),
                            ),
                            child: ClipOval(
                              child: _avatarBytes != null
                                  ? Image.memory(
                                      _avatarBytes!,
                                      fit: BoxFit.cover,
                                    )
                                  : _avatarUrl != null
                                  ? Image.network(
                                      _avatarUrl!,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, _, _) =>
                                          _buildInitialsAvatar(
                                            theme,
                                            user.initials,
                                          ),
                                    )
                                  : _buildInitialsAvatar(theme, user.initials),
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: theme.colorScheme.surface,
                                width: 2,
                              ),
                            ),
                            child: Icon(
                              Icons.camera_alt,
                              size: 16,
                              color: theme.colorScheme.onPrimary,
                            ),
                          ),
                        ),
                        if (_isUploadingAvatar)
                          Positioned.fill(
                            child: DecoratedBox(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.black.withValues(alpha: 0.5),
                              ),
                              child: const Center(
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap to change avatar',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  // Header
                  Text(
                    'Edit Profile',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    user.email,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  // Messages
                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.error_outline,
                            color: theme.colorScheme.error,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: TextStyle(
                                color: theme.colorScheme.error,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  if (_successMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primaryContainer,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.check_circle_outline,
                            color: theme.colorScheme.primary,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _successMessage!,
                              style: TextStyle(
                                color: theme.colorScheme.onPrimaryContainer,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Form
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // Name fields
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _firstNameController,
                                textInputAction: TextInputAction.next,
                                textCapitalization: TextCapitalization.words,
                                decoration: InputDecoration(
                                  labelText: 'First Name *',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                validator: (value) {
                                  if (value == null || value.trim().isEmpty) {
                                    return 'Required';
                                  }
                                  if (value.trim().length < 2) {
                                    return 'Too short';
                                  }
                                  return null;
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextFormField(
                                controller: _lastNameController,
                                textInputAction: TextInputAction.next,
                                textCapitalization: TextCapitalization.words,
                                decoration: InputDecoration(
                                  labelText: 'Last Name *',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                validator: (value) {
                                  if (value == null || value.trim().isEmpty) {
                                    return 'Required';
                                  }
                                  if (value.trim().length < 2) {
                                    return 'Too short';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Phone with country code
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CountryCodePicker(
                              selectedCountry: _selectedCountry,
                              onChanged: (country) {
                                setState(() {
                                  _selectedCountry = country;
                                });
                              },
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextFormField(
                                controller: _phoneController,
                                keyboardType: TextInputType.phone,
                                textInputAction: TextInputAction.done,
                                decoration: InputDecoration(
                                  labelText: 'Phone Number',
                                  hintText: 'Optional',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                validator: (value) {
                                  if (value != null && value.isNotEmpty) {
                                    // Only digits allowed
                                    if (!RegExp(r'^\d+$').hasMatch(value)) {
                                      return 'Digits only';
                                    }
                                    if (value.length < 6 || value.length > 15) {
                                      return '6-15 digits';
                                    }
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Save button
                  FilledButton(
                    onPressed: _isLoading ? null : _handleSave,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Text(
                            'Save Changes',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                  const SizedBox(height: 16),

                  // Sign out button
                  OutlinedButton(
                    onPressed: _handleSignOut,
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      foregroundColor: theme.colorScheme.error,
                      side: BorderSide(color: theme.colorScheme.error),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Sign Out',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInitialsAvatar(ThemeData theme, String initials) => ColoredBox(
      color: theme.colorScheme.primaryContainer,
      child: Center(
        child: Text(
          initials,
          style: TextStyle(
            color: theme.colorScheme.onPrimaryContainer,
            fontWeight: FontWeight.bold,
            fontSize: 32,
          ),
        ),
      ),
    );
}
