"use client";

import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";
import { setOgImage } from "./actions";

export default function OgImageUploader() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-md border border-border bg-surface-muted p-4">
      <label className="block text-sm font-medium text-text-primary">
        Open Graph Image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            startTransition(async () => {
              try {
                const asset = await uploadMediaAsset({
                  file,
                  folder: "hero",
                  altText: "Open Graph image",
                  status: "published",
                });
                await setOgImage(asset.id);
                setMessage("Open Graph image updated.");
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Upload failed.");
              }
            });
          }}
          className="mt-2 block w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
        />
      </label>
      {message ? <p className="mt-2 text-sm text-text-muted">{message}</p> : null}
    </div>
  );
}
