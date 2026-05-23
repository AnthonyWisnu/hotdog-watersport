"use client";

import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";
import { setTestimonialImage } from "./actions";

export default function TestimonialImageUploader({ testimonialId }: { testimonialId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div>
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
                folder: "testimonials",
                altText: file.name,
                status: "published",
              });
              await setTestimonialImage(testimonialId, asset.id);
              setMessage("Image uploaded.");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Upload failed.");
            }
          });
        }}
        className="block w-full rounded-md border border-border px-3 py-2 text-sm"
      />
      {message ? <p className="mt-2 text-sm text-text-muted">{message}</p> : null}
    </div>
  );
}
