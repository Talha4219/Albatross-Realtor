
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SavedPropertiesProvider } from '@/contexts/SavedPropertiesContext';
import { AuthProvider } from '@/contexts/AuthContext'; 
import Header from '@/components/layout/Header';
import { ThemeProvider } from "@/components/theme/ThemeProvider"; 
import Footer from '@/components/layout/Footer';
import AIChatWidget from '@/components/chat/AIChatWidget'; 

export const metadata: Metadata = {
  title: 'Albatross Realtor',
  description: 'Find your next property with Albatross Realtor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider> 
            <SavedPropertiesProvider>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8 animate-in fade-in-50 duration-500">
                {children}
              </main>
              <Footer />
              <Toaster />
              <AIChatWidget /> 
            </SavedPropertiesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
