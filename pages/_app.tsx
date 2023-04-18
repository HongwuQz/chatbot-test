import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from 'react-cookie';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <CookiesProvider>
      <div className={inter.className}>
        <Toaster />
        <Component {...pageProps} />
      </div>
    </CookiesProvider>
  );
}

export default appWithTranslation(App);
