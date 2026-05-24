export const SITE_MEDIA_BUCKET = "site-media";
export const MAX_MEDIA_FILE_SIZE = 100 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/webm"] as const;

export const ALLOWED_MEDIA_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  ...ALLOWED_VIDEO_MIME_TYPES,
] as const;

export type MediaFolder =
  | "hero"
  | "services"
  | "gallery"
  | "testimonials"
  | "library"
  | "logos";
export type MediaStatus = "draft" | "published" | "archived";
export type MediaType = "image" | "video";
