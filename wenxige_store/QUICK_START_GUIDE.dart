/*
 * Quick Start Guide - Profile Settings Enhancement
 * ================================================
 * 
 * This file explains how to use the new enhanced profile settings page
 * for your tea business Flutter app.
 */

// ========================================
// 1. SUPABASE DATABASE SETUP (REQUIRED)
// ========================================

/*
Step 1: Go to your Supabase Dashboard
Step 2: Navigate to: SQL Editor
Step 3: Copy and paste the contents of: 
        supabase_migrations/create_user_profiles_table.sql
Step 4: Click "Run" to execute the migration

This creates:
- user_profiles table
- RLS policies for data privacy
- Automatic timestamp triggers

IMPORTANT: This MUST be done before running the app, or profile 
           saving will fail!
*/


// ========================================
// 2. HOW THE NEW FEATURES WORK
// ========================================

/*
GENDER SELECTION:
- Optional dropdown
- Choices: Male, Female, Other, Prefer not to say
- Stored in: user_profiles.gender

BILLING ADDRESS:
- Street Address (text field)
- City (text field)
- State/Province (text field)
- Postal Code (text field)
- Country (dropdown with 29 countries)
- Stored in: user_profiles.billing_address (JSONB)

SHIPPING ADDRESS:
- Same fields as billing address
- Smart toggle: "Shipping address is same as billing address"
- When checked: Shipping fields are HIDDEN
- When unchecked: Shipping fields are SHOWN
- Stored in: user_profiles.shipping_address (JSONB)

SAVE BUTTON:
- Single button to save ALL changes
- No real-time updates (prevents excessive database calls)
- Shows success/error messages after saving
*/


// ========================================
// 3. COUNTRY LIST (29 Countries)
// ========================================

/*
The app ships to these countries (optimized for tea business starting in China):

Asia-Pacific:
- China, Hong Kong, Macau, Taiwan
- Japan, South Korea
- Singapore, Malaysia, Thailand, Vietnam
- Philippines, Indonesia
- Australia, New Zealand

North America:
- United States
- Canada

Europe:
- United Kingdom, Germany, France
- Netherlands, Switzerland, Austria
- Italy, Spain, Belgium
- Sweden, Norway, Denmark, Finland

To add more countries, edit:
lib/shared/models/user_profile_model.dart
→ ShippingCountries.countries array
*/


// ========================================
// 4. CODE STRUCTURE
// ========================================

/*
DATA MODELS:
lib/shared/models/user_profile_model.dart
├─ UserProfile class (main profile data)
├─ Address class (billing/shipping address)
└─ ShippingCountries (country list)

SERVICES:
lib/shared/services/user_profile_service.dart
├─ loadProfile(userId) - Load user profile from database
├─ saveProfile(profile) - Save/update profile
└─ deleteProfile(userId) - Delete profile

UI:
lib/features/profile/profile_settings_page.dart
├─ Avatar upload section
├─ Personal information form
├─ Billing address form
├─ Shipping address form (with toggle)
└─ Save button + Sign out button

ROUTER:
lib/core/router/app_router.dart
└─ Route '/profile' → ProfileSettingsPage
*/


// ========================================
// 5. USAGE EXAMPLES
// ========================================

/*
LOADING USER PROFILE:
```dart
final profileService = UserProfileService();
final userId = Supabase.instance.client.auth.currentUser!.id;
final profile = await profileService.loadProfile(userId);

if (profile != null) {
  print('Gender: ${profile.gender}');
  print('Billing Country: ${profile.billingAddress?.country}');
  print('Use same address: ${profile.useBillingAsShipping}');
}
```

SAVING USER PROFILE:
```dart
final profile = UserProfile(
  userId: userId,
  gender: 'Female',
  billingAddress: Address(
    street: '123 Tea Street',
    city: 'Shanghai',
    state: 'Shanghai',
    postalCode: '200000',
    country: 'China',
  ),
  useBillingAsShipping: true,
);

await profileService.saveProfile(profile);
```

CHECKING ADDRESS COMPLETENESS:
```dart
if (profile.billingAddress?.isComplete == true) {
  print('Billing address is complete and ready for checkout');
}
```
*/


// ========================================
// 6. INTEGRATION WITH CHECKOUT
// ========================================

/*
When implementing checkout/order flow:

1. Load user's profile:
   final profile = await UserProfileService().loadProfile(userId);

2. Get shipping address:
   final shippingAddress = profile.useBillingAsShipping
       ? profile.billingAddress
       : profile.shippingAddress;

3. Validate address exists:
   if (shippingAddress == null || !shippingAddress.isComplete) {
     // Prompt user to complete their profile
     context.go('/profile');
   }

4. Use address in order:
   final order = Order(
     userId: userId,
     shippingAddress: shippingAddress,
     // ... other order fields
   );
*/


// ========================================
// 7. TROUBLESHOOTING
// ========================================

/*
PROBLEM: "Failed to save profile" error
SOLUTION: 
1. Verify database migration was run
2. Check Supabase connection in .env file
3. Verify user is authenticated
4. Check browser console for detailed errors

PROBLEM: Countries not showing in dropdown
SOLUTION:
1. Check ShippingCountries.countries array exists
2. Verify user_profile_model.dart compiled correctly
3. Run: flutter clean && flutter pub get

PROBLEM: Build errors after adding files
SOLUTION:
1. Run: flutter pub run build_runner build --delete-conflicting-outputs
2. This generates user_profile_model.g.dart
3. Then: flutter clean && flutter pub get

PROBLEM: Avatar upload fails
SOLUTION:
1. Create 'avatars' bucket in Supabase Storage
2. Set bucket to public or configure RLS policies
3. Check storage quota in Supabase dashboard
*/


// ========================================
// 8. CUSTOMIZATION
// ========================================

/*
TO ADD MORE GENDER OPTIONS:
Edit lib/features/profile/profile_settings_page.dart
→ _genderOptions array

TO ADD MORE COUNTRIES:
Edit lib/shared/models/user_profile_model.dart
→ ShippingCountries.countries array

TO ADD NEW PROFILE FIELDS:
1. Add field to UserProfile class in user_profile_model.dart
2. Run: flutter pub run build_runner build --delete-conflicting-outputs
3. Update database table to include new column
4. Add UI field in profile_settings_page.dart
5. Update save logic to include new field

TO CHANGE VALIDATION RULES:
Edit lib/features/profile/profile_settings_page.dart
→ validator functions in TextFormField widgets
*/


// ========================================
// 9. SECURITY NOTES
// ========================================

/*
ROW LEVEL SECURITY (RLS):
- All user_profiles queries are filtered by user_id
- Users can ONLY access their own profile
- Enforced at the database level
- Even if API is compromised, users can't access others' data

DATA PRIVACY:
- Gender is optional
- Addresses are optional
- No data is shared between users
- Avatar URLs are generated with user_id prefix

BEST PRACTICES:
- Never log sensitive user data
- Always use parameterized queries
- Validate all inputs on client AND server
- Use HTTPS for all API calls
*/


// ========================================
// 10. TESTING CHECKLIST
// ========================================

/*
□ User can sign up and sign in
□ User can navigate to /profile page
□ User can upload avatar
□ User can enter first name and last name
□ User can select gender (optional)
□ User can enter phone number
□ User can fill in billing address
□ User can select billing country from dropdown
□ Checkbox "same as billing" works correctly
□ When checked: shipping fields are hidden
□ When unchecked: shipping fields are shown
□ User can fill in separate shipping address
□ User can click "Save Changes" button
□ Success message appears after save
□ Data persists after page reload
□ User can sign out
□ Profile data loads correctly on next login
□ Validation works for required fields
□ Validation works for phone number format
□ Avatar upload shows loading indicator
□ Error messages display correctly
*/

// ========================================
// END OF QUICK START GUIDE
// ========================================
