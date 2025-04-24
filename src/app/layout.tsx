import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Museu de São José",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      <body className={`${inter.className} bg-background text-white`}>
        {children}
      </body>
    </html>
  );
}
