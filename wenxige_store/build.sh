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

# Create .env file from Vercel environment variables
echo "=== Creating .env file ==="
cat > .env << EOF
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_KEY=${SUPABASE_KEY}
SUPABASE_S3_URL=${SUPABASE_S3_URL}
SUPABASE_S3_REGION=${SUPABASE_S3_REGION}
SUPABASE_S3_KEY_ID=${SUPABASE_S3_KEY_ID}
SUPABASE_S3_SECRET_KEY=${SUPABASE_S3_SECRET_KEY}
EOF

echo "Checking if .env exists and has content:"
ls -la .env
wc -l .env

# Configure and build Flutter web
echo "=== Running Flutter Doctor ==="
flutter/bin/flutter doctor

echo "=== Configuring Flutter Web ==="
flutter/bin/flutter config --enable-web

echo "=== Getting Dependencies ==="
flutter/bin/flutter pub get

echo "=== Building for Web ==="
flutter/bin/flutter build web --release --verbose 2>&1 | tee build.log || (echo "=== BUILD FAILED ===" && cat build.log && exit 1)
