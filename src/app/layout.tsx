import type { Metadata } from 'next';
import { Outfit, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudyGen AI (স্টাডিজেন এআই) — AI Question Paper & Educational Problem Solver',
  description: 'হাতে লেখা ছবি থেকে গুগল ডক এডিটেবল প্রশ্নপত্র তৈরির আধুনিক এআই সিস্টেম, স্টেপ-বাই-স্টেপ সমীকরণ সমাধানকারী ও এডুকেশনাল টুলকিট।',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo-icon.png', type: 'image/png' },
    ],
    apple: '/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${outfit.variable} ${notoSansBengali.variable} font-sans h-full antialiased dark`}
    >
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/logo-icon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-icon.png?v=2" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('app_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
