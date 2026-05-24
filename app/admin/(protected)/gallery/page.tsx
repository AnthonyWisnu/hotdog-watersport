import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import MoveOrderButtons from "@/components/admin/MoveOrderButtons";
import { getAdminGalleryItems } from "@/lib/cms/gallery";
import { getActiveTaxonomyOptions } from "@/lib/cms/taxonomies";
import GalleryMediaReplacer from "./GalleryMediaReplacer";
import GalleryUploader from "./GalleryUploader";
import {
  deleteGalleryItem,
  moveGalleryItem,
  updateGalleryItem,
} from "./actions";

export default async function AdminGalleryPage() {
  const [items, categories] = await Promise.all([
    getAdminGalleryItems(),
    getActiveTaxonomyOptions("gallery_category"),
  ]);

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="Gallery"
        description="Upload and manage gallery photos/videos, categories, captions, alt text, and publish status."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="Gallery Items">
          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border p-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                    <div className="min-w-0">
                      <div className="aspect-[4/3] overflow-hidden rounded-md bg-surface-muted">
                        {item.signed_url ? (
                          item.media_assets?.media_type === "video" ? (
                            <video
                              src={item.signed_url}
                              controls
                              muted
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.signed_url}
                              alt={item.alt_text || item.caption || "Gallery media"}
                              className="h-full w-full object-cover"
                            />
                          )
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-text-muted">
                            No preview
                          </div>
                        )}
                      </div>
                      <p className="mt-2 truncate text-xs text-text-muted">
                        {item.media_assets?.path || "Missing media asset"}
                      </p>
                    </div>

                    <div className="min-w-0 space-y-3">
                      <form action={updateGalleryItem.bind(null, item.id)}>
                        <input
                          type="hidden"
                          name="sort_order"
                          value={item.sort_order}
                        />
                        <div className="grid gap-3 md:grid-cols-3">
                          <select
                            name="category"
                            defaultValue={item.category}
                            className="rounded-md border border-border px-3 py-2 text-sm"
                          >
                            {categories.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <select
                            name="status"
                            defaultValue={item.status}
                            className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                          <input
                            name="alt_text"
                            defaultValue={item.alt_text || ""}
                            placeholder="Alt text"
                            className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              name="is_featured"
                              type="checkbox"
                              defaultChecked={item.is_featured}
                            />{" "}
                            Featured
                          </label>
                          <input
                            name="caption"
                            defaultValue={item.caption || ""}
                            placeholder="Caption"
                            className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3"
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">
                            Save
                          </button>
                          <MoveOrderButtons
                            moveUpAction={moveGalleryItem.bind(
                              null,
                              item.id,
                              "up"
                            )}
                            moveDownAction={moveGalleryItem.bind(
                              null,
                              item.id,
                              "down"
                            )}
                            disableUp={index === 0}
                            disableDown={index === items.length - 1}
                          />
                          <ConfirmButton
                            formAction={deleteGalleryItem.bind(null, item.id)}
                            message="Delete this gallery item?"
                            className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"
                          >
                            Delete
                          </ConfirmButton>
                        </div>
                      </form>

                      <GalleryMediaReplacer
                        itemId={item.id}
                        altText={item.alt_text}
                        caption={item.caption}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted">No gallery CMS items yet.</p>
            )}
          </div>
        </AdminCard>
        <AdminCard title="Upload Media">
          <GalleryUploader categories={categories} />
        </AdminCard>
      </div>
    </div>
  );
}
