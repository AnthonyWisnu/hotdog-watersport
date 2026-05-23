"use client";

import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";
import { setHeroMedia } from "./actions";

export default function HeroMediaUploader() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-md border border-border bg-surface-muted p-4">
      <label className="block text-sm font-medium text-text-primary">
        Hero Background Image/Video
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          disabled={pending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            startTransition(async () => {
              try {
                const asset = await uploadMediaAsset({
                  file,
                  folder: "hero",
                  altText: "Hero background",
                  status: "published",
                });
                await setHeroMedia(asset.id);
                setMessage("Hero media updated.");
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
