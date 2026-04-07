import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:wenxige_store/shared/models/cart_model.dart';
import 'package:wenxige_store/shared/models/order_model.dart';
import 'package:wenxige_store/shared/models/user_profile_model.dart';
import 'package:wenxige_store/shared/services/cart_service.dart';
import 'package:wenxige_store/shared/services/order_service.dart';
import 'package:wenxige_store/shared/services/user_profile_service.dart';
import 'package:wenxige_store/shared/widgets/app_scaffold.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final CartService _cartService = CartService();
  final UserProfileService _profileService = UserProfileService();
  final OrderService _orderService = OrderService();

  final _formKey = GlobalKey<FormState>();

  // Form controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  // Shipping address
  final _shippingStreetController = TextEditingController();
  final _shippingCityController = TextEditingController();
  final _shippingStateController = TextEditingController();
  final _shippingPostalCodeController = TextEditingController();
  String _shippingCountry = 'China';

  // Billing address
  bool _billingSameAsShipping = true;
  final _billingStreetController = TextEditingController();
  final _billingCityController = TextEditingController();
  final _billingStateController = TextEditingController();
  final _billingPostalCodeController = TextEditingController();
  String _billingCountry = 'China';

  final _notesController = TextEditingController();

  PaymentMethod _selectedPaymentMethod = PaymentMethod.stripe;

  bool _isLoading = true;
  bool _isProcessing = false;
  bool _isGuest = true;
  int _currentStep = 0;

  @override
  void initState() {
    super.initState();
    _initCheckout();
  }

  Future<void> _initCheckout() async {
    await _cartService.init();

    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      _isGuest = false;
      await _loadUserProfile();
    }

    setState(() => _isLoading = false);
  }

  Future<void> _loadUserProfile() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      // Get data from user metadata
      final metadata = user.userMetadata;
      _firstNameController.text = (metadata?['first_name'] as String?) ?? '';
      _lastNameController.text = (metadata?['last_name'] as String?) ?? '';
      _emailController.text = user.email ?? '';
      _phoneController.text = (metadata?['phone'] as String?) ?? '';

      // Get extended profile (addresses)
      final profile = await _profileService.getProfile();
      if (profile != null && profile.shippingAddress != null) {
        _shippingStreetController.text = profile.shippingAddress!.street ?? '';
        _shippingCityController.text = profile.shippingAddress!.city ?? '';
        _shippingStateController.text = profile.shippingAddress!.state ?? '';
        _shippingPostalCodeController.text =
            profile.shippingAddress!.postalCode ?? '';
        _shippingCountry = profile.shippingAddress!.country;
      }
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _shippingStreetController.dispose();
    _shippingCityController.dispose();
    _shippingStateController.dispose();
    _shippingPostalCodeController.dispose();
    _billingStreetController.dispose();
    _billingCityController.dispose();
    _billingStateController.dispose();
    _billingPostalCodeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cart = _cartService.cart;

    if (_isLoading) {
      return const AppScaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (cart.isEmpty) {
      return AppScaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.shopping_cart_outlined,
                size: 80,
                color: theme.colorScheme.outline,
              ),
              const SizedBox(height: 16),
              Text('Your cart is empty', style: theme.textTheme.titleLarge),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: () => context.go('/shop'),
                child: const Text('Go to Shop'),
              ),
            ],
          ),
        ),
      );
    }

    return AppScaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth > 1000;

          if (isWide) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(flex: 2, child: _buildCheckoutForm(theme)),
                const SizedBox(width: 32),
                SizedBox(
                  width: 400,
                  child: _buildOrderSummaryCard(theme, cart),
                ),
              ],
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildCheckoutSteps(theme),
                const SizedBox(height: 24),
                _buildOrderSummaryCard(theme, cart),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildCheckoutForm(ThemeData theme) => SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Checkout',
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          _buildCheckoutSteps(theme),
        ],
      ),
    );

  Widget _buildCheckoutSteps(ThemeData theme) => Form(
      key: _formKey,
      child: Stepper(
        currentStep: _currentStep,
        onStepContinue: _onStepContinue,
        onStepCancel: _onStepCancel,
        onStepTapped: (step) => setState(() => _currentStep = step),
        controlsBuilder: (context, details) {
          return Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Row(
              children: [
                if (_currentStep < 2)
                  FilledButton(
                    onPressed: details.onStepContinue,
                    child: const Text('Continue'),
                  )
                else
                  FilledButton(
                    onPressed: _isProcessing ? null : _processOrder,
                    child: _isProcessing
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Place Order'),
                  ),
                const SizedBox(width: 12),
                if (_currentStep > 0)
                  OutlinedButton(
                    onPressed: details.onStepCancel,
                    child: const Text('Back'),
                  ),
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text('Contact & Shipping'),
            subtitle: _currentStep > 0
                ? Text(
                    '${_firstNameController.text} ${_lastNameController.text}',
                  )
                : null,
            isActive: _currentStep >= 0,
            state: _currentStep > 0 ? StepState.complete : StepState.indexed,
            content: _buildContactAndShippingStep(theme),
          ),
          Step(
            title: const Text('Billing Address'),
            subtitle: _currentStep > 1
                ? Text(
                    _billingSameAsShipping
                        ? 'Same as shipping'
                        : 'Different address',
                  )
                : null,
            isActive: _currentStep >= 1,
            state: _currentStep > 1 ? StepState.complete : StepState.indexed,
            content: _buildBillingStep(theme),
          ),
          Step(
            title: const Text('Payment'),
            isActive: _currentStep >= 2,
            state: _currentStep > 2 ? StepState.complete : StepState.indexed,
            content: _buildPaymentStep(theme),
          ),
        ],
      ),
    );

  Widget _buildContactAndShippingStep(ThemeData theme) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_isGuest) ...[
          Card(
            color: theme.colorScheme.primaryContainer,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: theme.colorScheme.onPrimaryContainer,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Sign in for a faster checkout experience',
                      style: TextStyle(
                        color: theme.colorScheme.onPrimaryContainer,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.go('/login'),
                    child: const Text('Sign In'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],

        Text('Contact Information', style: theme.textTheme.titleMedium),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _firstNameController,
                decoration: const InputDecoration(
                  labelText: 'First Name *',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _lastNameController,
                decoration: const InputDecoration(
                  labelText: 'Last Name *',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email *',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (v) {
            if (v?.isEmpty ?? true) return 'Required';
            if (!v!.contains('@')) return 'Invalid email';
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _phoneController,
          decoration: const InputDecoration(
            labelText: 'Phone',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.phone,
        ),

        const SizedBox(height: 24),
        Text('Shipping Address', style: theme.textTheme.titleMedium),
        const SizedBox(height: 12),
        TextFormField(
          controller: _shippingStreetController,
          decoration: const InputDecoration(
            labelText: 'Street Address *',
            border: OutlineInputBorder(),
          ),
          validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _shippingCityController,
                decoration: const InputDecoration(
                  labelText: 'City *',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _shippingStateController,
                decoration: const InputDecoration(
                  labelText: 'State/Province',
                  border: OutlineInputBorder(),
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
                controller: _shippingPostalCodeController,
                decoration: const InputDecoration(
                  labelText: 'Postal Code *',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: DropdownButtonFormField<String>(
                value: _shippingCountry,
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Country *',
                  border: OutlineInputBorder(),
                ),
                items: ShippingCountries.countries.map((c) {
                  return DropdownMenuItem(
                    value: c,
                    child: Text(c, overflow: TextOverflow.ellipsis),
                  );
                }).toList(),
                onChanged: (v) =>
                    setState(() => _shippingCountry = v ?? 'China'),
              ),
            ),
          ],
        ),
      ],
    );

  Widget _buildBillingStep(ThemeData theme) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CheckboxListTile(
          value: _billingSameAsShipping,
          onChanged: (v) => setState(() => _billingSameAsShipping = v ?? true),
          title: const Text('Billing address same as shipping'),
          controlAffinity: ListTileControlAffinity.leading,
          contentPadding: EdgeInsets.zero,
        ),

        if (!_billingSameAsShipping) ...[
          const SizedBox(height: 16),
          TextFormField(
            controller: _billingStreetController,
            decoration: const InputDecoration(
              labelText: 'Street Address *',
              border: OutlineInputBorder(),
            ),
            validator: (v) => !_billingSameAsShipping && (v?.isEmpty ?? true)
                ? 'Required'
                : null,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _billingCityController,
                  decoration: const InputDecoration(
                    labelText: 'City *',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      !_billingSameAsShipping && (v?.isEmpty ?? true)
                      ? 'Required'
                      : null,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  controller: _billingStateController,
                  decoration: const InputDecoration(
                    labelText: 'State/Province',
                    border: OutlineInputBorder(),
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
                  controller: _billingPostalCodeController,
                  decoration: const InputDecoration(
                    labelText: 'Postal Code *',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      !_billingSameAsShipping && (v?.isEmpty ?? true)
                      ? 'Required'
                      : null,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _billingCountry,
                  isExpanded: true,
                  decoration: const InputDecoration(
                    labelText: 'Country *',
                    border: OutlineInputBorder(),
                  ),
                  items: ShippingCountries.countries.map((c) {
                    return DropdownMenuItem(
                      value: c,
                      child: Text(c, overflow: TextOverflow.ellipsis),
                    );
                  }).toList(),
                  onChanged: (v) =>
                      setState(() => _billingCountry = v ?? 'China'),
                ),
              ),
            ],
          ),
        ],
      ],
    );

  Widget _buildPaymentStep(ThemeData theme) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Select Payment Method', style: theme.textTheme.titleMedium),
        const SizedBox(height: 16),

        _buildPaymentOption(
          theme,
          PaymentMethod.stripe,
          'Credit/Debit Card',
          'Pay securely with Stripe',
          Icons.credit_card,
        ),
        const SizedBox(height: 12),
        _buildPaymentOption(
          theme,
          PaymentMethod.paypal,
          'PayPal',
          'Pay with your PayPal account',
          Icons.account_balance_wallet,
        ),
        const SizedBox(height: 12),
        _buildPaymentOption(
          theme,
          PaymentMethod.bankTransfer,
          'Bank Transfer',
          'Direct bank transfer',
          Icons.account_balance,
        ),

        const SizedBox(height: 24),
        TextFormField(
          controller: _notesController,
          decoration: const InputDecoration(
            labelText: 'Order Notes (Optional)',
            hintText: 'Special instructions for your order',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
      ],
    );

  Widget _buildPaymentOption(
    ThemeData theme,
    PaymentMethod method,
    String title,
    String subtitle,
    IconData icon,
  ) {
    final isSelected = _selectedPaymentMethod == method;

    return InkWell(
      onTap: () => setState(() => _selectedPaymentMethod = method),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected
                ? theme.colorScheme.primary
                : theme.colorScheme.outline.withValues(alpha: 0.3),
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isSelected
              ? theme.colorScheme.primaryContainer.withValues(alpha: 0.3)
              : null,
        ),
        child: Row(
          children: [
            Radio<PaymentMethod>(
              value: method,
              groupValue: _selectedPaymentMethod,
              onChanged: (v) => setState(() => _selectedPaymentMethod = v!),
            ),
            Icon(icon, color: isSelected ? theme.colorScheme.primary : null),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummaryCard(ThemeData theme, Cart cart) => Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Order Summary',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Divider(),
            ...cart.items.map((item) => _buildOrderItem(theme, item)),
            const Divider(),
            const SizedBox(height: 8),
            _buildSummaryRow(
              theme,
              'Subtotal',
              '¥${cart.subtotal.toStringAsFixed(2)}',
            ),
            const SizedBox(height: 8),
            _buildSummaryRow(theme, 'Shipping', 'Free'),
            const SizedBox(height: 8),
            _buildSummaryRow(theme, 'Tax', '¥0.00'),
            const Divider(height: 24),
            _buildSummaryRow(
              theme,
              'Total',
              '¥${cart.subtotal.toStringAsFixed(2)}',
              isTotal: true,
            ),
          ],
        ),
      ),
    );

  Widget _buildOrderItem(ThemeData theme, CartItem item) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              width: 50,
              height: 50,
              color: theme.colorScheme.surfaceContainerHighest,
              child: item.productImageUrl != null
                  ? Image.network(item.productImageUrl!, fit: BoxFit.cover)
                  : Icon(
                      Icons.inventory_2_outlined,
                      color: theme.colorScheme.outline,
                    ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: theme.textTheme.bodyMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  'Qty: ${item.quantity}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '¥${item.totalPrice.toStringAsFixed(2)}',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );

  Widget _buildSummaryRow(
    ThemeData theme,
    String label,
    String value, {
    bool isTotal = false,
  }) => Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: isTotal
              ? theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                )
              : theme.textTheme.bodyLarge,
        ),
        Text(
          value,
          style: isTotal
              ? theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                )
              : theme.textTheme.bodyLarge,
        ),
      ],
    );

  void _onStepContinue() {
    if (_currentStep == 0) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _currentStep++);
      }
    } else if (_currentStep < 2) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _currentStep++);
      }
    }
  }

  void _onStepCancel() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  Future<void> _processOrder() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    setState(() => _isProcessing = true);

    final order = await _orderService.createOrder(
      cart: _cartService.cart,
      firstName: _firstNameController.text,
      lastName: _lastNameController.text,
      email: _emailController.text,
      phone: _phoneController.text.isNotEmpty ? _phoneController.text : null,
      shippingStreet: _shippingStreetController.text,
      shippingCity: _shippingCityController.text,
      shippingState: _shippingStateController.text.isNotEmpty
          ? _shippingStateController.text
          : null,
      shippingPostalCode: _shippingPostalCodeController.text,
      shippingCountry: _shippingCountry,
      billingSameAsShipping: _billingSameAsShipping,
      billingStreet: _billingSameAsShipping
          ? null
          : _billingStreetController.text,
      billingCity: _billingSameAsShipping ? null : _billingCityController.text,
      billingState: _billingSameAsShipping
          ? null
          : _billingStateController.text,
      billingPostalCode: _billingSameAsShipping
          ? null
          : _billingPostalCodeController.text,
      billingCountry: _billingSameAsShipping ? null : _billingCountry,
      paymentMethod: _selectedPaymentMethod,
      customerNotes: _notesController.text.isNotEmpty
          ? _notesController.text
          : null,
    );

    if (order == null) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to create order. Please try again.'),
          ),
        );
      }
      return;
    }

    // Process fake payment
    final paymentSuccess = await _orderService.processPayment(
      orderId: order.id!,
      paymentMethod: _selectedPaymentMethod,
    );

    if (paymentSuccess) {
      await _cartService.clearCart();
      if (mounted) {
        context.go('/order-confirmation/${order.orderNumber}');
      }
    } else {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Payment failed. Please try again.')),
        );
      }
    }
  }
}
