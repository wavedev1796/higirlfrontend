import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../store/authStore";

export const metadata: Metadata = {
  title: "Hi Girl | Conecta y Crece",
  description: "Una comunidad segura para mujeres donde conectar, aprender y crecer juntas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
