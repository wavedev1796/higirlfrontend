/**
 * Root layout — Hi Girl.
 *
 * Sets up global providers, fonts, and metadata.
 */

import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import { AuthProvider } from "@/features/auth";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/layouts.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html lang="es" className={`${poppins.variable} ${lora.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );

}