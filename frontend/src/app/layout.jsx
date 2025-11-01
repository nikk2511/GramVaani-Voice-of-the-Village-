import '../styles/globals.css';
import { I18nProvider } from '@/components/I18nProvider';

export const metadata = {
  title: 'Our Voice, Our Rights - MGNREGA District Performance',
  description: 'View MGNREGA district performance data',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

