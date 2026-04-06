class UserModel {
  final String id;
  final String displayName;
  final String email;
  final String? avatarUrl;

  const UserModel({
    required this.id,
    required this.displayName,
    required this.email,
    this.avatarUrl,
  });

  String get initials {
    final parts = displayName.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return displayName[0].toUpperCase();
  }

  String get firstName => displayName.split(' ').first;
}
