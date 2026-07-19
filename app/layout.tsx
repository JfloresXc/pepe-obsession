import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/shared/Nav";
import { Footer } from "@/shared/Footer";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Pepe Obsession",
  description: "Hazle un gesto a la cámara y mira cómo Pepe reacciona.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ibmPlexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
