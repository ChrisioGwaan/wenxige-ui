import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/core/constants/app_constants.dart';
import 'package:wenxige_store/shared/widgets/app_nav_bar.dart';
import 'package:wenxige_store/features/landing/widgets/footer_section.dart';

class ContactPage extends StatefulWidget {
  const ContactPage({super.key});

  @override
  State<ContactPage> createState() => _ContactPageState();
}

class _ContactPageState extends State<ContactPage> {
  static final _emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');

  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _commentController = TextEditingController();

  bool _isSubmitting = false;
  bool _submissionSucceeded = false;
  String? _errorMessage;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
      _submissionSucceeded = false;
    });

    try {
      await Supabase.instance.client.from('contact_messages').insert({
        'first_name': _firstNameController.text.trim(),
        'last_name': _lastNameController.text.trim(),
        'email': _emailController.text.trim(),
        'phone': _normalizedPhone,
        'comment': _commentController.text.trim(),
      });

      _formKey.currentState!.reset();
      _firstNameController.clear();
      _lastNameController.clear();
      _emailController.clear();
      _phoneController.clear();
      _commentController.clear();

      if (!mounted) return;

      setState(() {
        _submissionSucceeded = true;
      });
    } on PostgrestException catch (error) {
      if (!mounted) return;

      setState(() {
        _errorMessage = error.message;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _errorMessage =
            'We could not send your message right now. Please try again in a moment.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  String? get _normalizedPhone {
    final value = _phoneController.text.trim();
    return value.isEmpty ? null : value;
  }

  String? _validateName(String? value, String label) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) {
      return 'Please enter your $label';
    }
    if (text.length > 80) {
      return '$label is too long';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) {
      return 'Please enter your email';
    }
    if (!_emailRegex.hasMatch(text)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  String? _validatePhone(String? value) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) return null;

    final digitsOnlyLength = text.replaceAll(RegExp(r'\D'), '').length;
    if (digitsOnlyLength < 6) {
      return 'Phone number looks too short';
    }
    if (digitsOnlyLength > 20) {
      return 'Phone number looks too long';
    }
    return null;
  }

  String? _validateComment(String? value) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) {
      return 'Please enter your comment';
    }
    if (text.length > 2000) {
      return 'Comment is too long';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: const AppNavBar(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _ContactHero(theme: theme),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppConstants.pageHorizontalPadding,
                32,
                AppConstants.pageHorizontalPadding,
                AppConstants.sectionVerticalPadding,
              ),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxWidth: AppConstants.maxContentWidth,
                  ),
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final useSingleColumn =
                          constraints.maxWidth < AppConstants.tabletBreakpoint;

                      if (useSingleColumn) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _ContactInfoCard(theme: theme),
                            const SizedBox(height: 24),
                            _ContactFormCard(
                              formKey: _formKey,
                              firstNameController: _firstNameController,
                              lastNameController: _lastNameController,
                              emailController: _emailController,
                              phoneController: _phoneController,
                              commentController: _commentController,
                              isSubmitting: _isSubmitting,
                              submissionSucceeded: _submissionSucceeded,
                              errorMessage: _errorMessage,
                              onSubmit: _submit,
                              validateName: _validateName,
                              validateEmail: _validateEmail,
                              validatePhone: _validatePhone,
                              validateComment: _validateComment,
                            ),
                          ],
                        );
                      }

                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: _ContactInfoCard(theme: theme),
                          ),
                          const SizedBox(width: 32),
                          Expanded(
                            flex: 2,
                            child: _ContactFormCard(
                              formKey: _formKey,
                              firstNameController: _firstNameController,
                              lastNameController: _lastNameController,
                              emailController: _emailController,
                              phoneController: _phoneController,
                              commentController: _commentController,
                              isSubmitting: _isSubmitting,
                              submissionSucceeded: _submissionSucceeded,
                              errorMessage: _errorMessage,
                              onSubmit: _submit,
                              validateName: _validateName,
                              validateEmail: _validateEmail,
                              validatePhone: _validatePhone,
                              validateComment: _validateComment,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),
            ),
            const FooterSection(),
          ],
        ),
      ),
    );
  }
}

class _ContactHero extends StatelessWidget {

  const _ContactHero({required this.theme});
  final ThemeData theme;

  @override
  Widget build(BuildContext context) => Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        AppConstants.pageHorizontalPadding,
        48,
        AppConstants.pageHorizontalPadding,
        56,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF0D0221),
            theme.colorScheme.primary,
            const Color(0xFF28104E),
          ],
        ),
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            maxWidth: AppConstants.maxContentWidth,
          ),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final compact =
                  constraints.maxWidth < AppConstants.tabletBreakpoint;

              if (compact) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _HeroCopy(theme: theme),
                    const SizedBox(height: 24),
                    _HeroHighlight(theme: theme),
                  ],
                );
              }

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: _HeroCopy(theme: theme)),
                  const SizedBox(width: 32),
                  Expanded(child: _HeroHighlight(theme: theme)),
                ],
              );
            },
          ),
        ),
      ),
    );
}

class _HeroCopy extends StatelessWidget {

  const _HeroCopy({required this.theme});
  final ThemeData theme;

  @override
  Widget build(BuildContext context) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
          ),
          child: const Text(
            'Contact Wenxige',
            style: TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.3,
            ),
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'Questions about tea, teaware, or your order.',
          style: TextStyle(
            color: Colors.white,
            fontSize: 42,
            fontWeight: FontWeight.w700,
            height: 1.12,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'From traditional Chinese tea selections to teapot recommendations and thoughtful gifting, our team is here to help you choose with confidence.',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.82),
            fontSize: 16,
            height: 1.7,
          ),
        ),
      ],
    );
}

class _HeroHighlight extends StatelessWidget {

  const _HeroHighlight({required this.theme});
  final ThemeData theme;

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.mark_email_unread_outlined,
            color: theme.colorScheme.secondaryContainer,
            size: 36,
          ),
          const SizedBox(height: 18),
          const Text(
            'What happens next',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 14),
          _HeroBullet(
            text: 'Ask about loose-leaf teas, brewing guidance, and teaware.',
          ),
          const SizedBox(height: 10),
          _HeroBullet(
            text: 'Phone is optional if you prefer to be contacted by email only.',
          ),
          const SizedBox(height: 10),
          _HeroBullet(
            text: 'Your message is securely saved in Supabase for our team to review.',
          ),
        ],
      ),
    );
}

class _HeroBullet extends StatelessWidget {

  const _HeroBullet({required this.text});
  final String text;

  @override
  Widget build(BuildContext context) => Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 8,
          height: 8,
          margin: const EdgeInsets.only(top: 7),
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.82),
              fontSize: 14,
              height: 1.6,
            ),
          ),
        ),
      ],
    );
}

class _ContactInfoCard extends StatelessWidget {

  const _ContactInfoCard({required this.theme});
  final ThemeData theme;

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F5FF),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: theme.colorScheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Before you send',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Reach out for tea recommendations, teapot care, gifting questions, order updates, or help choosing the right piece for your tea ritual.',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
              height: 1.7,
            ),
          ),
          const SizedBox(height: 24),
          const _InfoTile(
            icon: Icons.schedule_outlined,
            title: 'Warm Support',
            description: 'We aim to reply thoughtfully and help you find the right tea or teaware for your needs.',
          ),
          const SizedBox(height: 16),
          const _InfoTile(
            icon: Icons.local_cafe_outlined,
            title: 'Tea & Teaware Guidance',
            description: 'Tell us what you enjoy drinking or serving, and we can guide you toward suitable teas, teapots, and accessories.',
          ),
          const SizedBox(height: 16),
          const _InfoTile(
            icon: Icons.privacy_tip_outlined,
            title: 'Securely Saved',
            description: 'Your message is securely saved in Supabase so our team can follow up with care.',
          ),
        ],
      ),
    );
}

class _InfoTile extends StatelessWidget {

  const _InfoTile({
    required this.icon,
    required this.title,
    required this.description,
  });
  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(14),
          ),
          alignment: Alignment.center,
          child: Icon(icon, color: theme.colorScheme.primary),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                  height: 1.6,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ContactFormCard extends StatelessWidget {

  const _ContactFormCard({
    required this.formKey,
    required this.firstNameController,
    required this.lastNameController,
    required this.emailController,
    required this.phoneController,
    required this.commentController,
    required this.isSubmitting,
    required this.submissionSucceeded,
    required this.errorMessage,
    required this.onSubmit,
    required this.validateName,
    required this.validateEmail,
    required this.validatePhone,
    required this.validateComment,
  });
  final GlobalKey<FormState> formKey;
  final TextEditingController firstNameController;
  final TextEditingController lastNameController;
  final TextEditingController emailController;
  final TextEditingController phoneController;
  final TextEditingController commentController;
  final bool isSubmitting;
  final bool submissionSucceeded;
  final String? errorMessage;
  final VoidCallback onSubmit;
  final String? Function(String?, String) validateName;
  final String? Function(String?) validateEmail;
  final String? Function(String?) validatePhone;
  final String? Function(String?) validateComment;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (submissionSucceeded) {
      return Container(
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 32,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: const Color(0xFFE7F8EE),
                borderRadius: BorderRadius.circular(20),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.check_circle_outline,
                color: Color(0xFF0B6B3A),
                size: 34,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Message sent',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Thank you for reaching out to Wenxige. Your message has been sent successfully, and our team will get back to you soon.',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
                height: 1.7,
              ),
            ),
            const SizedBox(height: 24),
            const _StatusBanner(
              icon: Icons.verified_user_outlined,
              backgroundColor: Color(0xFFE7F8EE),
              foregroundColor: Color(0xFF0B6B3A),
              message:
                  'Your details have been securely saved in Supabase.',
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => context.go('/'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 18),
                ),
                child: const Text(
                  'Return Home',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 32,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Form(
        key: formKey,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Send us a message',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Share a few details below and let us know how Wenxige can help.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 24),
            if (errorMessage != null) ...[
              _StatusBanner(
                icon: Icons.error_outline,
                backgroundColor: theme.colorScheme.errorContainer,
                foregroundColor: theme.colorScheme.error,
                message: errorMessage!,
              ),
              const SizedBox(height: 16),
            ],
            LayoutBuilder(
              builder: (context, constraints) {
                final stackFields = constraints.maxWidth < 640;

                if (stackFields) {
                  return Column(
                    children: [
                      _ContactTextField(
                        controller: firstNameController,
                        label: 'First Name *',
                        textInputAction: TextInputAction.next,
                        textCapitalization: TextCapitalization.words,
                        validator: (value) => validateName(value, 'first name'),
                      ),
                      const SizedBox(height: 16),
                      _ContactTextField(
                        controller: lastNameController,
                        label: 'Last Name *',
                        textInputAction: TextInputAction.next,
                        textCapitalization: TextCapitalization.words,
                        validator: (value) => validateName(value, 'last name'),
                      ),
                    ],
                  );
                }

                return Row(
                  children: [
                    Expanded(
                      child: _ContactTextField(
                        controller: firstNameController,
                        label: 'First Name *',
                        textInputAction: TextInputAction.next,
                        textCapitalization: TextCapitalization.words,
                        validator: (value) =>
                            validateName(value, 'first name'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _ContactTextField(
                        controller: lastNameController,
                        label: 'Last Name *',
                        textInputAction: TextInputAction.next,
                        textCapitalization: TextCapitalization.words,
                        validator: (value) => validateName(value, 'last name'),
                      ),
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 16),
            _ContactTextField(
              controller: emailController,
              label: 'Email *',
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              prefixIcon: const Icon(Icons.email_outlined),
              validator: validateEmail,
            ),
            const SizedBox(height: 16),
            _ContactTextField(
              controller: phoneController,
              label: 'Phone',
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
              prefixIcon: const Icon(Icons.phone_outlined),
              hintText: 'Optional',
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[0-9+\-\s()]')),
                LengthLimitingTextInputFormatter(24),
              ],
              validator: validatePhone,
            ),
            const SizedBox(height: 16),
            _ContactTextField(
              controller: commentController,
              label: 'Comment *',
              hintText: 'Tell us how we can help',
              textInputAction: TextInputAction.newline,
              maxLines: 7,
              minLines: 5,
              validator: validateComment,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: isSubmitting ? null : onSubmit,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 18),
                ),
                child: isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        'Send',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ContactTextField extends StatelessWidget {

  const _ContactTextField({
    required this.controller,
    required this.label,
    this.hintText,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.prefixIcon,
    this.maxLines = 1,
    this.minLines,
    this.inputFormatters,
    this.validator,
  });
  final TextEditingController controller;
  final String label;
  final String? hintText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final TextCapitalization textCapitalization;
  final Widget? prefixIcon;
  final int? maxLines;
  final int? minLines;
  final List<TextInputFormatter>? inputFormatters;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) => TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      textCapitalization: textCapitalization,
      maxLines: maxLines,
      minLines: minLines,
      inputFormatters: inputFormatters,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        prefixIcon: prefixIcon,
        alignLabelWithHint: maxLines != 1,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.outlineVariant,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 18,
          vertical: 18,
        ),
      ),
    );
}

class _StatusBanner extends StatelessWidget {

  const _StatusBanner({
    required this.icon,
    required this.backgroundColor,
    required this.foregroundColor,
    required this.message,
  });
  final IconData icon;
  final Color backgroundColor;
  final Color foregroundColor;
  final String message;

  @override
  Widget build(BuildContext context) => Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(icon, color: foregroundColor, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                color: foregroundColor,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
}
