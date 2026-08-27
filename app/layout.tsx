import type { Metadata } from "next";
import "./globals.css";

const description =
  "The GitHub bot that catches the SSRF your human reviewers missed. Continuous PR review for Next.js, Vercel, Supabase and MCP tools. Powered by Claude + the armor family.";

export const metadata: Metadata = {
  title: "armor-bot — the senior code reviewer that never sleeps",
  description,
  metadataBase: new URL("https://armor-bot.vercel.app"),
  openGraph: {
    title: "armor-bot",
    description,
    url: "https://armor-bot.vercel.app",
    siteName: "armor-bot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "armor-bot",
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
