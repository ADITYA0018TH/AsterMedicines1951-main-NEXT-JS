# 🏥 Aster Medicines

> A modern, futuristic web application for Aster Medicines built with cutting-edge technologies and designed for exceptional user experiences.

[![TypeScript](https://img.shields.io/badge/TypeScript-96%25-blue? style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![CSS](https://img.shields.io/badge/CSS-3. 7%25-orange?style=flat-square&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Next.js](https://img.shields.io/badge/Next.js-16+-000000? style=flat-square&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-scripts)
- [Project Architecture](#-project-architecture)
- [Key Components](#-key-components)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

Aster Medicines is a comprehensive digital platform designed to revolutionize the way users discover, explore, and purchase pharmaceutical products. With a focus on modern UX/UI design, performance optimization, and secure transactions, this application delivers a premium experience powered by Next.js and supported by advanced cloud technologies.

### Key Highlights
- ⚡ **High Performance**:  Optimized for speed with Next.js 14+
- 🎨 **Modern Design**: Glassmorphism effects with smooth animations
- 🔒 **Secure**:  Admin authentication and protected routes
- 📱 **Responsive**: Mobile-first design approach
- 🌐 **SEO Optimized**: Structured data and sitemap generation

---

## 🚀 Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with App Router | 16+ |
| **TypeScript** | Type-safe JavaScript | Latest |
| **Tailwind CSS** | Utility-first CSS framework | Latest |
| **Framer Motion** | Animation library | Latest |
| **Lucide React** | Icon library | Latest |
| **MongoDB** | Database | Latest |

### Language Composition
- **TypeScript**: 96% (Primary language)
- **CSS**: 3.7% (Styling)
- **JavaScript**: 0.3% (Configuration)

---

## 🎨 Features

### Core Features
- ✨ **Dynamic Product Catalog**: Browse and filter medicines with advanced search
- 🛒 **Shopping Cart**:  Seamless checkout experience
- 📦 **Product Details**: Comprehensive product information with specifications
- 💬 **Contact Form**: Easy communication with customer support
- 📊 **Admin Dashboard**: Manage products, orders, and customer messages
- 🔐 **Authentication**: Secure login system for admins
- 🌓 **Dark Mode**: Theme toggle for user preference
- 📱 **Mobile Responsive**: Optimized for all devices
- 🎞️ **Smooth Animations**: Engaging page transitions and effects
- 🔍 **SEO Optimized**: Meta tags, structured data, and sitemaps

### Advanced Features
- 🤖 **AI Integration**: Humanoid and AI section showcases
- 📈 **Analytics**:  Recently viewed products tracking
- 🔔 **Notifications**: Success and error notifications
- 📤 **File Upload**: Bulk inquiry with image support
- 🧭 **Navigation**: Breadcrumb navigation and floating navbar

---

## 📂 Project Structure

```
AsterMedicines1951-main-NEXT-JS/
├── 📁 public/                          # Static assets
│   ├── videos/ & animations/
│   ├── images/ (webp, png format)
│   ├── robots.txt & sitemap.xml
│   └── og-image-update.webp
│
├── 📁 src/
│   ├── 🚀 app/                         # Next.js App Router
│   │   ├── (routes)/
│   │   │   ├── about/                  # About page
│   │   │   ├── admin/                  # Admin dashboard & auth
│   │   │   ├── api/                    # API routes
│   │   │   ├── contact/                # Contact form
│   │   │   ├── login/                  # Admin login
│   │   │   └── products/               # Product catalog
│   │   ├── globals.css                 # Global styles
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Home page
│   │   ├── not-found.tsx               # 404 page
│   │   ├── robots.ts                   # Robots.txt generation
│   │   └── sitemap.ts                  # Sitemap generation
│   │
│   ├── 🧩 components/                  # React Components
│   │   ├── ui/                         # Shadcn & UI Library (23 files)
│   │   │   ├── Button3D.tsx, GlassSurface.tsx, MagicBento.tsx
│   │   │   └── [Standard UI components like Button, Card, Dialog...]
│   │   │
│   │   ├── Layout/
│   │   │   ├── Navbar.tsx              # Main navigation
│   │   │   ├── Footer.tsx              # Site footer
│   │   │   └── ThemeToggle.tsx         # Dark/Light mode toggle
│   │   │
│   │   ├── Pages & Content/
│   │   │   ├── HomeContent.tsx         # Home page logic
│   │   │   ├── AboutContent.tsx        # About page logic
│   │   │   ├── ContactContent.tsx      # Contact page logic
│   │   │   ├── LoginContent.tsx        # Login page logic
│   │   │   ├── ProductsContent.tsx     # Product catalog logic
│   │   │   └── ProductDetailContent.tsx# Product details logic
│   │   │
│   │   ├── Features & Sections/
│   │   │   ├── Hero.tsx                # Hero section
│   │   │   ├── Features.tsx            # Features showcase
│   │   │   ├── PharmaceuticalSection.tsx # 3D/Visual section
│   │   │   ├── ImageShowcaseSection.tsx# Image gallery
│   │   │   ├── DetailsSection.tsx      # Product details
│   │   │   ├── SpecsSection.tsx        # Technical specs
│   │   │   ├── ProductComparison.tsx   # Comparison tool
│   │   │   ├── Newsletter.tsx          # Subscription form
│   │   │   └── BulkInquiryForm.tsx     # Bulk order form
│   │   │
│   │   ├── Admin/
│   │   │   ├── AdminDashboardContent.tsx
│   │   │   ├── AdminProductsContent.tsx
│   │   │   ├── AdminMessagesContent.tsx
│   │   │   └── AdminProductForm.tsx
│   │   │
│   │   └── Utility/
│   │       ├── EnhancedLoader.tsx      # Custom loader
│   │       ├── LoadingProvider.tsx     # Loading context
│   │       ├── Providers.tsx           # App providers
│   │       ├── ScrollReveal.tsx        # Scroll animations
│   │       ├── ScrollFloat.tsx         # Floating effect
│   │       └── SuccessNotification.tsx
│   │
│   ├── 📊 data/                        # Static Data
│   │
│   ├── 🪝 hooks/                       # Custom Hooks
│   │   ├── use-mobile.tsx              # Mobile detection
│   │   ├── use-theme-animation.ts      # Theme transitions
│   │   ├── use-toast.ts                # Toast notifications
│   │   ├── useClickOutside.ts          # Click handler
│   │   └── useRecentlyViewed.ts        # Product history
│   │
│   ├── 📚 lib/                         # Libraries
│   │   ├── db.ts                       # Database connection
│   │   └── utils.ts                    # Class merging helper
│   │
│   ├── 🗃️ models/                      # Database Schemas
│   │   ├── Contact.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   │
│   ├── 🔌 services/                    # Services
│   │   └── api.ts                      # API fetcher
│   │
│   └── 🛠️ utils/                       # Utilities
│       ├── animations.ts               # Animation constants
│       ├── schemaGenerators.ts         # SEO schema helpers
│       └── sitemap.ts                  # Sitemap helpers
│
├── ⚙️ Configuration
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── postcss.config.mjs
│   └── eslint.config.mjs
│
└── 📖 Documentation
    ├── README.md                       # This file
    └── .gitignore
```

---

## 🛠️ Getting Started

### Prerequisites
- Node. js 18. 17 or later
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADITYA0018TH/AsterMedicines1951-main-NEXT-JS.git
   cd AsterMedicines1951-main-NEXT-JS
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example . env. local
   # Edit .env. local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Tips
- Hot reload is enabled by default
- Check console for TypeScript and ESLint errors
- Use the built-in DevTools for debugging

---

## 📜 Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| **dev** | `npm run dev` | Start development server with hot reload |
| **build** | `npm run build` | Create optimized production build |
| **start** | `npm run start` | Run production server |
| **lint** | `npm run lint` | Check code quality with ESLint |

### Usage Examples
```bash
# Development
npm run dev

# Production deployment
npm run build && npm run start

# Code quality check
npm run lint
```

---

## 🏗️ Project Architecture

### Frontend Architecture
```
Pages (App Router)
    ↓
Components (UI + Feature)
    ↓
Hooks (Custom Logic)
    ↓
Services (API Calls)
    ↓
Utils & Helpers
```

### API Architecture
```
Next.js API Routes
    ↓
Database Models
    ↓
MongoDB Atlas
```

### Authentication Flow
```
Login Form
    ↓
API Validation
    ↓
JWT Token Generation
    ↓
Protected Routes & Admin Access
```

---

## 🧩 Key Components

### Layout Components
- **Navbar**: Navigation with theme toggle
- **Footer**: Company information and links
- **Breadcrumb**: Navigation trail

### Page Components
- **Hero**: Landing page hero section with animations
- **FeaturedProducts**:  Showcase top medicines
- **ProductFilters**: Advanced filtering and search
- **AdminDashboard**: Product and message management

### UI Library
- **Shadcn/ui** components for consistent design
- Fully customizable with Tailwind CSS
- Accessibility-first approach

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Docker
```bash
# Build Docker image
docker build -t aster-medicines . 

# Run container
docker run -p 3000:3000 aster-medicines
```

### Traditional Hosting
```bash
npm run build
npm run start
```

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔒 Security Features

- ✅ Protected API routes with authentication
- ✅ Secure password hashing
- ✅ CORS configuration
- ✅ Environment variable encryption
- ✅ Input validation & sanitization
- ✅ Protected admin routes

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 📧 Support & Contact

- **Email**: support@astermedicines.com
- **Website**: https://www.astermedicines.com
- **Issues**: [GitHub Issues](https://github.com/ADITYA0018TH/AsterMedicines1951-main-NEXT-JS/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [MongoDB](https://www.mongodb.com/) - Database

---

**Made with ❤️ by Aster Medicines Team**

*Last Updated: December 18, 2025*
