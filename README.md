# 🏥 Aster Medicines

> A modern, futuristic web application for Aster Medicines built with cutting-edge technologies and designed for exceptional user experiences.

[![TypeScript](https://img.shields.io/badge/TypeScript-96%25-blue? style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![CSS](https://img.shields.io/badge/CSS-3. 7%25-orange?style=flat-square&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000? style=flat-square&logo=next.js)](https://nextjs.org/)
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
| **Next.js** | React framework with App Router | 14+ |
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
│   ├── favicon files
│   ├── robots.txt & sitemap.xml
│   └── SVG assets
│
├── 📁 src/
│   ├── 🚀 app/                         # Next.js App Router
│   │   ├── page. tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── (routes)/
│   │   │   ├── about/                  # About page
│   │   │   ├── contact/                # Contact form
│   │   │   ├── products/               # Product catalog
│   │   │   ├── products/[id]/          # Product details
│   │   │   ├── login/                  # Admin login
│   │   │   └── admin/                  # Admin dashboard
│   │   ├── api/                        # API routes
│   │   │   ├── auth/                   # Authentication endpoints
│   │   │   ├── products/               # Product CRUD
│   │   │   ├── categories/             # Category management
│   │   │   ├── contact/                # Contact form submission
│   │   │   └── upload/                 # File upload
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   │
│   ├── 🧩 components/                  # Reusable React components
│   │   ├── Layout Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── Page Components
│   │   │   ├── HomeContent.tsx
│   │   │   ├── ProductsContent.tsx
│   │   │   ├── ProductDetailContent.tsx
│   │   │   ├── AboutContent.tsx
│   │   │   ├── ContactContent. tsx
│   │   │   └── LoginContent.tsx
│   │   ├── Feature Components
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── CallToAction.tsx
│   │   ├── UI Components (src/components/ui/)
│   │   │   ├── Button, Input, Dialog
│   │   │   ├── Card, Badge, Avatar
│   │   │   ├── Accordion, Tabs, Drawer
│   │   │   ├── Form, Modal, Popover
│   │   │   ├── Charts, Tables, Progress
│   │   │   └── Toast, Tooltip, Notifications
│   │   ├── Animation Components
│   │   │   ├── PageTransition.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   ├── ScrambledText.tsx
│   │   │   └── LottieAnimation.tsx
│   │   ├── Admin Components
│   │   │   ├── AdminDashboardContent.tsx
│   │   │   ├── AdminProductsContent.tsx
│   │   │   └── AdminMessagesContent.tsx
│   │   └── Utility Components
│   │       ├── LoadingSpinner.tsx
│   │       ├── PageLoader.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── CustomCursor.tsx
│   │
│   ├── 📊 data/                        # Static data & utilities
│   │   ├── products.ts                 # Product seed data
│   │   └── structuredData.ts           # JSON-LD schemas
│   │
│   ├── 🪝 hooks/                       # Custom React hooks
│   │   ├── use-mobile. tsx              # Mobile detection
│   │   ├── use-toast.ts                # Toast notifications
│   │   └── useRecentlyViewed.ts        # Product history
│   │
│   ├── 📚 lib/                         # Utilities & helpers
│   │   ├── db.ts                       # Database connection
│   │   └── utils.ts                    # General utilities
│   │
│   ├── 🗃️ models/                      # Database schemas
│   │   ├── Product.ts
│   │   ├── Contact.ts
│   │   └── User.ts
│   │
│   ├── 🔌 services/                    # External services
│   │   └── api.ts                      # API client
│   │
│   ├── 🛡️ middleware. ts                # Next.js middleware
│   ├── 🛡️ proxy.ts                     # Proxy configuration
│   └── 🛠️ utils/
│       ├── schemaGenerators.ts         # Schema generation
│       └── sitemap.ts                  # Sitemap utility
│
├── ⚙️ Configuration Files
│   ├── next. config.ts                  # Next.js configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tailwind.config.ts              # Tailwind configuration
│   ├── postcss.config.mjs              # PostCSS configuration
│   ├── eslint.config.mjs               # ESLint rules
│   └── package.json                    # Dependencies
│
└── 📖 Documentation
    ├── README.md                       # This file
    └── . gitignore
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

*Last Updated: December 10, 2025*
