import type { Metadata } from "next";
import { Inter, Pacifico, Bungee_Outline } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const pacifico = Pacifico({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const bungee = Bungee_Outline({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mostwickedday.com"),
  title: {
    default: "Most Wicked Day 2025",
    template: "%s · Most Wicked Day",
  },
  description:
    "The ultimate summer showdown at Lake Tobesofkee. Recaps, registration, and player profiles for Most Wicked Day.",
  openGraph: {
    title: "Most Wicked Day 2025",
    description:
      "Join the ultimate summer competition at Lake Tobesofkee — past recaps, leaderboards, sign-up, and epic photo galleries.",
    type: "website",
    url: "https://mostwickedday.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${pacifico.variable} ${bungee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
