import type { Metadata } from "next";
import { Manrope, Major_Mono_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const majorMonoDisplay = Major_Mono_Display({
  variable: "--font-major-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "pente.fino",
  description:
    "Garimpa álbuns e EPs que você ainda não conhece, com fichas construídas a partir de fontes reais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${majorMonoDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col items-center bg-bg text-text font-sans">
        {children}
      </body>
    </html>
  );
}
