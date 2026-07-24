import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { Providers } from './providers'
import './globals.css'

const dmSansDisplay = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSansBody = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aipea.co'),
  title: 'AIPEA: Africa Institute of Personal and Executive Assistants',
  description:
    "The professional membership body for executive and personal assistants across Africa. Membership, CPD certification and community.",
  openGraph: {
    title: 'AIPEA: Elevating the Executive Assistant Profession',
    description:
      'Professional membership, CPD certification, and community for EAs across Africa.',
    type: 'website',
    url: 'https://www.aipea.co',
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
      // globals.css sets `scroll-behavior: smooth` for in-page anchor jumps.
      // Next 16 no longer auto-suppresses that during route transitions, so
      // without this attribute every subpage-to-subpage navigation animates the
      // scroll-to-top instead of jumping. This opts back into the override:
      // instant on navigation, smooth for on-page anchors.
      data-scroll-behavior="smooth"
      className={`${dmSansDisplay.variable} ${dmSansBody.variable} antialiased`}
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
