import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adolesanto - Doações Santíssima Trindade",
  description: "Sistema de acompanhamento de doações para o Adolesanto 2025 da Paróquia Santíssima Trindade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gradient-to-br from-[#fef9f0] to-[#e8f4f8] min-h-screen text-gray-900">
        <div className="w-full min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
