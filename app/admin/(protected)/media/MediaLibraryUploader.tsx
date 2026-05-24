"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";

export default function MediaLibraryUploader() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const input = form.elements.namedItem("files") as HTMLInputElement;
        const files = Array.from(input.files || []);

        if (files.length === 0) {
          setMessage("Choose at least one file.");
          return;
        }

        startTransition(async () => {
          try {
            for (const file of files) {
              await uploadMediaAsset({
                file,
                folder: "library",
                altText: String(formData.get("alt_text") || file.name),
                caption: String(formData.get("caption") || ""),
                status:
                  formData.get("status") === "published" ? "published" : "draft",
              });
            }

            form.reset();
            setMessage("Media uploaded.");
            router.refresh();
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Upload failed.");
          }
        });
      }}
    >
      <label className="block text-sm font-medium text-text-primary">
        Files
        <input
          name="files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          disabled={pending}
          className="mt-2 block w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-text-primary">
        Alt Text
        <input
          name="alt_text"
          className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-text-primary">
        Caption
        <input
          name="caption"
          className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-text-primary">
        Status
        <select
          name="status"
          defaultValue="draft"
          className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <button
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        Upload Media
      </button>
      {message ? <p className="text-sm text-text-muted">{message}</p> : null}
    </form>
  );
}
