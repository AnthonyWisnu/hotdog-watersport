"use client";

import { useState, useTransition } from "react";
import { linkServiceMedia } from "../actions";
import { uploadMediaAsset } from "@/lib/media/client";

export default function ServiceMediaUploader({ serviceId }: { serviceId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
        disabled={pending}
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          if (files.length === 0) return;

          startTransition(async () => {
            try {
              for (const file of files) {
                const asset = await uploadMediaAsset({
                  file,
                  folder: "services",
                  altText: file.name,
                  status: "published",
                });
                await linkServiceMedia(serviceId, asset.id);
              }
              setMessage("Media uploaded.");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Upload failed.");
            }
          });
        }}
        className="block w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
      />
      {message ? <p className="mt-2 text-sm text-text-muted">{message}</p> : null}
    </div>
  );
}
