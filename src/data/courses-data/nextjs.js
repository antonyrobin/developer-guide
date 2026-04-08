export const nextjsCourse = {
  id: 'nextjs', title: 'Next.js', description: 'The React framework for building full-stack web applications with SSR, SSG, and App Router.',
  officialDocs: 'https://nextjs.org/docs', tutorialLink: 'https://nextjs.org/learn', exerciseLink: 'https://nextjs.org/learn/dashboard-app',
  sections: [
    {
      title: 'What is Next.js',
      image: '/images/nextjs/nextjs-architecture.svg',
      content: `**Next.js** is a React-based framework developed by **Vercel** that provides everything you need to build production-ready, full-stack web applications. It extends React with powerful features like Server-Side Rendering (SSR), Static Site Generation (SSG), file-based routing, and built-in API routes.

### Why Next.js?

Plain React is a **UI library** — it handles only the view layer. For a production app you need routing, data fetching, server rendering, optimization, and deployment tooling. Next.js provides all of this out of the box:

- **Server-Side Rendering (SSR)** — Pages rendered on the server for faster initial load and SEO
- **Static Site Generation (SSG)** — Pre-build pages at build time for maximum performance
- **Incremental Static Regeneration (ISR)** — Update static pages without full rebuild
- **App Router** — File-system-based routing with layouts, loading states, and error boundaries
- **Server Components** — Components that run only on the server, reducing client bundle size
- **API Routes** — Backend-for-frontend (BFF) pattern built into the framework
- **Edge Middleware** — Runs at the edge for fast JWT validation and redirects

### How It Fits in a Stack

\`\`\`text
Browser → CDN → Next.js App → API Gateway → Backend Services → Database
                   │
                   ├── Server Components (SSR)
                   ├── API Routes (JWT proxy / BFF)
                   └── Client Components (interactivity)
\`\`\`

Next.js can serve as both the **frontend** and **backend-for-frontend**, handling secure cookie-based auth, proxying API requests, and rendering pages on the server — all in one framework.`,
      keyPoints: [
        'Next.js is a full-stack React framework by Vercel.',
        'Provides SSR, SSG, ISR, and file-based routing out of the box.',
        'Server Components reduce client bundle size.',
        'App Router is the modern, recommended routing system.',
        'Can serve as both frontend and backend-for-frontend (BFF).'
      ]
    },

    {
      title: 'Installation & Setup',
      content: `### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Node.js** | 20.x LTS or 22.x | JavaScript runtime |
| **npm / pnpm** | npm 10+ / pnpm 9+ | Package manager |
| **VS Code** | Latest | IDE |

### Create a New Next.js Project

\`\`\`bash
# Create project with App Router (interactive wizard)
npx create-next-app@latest my-app

# Selections:
# ✔ TypeScript?          → Yes
# ✔ ESLint?              → Yes
# ✔ Tailwind CSS?        → Yes
# ✔ src/ directory?      → Yes
# ✔ App Router?          → Yes
# ✔ Turbopack?           → Yes
# ✔ Import alias?        → Yes (@/*)

cd my-app
npm run dev
\`\`\`

### Using pnpm (Recommended)

\`\`\`bash
# Enable corepack (ships with Node.js)
corepack enable
corepack prepare pnpm@latest --activate

# Create project with pnpm
pnpm create next-app@latest my-app
cd my-app
pnpm dev
\`\`\`

### Project Structure

\`\`\`text
my-app/
├── public/                  # Static assets (images, fonts)
├── src/
│   ├── app/                 # App Router (routes & pages)
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (/)
│   │   ├── loading.tsx      # Loading state
│   │   ├── error.tsx        # Error boundary
│   │   └── not-found.tsx    # 404 page
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities & helpers
│   └── middleware.ts        # Edge middleware
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── package.json
\`\`\`

### Core Dependencies

\`\`\`bash
# Essential libraries
pnpm add zod                          # Validation
pnpm add react-hook-form              # Forms
pnpm add @tanstack/react-query        # Client data fetching
pnpm add zustand                      # State management
pnpm add lucide-react                 # Icons
pnpm add clsx tailwind-merge          # Utility classes
\`\`\``,
      keyPoints: [
        'Use create-next-app with App Router and TypeScript.',
        'pnpm is recommended for faster installs and strict dependencies.',
        'src/app/ directory is the App Router root.',
        'Turbopack provides faster dev server startup.'
      ]
    },

    {
      title: 'App Router & Routing',
      image: '/images/nextjs/nextjs-app-router.svg',
      content: `The **App Router** (introduced in Next.js 13) uses the file system to define routes. Every folder inside \`src/app/\` becomes a URL segment — just create a \`page.tsx\` file to make it accessible.

### File Conventions

| File | Purpose |
|---|---|
| \`page.tsx\` | UI for a route — makes it publicly accessible |
| \`layout.tsx\` | Shared UI that wraps child pages (preserves state) |
| \`loading.tsx\` | Loading skeleton (auto-wrapped in Suspense) |
| \`error.tsx\` | Error boundary for the route |
| \`not-found.tsx\` | 404 UI |
| \`route.ts\` | API endpoint (no UI) |

### Route Examples

\`\`\`text
src/app/
├── page.tsx                    → /
├── about/page.tsx              → /about
├── blog/page.tsx               → /blog
├── blog/[slug]/page.tsx        → /blog/hello-world (dynamic)
├── shop/[...slug]/page.tsx     → /shop/clothes/tops (catch-all)
├── (marketing)/pricing/page.tsx → /pricing (route group)
└── api/users/route.ts          → GET/POST /api/users
\`\`\`

### Dynamic Routes

\`\`\`tsx
// src/app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

### Route Groups

Parentheses create route groups that **don't affect the URL** — useful for organizing routes with different layouts:

\`\`\`text
src/app/
├── (auth)/              # Route group — no /auth in URL
│   ├── login/page.tsx   → /login
│   └── register/page.tsx → /register
├── (dashboard)/         # Separate layout group
│   ├── layout.tsx       # Dashboard layout (sidebar)
│   └── settings/page.tsx → /settings
\`\`\`

### Navigation

\`\`\`tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Declarative navigation
<Link href="/about">About</Link>
<Link href={\`/blog/\${slug}\`}>Read More</Link>

// Programmatic navigation (Client Components only)
const router = useRouter();
router.push('/dashboard');
router.replace('/login');
router.back();
\`\`\``,
      keyPoints: [
        'Folders = URL segments. page.tsx makes a route accessible.',
        'layout.tsx wraps child pages and preserves state on navigation.',
        '[slug] creates dynamic routes; [...slug] creates catch-all routes.',
        'Route groups (parentheses) organize without affecting URLs.',
        'Use <Link> for navigation with automatic prefetching.'
      ]
    },

    {
      title: 'Layouts & Templates',
      content: `**Layouts** are the backbone of Next.js UI architecture. A layout wraps its child pages and **persists across navigations** — it doesn't re-render when you navigate between sibling pages.

### Root Layout (Required)

Every Next.js app must have a root layout that wraps the entire application:

\`\`\`tsx
// src/app/layout.tsx — Root Layout (REQUIRED)
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>/* Global navigation */</nav>
        <main>{children}</main>
        <footer>/* Global footer */</footer>
      </body>
    </html>
  );
}
\`\`\`

### Nested Layouts

Each route segment can have its own layout that nests inside the parent:

\`\`\`tsx
// src/app/(dashboard)/layout.tsx — Dashboard Layout
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
\`\`\`

### Templates vs Layouts

\`template.tsx\` is similar to \`layout.tsx\` but **re-mounts on every navigation** — creating a new instance each time. Use it when you need:

- Enter/exit animations
- Features that rely on \`useEffect\` running on each navigation
- Resetting state on page change

\`\`\`tsx
// src/app/template.tsx — Re-renders on every navigation
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
\`\`\`

### Loading & Error States

\`\`\`tsx
// src/app/(dashboard)/loading.tsx — Auto Suspense boundary
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
\`\`\`

\`\`\`tsx
// src/app/(dashboard)/error.tsx — Error boundary
'use client'; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
\`\`\``,
      keyPoints: [
        'Root layout.tsx is required — wraps the entire app with <html> and <body>.',
        'Layouts persist across navigations; they don\'t re-render.',
        'Templates re-mount on every navigation — useful for animations.',
        'loading.tsx automatically creates a Suspense boundary.',
        'error.tsx must be a Client Component with a reset function.'
      ]
    },

    {
      title: 'Server & Client Components',
      image: '/images/nextjs/nextjs-server-vs-client.svg',
      content: `In the App Router, all components are **Server Components by default**. They run only on the server, send zero JavaScript to the browser, and can directly access databases, APIs, and file systems.

### Server Components (Default)

\`\`\`tsx
// This is a Server Component (NO 'use client' directive)
// src/app/products/page.tsx
import { db } from '@/lib/database';

export default async function ProductsPage() {
  // Runs on the server — direct database access!
  const products = await db.query('SELECT * FROM products');

  return (
    <div>
      <h1>Products ({products.length})</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} — \${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

### Client Components

Add \`'use client'\` at the top of a file to make it a Client Component. Use these **only when you need interactivity**:

\`\`\`tsx
'use client';
// src/components/add-to-cart.tsx
import { useState } from 'react';

export function AddToCart({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    setAdding(false);
  };

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min={1}
      />
      <button onClick={handleAdd} disabled={adding}>
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
\`\`\`

### Composition Pattern — Mix Both

The key pattern: keep pages as **Server Components** and extract interactive parts into **Client Components**:

\`\`\`tsx
// Server Component (page) — fetches data on the server
// src/app/products/[id]/page.tsx
import { AddToCart } from '@/components/add-to-cart';
import { getProduct } from '@/lib/products';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>\${product.price}</p>
      {/* Client Component handles interactivity */}
      <AddToCart productId={id} />
    </div>
  );
}
\`\`\`

### When to Use Which?

| Need | Component Type |
|---|---|
| Fetch data, access DB | **Server Component** |
| Access secrets/env vars | **Server Component** |
| Display static content | **Server Component** |
| onClick, onChange events | **Client Component** |
| useState, useEffect | **Client Component** |
| Browser APIs (window, localStorage) | **Client Component** |`,
      keyPoints: [
        'All components are Server Components by default in App Router.',
        'Add \'use client\' only when you need state, effects, or event handlers.',
        'Server Components can directly access databases and APIs.',
        'Composition: Server page + Client interactive children.',
        'Server Components send zero JavaScript to the browser.'
      ]
    },

    {
      title: 'CSS Styling',
      content: `Next.js supports multiple styling approaches out of the box. The recommended approach is **Tailwind CSS** (selected during \`create-next-app\`).

### 1. Tailwind CSS (Recommended)

\`\`\`tsx
// Utility-first CSS — no separate stylesheet needed
export default function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-sm
                    hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
\`\`\`

### 2. CSS Modules

Scoped CSS that avoids class name collisions:

\`\`\`css
/* src/components/button.module.css */
.primary {
  background-color: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}
.primary:hover {
  background-color: #0060df;
}
\`\`\`

\`\`\`tsx
import styles from './button.module.css';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.primary}>{children}</button>;
}
\`\`\`

### 3. Global CSS

\`\`\`tsx
// src/app/layout.tsx — import global styles in root layout
import './globals.css';
\`\`\`

### 4. CSS-in-JS (styled-jsx)

Next.js has built-in support for styled-jsx:

\`\`\`tsx
export default function Alert() {
  return (
    <div className="alert">
      <p>This is styled with styled-jsx</p>
      <style jsx>{\`
        .alert {
          padding: 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
        }
      \`}</style>
    </div>
  );
}
\`\`\`

### clsx + tailwind-merge (Conditional Classes)

\`\`\`tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility to merge Tailwind classes safely
function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}

// Usage
<button className={cn(
  'px-4 py-2 rounded font-medium',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
  {children}
</button>
\`\`\``,
      keyPoints: [
        'Tailwind CSS is the recommended styling approach in Next.js.',
        'CSS Modules (*.module.css) scope styles locally.',
        'Import global CSS only in the root layout.tsx.',
        'Use clsx + tailwind-merge for conditional class merging.'
      ]
    },

    {
      title: 'Fonts & Images',
      content: `Next.js provides built-in components for font and image optimization — reducing layout shift and improving Core Web Vitals automatically.

### Font Optimization (next/font)

\`next/font\` self-hosts fonts at build time — no external requests to Google Fonts at runtime:

\`\`\`tsx
// src/app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${robotoMono.variable}\`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
\`\`\`

### Image Optimization (next/image)

The \`<Image>\` component optimizes images automatically — lazy loading, responsive sizing, WebP/AVIF conversion:

\`\`\`tsx
import Image from 'next/image';

// Local image (auto width/height detection)
import heroImage from '@/assets/hero.png';

export default function Hero() {
  return (
    <div>
      {/* Local image — dimensions detected automatically */}
      <Image
        src={heroImage}
        alt="Hero banner"
        priority  // Load immediately (above-the-fold)
        placeholder="blur"  // Show blur while loading
      />

      {/* Remote image — must specify dimensions */}
      <Image
        src="https://example.com/photo.jpg"
        alt="Product photo"
        width={800}
        height={600}
        className="rounded-lg"
      />
    </div>
  );
}
\`\`\`

### Configuring Remote Images

\`\`\`typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
};
export default nextConfig;
\`\`\`

### Key Optimizations

| Feature | Benefit |
|---|---|
| **Lazy loading** | Images load only when entering viewport |
| **Responsive sizes** | Serves right size for each device |
| **WebP/AVIF** | Modern formats, smaller file sizes |
| **Blur placeholder** | Shows blurred preview while loading |
| **priority** | Preloads above-the-fold images |
| **Font self-hosting** | Zero external requests, no layout shift |`,
      keyPoints: [
        'next/font self-hosts Google Fonts — no external requests.',
        'next/image provides automatic lazy loading and format optimization.',
        'Use priority prop for above-the-fold images.',
        'Remote images require width/height and remotePatterns config.',
        'Font and image optimization improve Core Web Vitals scores.'
      ]
    },

    {
      title: 'Data Fetching',
      image: '/images/nextjs/nextjs-data-fetching.svg',
      content: `Next.js provides multiple patterns for data fetching. The primary approach in the App Router is fetching data directly in **Server Components** using \`async/await\`.

### Pattern 1: Server Component (Direct Fetch)

\`\`\`tsx
// src/app/products/page.tsx — Server Component
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 }, // Cache for 60 seconds (ISR)
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product: any) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Pattern 2: Parallel Data Fetching

\`\`\`tsx
// Fetch multiple resources in parallel (faster!)
export default async function DashboardPage() {
  // Start all fetches at the same time
  const [orders, products, stats] = await Promise.all([
    getOrders(),
    getProducts(),
    getStats(),
  ]);

  return (
    <div>
      <StatsCards stats={stats} />
      <OrdersTable orders={orders} />
      <ProductList products={products} />
    </div>
  );
}
\`\`\`

### Pattern 3: Server Actions (Mutations)

\`\`\`tsx
// src/app/products/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));

  await fetch('https://api.example.com/products', {
    method: 'POST',
    body: JSON.stringify({ name, price }),
    headers: { 'Content-Type': 'application/json' },
  });

  revalidatePath('/products'); // Refresh the products page
}
\`\`\`

\`\`\`tsx
// src/app/products/new/page.tsx — Use Server Action in form
import { createProduct } from '../actions';

export default function NewProductPage() {
  return (
    <form action={createProduct}>
      <input name="name" placeholder="Product name" required />
      <input name="price" type="number" placeholder="Price" required />
      <button type="submit">Create Product</button>
    </form>
  );
}
\`\`\`

### Pattern 4: Route Handlers (API Routes)

\`\`\`typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  const products = await db.products.findMany({
    where: query ? { name: { contains: query } } : undefined,
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await db.products.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}
\`\`\``,
      keyPoints: [
        'Fetch data directly in Server Components with async/await.',
        'Use Promise.all() for parallel data fetching.',
        'Server Actions handle mutations with \'use server\' directive.',
        'revalidatePath/revalidateTag refresh cached data after mutations.',
        'Route Handlers create API endpoints for external consumers.'
      ]
    },

    {
      title: 'Rendering Strategies',
      image: '/images/nextjs/nextjs-rendering.svg',
      content: `Next.js supports multiple rendering strategies — and it **automatically chooses** the best one based on your code. You can also configure it explicitly.

### Static Rendering (SSG) — Default

Pages with no dynamic data are statically rendered at build time:

\`\`\`tsx
// This page is automatically static (no dynamic data)
export default function AboutPage() {
  return <h1>About Us</h1>;
}
\`\`\`

### Dynamic Rendering (SSR)

Pages that use dynamic functions (\`cookies()\`, \`headers()\`, \`searchParams\`) are rendered on each request:

\`\`\`tsx
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // Using cookies() makes this page dynamic (SSR)
  const cookieStore = await cookies();
  const token = cookieStore.get('session');

  const data = await fetchDashboard(token?.value);
  return <Dashboard data={data} />;
}
\`\`\`

### Incremental Static Regeneration (ISR)

Static pages that revalidate after a configured time:

\`\`\`tsx
// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products');
  return <ProductList products={await products.json()} />;
}
\`\`\`

### Force Static or Dynamic

\`\`\`tsx
// Force dynamic rendering (SSR on every request)
export const dynamic = 'force-dynamic';

// Force static rendering (build-time only)
export const dynamic = 'force-static';

// Error if page tries to use dynamic features
export const dynamic = 'error';
\`\`\`

### Static Params (Pre-render Dynamic Routes)

\`\`\`tsx
// src/app/blog/[slug]/page.tsx
// Pre-render these paths at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.content}</article>;
}
\`\`\`

### Comparison

| Strategy | When HTML Generated | Data Freshness | Speed |
|---|---|---|---|
| **SSG** | Build time | Stale until rebuild | ⚡ Fastest |
| **ISR** | Build + revalidate | Fresh after interval | ⚡ Fast |
| **SSR** | Every request | Always fresh | 🔄 Per-request |`,
      keyPoints: [
        'Next.js automatically chooses static or dynamic rendering.',
        'SSG (default): HTML at build time — fastest.',
        'ISR: Static + revalidate periodically — best of both worlds.',
        'SSR: Fresh on every request — for dynamic user-specific data.',
        'generateStaticParams pre-renders dynamic routes at build time.'
      ]
    },

    {
      title: 'Streaming & Suspense',
      image: '/images/nextjs/nextjs-streaming.svg',
      content: `**Streaming** allows you to progressively render UI from the server. Instead of waiting for all data to load before sending HTML, Next.js sends the page **shell immediately** and streams in content as it becomes ready.

### How Streaming Works

1. Server sends the **layout shell** instantly (nav, sidebar, footer)
2. Slow data-fetching components show a **loading skeleton**
3. When data arrives, the component **streams in** and replaces the skeleton
4. User sees content progressively — no blank screen waiting

### loading.tsx (Automatic Streaming)

The simplest way — create a \`loading.tsx\` file in any route folder:

\`\`\`tsx
// src/app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
\`\`\`

### Suspense (Granular Control)

For more control, wrap individual components in \`<Suspense>\`:

\`\`\`tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This loads instantly */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />  {/* Streams in when data ready */}
      </Suspense>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<TableSkeleton />}>
          <RecentOrders />  {/* Independent stream */}
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />  {/* Independent stream */}
        </Suspense>
      </div>
    </div>
  );
}
\`\`\`

Each \`<Suspense>\` boundary streams independently — fast components appear first, slow ones stream in later.

### Streaming Server Components

\`\`\`tsx
// This component fetches data — it will be streamed
async function RecentOrders() {
  // This fetch might take 2 seconds
  const orders = await fetch('https://api.example.com/orders', {
    cache: 'no-store',
  });
  const data = await orders.json();

  return (
    <table>
      {data.map((order: any) => (
        <tr key={order.id}>
          <td>{order.customer}</td>
          <td>\${order.total}</td>
        </tr>
      ))}
    </table>
  );
}
\`\`\``,
      keyPoints: [
        'Streaming sends the page shell instantly — no blank screen.',
        'loading.tsx auto-wraps page.tsx in a Suspense boundary.',
        'Use <Suspense> for granular control over loading states.',
        'Each Suspense boundary streams independently.',
        'Slow components don\'t block fast ones from rendering.'
      ]
    },

    {
      title: 'Search & Pagination',
      content: `Next.js encourages using **URL search params** for search and pagination state. This makes the state shareable, bookmarkable, and works with server rendering.

### Search with URL Params

\`\`\`tsx
// src/app/products/page.tsx — Server Component reads search params
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q: query = '', page = '1' } = await searchParams;
  const currentPage = Number(page);

  const { products, totalPages } = await getProducts({
    query,
    page: currentPage,
    pageSize: 10,
  });

  return (
    <div>
      <SearchBar defaultValue={query} />
      <ProductList products={products} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
\`\`\`

### Search Input (Client Component)

\`\`\`tsx
'use client';
// src/components/search-bar.tsx
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar({ defaultValue }: { defaultValue: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on new search
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(\`\${pathname}?\${params.toString()}\`);
  }, 300);

  return (
    <input
      type="search"
      placeholder="Search products..."
      defaultValue={defaultValue}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full rounded-md border px-4 py-2"
    />
  );
}
\`\`\`

### Pagination Component

\`\`\`tsx
'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return \`?\${params.toString()}\`;
  };

  return (
    <div className="flex gap-2">
      <Link
        href={createPageURL(currentPage - 1)}
        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
      >
        Previous
      </Link>
      <span>{currentPage} / {totalPages}</span>
      <Link
        href={createPageURL(currentPage + 1)}
        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
      >
        Next
      </Link>
    </div>
  );
}
\`\`\``,
      keyPoints: [
        'Use URL search params for search/filter/pagination state.',
        'searchParams in Server Components reads URL query parameters.',
        'Debounce search input to avoid excessive requests.',
        'Reset page to 1 when search query changes.',
        'URL-based state is shareable, bookmarkable, and SSR-compatible.'
      ]
    },

    {
      title: 'Server Actions & Mutations',
      content: `**Server Actions** are asynchronous functions that execute on the server. They can be called from both Server and Client Components to handle form submissions, data mutations, and more.

### Defining Server Actions

\`\`\`tsx
// Option 1: In a separate file with 'use server' at the top
// src/app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().positive('Price must be positive'),
  description: z.string().optional(),
});

export async function createProduct(prevState: any, formData: FormData) {
  // Validate input
  const validated = ProductSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    description: formData.get('description'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  // Mutate data
  await db.products.create({ data: validated.data });

  // Revalidate cache and redirect
  revalidatePath('/products');
  redirect('/products');
}
\`\`\`

### Using Server Actions in Forms

\`\`\`tsx
'use client';
import { useActionState } from 'react';
import { createProduct } from '../actions';

export function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, {
    errors: {},
    message: '',
  });

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Product Name</label>
        <input id="name" name="name" required />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input id="price" name="price" type="number" step="0.01" required />
        {state.errors?.price && (
          <p className="text-red-500">{state.errors.price}</p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
\`\`\`

### Server Actions Outside Forms

\`\`\`tsx
'use client';

export function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    // Call server action directly
    await deleteProduct(id);
  };

  return (
    <button onClick={handleDelete} className="text-red-600">
      Delete
    </button>
  );
}
\`\`\`

### Key Benefits

| Feature | Description |
|---|---|
| **Progressive Enhancement** | Forms work even without JavaScript |
| **Type Safety** | Full TypeScript support with Zod validation |
| **Revalidation** | \`revalidatePath\` / \`revalidateTag\` refresh stale data |
| **Redirect** | \`redirect()\` navigates after mutation |
| **Error Handling** | Return error state to display validation messages |`,
      keyPoints: [
        'Server Actions run on the server — marked with \'use server\'.',
        'Can be used in forms (action prop) or called directly.',
        'Use Zod for server-side validation in actions.',
        'useActionState provides pending state and error handling.',
        'Forms with Server Actions work without JavaScript (progressive enhancement).'
      ]
    },

    {
      title: 'Error Handling',
      content: `Next.js provides built-in error handling through special files: \`error.tsx\` for runtime errors and \`not-found.tsx\` for 404 pages.

### error.tsx — Error Boundaries

\`\`\`tsx
// src/app/dashboard/error.tsx
'use client'; // Must be a Client Component

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
\`\`\`

### not-found.tsx — 404 Pages

\`\`\`tsx
// src/app/not-found.tsx — Global 404
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
\`\`\`

### Triggering notFound()

\`\`\`tsx
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound(); // Renders the nearest not-found.tsx
  }

  return <div>{product.name}</div>;
}
\`\`\`

### Error Hierarchy

Errors bubble up to the nearest \`error.tsx\` boundary:

\`\`\`text
app/
├── error.tsx           ← Catches errors from all child routes
├── dashboard/
│   ├── error.tsx       ← Catches dashboard-specific errors
│   └── settings/
│       └── page.tsx    ← Error here → caught by dashboard/error.tsx
└── blog/
    └── page.tsx        ← Error here → caught by app/error.tsx
\`\`\`

### global-error.tsx

To catch errors in the **root layout**, use \`global-error.tsx\`:

\`\`\`tsx
// src/app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
\`\`\``,
      keyPoints: [
        'error.tsx catches runtime errors — must be a Client Component.',
        'not-found.tsx renders 404 pages; triggered by notFound().',
        'Errors bubble up to the nearest error.tsx boundary.',
        'global-error.tsx catches errors from the root layout.',
        'The reset() function retries the failed render.'
      ]
    },

    {
      title: 'Middleware & Authentication',
      image: '/images/nextjs/nextjs-middleware-auth.svg',
      content: `**Middleware** runs before every request, at the edge. It's the ideal place for authentication checks, redirects, and request modification.

### Middleware Setup

\`\`\`typescript
// src/middleware.ts — runs before EVERY matched request
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
\`\`\`

### Secure JWT Login (httpOnly Cookies)

\`\`\`typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Forward to backend auth service
  const response = await fetch(\`\${process.env.BACKEND_URL}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const { access_token, refresh_token, expires_in } = await response.json();

  // Set httpOnly cookies — NEVER accessible via JavaScript
  const res = NextResponse.json({ success: true });

  res.cookies.set('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expires_in,
    path: '/',
  });

  res.cookies.set('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/api/auth',
  });

  return res;
}
\`\`\`

### Logout

\`\`\`typescript
// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('access_token');
  res.cookies.delete('refresh_token');
  return res;
}
\`\`\`

### Auth Best Practices

| Practice | Reason |
|---|---|
| **httpOnly cookies** | XSS-proof — tokens never accessible via JavaScript |
| **secure: true (production)** | Only sent over HTTPS |
| **sameSite: 'lax'** | Prevents CSRF on cross-origin requests |
| **Middleware auth check** | Runs at the edge — fast redirects |
| **Server-side token validation** | Never trust client-side auth state |`,
      keyPoints: [
        'Middleware runs before every request — ideal for auth checks.',
        'Store JWT in httpOnly cookies — immune to XSS attacks.',
        'Use the matcher config to skip static files and images.',
        'API routes handle login/logout by setting/clearing cookies.',
        'Never expose tokens to JavaScript — always use httpOnly.'
      ]
    },

    {
      title: 'Caching & Revalidation',
      image: '/images/nextjs/nextjs-caching.svg',
      content: `Next.js has a multi-layered caching system designed to maximize performance. Understanding these layers helps you control data freshness.

### Caching Layers

| Layer | Where | What | Duration |
|---|---|---|---|
| **Router Cache** | Browser | Prefetched routes | Session |
| **Full Route Cache** | Server | Rendered HTML + RSC payload | Until revalidation |
| **Data Cache** | Server | \`fetch()\` responses | Persistent |
| **Request Memoization** | Server | Duplicate \`fetch()\` calls in one render | Per-request |

### Controlling Cache with fetch()

\`\`\`tsx
// Cached indefinitely (default for GET in Server Components)
const data = await fetch('https://api.example.com/data');

// Revalidate every 60 seconds (ISR)
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
});

// No caching — always fetch fresh
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});

// Tag-based cache — invalidate by tag
const data = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] },
});
\`\`\`

### On-Demand Revalidation

\`\`\`tsx
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateProduct(id: string, data: FormData) {
  await db.products.update({ where: { id }, data: { /* ... */ } });

  // Option 1: Revalidate by path
  revalidatePath('/products');

  // Option 2: Revalidate by tag (more granular)
  revalidateTag('products');

  // Option 3: Revalidate specific page
  revalidatePath(\`/products/\${id}\`);
}
\`\`\`

### Route Segment Config

\`\`\`tsx
// Set revalidation for an entire route segment
export const revalidate = 60; // ISR: revalidate every 60s

// Force dynamic rendering (no cache)
export const dynamic = 'force-dynamic';

// Force static rendering
export const dynamic = 'force-static';
\`\`\`

### Opting Out of Caching

\`\`\`tsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function DashboardPage() {
  // Opt out of caching for this component
  noStore();

  const liveData = await fetchLiveStats();
  return <Stats data={liveData} />;
}
\`\`\``,
      keyPoints: [
        'Next.js caches at 4 layers: Router, Full Route, Data, and Memoization.',
        'Use next: { revalidate: N } for time-based ISR caching.',
        'revalidatePath/revalidateTag for on-demand cache invalidation.',
        'cache: \'no-store\' or noStore() opts out of caching entirely.',
        'Tag-based caching enables granular invalidation.'
      ]
    },

    {
      title: 'Metadata & SEO',
      content: `Next.js has a built-in Metadata API for managing \`<head>\` tags like title, description, Open Graph, and more — critical for SEO.

### Static Metadata

\`\`\`tsx
// src/app/layout.tsx or any page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My App',  // %s replaced by child page title
    default: 'My App',
  },
  description: 'A full-stack app built with Next.js',
  keywords: ['nextjs', 'react', 'web development'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'My App',
    description: 'A full-stack app built with Next.js',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'A full-stack app built with Next.js',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
\`\`\`

### Dynamic Metadata

\`\`\`tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.content}</article>;
}
\`\`\`

### Sitemap & Robots

\`\`\`typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://myapp.com', lastModified: new Date(), priority: 1 },
    { url: 'https://myapp.com/about', lastModified: new Date(), priority: 0.8 },
    { url: 'https://myapp.com/blog', lastModified: new Date(), priority: 0.9 },
  ];
}
\`\`\`

\`\`\`typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://myapp.com/sitemap.xml',
  };
}
\`\`\``,
      keyPoints: [
        'Export metadata object or generateMetadata function from pages.',
        'Title templates (\'%s | My App\') auto-format child page titles.',
        'Dynamic metadata fetches data for SEO tags at render time.',
        'sitemap.ts and robots.ts auto-generate /sitemap.xml and /robots.txt.',
        'Open Graph and Twitter cards improve social media sharing.'
      ]
    },

    {
      title: 'Performance Optimization',
      content: `Next.js is optimized for performance by default. Here are the key techniques and built-in features to maximize speed.

### Built-in Optimizations

| Feature | What It Does |
|---|---|
| **Server Components** | Zero client JS for non-interactive components |
| **Code Splitting** | Each route loads only its own JavaScript |
| **Prefetching** | \`<Link>\` prefetches routes in the viewport |
| **Image Optimization** | \`next/image\` — lazy load, resize, WebP/AVIF |
| **Font Optimization** | \`next/font\` — self-host, no layout shift |
| **Script Optimization** | \`next/script\` — control third-party loading |

### Dynamic Imports (Code Splitting)

\`\`\`tsx
import dynamic from 'next/dynamic';

// Load heavy component only when needed
const HeavyChart = dynamic(() => import('@/components/chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Skip server rendering for browser-only libs
});

export default function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
      <HeavyChart />
    </div>
  );
}
\`\`\`

### Script Optimization

\`\`\`tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        {/* Load analytics after page is interactive */}
        <Script
          src="https://analytics.example.com/script.js"
          strategy="afterInteractive"
        />
        {/* Load non-critical script when browser is idle */}
        <Script
          src="https://widget.example.com/embed.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
\`\`\`

### Parallel Data Fetching

\`\`\`tsx
// ❌ Slow: Sequential fetches (waterfall)
const users = await getUsers();    // 500ms
const posts = await getPosts();    // 500ms
// Total: ~1000ms

// ✅ Fast: Parallel fetches
const [users, posts] = await Promise.all([
  getUsers(),   // 500ms
  getPosts(),   // 500ms
]);
// Total: ~500ms
\`\`\`

### Bundle Analysis

\`\`\`bash
# Install analyzer
pnpm add -D @next/bundle-analyzer

# next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer';
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({});
export default config;

# Run analysis
ANALYZE=true pnpm build
\`\`\`

### Performance Checklist

- ✅ Default to **Server Components** (zero client JS)
- ✅ Use **\`next/image\`** for all images
- ✅ Use **\`next/font\`** for fonts
- ✅ Use **\`<Link>\`** instead of \`<a>\` for internal links
- ✅ Use **\`dynamic()\`** for heavy client components
- ✅ Use **\`<Suspense>\`** for streaming
- ✅ Use **\`Promise.all()\`** for parallel fetches
- ✅ Review bundle size with analyzer`,
      keyPoints: [
        'Server Components eliminate unnecessary client JavaScript.',
        'Use dynamic() imports for heavy components — lazy loading.',
        'next/script controls third-party script loading strategy.',
        'Promise.all() for parallel data fetching avoids waterfalls.',
        'Bundle analyzer identifies large dependencies to optimize.'
      ]
    },

    {
      title: 'Docker Deployment',
      image: '/images/nextjs/nextjs-docker.svg',
      content: `Next.js apps can be containerized with Docker using **multi-stage builds** for minimal production images.

### next.config.ts (Enable Standalone)

\`\`\`typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Bundles node_modules into .next/standalone
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.example.com' },
    ],
  },
};
export default nextConfig;
\`\`\`

### Dockerfile (Multi-Stage Build)

\`\`\`dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only what's needed
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
# docker-compose.yml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - BACKEND_API_URL=http://api:5000
    depends_on:
      - api
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
\`\`\`

### Build & Deploy Commands

\`\`\`bash
# Build Docker image
docker build -t my-nextjs-app .

# Run container
docker run -p 3000:3000 my-nextjs-app

# Tag and push to registry
docker tag my-nextjs-app ghcr.io/org/my-nextjs-app:latest
docker push ghcr.io/org/my-nextjs-app:latest
\`\`\`

### Security Headers

\`\`\`typescript
// next.config.ts — add security headers
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
    ],
  }];
}
\`\`\``,
      keyPoints: [
        'output: \'standalone\' bundles everything for Docker deployment.',
        'Multi-stage builds create minimal ~150MB production images.',
        'Run as non-root user (nextjs:nodejs) for security.',
        'Add security headers in next.config.ts.',
        'Use healthcheck in Docker Compose for reliability.'
      ]
    },

    {
      title: 'Best Practices & Do\'s/Don\'ts',
      content: `### ✅ Do\'s

| # | Practice | Reason |
|---|---|---|
| 1 | **Default to Server Components** | Smaller bundles, direct data access |
| 2 | **Use \`'use client'\` only when needed** | Only for state, effects, event handlers |
| 3 | **Store JWT in httpOnly cookies** | XSS-proof — tokens never exposed to JS |
| 4 | **Validate inputs with Zod** | Runtime type safety on server |
| 5 | **Use \`loading.tsx\` for every route** | Better UX with loading skeletons |
| 6 | **Use \`error.tsx\` for every route group** | Graceful error handling |
| 7 | **Use \`next/image\` for all images** | Auto optimization, lazy loading |
| 8 | **Use \`next/link\` for navigation** | Client-side nav with prefetching |
| 9 | **Use TypeScript strict mode** | Catch bugs at compile time |
| 10 | **Co-locate related files** | Keep page, loading, error together |

### ❌ Don\'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Don't store JWT in localStorage** | Use httpOnly cookies via API routes |
| 2 | **Don't \`'use client'\` on page.tsx** | Extract interactive parts to child Client Components |
| 3 | **Don't use \`useEffect\` for data fetching** | Use Server Components or React Query |
| 4 | **Don't hardcode API URLs** | Use environment variables |
| 5 | **Don't skip input validation** | Validate with Zod on server side |
| 6 | **Don't use \`any\` type** | Use proper TypeScript types |
| 7 | **Don't import server code in client** | Separate server/client code |
| 8 | **Don't skip \`key\` props in lists** | Always use stable unique IDs |
| 9 | **Don't use Pages Router** | App Router is the standard |
| 10 | **Don't create giant components** | Split at ~100 lines |

### Environment Variables

\`\`\`bash
# .env.local — NOT committed to git
BACKEND_API_URL=http://localhost:5000/api
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key

# NEXT_PUBLIC_ prefix exposes to browser — NEVER for secrets!
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Useful Commands

\`\`\`bash
# Development
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Testing
pnpm test         # Unit tests (Vitest)
pnpm test:e2e     # E2E tests (Playwright)

# Docker
docker build -t app .
docker run -p 3000:3000 app
\`\`\``,
      keyPoints: [
        'Default to Server Components — use \'use client\' sparingly.',
        'Never store secrets in NEXT_PUBLIC_ variables.',
        'Validate all inputs with Zod on the server side.',
        'Use App Router (not Pages Router) for new projects.',
        'Co-locate page.tsx, loading.tsx, and error.tsx together.'
      ]
    }
  ]
};
