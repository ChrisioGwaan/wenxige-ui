<div align="center">
  <img width="100" src="saas-platform/src/assets/readme/green-tea.png" alt="Wenxige Logo">

  <h1>Wenxige Store</h1>
  
  <p><strong>广州文熙阁贸易有限公司电商平台</strong></p>
  <p>Guangzhou Wenxige Trading Co., Ltd. E-commerce Platform</p>

  ![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)
  ![Dart](https://img.shields.io/badge/dart-%230175C2.svg?style=for-the-badge&logo=dart&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

  [![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://www.wenxige.com)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

</div>

---

## 🌟 Overview

**Wenxige Store** is a modern, cross-platform e-commerce application built with Flutter, designed to deliver a refined shopping experience with elegance and performance. The platform features a clean, responsive design optimized for web deployment.

**Live Site**: [https://www.wenxige.com](https://www.wenxige.com)

## ✨ Key Features

- 🛍️ **Full E-commerce Experience**: Product browsing, cart management, and checkout
- 🎨 **Modern Design**: Material Design 3 with Poppins font (Google Sans alternative)
- 📱 **Responsive**: Seamless experience across desktop, tablet, and mobile
- 🔐 **Secure Authentication**: User registration and login powered by Supabase
- 🖼️ **Product Gallery**: High-quality product images with lightbox view
- 🛒 **Shopping Cart**: Real-time cart updates and quantity management
- 📦 **Order Management**: Order confirmation and tracking
- 🌐 **Web-Optimized**: Deployed on Vercel for fast global delivery
- 🔒 **Security First**: Environment variables injected at build time (no exposed secrets)

## 🏗️ Project Structure

This monorepo contains:

```
wenxige-ui/
└── wenxige_store/          # Flutter e-commerce application
    ├── lib/
    │   ├── features/      # Feature modules (shop, cart, auth, etc.)
    │   ├── core/          # App configuration, routing, theme
    │   └── shared/        # Reusable widgets and utilities
    └── web/               # Web-specific assets
```

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Flutter 3.41+** | Cross-platform UI framework |
| **Dart 3.11+** | Programming language |
| **Supabase** | Backend (auth, database, storage) |
| **GoRouter** | Declarative routing |
| **Google Fonts** | Poppins typography |
| **Material Design 3** | Modern UI components |
| **Vercel** | Web hosting and deployment |

## 📋 Prerequisites

- Flutter SDK 3.41+ ([Install Guide](https://docs.flutter.dev/get-started/install))
- Dart 3.11+ (included with Flutter)
- Git
- Chrome (for web development)

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/ChrisioGwaan/wenxige-ui.git
cd wenxige-ui/wenxige_store

# Copy environment template
cp .env.example .env
# Edit .env with your Supabase credentials

# Install dependencies
flutter pub get

# Run on web (development)
flutter run -d chrome

# Or with environment variables
flutter run -d chrome \
  --dart-define=SUPABASE_URL=your_url \
  --dart-define=SUPABASE_KEY=your_key
```

## 🌐 Deployment

### Web Deployment (Vercel)

The Flutter web app is configured for Vercel deployment with:

- **Root Directory**: `wenxige_store`
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Output Directory**: `build/web`

Environment variables are injected at build time via `--dart-define` for security.

See [build.sh](wenxige_store/build.sh) for the complete build configuration.

## 🔒 Security

- ✅ No `.env` files in web builds (secrets not exposed)
- ✅ Environment variables injected at compile time
- ✅ Supabase Row Level Security (RLS) enabled
- ✅ HTTPS-only deployment
- ✅ Secure authentication flows

## 📱 Features by Module

| Module | Description |
|--------|-------------|
| **Landing** | Hero section, features, categories, promotions |
| **Shop** | Product catalog with filtering and search |
| **Product Detail** | Image gallery, specifications, add to cart |
| **Cart** | Item management, quantity updates, checkout |
| **Checkout** | Order placement and payment processing |
| **Auth** | Login, signup, password recovery |
| **Profile** | User account and settings |
| **Gallery** | Product image showcase |
| **About** | Company information |
| **Contact** | Contact form and information |

## 🎨 Design System

- **Typography**: Poppins (closest Google Sans alternative)
- **Color Scheme**: Purple accent (#6B4EFF) with Material 3 color system
- **Icons**: Material Icons (tree-shaken for optimal size)
- **Responsive**: Mobile-first design with breakpoints

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Branch Strategy

- **`feature`**: Production-ready releases
- **`dev`**: Active development, new features, and bug fixes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chrisio Gwaan**
- GitHub: [@ChrisioGwaan](https://github.com/ChrisioGwaan)
- Website: [wenxige.com](https://www.wenxige.com)

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- Supabase for backend infrastructure
- Vercel for seamless deployment
- Material Design for design principles

---

<div align="center">
  <p><strong>Built with ❤️ using Flutter</strong></p>
  <p>© 2008-2026 Guangzhou Wenxige Trading Co., Ltd.</p>
</div>