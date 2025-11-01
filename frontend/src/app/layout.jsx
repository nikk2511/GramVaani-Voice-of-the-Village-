'use client';

import '../styles/globals.css';
import { I18nProvider } from '@/components/I18nProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Our Voice, Our Rights - MGNREGA District Performance</title>
        <meta name="description" content="View MGNREGA district performance data" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

