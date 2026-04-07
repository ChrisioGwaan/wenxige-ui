#!/bin/bash
set -e

echo "=== Starting Flutter Web Build ==="

# Install Flutter if not exists
if cd flutter; then 
  echo "Flutter found, updating..."
  git pull && cd ..
else 
  echo "Installing Flutter..."
  git clone -b stable --depth 1 https://github.com/flutter/flutter.git
fi

# NOTE: We do NOT create .env file anymore for web builds
# Environment variables are passed via --dart-define instead

# Configure and build Flutter web
echo "=== Running Flutter Doctor ==="
flutter/bin/flutter doctor

echo "=== Configuring Flutter Web ==="
flutter/bin/flutter config --enable-web

echo "=== Getting Dependencies ==="
flutter/bin/flutter pub get

echo "=== Building for Web with Environment Variables ==="
# Pass secrets as compile-time constants, NOT as a bundled .env file
flutter/bin/flutter build web --release \
  --dart-define=SUPABASE_URL="${SUPABASE_URL}" \
  --dart-define=SUPABASE_KEY="${SUPABASE_KEY}" \
  --verbose 2>&1 | tee build.log || (echo "=== BUILD FAILED ===" && cat build.log && exit 1)
