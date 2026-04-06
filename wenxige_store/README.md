# Wenxige Store

[![CI/CD Pipeline](https://github.com/username/wenxige-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/username/wenxige-ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/username/wenxige-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/username/wenxige-ui)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, responsive e-commerce platform built with Flutter, featuring a clean design and professional development practices.

## 🚀 Features

- **Cross-Platform**: Runs on Web, Android, and iOS
- **Modern UI**: Material Design 3 with custom theming
- **Authentication**: Secure user authentication with Supabase
- **Shopping Cart**: Full shopping cart functionality
- **Responsive Design**: Works perfectly on all screen sizes
- **Professional CI/CD**: Automated testing, building, and deployment
- **Code Quality**: Comprehensive linting and static analysis

## 🛠️ Tech Stack

- **Frontend**: Flutter 3.24.0+
- **Backend**: Supabase
- **State Management**: Provider/Riverpod (configurable)
- **Routing**: GoRouter
- **UI Library**: Material Design 3
- **Fonts**: Google Fonts (Inter)
- **Testing**: Flutter Test + Mockito
- **CI/CD**: GitHub Actions
- **Deployment**: Firebase Hosting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Flutter SDK** (3.24.0 or later)
- **Dart SDK** (included with Flutter)
- **Git**
- **Visual Studio Code** or **Android Studio** (recommended)

### Optional for full development experience:

- **Firebase CLI** (for deployment)
- **lcov** (for coverage reports)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/username/wenxige-ui.git
cd wenxige-ui/wenxige_store
```

### 2. Setup environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# (Supabase URLs, Firebase project ID, etc.)
```

### 3. Install dependencies and setup

```bash
# Using our development scripts (recommended)
chmod +x scripts/dev.sh
./scripts/dev.sh setup

# Or manually
flutter pub get
flutter packages pub run build_runner build --delete-conflicting-outputs
```

### 4. Run the app

```bash
# Development server
./scripts/dev.sh dev

# Or manually
flutter run -d chrome --web-port 3000
```

## 📚 Development Scripts

We provide convenient development scripts for common tasks:

### Unix/Linux/macOS
```bash
./scripts/dev.sh <command>
```

### Windows
```cmd
scripts\dev.bat <command>
```

### Available Commands

| Command | Description |
|---------|-------------|
| `setup` | Setup development environment |
| `clean` | Clean project and dependencies |
| `format` | Format all Dart code |
| `analyze` | Run static analysis |
| `test` | Run all tests with coverage |
| `build` | Build for all platforms |
| `dev` | Start development server |
| `quality` | Run all quality checks |
| `generate` | Run code generation |
| `watch` | Watch and regenerate code |
| `deploy` | Deploy to Firebase |

## 🏗️ Project Structure

```
lib/
├── core/                   # Core functionality
│   ├── constants/         # App constants
│   ├── router/           # App routing configuration
│   └── theme/            # App theming
├── features/             # Feature modules
│   ├── auth/            # Authentication
│   ├── cart/            # Shopping cart
│   ├── shop/            # Product catalog
│   └── ...              # Other features
└── shared/              # Shared components
    ├── models/          # Data models
    ├── providers/       # State management
    └── widgets/         # Reusable widgets
```

## 🧪 Testing

Run the full test suite:

```bash
./scripts/dev.sh test
```

This will:
- Run unit tests
- Run widget tests
- Generate coverage reports
- Display coverage statistics

### Coverage Reports

After running tests, coverage reports are available at:
- **Terminal**: Immediate summary
- **HTML Report**: `coverage/html/index.html`

## 🚀 Deployment

### Staging Deployment
```bash
./scripts/dev.sh deploy staging
```

### Production Deployment
```bash
./scripts/dev.sh deploy production
```

### Manual Deployment
```bash
# Build for web
flutter build web --release --web-renderer canvaskit

# Deploy with Firebase CLI
firebase deploy --only hosting
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key  
- `FIREBASE_PROJECT_ID`: Firebase project for deployment
- `API_BASE_URL`: Backend API base URL

### Firebase Configuration

1. Create a Firebase project
2. Enable Hosting
3. Configure `firebase.json` with your project settings
4. Deploy using the scripts or Firebase CLI

### Supabase Configuration

1. Create a Supabase project
2. Set up authentication
3. Configure database tables
4. Add your URLs and keys to `.env`

## 📊 Code Quality

We maintain high code quality standards with:

- **Linting**: Comprehensive lint rules
- **Static Analysis**: Strict type checking
- **Code Coverage**: Minimum 60% coverage requirement
- **Automated Testing**: Unit, widget, and integration tests
- **Code Review**: Required PR reviews
- **Security Scanning**: Automated vulnerability checks

### Quality Metrics

- **Test Coverage**: ![codecov](https://codecov.io/gh/username/wenxige-ui/branch/main/graph/badge.svg)
- **Build Status**: [![CI/CD Pipeline](https://github.com/username/wenxige-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/username/wenxige-ui/actions/workflows/ci.yml)
- **Code Quality**: Maintained with dart_code_metrics

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Run** quality checks (`./scripts/dev.sh quality`)
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure CI/CD pipeline passes
- Maintain test coverage above 60%

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: contact@wenxige.com

## 🙏 Acknowledgments

- **Flutter Team** for the amazing framework
- **Supabase** for backend services
- **Firebase** for hosting and deployment
- **Material Design** for design principles
- **Open Source Community** for inspiration and tools

---

**Built with ❤️ using Flutter**
