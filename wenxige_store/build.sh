#!/bin/bash
set -e

# Install Flutter if not exists
if cd flutter; then 
  git pull && cd ..
else 
  git clone -b stable --depth 1 https://github.com/flutter/flutter.git
fi

# Create .env file from Vercel environment variables
echo "SUPABASE_URL=$SUPABASE_URL" > .env
echo "SUPABASE_KEY=$SUPABASE_KEY" >> .env
echo "SUPABASE_S3_URL=$SUPABASE_S3_URL" >> .env
echo "SUPABASE_S3_REGION=$SUPABASE_S3_REGION" >> .env
echo "SUPABASE_S3_KEY_ID=$SUPABASE_S3_KEY_ID" >> .env
echo "SUPABASE_S3_SECRET_KEY=$SUPABASE_S3_SECRET_KEY" >> .env

# Configure and build Flutter web
flutter/bin/flutter doctor
flutter/bin/flutter config --enable-web
flutter/bin/flutter pub get
flutter/bin/flutter build web --release
