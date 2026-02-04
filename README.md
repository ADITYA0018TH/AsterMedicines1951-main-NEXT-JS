# 🏥 Aster Medicines

> A modern, premium web application for **Aster Medicines Pvt Ltd**, a WHO-GMP certified pharmaceutical manufacturer based in Bihar, India.

[![TypeScript](https://img.shields.io/badge/TypeScript-96%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-scripts)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

Aster Medicines is a comprehensive digital platform for a pharmaceutical manufacturing company. It serves as both a public-facing product catalog and an internal admin dashboard for managing products, customer inquiries, and visitor analytics.

### Key Highlights
- ⚡ **High Performance**: Built with Next.js 16+ App Router & Turbopack
- 🎨 **Modern Design**: Glassmorphism, GSAP animations, and dark mode
- 🔒 **Secure Admin**: NextAuth.js protected admin panel
- 📱 **Responsive**: Mobile-first design with optimized views
- 🌐 **SEO Optimized**: Structured data (JSON-LD), dynamic sitemap, and robots.txt
- 📊 **Visitor Analytics**: Real-time visitor tracking with device detection

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **GSAP** | Scroll-triggered animations |
| **Framer Motion** | Component animations |
| **MongoDB + Mongoose** | Database & ODM |
| **NextAuth.js** | Authentication |
| **Nodemailer** | Email notifications |
| **ua-parser-js** | Visitor device detection |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |

---

## 🎨 Features

### Public Pages
- **Home**: Hero section, product showcase, pharmaceutical highlights
- **Products**: Searchable catalog with category filters
- **Product Detail**: Specifications, related products, comparison tool
- **About**: Company manifesto, leadership profile, facility showcase
- **Contact**: Inquiry form with image upload support

### Admin Dashboard
- **Dashboard**: Overview with quick stats
- **Products Management**: CRUD operations for product catalog
- **Messages**: View and manage customer inquiries
- **Visitor Logs**: Analytics with device, location, and ISP tracking
- **Password Recovery**: Self-service password reset via email

### Technical Features
- 🌓 **Dark/Light Mode**: System-aware theme toggle
- 🔍 **SEO**: Dynamic meta tags, JSON-LD structured data
- 📧 **Email**: Password reset flow with secure tokens
- 📈 **Analytics**: Visitor tracking with geo-location

---

## 📂 Project Structure

```
AsterMedicines1951-main-NEXT-JS/
│
├── public/                         # Static assets
│   ├── uploads/                    # Product images
│   ├── og-image.webp               # Open Graph image
│   ├── icon.png                    # Favicon source
│   └── apple-touch-icon.png
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout with SEO metadata
│   │   ├── page.tsx                # Home page
│   │   ├── globals.css             # Global styles
│   │   ├── not-found.tsx           # 404 page
│   │   ├── loading.tsx             # Loading state
│   │   ├── robots.ts               # Dynamic robots.txt
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   ├── manifest.ts             # PWA manifest
│   │   │
│   │   ├── about/                  # About page
│   │   ├── contact/                # Contact page
│   │   ├── products/               # Product catalog
│   │   │   └── [slug]/             # Product detail (dynamic)
│   │   │
│   │   ├── 7061452180/             # Admin login (obfuscated URL)
│   │   ├── forgot-password/        # Password reset request
│   │   ├── reset-password/         # Password reset form
│   │   │
│   │   ├── admin/                  # Protected admin area
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── messages/
│   │   │   └── visitors/
│   │   │
│   │   └── api/                    # API Routes
│   │       ├── auth/               # NextAuth endpoints
│   │       │   ├── [...nextauth]/  # Auth handler
│   │       │   ├── forgot-password/
│   │       │   └── reset-password/
│   │       ├── products/           # Product CRUD
│   │       ├── categories/         # Category list
│   │       ├── contact/            # Contact form submission
│   │       ├── admin/              # Admin-only endpoints
│   │       │   └── visitors/       # Visitor logs API
│   │       ├── track-visit/        # Visitor tracking
│   │       └── upload/             # File upload handler
│   │
│   ├── components/                 # React Components
│   │   ├── ui/                     # Base UI components (22 files)
│   │   │   ├── button.tsx, card.tsx, input.tsx, ...
│   │   │   ├── Button3D.tsx        # 3D button effect
│   │   │   ├── GlassSurface.tsx    # Glassmorphism component
│   │   │   └── MagicBento.tsx      # Bento grid layout
│   │   │
│   │   ├── Navbar.tsx              # Main navigation
│   │   ├── Footer.tsx              # Site footer
│   │   ├── ThemeToggle.tsx         # Dark/Light mode switch
│   │   │
│   │   ├── HomeContent.tsx         # Home page content
│   │   ├── AboutContent.tsx        # About page content
│   │   ├── ContactContent.tsx      # Contact page content
│   │   ├── ProductsContent.tsx     # Product catalog
│   │   ├── ProductDetailContent.tsx# Product detail page
│   │   ├── LoginContent.tsx        # Login form
│   │   │
│   │   ├── Hero.tsx                # Home hero section
│   │   ├── Features.tsx            # Features grid
│   │   ├── PharmaceuticalSection.tsx
│   │   ├── ImageShowcaseSection.tsx
│   │   ├── VideoShowcase.tsx
│   │   ├── FAQSection.tsx
│   │   ├── Newsletter.tsx
│   │   ├── BulkInquiryForm.tsx
│   │   │
│   │   ├── AdminDashboardContent.tsx
│   │   ├── AdminProductsContent.tsx
│   │   ├── AdminProductForm.tsx
│   │   ├── AdminMessagesContent.tsx
│   │   ├── VisitorsContent.tsx     # Visitor analytics table
│   │   ├── StatsCards.tsx          # Analytics stats
│   │   │
│   │   ├── VisitorTracker.tsx      # Client-side tracking
│   │   ├── Providers.tsx           # App providers wrapper
│   │   ├── JsonLd.tsx              # SEO structured data
│   │   └── ScrollReveal.tsx        # Animation wrapper
│   │
│   ├── models/                     # Mongoose Schemas
│   │   ├── Product.ts              # Product schema
│   │   ├── Contact.ts              # Contact message schema
│   │   ├── User.ts                 # Admin user schema
│   │   └── Visitor.ts              # Visitor log schema
│   │
│   ├── lib/                        # Core libraries
│   │   ├── db.ts                   # MongoDB connection
│   │   └── utils.ts                # Utility functions
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── use-mobile.tsx          # Mobile detection
│   │   ├── use-toast.ts            # Toast notifications
│   │   ├── useClickOutside.ts      # Click outside handler
│   │   └── useRecentlyViewed.ts    # Product history
│   │
│   ├── services/                   # API Services
│   │   └── api.ts                  # Fetch utilities
│   │
│   ├── types/                      # TypeScript Types
│   │   └── [type definitions]
│   │
│   ├── utils/                      # Utilities
│   │   ├── animations.ts           # Animation presets
│   │   └── schemaGenerators.ts     # SEO schema helpers
│   │
│   └── proxy.ts                    # NextAuth middleware config
│
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
└── .env                            # Environment variables
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.17+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/ADITYA0018TH/AsterMedicines1951-main-NEXT-JS.git
cd AsterMedicines1951-main-NEXT-JS

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword

# JWT
JWT_SECRET=your-jwt-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@astermedicines.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server (Turbopack) |
| **build** | `npm run build` | Create production build |
| **start** | `npm run start` | Run production server |
| **lint** | `npm run lint` | Run ESLint |

---

## 🔌 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/[slug]` | Get product by slug |
| GET | `/api/categories` | List all categories |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/track-visit` | Log visitor data |

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/callback/credentials` | Login |
| GET | `/api/auth/session` | Get session |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/visitors` | Get visitor logs |
| DELETE | `/api/admin/visitors` | Delete visitor logs |
| POST | `/api/products` | Create product |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |

---

## 🗃️ Database Models

### Product
```typescript
{
  name: string;
  slug: string;
  category: string;
  description: string;
  composition: string;
  packaging: string;
  therapeutic: string[];
  images: string[];
  featured: boolean;
}
```

### Visitor
```typescript
{
  ip: string;
  userAgent: string;
  device: string;          // Parsed device name
  path: string;
  location: { city, country, region };
  isp: string;
  coordinates: { lat, lon };
  screenResolution: string;
  language: string;
  visitedAt: Date;
}
```

### User
```typescript
{
  email: string;
  password: string;        // Hashed with bcrypt
  role: 'admin';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
```

### Contact
```typescript
{
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  images: string[];
  createdAt: Date;
}
```

---

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected admin routes via middleware
- ✅ CSRF protection via NextAuth
- ✅ Input validation
- ✅ Obfuscated admin login URL

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

- **Website**: [astermedicines.com](https://www.astermedicines.com)
- **Email**: support@astermedicines.com

---

**Made with ❤️ by Aster Medicines Team**

*Last Updated: February 4, 2026*
