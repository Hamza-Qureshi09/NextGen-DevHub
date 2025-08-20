import "@/styles/globals.css";
import { ReduxProvider } from "@/providers/ReduxProviders";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { TanStackQueryProvider } from "@/providers/QueryProvider";
import { RootLoading } from "@/components/shared/loaders/RootLoader";

// Get base URL from environment or use default
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://hamza.com"
    : "http://localhost:4000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "My Awesome Website HQ",
    template: "%s - My Awesome Website HQ",
  },
  description:
    "Advanced lead management system with filtering, pagination, and real-time updates build by HQ",
  keywords: ["leads", "management", "CRM", "business", "sales"],
  authors: [{ name: "HQ Foundation", url: baseUrl }],
  creator: "HQ Foundation",
  publisher: "HQ Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification tokens here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        {/* providers */}
        <ReduxProvider>
          <TanStackQueryProvider>
            <Suspense fallback={<RootLoading />}>{children}</Suspense>
          </TanStackQueryProvider>
        </ReduxProvider>
        {/* toaster */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
          theme="system"
        />
      </body>
    </html>
  );
}
