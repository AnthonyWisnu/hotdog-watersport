import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAdminTestimonials } from "@/lib/cms/testimonials";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "./actions";
import TestimonialImageUploader from "./TestimonialImageUploader";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="Testimonials"
        description="Manage guest reviews, ratings, featured status, and optional guest images."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="Testimonials">
          <div className="space-y-3">
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <form key={testimonial.id} action={updateTestimonial.bind(null, testimonial.id)} className="rounded-md border border-border p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <input name="guest_name" defaultValue={testimonial.guest_name} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <input name="guest_origin" defaultValue={testimonial.guest_origin || ""} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <input name="rating" type="number" min="0" max="5" step="0.1" defaultValue={testimonial.rating} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <textarea name="review" defaultValue={testimonial.review} rows={3} className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3" />
                  <input name="reviewed_at" type="date" defaultValue={testimonial.reviewed_at || ""} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <input name="sort_order" type="number" defaultValue={testimonial.sort_order} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <select name="status" defaultValue={testimonial.status} className="rounded-md border border-border px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input name="is_featured" type="checkbox" defaultChecked={testimonial.is_featured} /> Featured
                  </label>
                  <div className="md:col-span-2">
                    <TestimonialImageUploader testimonialId={testimonial.id} />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">Save</button>
                  <ConfirmButton formAction={deleteTestimonial.bind(null, testimonial.id)} message="Delete this testimonial?" className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700">
                    Delete
                  </ConfirmButton>
                </div>
              </form>
            )) : <p className="text-sm text-text-muted">No testimonials yet.</p>}
          </div>
        </AdminCard>
        <AdminCard title="Create Testimonial">
          <form action={createTestimonial} className="space-y-4">
            <input name="guest_name" required placeholder="Guest name" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input name="guest_origin" placeholder="Origin" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input name="rating" type="number" min="0" max="5" step="0.1" defaultValue="5" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <textarea name="review" required placeholder="Review" rows={5} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input name="reviewed_at" type="date" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue="0" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <select name="status" defaultValue="draft" className="w-full rounded-md border border-border px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input name="is_featured" type="checkbox" /> Featured
            </label>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Create Testimonial</button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
