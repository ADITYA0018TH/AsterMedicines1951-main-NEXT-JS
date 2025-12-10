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
📦 .
├── 🔧 .gitattributes
├── 🙈 .gitignore
├── 📜 eslint.config.mjs
├── 📜 migrate_paths.js
├── 📘 next-env.d.ts
├── ⚙️ next.config.ts
├── 🔒 package-lock.json
├── 📦 package.json
├── 🎨 postcss.config.mjs
├── 📁 public
│   ├── 🎬 Animated_Logo.mp4
│   ├── � My-uploads
│   ├── �🖼️ background-section1.webp
│   ├── 🖼️ background-section2.png
│   ├── 🖼️ background-section3.webp
│   ├── �️ favicon.ico
│   ├── 🏷️ favicon2.ico
│   ├── 📄 file.svg
│   ├── 🌐 globe.svg
│   ├── �🎥 loop-animation.webm
│   ├── 🎞️ loop-header.lottie
│   ├── ️⚡ next.svg
│   ├── 🖼️ og-image-update.webp
│   ├── 🖼️ og-image.png
│   ├── 🖼️ placeholder.svg
│   ├── 🤖 robots.txt
│   ├── 🗺️ sitemap.xml
│   ├── ▲ vercel.svg
│   └── 🪟 window.svg
├── 📖 README.md
├── 📂 src
│   ├── 🚀 app
│   │   ├── 📂 about
│   │   │   └── 📄 page.tsx
│   │   ├── 📂 admin
│   │   │   ├── 📂 dashboard
│   │   │   ├── 📂 messages
│   │   │   └── 📂 products
│   │   ├── 📂 api
│   │   │   ├── 📂 auth
│   │   │   ├── 📂 categories
│   │   │   ├── 📂 contact
│   │   │   ├── 📂 products
│   │   │   └── 📂 upload
│   │   ├── 📂 contact
│   │   │   └── 📄 page.tsx
│   │   ├── 📂 login
│   │   │   └── 📄 page.tsx
│   │   ├── 📂 products
│   │   │   ├── � [id]
│   │   │   └── �📄 page.tsx
│   │   ├── 🏷️ favicon.ico
│   │   ├── 🏷️ favicon1.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 not-found.tsx
│   │   ├── 📄 page.tsx
│   │   ├── � robots.ts
│   │   └── 🗺️ sitemap.ts
│   ├── �🧩 components
│   │   ├── ℹ️ AboutContent.tsx
│   │   ├── � AdminDashboardContent.tsx
│   │   ├── 💬 AdminMessagesContent.tsx
│   │   ├── 📦 AdminProductsContent.tsx
│   │   ├── 📝 AnimatedList.tsx
│   │   ├── 🍞 Breadcrumb.tsx
│   │   ├── � BulkInquiryForm.tsx
│   │   ├── 📣 CTA.tsx
│   │   ├── 📣 CallToAction.tsx
│   │   ├── 📞 ContactContent.tsx
│   │   ├── 🖱️ CustomCursor.tsx
│   │   ├── 🔍 DetailsSection.tsx
│   │   ├── ▦ DotGrid.tsx
│   │   ├── ⏳ EnhancedLoader.tsx
│   │   ├── 🌟 FeaturedProducts.tsx
│   │   ├── ✨ Features.tsx
│   │   ├── 🦶 Footer.tsx
│   │   ├── ❄️ GlassSurface.tsx
│   │   ├── 🦸 Hero.tsx
│   │   ├── 🏠 HomeContent.tsx
│   │   ├── ❓ HowItWorks.tsx
│   │   ├── 🧠 HumanIntuitionSection.tsx
│   │   ├── 🤖 HumanoidSection.tsx
│   │   ├── 📤 ImageDropzone.tsx
│   │   ├── 🖼️ ImageShowcaseSection.tsx
│   │   ├── 💡 InnovationSection.tsx
│   │   ├── ⏳ LoadingProvider.tsx
│   │   ├── 🔄 LoadingSpinner.tsx
│   │   ├── 🔑 LoginContent.tsx
│   │   ├── 🎞️ LottieAnimation.tsx
│   │   ├── 🤝 MadeByHumans.tsx
│   │   ├── 🧭 Navbar.tsx
│   │   ├── 📰 Newsletter.tsx
│   │   ├── ⏳ PageLoader.tsx
│   │   ├── 🔄 PageTransition.tsx
│   │   ├── 🤝 PartnerLogos.tsx
│   │   ├── ⚖️ ProductComparison.tsx
│   │   ├── 📄 ProductDetailContent.tsx
│   │   ├── 🔍 ProductFilters.tsx
│   │   ├── 🔍 ProductSearch.tsx
│   │   ├── 🛍️ ProductsContent.tsx
│   │   ├── 🎨 ProfileCard.css
│   │   ├── 👤 ProfileCard.tsx
│   │   ├── 🛡️ ProtectedRoute.tsx
│   │   ├── 🔌 Providers.tsx
│   │   ├── 🕒 RecentlyViewed.tsx
│   │   ├── 🤖 RobotShowcaseSection.tsx
│   │   ├── 🔍 SEO.tsx
│   │   ├── 🔠 ScrambledText.tsx
│   │   ├── 📜 ScrollReveal.tsx
│   │   ├── ⏳ SectionLoader.tsx
│   │   ├── 📋 SpecsSection.tsx
│   │   ├── ✅ SuccessNotification.tsx
│   │   ├── 💬 Testimonials.tsx
│   │   ├── 🎨 ThemeToggle.css
│   │   ├── 🌓 ThemeToggle.tsx
│   │   ├── ⏱️ TimelineSection.tsx
│   │   ├── 🤝 TrustSection.tsx
│   │   ├── ❓ WhyChooseUs.tsx
│   │   ├── 📜 container-scroll-animation.tsx
│   │   └── 📂 ui
│   │       ├── 🧊 Button3D.tsx
│   │       ├── ❄️ GlassSurface.tsx
│   │       ├── 🍱 MagicBento.tsx
│   │       ├── 📑 accordion.tsx
│   │       ├── � alert-dialog.tsx
│   │       ├── ⚠️ alert.tsx
│   │       ├── 📐 aspect-ratio.tsx
│   │       ├── 👤 avatar.tsx
│   │       ├── 📛 badge.tsx
│   │       ├── 🍱 bento-grid.tsx
│   │       ├── 🍞 breadcrumb.tsx
│   │       ├── 🔘 button.tsx
│   │       ├── 📅 calendar.tsx
│   │       ├── 🃏 card.tsx
│   │       ├── 🎠 carousel.tsx
│   │       ├── �📊 chart.tsx
│   │       ├── ☑️ checkbox.tsx
│   │       ├── 🔽 collapsible.tsx
│   │       ├── ⌨️ command.tsx
│   │       ├── 🖱️ context-menu.tsx
│   │       ├── 💬 dialog.tsx
│   │       ├── 🗄️ drawer.tsx
│   │       ├── 🔽 dropdown-menu.tsx
│   │       ├── � floating-navbar.tsx
│   │       ├── 📝 form.tsx
│   │       ├── 🃏 hover-card.tsx
│   │       ├── 🔢 input-otp.tsx
│   │       ├── ⌨️ input.tsx
│   │       ├── 🏷️ label.tsx
│   │       ├── ☰ menubar.tsx
│   │       ├── 🧭 navigation-menu.tsx
│   │       ├── 📄 pagination.tsx
│   │       ├── 💬 popover.tsx
│   │       ├── 📊 progress.tsx
│   │       ├── 🔘 radio-group.tsx
│   │       ├── ↔️ resizable.tsx
│   │       ├── 📜 scroll-area.tsx
│   │       ├── 🔽 select.tsx
│   │       ├── ➖ separator.tsx
│   │       ├── 📄 sheet.tsx
│   │       ├── 📑 sidebar.tsx
│   │       ├── 💀 skeleton.tsx
│   │       ├── 🎚️ slider.tsx
│   │       ├── 🔔 sonner.tsx
│   │       ├── 🔘 switch.tsx
│   │       ├── ▦ table.tsx
│   │       ├── 📑 tabs.tsx
│   │       ├── ✨ text-generate-effect.tsx
│   │       ├── 📝 textarea.tsx
│   │       ├── 🍞 toast.tsx
│   │       ├── 🍞 toaster.tsx
│   │       ├── 🔘 toggle-group.tsx
│   │       ├── 🔘 toggle.tsx
│   │       ├── 💬 tooltip.tsx
│   │       └── 🍞 use-toast.ts
│   ├── 📊 data
│   │   ├── 📄 products.ts
│   │   └── 📄 structuredData.ts
│   ├── �🪝 hooks
│   │   ├── 📱 use-mobile.tsx
│   │   ├── 🍞 use-toast.ts
│   │   └── 🕒 useRecentlyViewed.ts
│   ├── 📚 lib
│   │   ├── 🗄️ db.ts
│   │   └── 🛠️ utils.ts
│   ├── 🛡️ middleware.ts
│   ├── 🗃️ models
│   │   ├── 📄 Contact.ts
│   │   ├── 📄 Product.ts
│   │   └── 👤 User.ts
│   ├── 🛡️ proxy.ts
│   ├── 🔌 services
│   │   └── 📄 api.ts
│   └── 🛠️ utils
│       ├── 📄 schemaGenerators.ts
│       └── 🗺️ sitemap.ts
├── 🎨 tailwind.config.ts
└── ⚙️ tsconfig.json
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
    npm i --legacy-peer-deps
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
