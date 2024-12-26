import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Schedule System',
  description: "",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
