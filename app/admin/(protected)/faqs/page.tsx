import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import MoveOrderButtons from "@/components/admin/MoveOrderButtons";
import { getAdminFAQs } from "@/lib/cms/faqs";
import { getActiveTaxonomyOptions } from "@/lib/cms/taxonomies";
import { FAQ_CATEGORY_OPTIONS, type TaxonomyOption } from "@/lib/taxonomy";
import { createFAQ, deleteFAQ, moveFAQ, updateFAQ } from "./actions";

export default async function AdminFaqsPage() {
  const [faqs, categories] = await Promise.all([
    getAdminFAQs(),
    getActiveTaxonomyOptions("faq_category"),
  ]);

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
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <form
                  key={faq.id}
                  action={updateFAQ.bind(null, faq.id)}
                  className="rounded-md border border-border p-4"
                >
                  <input type="hidden" name="sort_order" value={faq.sort_order} />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input
                      name="question"
                      defaultValue={faq.question}
                      className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3"
                    />
                    <textarea
                      name="answer"
                      defaultValue={faq.answer}
                      rows={3}
                      className="rounded-md border border-border px-3 py-2 text-sm md:col-span-3"
                    />
                    <CategorySelect
                      defaultValue={faq.category}
                      options={categories}
                    />
                    <select
                      name="status"
                      defaultValue={faq.status}
                      className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2"
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
                    <MoveOrderButtons
                      moveUpAction={moveFAQ.bind(null, faq.id, "up")}
                      moveDownAction={moveFAQ.bind(null, faq.id, "down")}
                      disableUp={index === 0}
                      disableDown={index === faqs.length - 1}
                    />
                    <ConfirmButton
                      formAction={deleteFAQ.bind(null, faq.id)}
                      message="Delete this FAQ?"
                      className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </form>
              ))
            ) : (
              <p className="text-sm text-text-muted">No FAQ items yet.</p>
            )}
          </div>
        </AdminCard>
        <AdminCard title="Create FAQ">
          <form action={createFAQ} className="space-y-4">
            <input
              name="question"
              required
              placeholder="Question"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            <textarea
              name="answer"
              required
              placeholder="Answer"
              rows={5}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            <CategorySelect
              defaultValue={categories[0]?.value || "general"}
              options={categories}
            />
            <select
              name="status"
              defaultValue="draft"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
              Create FAQ
            </button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

function CategorySelect({
  defaultValue,
  options = FAQ_CATEGORY_OPTIONS,
}: {
  defaultValue: string;
  options?: readonly TaxonomyOption[];
}) {
  return (
    <select
      name="category"
      defaultValue={defaultValue}
      className="w-full rounded-md border border-border px-3 py-2 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
