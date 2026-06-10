/**
 * Root layout — Hi Girl.
 *
 * Sets up global providers, fonts, and metadata.
 */

import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/layouts.css";

export const metadata: Metadata = {
  title: "Hi Girl | Conecta y Crece",
  description:
    "Una comunidad segura para mujeres donde conectar, aprender y crecer juntas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
