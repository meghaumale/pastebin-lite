import React from "react";

export const metadata = {
  title: "Pastebin Lite",
  description: "Minimal pastebin service",
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