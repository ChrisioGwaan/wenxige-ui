import 'package:flutter/material.dart';

/// Country data with dial code and flag emoji
class Country {

  const Country({
    required this.name,
    required this.code,
    required this.dialCode,
    required this.flag,
  });
  final String name;
  final String code;
  final String dialCode;
  final String flag;

  String get displayText => '$flag $dialCode';

  static const List<Country> all = [
    Country(name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺'),
    Country(name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹'),
    Country(name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪'),
    Country(name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷'),
    Country(name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦'),
    Country(name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳'),
    Country(name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰'),
    Country(name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮'),
    Country(name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷'),
    Country(name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪'),
    Country(name: 'Hong Kong', code: 'HK', dialCode: '+852', flag: '🇭🇰'),
    Country(name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳'),
    Country(name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩'),
    Country(name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪'),
    Country(name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹'),
    Country(name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵'),
    Country(name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷'),
    Country(name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾'),
    Country(name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽'),
    Country(name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱'),
    Country(name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿'),
    Country(name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴'),
    Country(name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭'),
    Country(name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱'),
    Country(name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹'),
    Country(name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺'),
    Country(name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬'),
    Country(name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦'),
    Country(name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸'),
    Country(name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪'),
    Country(name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭'),
    Country(name: 'Taiwan', code: 'TW', dialCode: '+886', flag: '🇹🇼'),
    Country(name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭'),
    Country(
      name: 'United Arab Emirates',
      code: 'AE',
      dialCode: '+971',
      flag: '🇦🇪',
    ),
    Country(name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧'),
    Country(name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸'),
    Country(name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳'),
  ];

  static Country findByCode(String code) => all.firstWhere(
      (c) => c.code == code,
      orElse: () => all.firstWhere((c) => c.code == 'AU'),
    );
}

/// A dropdown picker for country codes
class CountryCodePicker extends StatelessWidget {

  const CountryCodePicker({
    required this.selectedCountry,
    required this.onChanged,
    super.key,
  });
  final Country selectedCountry;
  final ValueChanged<Country> onChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: () => _showCountryPicker(context),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 56, // Match TextFormField default height
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          border: Border.all(color: theme.colorScheme.outline),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(selectedCountry.flag, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 6),
            Text(
              selectedCountry.dialCode,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(width: 2),
            Icon(
              Icons.arrow_drop_down,
              color: theme.colorScheme.onSurfaceVariant,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  void _showCountryPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => _CountryPickerSheet(
        selectedCountry: selectedCountry,
        onSelected: (country) {
          onChanged(country);
          Navigator.pop(context);
        },
      ),
    );
  }
}

class _CountryPickerSheet extends StatefulWidget {

  const _CountryPickerSheet({
    required this.selectedCountry,
    required this.onSelected,
  });
  final Country selectedCountry;
  final ValueChanged<Country> onSelected;

  @override
  State<_CountryPickerSheet> createState() => _CountryPickerSheetState();
}

class _CountryPickerSheetState extends State<_CountryPickerSheet> {
  final _searchController = TextEditingController();
  List<Country> _filteredCountries = Country.all;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterCountries(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredCountries = Country.all;
      } else {
        final lowerQuery = query.toLowerCase();
        _filteredCountries = Country.all.where((c) => c.name.toLowerCase().contains(lowerQuery) ||
              c.dialCode.contains(query) ||
              c.code.toLowerCase().contains(lowerQuery)).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bottomPadding = MediaQuery.of(context).viewInsets.bottom;

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) => Padding(
          padding: EdgeInsets.only(bottom: bottomPadding),
          child: Column(
            children: [
              // Handle
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: theme.colorScheme.outlineVariant,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // Title
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: Text(
                  'Select Country',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              // Search
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search country...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    isDense: true,
                  ),
                  onChanged: _filterCountries,
                ),
              ),

              // List
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: _filteredCountries.length,
                  itemBuilder: (context, index) {
                    final country = _filteredCountries[index];
                    final isSelected =
                        country.code == widget.selectedCountry.code;

                    return ListTile(
                      leading: Text(
                        country.flag,
                        style: const TextStyle(fontSize: 24),
                      ),
                      title: Text(country.name),
                      trailing: Text(
                        country.dialCode,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      selected: isSelected,
                      selectedTileColor: theme.colorScheme.primaryContainer
                          .withValues(alpha: 0.3),
                      onTap: () => widget.onSelected(country),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
    );
  }
}
