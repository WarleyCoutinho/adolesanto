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
      <body>{children}</body>
    </html>
  );
}
