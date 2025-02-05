import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/airbnb-logo.svg" sizes="any" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
