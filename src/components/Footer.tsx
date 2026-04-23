import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0A0F1F] border-t border-[#3CF6F0]/20 py-12 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[#3CF6F0] font-bold mb-4 uppercase text-sm tracking-wider">
              Editions
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/2023" className="text-gray-400 hover:text-white transition">
                  2023 Recap
                </Link>
              </li>
              <li>
                <Link href="/2024" className="text-gray-400 hover:text-white transition">
                  2024 Recap
                </Link>
              </li>
              <li>
                <Link href="/#register-2025" className="text-gray-400 hover:text-white transition">
                  2025 Registration
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#3CF6F0] font-bold mb-4 uppercase text-sm tracking-wider">
              Stats &amp; Records
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/all-time" className="text-gray-400 hover:text-white transition">
                  All-Time Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-gray-400 hover:text-white transition">
                  Upload Photos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#3CF6F0] font-bold mb-4 uppercase text-sm tracking-wider">
              Location
            </h3>
            <div className="text-gray-400">
              Lake Tobesofkee<br />
              Macon, GA
            </div>
          </div>
          <div>
            <h3 className="text-[#3CF6F0] font-bold mb-4 uppercase text-sm tracking-wider">
              Most Wicked Day
            </h3>
            <p className="text-gray-400 text-sm">The ultimate summer showdown.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#3CF6F0]/10 text-center text-gray-500 text-sm">
          © 2026 Most Wicked Day. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
