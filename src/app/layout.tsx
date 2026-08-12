import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gobierno AI — LAG",
  description:
    "Plataforma de gobernanza de Inteligencia Artificial de Logiztik Alliance Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-white">
        {/* Header global con branding LAG */}
        <header className="border-b border-lag-border bg-lag-bg-secondary">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <Image
              src="/images/icono-lag.jpeg"
              alt="Logiztik Alliance Group"
              width={32}
              height={32}
              className="rounded-md"
            />
            <Image
              src="/images/logo-lag.png"
              alt="LAG Logo"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-sm text-lag-text-secondary ml-2">
              Gobierno AI
            </span>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
