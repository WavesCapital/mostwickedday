import Link from "next/link";
import { UploadForm } from "@/components/UploadForm";

export const metadata = {
  title: "Share Your Moments",
  description:
    "Upload photos and videos from Most Wicked Day. Everything goes into the year gallery.",
};

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="text-sunset-400 hover:text-sunset-200 text-sm transition inline-block mb-6"
      >
        ← Home
      </Link>
      <h1 className="text-sunset-gradient text-5xl md:text-6xl mb-4">
        SHARE YOUR MOMENTS
      </h1>
      <p className="text-sand-200 mb-10">
        Photos and videos from any Most Wicked Day — yours go straight into the
        year gallery. JPEG / PNG / WEBP / HEIC up to 20 MB, or MP4 / MOV / WEBM
        up to 200 MB.
      </p>
      <UploadForm />
    </main>
  );
}
