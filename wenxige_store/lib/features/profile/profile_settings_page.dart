import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/models/user_profile_model.dart';
import 'package:wenxige_store/shared/providers/auth_service.dart';
import 'package:wenxige_store/shared/services/user_profile_service.dart';
import 'package:wenxige_store/shared/widgets/animated_gradient_background.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';
import 'package:wenxige_store/shared/widgets/country_code_picker.dart';

class ProfileSettingsPage extends StatefulWidget {
  const ProfileSettingsPage({super.key});

  @override
  State<ProfileSettingsPage> createState() => _ProfileSettingsPageState();
}

class _ProfileSettingsPageState extends State<ProfileSettingsPage> {
  final _formKey = GlobalKey<FormState>();
  final _authService = AuthService();
  final _profileService = UserProfileService();

  // User metadata controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();

  // Profile controllers
  final _billingStreetController = TextEditingController();
  final _billingCityController = TextEditingController();
  final _billingStateController = TextEditingController();
  final _billingPostalController = TextEditingController();

  final _shippingStreetController = TextEditingController();
  final _shippingCityController = TextEditingController();
  final _shippingStateController = TextEditingController();
  final _shippingPostalController = TextEditingController();

  bool _isLoading = false;
  bool _isUploadingAvatar = false;
  String? _errorMessage;
  String? _successMessage;
  Country _selectedCountry = Country.findByCode('CN'); // Default to China
  String? _avatarUrl;
  Uint8List? _avatarBytes;

  // Profile fields
  String? _selectedGender;
  String _selectedBillingCountry = 'China';
  String _selectedShippingCountry = 'China';
  bool _useBillingAsShipping = true;

  final List<String> _genderOptions = [
    'Male',
    'Female',
    'Other',
    'Prefer not to say',
  ];

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) return;

    // Load basic user metadata
    final metadata = user.userMetadata ?? {};
    final displayName = metadata['display_name'] as String? ?? '';
    final phone = metadata['phone'] as String? ?? '';
    _avatarUrl = metadata['avatar_url'] as String?;

    // Parse display name
    final nameParts = displayName.split(' ');
    if (nameParts.isNotEmpty) {
      _firstNameController.text = nameParts.first;
      if (nameParts.length > 1) {
        _lastNameController.text = nameParts.sublist(1).join(' ');
      }
    }

    // Parse phone
    if (phone.isNotEmpty) {
      for (final country in Country.all) {
        if (phone.startsWith(country.dialCode)) {
          _selectedCountry = country;
          _phoneController.text = phone
              .substring(country.dialCode.length)
              .trim();
          break;
        }
      }
      if (_phoneController.text.isEmpty && phone.isNotEmpty) {
        _phoneController.text = phone;
      }
    }

    // Load extended profile data
    final profile = await _profileService.loadProfile(user.id);
    if (profile != null && mounted) {
      setState(() {
        _selectedGender = profile.gender;
        _useBillingAsShipping = profile.useBillingAsShipping;

        // Billing address
        if (profile.billingAddress != null) {
          _billingStreetController.text = profile.billingAddress!.street ?? '';
          _billingCityController.text = profile.billingAddress!.city ?? '';
          _billingStateController.text = profile.billingAddress!.state ?? '';
          _billingPostalController.text =
              profile.billingAddress!.postalCode ?? '';
          _selectedBillingCountry = profile.billingAddress!.country;
        }

        // Shipping address
        if (profile.shippingAddress != null && !_useBillingAsShipping) {
          _shippingStreetController.text =
              profile.shippingAddress!.street ?? '';
          _shippingCityController.text = profile.shippingAddress!.city ?? '';
          _shippingStateController.text = profile.shippingAddress!.state ?? '';
          _shippingPostalController.text =
              profile.shippingAddress!.postalCode ?? '';
          _selectedShippingCountry = profile.shippingAddress!.country;
        }
      });
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _billingStreetController.dispose();
    _billingCityController.dispose();
    _billingStateController.dispose();
    _billingPostalController.dispose();
    _shippingStreetController.dispose();
    _shippingCityController.dispose();
    _shippingStateController.dispose();
    _shippingPostalController.dispose();
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
      final user = Supabase.instance.client.auth.currentUser;
      if (user == null) throw Exception('Not authenticated');

      // Upload avatar if changed
      var avatarUrl = _avatarUrl;
      if (_avatarBytes != null) {
        avatarUrl = await _uploadAvatar();
        if (avatarUrl == null && _avatarBytes != null) {
          return;
        }
      }

      // Update auth metadata
      final firstName = _firstNameController.text.trim();
      final lastName = _lastNameController.text.trim();
      final displayName = '$firstName $lastName'.trim();

      String? phone;
      if (_phoneController.text.trim().isNotEmpty) {
        phone = '${_selectedCountry.dialCode}${_phoneController.text.trim()}';
      }

      await Supabase.instance.client.auth.updateUser(
        UserAttributes(
          data: {
            'display_name': displayName,
            'phone': ?phone,
            'avatar_url': ?avatarUrl,
          },
        ),
      );

      // Save extended profile
      Address? billingAddress;
      if (_billingStreetController.text.trim().isNotEmpty) {
        billingAddress = Address(
          street: _billingStreetController.text.trim(),
          city: _billingCityController.text.trim(),
          state: _billingStateController.text.trim(),
          postalCode: _billingPostalController.text.trim(),
          country: _selectedBillingCountry,
        );
      }

      Address? shippingAddress;
      if (!_useBillingAsShipping &&
          _shippingStreetController.text.trim().isNotEmpty) {
        shippingAddress = Address(
          street: _shippingStreetController.text.trim(),
          city: _shippingCityController.text.trim(),
          state: _shippingStateController.text.trim(),
          postalCode: _shippingPostalController.text.trim(),
          country: _selectedShippingCountry,
        );
      }

      final profile = UserProfile(
        userId: user.id,
        gender: _selectedGender,
        billingAddress: billingAddress,
        shippingAddress: shippingAddress,
        useBillingAsShipping: _useBillingAsShipping,
      );

      await _profileService.saveProfile(profile);
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
              constraints: const BoxConstraints(maxWidth: 600),
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
                    'Profile Settings',
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
                    _buildMessageCard(
                      theme,
                      _errorMessage!,
                      Icons.error_outline,
                      theme.colorScheme.errorContainer,
                      theme.colorScheme.error,
                    ),
                    const SizedBox(height: 16),
                  ],

                  if (_successMessage != null) ...[
                    _buildMessageCard(
                      theme,
                      _successMessage!,
                      Icons.check_circle_outline,
                      theme.colorScheme.primaryContainer,
                      theme.colorScheme.primary,
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Form
                  Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Personal Information Section
                        _buildSectionTitle(theme, 'Personal Information'),
                        const SizedBox(height: 16),

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

                        // Gender dropdown
                        DropdownButtonFormField<String>(
                          initialValue: _selectedGender,
                          decoration: InputDecoration(
                            labelText: 'Gender (Optional)',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          items: _genderOptions
                              .map(
                                (gender) => DropdownMenuItem(
                                  value: gender,
                                  child: Text(gender),
                                ),
                              )
                              .toList(),
                          onChanged: (value) {
                            setState(() {
                              _selectedGender = value;
                            });
                          },
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
                                textInputAction: TextInputAction.next,
                                decoration: InputDecoration(
                                  labelText: 'Phone Number',
                                  hintText: 'Optional',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                validator: (value) {
                                  if (value != null && value.isNotEmpty) {
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
                        const SizedBox(height: 32),

                        // Billing Address Section
                        _buildSectionTitle(theme, 'Billing Address'),
                        const SizedBox(height: 16),
                        _buildAddressFields(
                          streetController: _billingStreetController,
                          cityController: _billingCityController,
                          stateController: _billingStateController,
                          postalController: _billingPostalController,
                          selectedCountry: _selectedBillingCountry,
                          onCountryChanged: (country) {
                            setState(() {
                              _selectedBillingCountry = country;
                            });
                          },
                        ),
                        const SizedBox(height: 16),

                        // Checkbox for same as billing
                        CheckboxListTile(
                          value: _useBillingAsShipping,
                          onChanged: (value) {
                            setState(() {
                              _useBillingAsShipping = value ?? true;
                            });
                          },
                          title: const Text(
                            'Shipping address is same as billing address',
                          ),
                          contentPadding: EdgeInsets.zero,
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                        const SizedBox(height: 16),

                        // Shipping Address Section (conditionally shown)
                        if (!_useBillingAsShipping) ...[
                          _buildSectionTitle(theme, 'Shipping Address'),
                          const SizedBox(height: 16),
                          _buildAddressFields(
                            streetController: _shippingStreetController,
                            cityController: _shippingCityController,
                            stateController: _shippingStateController,
                            postalController: _shippingPostalController,
                            selectedCountry: _selectedShippingCountry,
                            onCountryChanged: (country) {
                              setState(() {
                                _selectedShippingCountry = country;
                              });
                            },
                          ),
                          const SizedBox(height: 16),
                        ],
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

  Widget _buildSectionTitle(ThemeData theme, String title) => Text(
    title,
    style: theme.textTheme.titleMedium?.copyWith(
      fontWeight: FontWeight.bold,
      color: theme.colorScheme.primary,
    ),
  );

  Widget _buildMessageCard(
    ThemeData theme,
    String message,
    IconData icon,
    Color backgroundColor,
    Color iconColor,
  ) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(
      children: [
        Icon(icon, color: iconColor, size: 20),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            message,
            style: TextStyle(color: iconColor, fontSize: 14),
          ),
        ),
      ],
    ),
  );

  Widget _buildAddressFields({
    required TextEditingController streetController,
    required TextEditingController cityController,
    required TextEditingController stateController,
    required TextEditingController postalController,
    required String selectedCountry,
    required Function(String) onCountryChanged,
  }) => Column(
    children: [
      TextFormField(
        controller: streetController,
        textInputAction: TextInputAction.next,
        textCapitalization: TextCapitalization.words,
        decoration: InputDecoration(
          labelText: 'Street Address',
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      const SizedBox(height: 16),
      Row(
        children: [
          Expanded(
            flex: 2,
            child: TextFormField(
              controller: cityController,
              textInputAction: TextInputAction.next,
              textCapitalization: TextCapitalization.words,
              decoration: InputDecoration(
                labelText: 'City',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextFormField(
              controller: stateController,
              textInputAction: TextInputAction.next,
              textCapitalization: TextCapitalization.words,
              decoration: InputDecoration(
                labelText: 'State/Province',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
      const SizedBox(height: 16),
      Row(
        children: [
          Expanded(
            child: TextFormField(
              controller: postalController,
              textInputAction: TextInputAction.next,
              decoration: InputDecoration(
                labelText: 'Postal Code',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            flex: 2,
            child: DropdownButtonFormField<String>(
              initialValue: selectedCountry,
              decoration: InputDecoration(
                labelText: 'Country',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              items: ShippingCountries.countries.map((country) => DropdownMenuItem(value: country, child: Text(country))).toList(),
              onChanged: (value) {
                if (value != null) {
                  onCountryChanged(value);
                }
              },
            ),
          ),
        ],
      ),
    ],
  );

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
