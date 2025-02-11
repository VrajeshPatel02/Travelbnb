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
        <link rel="icon" href="/house-logo.svg" type="image/svg+xml" sizes="32x32" />
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
