import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import Script from 'next/script'
import { Providers } from './providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AIPEA — Africa Institute of Personal and Executive Assistants',
  description:
    "Africa's premier professional membership body for executive and personal assistants. Join 5,000+ members across 33 countries.",
  openGraph: {
    title: 'AIPEA — Elevating the Executive Assistant Profession',
    description:
      'Professional membership, CPD certification, and community for EAs across Africa.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Script
          id="remove-extension-hydration-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var attrs = [
                  'data-new-gr-c-s-check-loaded',
                  'data-gr-ext-installed',
                  'data-gr-ext-disabled',
                  'data-new-gr-c-s-loaded'
                ];

                function clean() {
                  [document.documentElement, document.body].forEach(function (node) {
                    if (!node) return;
                    attrs.forEach(function (attr) {
                      node.removeAttribute(attr);
                    });
                  });
                }

                clean();
                document.addEventListener('DOMContentLoaded', clean, { once: true });
                var observer = new MutationObserver(clean);
                observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
                setTimeout(function () {
                  observer.disconnect();
                  clean();
                }, 3000);
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
