import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexArbiter",
  description: "Forensic evaluation and programmable settlement for agent agreements on GenLayer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
