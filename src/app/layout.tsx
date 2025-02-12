import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Minha Landing Page",
  description: "Página inicial responsiva com Next.js e Tailwind CSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#110D35] text-white`}>
        {children}
      </body>
    </html>
  );
}
