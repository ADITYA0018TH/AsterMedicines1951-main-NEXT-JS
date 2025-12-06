# Aster Medicines

A modern, futuristic web application for Aster Medicines, built with Next.js and Tailwind CSS.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Language:** TypeScript

## 📂 Project Structure

The project is organized as follows:

```
.
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── background-section1.png
│   ├── background-section2.png
│   ├── background-section3.png
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── Header-background.webp
│   ├── loop-animation.webm
│   ├── loop-header.lottie
│   ├── My-uploads
│   │   ├── ... (various image uploads)
│   ├── next.svg
│   ├── og-image-update.png
│   ├── og-image.png
│   ├── placeholder.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── text-mask-image.jpg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── app
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── admin
│   │   │   ├── dashboard
│   │   │   ├── messages
│   │   │   └── products
│   │   ├── api
│   │   │   ├── auth
│   │   │   ├── categories
│   │   │   ├── contact
│   │   │   ├── products
│   │   │   └── upload
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── products
│   │       ├── [id]
│   │       └── page.tsx
│   ├── components
│   │   ├── AboutContent.tsx
│   │   ├── AdminDashboardContent.tsx
│   │   ├── AdminMessagesContent.tsx
│   │   ├── AdminProductsContent.tsx
│   │   ├── AnimatedList.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── BulkInquiryForm.tsx
│   │   ├── ContactContent.tsx
│   │   ├── container-scroll-animation.tsx
│   │   ├── core
│   │   │   └── animated-background.tsx
│   │   ├── CTA.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── DetailsSection.tsx
│   │   ├── DotGrid.tsx
│   │   ├── EnhancedLoader.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── GlassSurface.tsx
│   │   ├── Hero.tsx
│   │   ├── HomeContent.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── HumanIntuitionSection.tsx
│   │   ├── HumanoidSection.tsx
│   │   ├── ImageDropzone.tsx
│   │   ├── ImageShowcaseSection.tsx
│   │   ├── LoadingProvider.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoginContent.tsx
│   │   ├── LottieAnimation.tsx
│   │   ├── MadeByHumans.tsx
│   │   ├── Navbar.tsx
│   │   ├── Newsletter.tsx
│   │   ├── PageLoader.tsx
│   │   ├── PageTransition.tsx
│   │   ├── ProductComparison.tsx
│   │   ├── ProductDetailContent.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductsContent.tsx
│   │   ├── ProductSearch.tsx
│   │   ├── ProfileCard.css
│   │   ├── ProfileCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Providers.tsx
│   │   ├── RecentlyViewed.tsx
│   │   ├── RobotShowcaseSection.tsx
│   │   ├── ScrambledText.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── SectionLoader.tsx
│   │   ├── SEO.tsx
│   │   ├── SpecsSection.tsx
│   │   ├── SuccessNotification.tsx
│   │   ├── Testimonials.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── floating-navbar.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   ├── data
│   │   ├── products.ts
│   │   └── structuredData.ts
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useRecentlyViewed.ts
│   ├── lib
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── models
│   │   ├── Contact.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   ├── services
│   │   └── api.ts
│   └── utils
│       ├── schemaGenerators.ts
│       └── sitemap.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd AsterMedicines1951-main NEXT JS
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint to catch code quality issues.

## 🎨 Features

-   **Responsive Design:** Fully responsive layout optimized for all devices.
-   **Modern UI:** Glassmorphism effects, smooth animations, and a futuristic aesthetic.
-   **Admin Dashboard:** Secure admin area for managing products and messages.
-   **Dynamic Routing:** Next.js App Router for efficient navigation.
