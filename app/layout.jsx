
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: 'Sistema de Gestão Financeira Pessoal',
  description: 'Controle suas finanças pessoais com facilidade. Gerencie receitas, despesas, orçamentos e dívidas.',
  generator: 'v0.app',
  icons: {
    icon: [
    {
      url: '/icon-light-32x32.png',
      media: '(prefers-color-scheme: light)'
    },
    {
      url: '/icon-dark-32x32.png',
      media: '(prefers-color-scheme: dark)'
    },
    {
      url: '/icon.svg',
      type: 'image/svg+xml'
    }],

    apple: '/apple-icon.png'
  }
};

export default function RootLayout({
  children


}) {
  return (
    <html lang="pt-BR" className="bg-[#F4F6F8]">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>);

}