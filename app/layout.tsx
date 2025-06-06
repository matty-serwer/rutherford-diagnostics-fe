import type { Metadata } from "next";
import { EB_Garamond, Quattrocento, Questrial, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";

const quattrocento = Quattrocento({
  variable: "--font-quattrocento",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: ["400"],
});

const eb_Garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Rutherford Diagnostics",
  description: "Medical diagnostic testing and patient management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quattrocento.variable} ${questrial.variable} ${eb_Garamond.variable} ${robotoMono.variable} min-h-screen bg-background font-sans antialiased max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
