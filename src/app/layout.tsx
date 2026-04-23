import type { Metadata } from "next";
import { Inter, Pacifico, Bungee_Outline, League_Spartan } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const spartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});
const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const bungee = Bungee_Outline({
  variable: "--font-bungee",
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
      className={`${inter.variable} ${spartan.variable} ${pacifico.variable} ${bungee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
