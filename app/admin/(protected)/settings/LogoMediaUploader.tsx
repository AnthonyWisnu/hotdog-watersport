"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";
import { setBrandMedia } from "./actions";

interface LogoMediaUploaderProps {
  target: "logo" | "footer_logo" | "favicon";
  label: string;
}

export default function LogoMediaUploader({
  target,
  label,
}: LogoMediaUploaderProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
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
                folder: "logos",
                altText: label,
                status: "published",
              });
              await setBrandMedia(target, asset.id);
              setMessage(`${label} updated.`);
              router.refresh();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Upload failed.");
            }
          });
        }}
        className="mt-2 block w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
      />
      {message ? <span className="mt-2 block text-sm text-text-muted">{message}</span> : null}
    </label>
  );
}
