"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy } from "lucide-react";

const YEAR_LINKS = [
  { to: "/2023", label: "2023" },
  { to: "/2024", label: "2024" },
  { to: "/2025/recap", label: "2025" },
  { to: "/all-time", label: "All-Time", icon: true },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && href !== "/2025/recap" && pathname.startsWith(href));

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 nav-wrapper"
      style={{ ["--nav-h" as string]: "4rem" }}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              aria-label="Home"
              className="text-[var(--color-primary)] hover:opacity-80 transition"
            >
              <Home className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-6">
              {YEAR_LINKS.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`text-sm transition ${
                    isActive(link.to)
                      ? "text-[var(--color-primary)] drop-shadow-[0_0_4px_#34F5FF]"
                      : "text-white hover:text-[var(--color-primary)]"
                  }`}
                >
                  {link.icon && (
                    <Trophy className="inline w-3.5 h-3.5 mr-1" aria-hidden />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/#register-2025"
            className="secondary-button text-sm py-1.5 px-5 hover:shadow-[0_0_12px_#34F5FF]"
          >
            Register
          </Link>
        </div>
      </div>
      <span aria-hidden className="nav-underline" />
    </nav>
  );
}
