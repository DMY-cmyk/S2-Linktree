import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'S2 Resource Hub',
  description: "Academic resource hub for Master's degree journey",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('s2-linktree-theme');var t=p;if(!p||p==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <div
          aria-live="polite"
          aria-atomic="true"
          id="toast-live-region"
          style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        />
      </body>
    </html>
  );
}
