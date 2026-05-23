import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminGalleryItems } from "@/lib/cms/gallery";
import GalleryUploader from "./GalleryUploader";
import { deleteGalleryItem, updateGalleryItem } from "./actions";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminGalleryPage() {
  const items = await getAdminGalleryItems();

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
            {items.length > 0 ? items.map((item) => (
              <form key={item.id} action={updateGalleryItem.bind(null, item.id)} className="rounded-md border border-border p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <input name="category" defaultValue={item.category} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <input name="sort_order" type="number" defaultValue={item.sort_order} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <select name="status" defaultValue={item.status} className="rounded-md border border-border px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <input name="alt_text" defaultValue={item.alt_text || ""} placeholder="Alt text" className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2" />
                  <label className="flex items-center gap-2 text-sm">
                    <input name="is_featured" type="checkbox" defaultChecked={item.is_featured} /> Featured
                  </label>
                  <input name="caption" defaultValue={item.caption || ""} placeholder="Caption" className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3" />
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">Save</button>
                  <ConfirmButton formAction={deleteGalleryItem.bind(null, item.id)} message="Delete this gallery item?" className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700">
                    Delete
                  </ConfirmButton>
                </div>
              </form>
            )) : <p className="text-sm text-text-muted">No gallery CMS items yet.</p>}
          </div>
        </AdminCard>
        <AdminCard title="Upload Media">
          <GalleryUploader />
        </AdminCard>
      </div>
    </div>
  );
}
