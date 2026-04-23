"use client";

import { useActionState, useState } from "react";
import { uploadMedia, type UploadState } from "@/app/actions/upload-media";

const YEARS = [2026, 2025, 2024, 2023];

export function UploadForm() {
  const [state, action, pending] = useActionState<UploadState, FormData>(
    uploadMedia,
    {},
  );
  const [fileName, setFileName] = useState("");

  if (state.message) {
    return (
      <div className="rounded-retro bg-sunset-gradient p-6 text-night-950 text-center">
        <div className="text-2xl font-semibold">{state.message}</div>
        <p className="mt-3 text-sm opacity-80">
          It'll appear on the year page after the next page load.
        </p>
        <a
          href="/upload"
          className="inline-block mt-4 text-sm font-medium border-b border-night-950/40 hover:border-night-950 transition"
        >
          Upload another →
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-sunset-400/80">
            Your name
          </span>
          <input
            name="uploader"
            required
            maxLength={60}
            className="mt-1 w-full bg-night-900/60 border border-sunset-700/30 rounded-retro px-3 py-2 text-sand-50 focus:outline-none focus:border-sunset-400/80 transition"
          />
          {state.errors?.uploader && (
            <span className="text-sunset-400 text-sm mt-1 block">
              {state.errors.uploader[0]}
            </span>
          )}
        </label>
      </div>

      <div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-sunset-400/80">
            Which year
          </span>
          <select
            name="year"
            defaultValue={2025}
            required
            className="mt-1 w-full bg-night-900/60 border border-sunset-700/30 rounded-retro px-3 py-2 text-sand-50 focus:outline-none focus:border-sunset-400/80 transition"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-sunset-400/80">
            Caption (optional)
          </span>
          <input
            name="caption"
            maxLength={280}
            placeholder="Bucket Pong finals, sun going down..."
            className="mt-1 w-full bg-night-900/60 border border-sunset-700/30 rounded-retro px-3 py-2 text-sand-50 placeholder-sand-200/40 focus:outline-none focus:border-sunset-400/80 transition"
          />
        </label>
      </div>

      <div>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-sunset-400/80">
            File
          </span>
          <input
            type="file"
            name="file"
            required
            accept="image/*,video/mp4,video/quicktime,video/webm"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            className="mt-1 w-full text-sm text-sand-200 file:mr-4 file:py-2 file:px-4 file:rounded-retro file:border-0 file:bg-sunset-500/80 file:text-night-950 file:font-semibold hover:file:bg-sunset-400 cursor-pointer"
          />
          {fileName && (
            <span className="text-sand-200/60 text-xs mt-2 block">
              Selected: {fileName}
            </span>
          )}
          {state.errors?.file && (
            <span className="text-sunset-400 text-sm mt-2 block">
              {state.errors.file[0]}
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-sunset-gradient px-8 py-3 rounded-retro font-semibold text-night-950 hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed w-full"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
