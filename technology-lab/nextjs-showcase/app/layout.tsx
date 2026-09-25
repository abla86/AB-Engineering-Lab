import type { ReactNode } from "react";

export const metadata = {
  title: "Next.js showcase",
  description: "App Router, React Server Components and a typed route handler",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: "2rem" }}>{children}</body>
    </html>
  );
}
