import type { Metadata } from "next";
import "./globals.css";
// import "./win98.css";

export const metadata: Metadata = {
  title: "My Win98 Portfolio",
  description: "My portfolio, Windows 98 style!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We use a classic system font stack for the 'Inter' of its day.
        The 'pixelated' font-family class will be defined in win98.css 
        for specific elements that need a pixel-font look.
      */}
      <body className="font-sans-win98">{children}</body>
    </html>
  );
}