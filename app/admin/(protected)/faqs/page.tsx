import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAdminFAQs } from "@/lib/cms/faqs";
import { createFAQ, deleteFAQ, updateFAQ } from "./actions";

export default async function AdminFaqsPage() {
  const faqs = await getAdminFAQs();

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="FAQ"
        description="Manage questions, answers, categories, order, and publish status."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="FAQ Items">
          <div className="space-y-3">
            {faqs.length > 0 ? faqs.map((faq) => (
              <form key={faq.id} action={updateFAQ.bind(null, faq.id)} className="rounded-md border border-border p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <input name="question" defaultValue={faq.question} className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3" />
                  <textarea name="answer" defaultValue={faq.answer} rows={3} className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3" />
                  <input name="category" defaultValue={faq.category} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <input name="sort_order" type="number" defaultValue={faq.sort_order} className="rounded-md border border-border px-3 py-2 text-sm" />
                  <select name="status" defaultValue={faq.status} className="rounded-md border border-border px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">Save</button>
                  <ConfirmButton formAction={deleteFAQ.bind(null, faq.id)} message="Delete this FAQ?" className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700">
                    Delete
                  </ConfirmButton>
                </div>
              </form>
            )) : <p className="text-sm text-text-muted">No FAQ items yet.</p>}
          </div>
        </AdminCard>
        <AdminCard title="Create FAQ">
          <form action={createFAQ} className="space-y-4">
            <input name="question" required placeholder="Question" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <textarea name="answer" required placeholder="Answer" rows={5} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input name="category" defaultValue="general" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue="0" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            <select name="status" defaultValue="draft" className="w-full rounded-md border border-border px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Create FAQ</button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
