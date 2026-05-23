"use client";

import { useState, useTransition } from "react";
import { uploadMediaAsset } from "@/lib/media/client";
import { createGalleryItem } from "./actions";

export default function GalleryUploader() {
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
        const selectedFiles = Array.from(fileInput.files || []);

        if (selectedFiles.length === 0) {
          setMessage("Choose at least one file.");
          return;
        }

        startTransition(async () => {
          try {
            for (const file of selectedFiles) {
              const asset = await uploadMediaAsset({
                file,
                folder: "gallery",
                altText: String(formData.get("alt_text") || file.name),
                caption: String(formData.get("caption") || ""),
                status: "published",
              });
              await createGalleryItem(asset.id, formData);
            }
            form.reset();
            setMessage("Gallery media uploaded.");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Upload failed.");
          }
        });
      }}
    >
      <label className="block text-sm font-medium text-text-primary md:col-span-2">
        Files
        <input name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" className="mt-2 block w-full rounded-md border border-border px-3 py-2" />
      </label>
      <Field name="category" label="Category" defaultValue="watersport" />
      <Field name="sort_order" label="Sort Order" type="number" defaultValue="0" />
      <Field name="alt_text" label="Alt Text" />
      <Field name="caption" label="Caption" />
      <Select name="status" label="Status" defaultValue="published" />
      <label className="flex items-center gap-2 self-end text-sm font-medium text-text-primary">
        <input name="is_featured" type="checkbox" />
        Featured
      </label>
      <button disabled={pending} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        Upload Gallery Media
      </button>
      {message ? <p className="text-sm text-text-muted">{message}</p> : null}
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
      <input {...inputProps} className="mt-2 w-full rounded-md border border-border px-3 py-2" />
    </label>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string }) {
  const { label, ...selectProps } = props;
  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
      <select {...selectProps} className="mt-2 w-full rounded-md border border-border px-3 py-2">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </label>
  );
}
