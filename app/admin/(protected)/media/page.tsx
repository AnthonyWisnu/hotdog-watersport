import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminState from "@/components/admin/AdminState";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAdminMediaAssets, type AdminMediaFilters } from "@/lib/cms/media";
import MediaLibraryUploader from "./MediaLibraryUploader";
import { archiveMediaAsset, deleteMediaAsset, updateMediaAsset } from "./actions";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  status?: string;
}>;

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters: AdminMediaFilters = {
    q: params.q || "",
    mediaType:
      params.type === "image" || params.type === "video" ? params.type : "all",
    status:
      params.status === "draft" ||
      params.status === "published" ||
      params.status === "archived"
        ? params.status
        : "all",
  };
  const media = await getAdminMediaAssets(filters);

  return (
    <div className="max-w-7xl">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="Media Library"
        description="Upload, search, edit, archive, and safely delete CMS media without touching the public folder."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AdminCard title="Filters">
            <form className="grid gap-3 md:grid-cols-[1fr_160px_160px_auto]">
              <input
                name="q"
                defaultValue={filters.q}
                placeholder="Search path, alt text, caption..."
                className="rounded-md border border-border px-3 py-2 text-sm"
              />
              <select
                name="type"
                defaultValue={filters.mediaType}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
              <select
                name="status"
                defaultValue={filters.status}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
                Apply
              </button>
            </form>
          </AdminCard>

          <AdminCard title="Assets">
            {media.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {media.map((asset) => (
                  <form
                    key={asset.id}
                    action={updateMediaAsset.bind(null, asset.id)}
                    className="rounded-md border border-border p-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-[132px_1fr]">
                      <div className="aspect-square overflow-hidden rounded-md bg-surface-muted">
                        {asset.signed_url ? (
                          asset.media_type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={asset.signed_url}
                              alt={asset.alt_text || asset.path}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <video
                              src={asset.signed_url}
                              controls
                              muted
                              className="h-full w-full object-cover"
                            />
                          )
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-text-muted">
                            No preview
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {asset.path}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {asset.media_type} / {asset.mime_type || "unknown"} /{" "}
                          {formatBytes(asset.size_bytes)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          Created {new Date(asset.created_at).toLocaleDateString("en-GB")}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {asset.usage.labels.length > 0 ? (
                            asset.usage.labels.map((label) => (
                              <span
                                key={label}
                                className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                              >
                                {label}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-md bg-surface-muted px-2 py-1 text-xs text-text-muted">
                              Unused
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <input
                        name="alt_text"
                        defaultValue={asset.alt_text || ""}
                        placeholder="Alt text"
                        className="rounded-md border border-border px-3 py-2 text-sm"
                      />
                      <input
                        name="caption"
                        defaultValue={asset.caption || ""}
                        placeholder="Caption"
                        className="rounded-md border border-border px-3 py-2 text-sm"
                      />
                      <select
                        name="status"
                        defaultValue={asset.status}
                        className="rounded-md border border-border px-3 py-2 text-sm"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">
                        Save
                      </button>
                      <ConfirmButton
                        formAction={archiveMediaAsset.bind(null, asset.id)}
                        message="Archive this media asset?"
                        className="rounded-md border border-border px-3 py-2 text-sm text-text-primary"
                      >
                        Archive
                      </ConfirmButton>
                      <ConfirmButton
                        formAction={deleteMediaAsset.bind(null, asset.id)}
                        message="Permanently delete this unused media asset?"
                        disabled={asset.usage.total > 0}
                        className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </form>
                ))}
              </div>
            ) : (
              <AdminState
                title="No media found"
                description="Upload new files or adjust the filters."
              />
            )}
          </AdminCard>
        </div>

        <AdminCard title="Upload Media">
          <MediaLibraryUploader />
        </AdminCard>
      </div>
    </div>
  );
}

function formatBytes(value: number | null) {
  if (!value) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const size = value / 1024 ** index;
  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
