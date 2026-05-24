"use client";

import { useState, useTransition } from "react";
import { linkServiceMedia } from "../actions";
import { uploadMediaAsset } from "@/lib/media/client";

export default function ServiceMediaUploader({ serviceId }: { serviceId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const fileInput = form.elements.namedItem("files") as HTMLInputElement;
        const files = Array.from(fileInput.files || []);

        if (files.length === 0) {
          setMessage("Choose at least one file.");
          return;
        }

        const mediaRole = String(formData.get("media_role") || "gallery") as
          | "cover"
          | "gallery"
          | "promo_video";
        const altText = String(formData.get("alt_text") || "").trim();
        const caption = String(formData.get("caption") || "").trim();

        startTransition(async () => {
          try {
            for (const file of files) {
              const asset = await uploadMediaAsset({
                file,
                folder: "services",
                altText: altText || file.name,
                caption,
                status: "published",
              });
              await linkServiceMedia(serviceId, asset.id, {
                mediaRole,
                altText: altText || file.name,
                caption,
              });
            }
            form.reset();
            setMessage(
              mediaRole === "cover"
                ? "Cover media uploaded."
                : "Service media uploaded."
            );
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Upload failed.");
          }
        });
      }}
    >
      <label className="block text-sm font-medium text-text-primary md:col-span-2">
        Files
        <input
          name="files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          disabled={pending}
          className="mt-2 block w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-text-primary">
        Media Role
        <select
          name="media_role"
          defaultValue="gallery"
          className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
        >
          <option value="cover">Cover Image</option>
          <option value="gallery">Gallery Image/Video</option>
          <option value="promo_video">Promo Video</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-text-primary">
        Alt Text
        <input
          name="alt_text"
          className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-text-primary md:col-span-2">
        Caption
        <input
          name="caption"
          className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </label>
      <button
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        Upload Service Media
      </button>
      {message ? <p className="mt-2 text-sm text-text-muted">{message}</p> : null}
    </form>
  );
}
