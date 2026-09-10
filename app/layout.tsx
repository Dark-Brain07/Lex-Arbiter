import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexArbiter — Autonomous Forensic Adjudication Protocol",
  description: "Neutral forensic adjudication and programmable settlement for autonomous agent agreements on GenLayer.",
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
