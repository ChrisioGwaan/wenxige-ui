#!/bin/bash

# Development scripts for Wenxige Store
# Usage: ./scripts/dev.sh <command>

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Flutter is installed
check_flutter() {
    if ! command -v flutter &> /dev/null; then
        log_error "Flutter is not installed or not in PATH"
        exit 1
    fi
    
    log_info "Flutter version: $(flutter --version | head -n1)"
}

# Setup development environment
setup() {
    log_info "Setting up development environment..."
    
    check_flutter
    
    log_info "Getting dependencies..."
    flutter pub get
    
    log_info "Running code generation..."
    flutter packages pub run build_runner build --delete-conflicting-outputs
    
    log_success "Development environment setup complete!"
}

# Clean the project
clean() {
    log_info "Cleaning project..."
    
    flutter clean
    flutter pub get
    
    # Clean build artifacts
    rm -rf build/
    rm -rf .dart_tool/
    
    log_success "Project cleaned!"
}

# Format code
format() {
    log_info "Formatting code..."
    
    dart format .
    
    log_success "Code formatted!"
}

# Analyze code
analyze() {
    log_info "Analyzing code..."
    
    dart analyze --fatal-infos --fatal-warnings
    
    log_success "Code analysis complete!"
}

# Run tests
test() {
    log_info "Running tests..."
    
    flutter test --coverage --reporter=expanded
    
    if [ -f "coverage/lcov.info" ]; then
        log_info "Generating coverage report..."
        
        # Check if lcov is available
        if command -v lcov &> /dev/null; then
            genhtml coverage/lcov.info -o coverage/html
            log_success "Coverage report generated at coverage/html/index.html"
        else
            log_warning "lcov not found. Install it to generate HTML coverage reports."
        fi
    fi
    
    log_success "Tests completed!"
}

# Build for all platforms
build_all() {
    log_info "Building for all platforms..."
    
    # Web
    log_info "Building for Web..."
    flutter build web --release --web-renderer canvaskit
    
    # Android
    log_info "Building for Android..."
    flutter build apk --release --split-per-abi
    flutter build appbundle --release
    
    # iOS (only on macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        log_info "Building for iOS..."
        flutter build ios --release --no-codesign
    else
        log_warning "Skipping iOS build (not on macOS)"
    fi
    
    log_success "All builds completed!"
}

# Development server
dev() {
    log_info "Starting development server..."
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        log_warning ".env file not found. Creating from template..."
        cp .env.example .env 2>/dev/null || echo "# Environment variables" > .env
    fi
    
    flutter run -d chrome --web-port 3000
}

# Quality check (format + analyze + test)
quality() {
    log_info "Running quality checks..."
    
    format
    analyze
    test
    
    log_success "All quality checks passed!"
}

# Generate code
generate() {
    log_info "Running code generation..."
    
    flutter packages pub run build_runner build --delete-conflicting-outputs
    
    log_success "Code generation complete!"
}

# Watch for changes and regenerate
watch() {
    log_info "Watching for changes and regenerating code..."
    
    flutter packages pub run build_runner watch --delete-conflicting-outputs
}

# Deploy to Firebase
deploy() {
    local environment=${1:-staging}
    
    log_info "Deploying to $environment..."
    
    # Build for web
    flutter build web --release --web-renderer canvaskit
    
    # Deploy with Firebase CLI
    if command -v firebase &> /dev/null; then
        firebase deploy --only hosting:$environment
        log_success "Deployed to $environment!"
    else
        log_error "Firebase CLI not found. Install it with: npm install -g firebase-tools"
        exit 1
    fi
}

# Show help
help() {
    echo "Wenxige Store Development Scripts"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  setup     - Setup development environment"
    echo "  clean     - Clean project and dependencies"
    echo "  format    - Format all Dart code"
    echo "  analyze   - Run static analysis"
    echo "  test      - Run all tests with coverage"
    echo "  build     - Build for all platforms"
    echo "  dev       - Start development server"
    echo "  quality   - Run all quality checks"
    echo "  generate  - Run code generation"
    echo "  watch     - Watch and regenerate code"
    echo "  deploy    - Deploy to Firebase (default: staging)"
    echo "  help      - Show this help message"
}

# Main script logic
case "${1:-help}" in
    setup)
        setup
        ;;
    clean)
        clean
        ;;
    format)
        format
        ;;
    analyze)
        analyze
        ;;
    test)
        test
        ;;
    build)
        build_all
        ;;
    dev)
        dev
        ;;
    quality)
        quality
        ;;
    generate)
        generate
        ;;
    watch)
        watch
        ;;
    deploy)
        deploy "$2"
        ;;
    help)
        help
        ;;
    *)
        log_error "Unknown command: $1"
        help
        exit 1
        ;;
esac