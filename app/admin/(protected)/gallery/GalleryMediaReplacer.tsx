"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";
import { replaceGalleryItemMedia } from "./actions";

interface GalleryMediaReplacerProps {
  itemId: string;
  altText: string | null;
  caption: string | null;
}

export default function GalleryMediaReplacer({
  itemId,
  altText,
  caption,
}: GalleryMediaReplacerProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file selected");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="rounded-md border border-dashed border-border bg-surface-muted p-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.elements.namedItem("file") as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
          setMessage("Choose one replacement file.");
          return;
        }

        startTransition(async () => {
          try {
            const asset = await uploadMediaAsset({
              file,
              folder: "gallery",
              altText: altText || file.name,
              caption: caption || "",
              status: "published",
            });

            await replaceGalleryItemMedia(itemId, asset.id);
            form.reset();
            setFileName("No file selected");
            setMessage("Media replaced.");
            router.refresh();
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Replace failed.");
          }
        });
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary">
          <Upload aria-hidden="true" size={15} />
          Replace Media
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            disabled={pending}
            className="sr-only"
            onChange={(event) => {
              setFileName(event.target.files?.[0]?.name || "No file selected");
              setMessage(null);
            }}
          />
        </label>
        <span className="min-w-0 truncate text-sm text-text-muted">
          {fileName}
        </span>
        <button
          disabled={pending}
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Apply
        </button>
      </div>
      {message ? <p className="mt-2 text-sm text-text-muted">{message}</p> : null}
    </form>
  );
}
