import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminState from "@/components/admin/AdminState";

const MODULES = [
  {
    title: "Services",
    description: "Manage service names, prices, durations, ratings, badges, and media.",
  },
  {
    title: "Hero & Settings",
    description: "Update homepage hero, contact details, location, and social links.",
  },
  {
    title: "Gallery",
    description: "Publish photos and videos with captions, categories, and alt text.",
  },
  {
    title: "FAQ & Testimonials",
    description: "Keep guest questions and reviews fresh from the admin dashboard.",
  },
];

export default function AdminDashboardPage() {
  return (
    <section aria-labelledby="admin-dashboard-heading" className="max-w-6xl">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Dashboard"
        description="Admin authentication, media storage, and database schema are ready. Content modules will be connected one phase at a time."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((module) => (
          <AdminCard key={module.title} title={module.title}>
            <p className="text-sm leading-relaxed text-text-muted">
              {module.description}
            </p>
          </AdminCard>
        ))}
      </div>

      <div className="mt-6">
        <AdminState
          variant="success"
          title="Foundation ready"
          description="Protected admin routing, storage policies, and reusable UI states are in place."
        />
      </div>
    </section>
  );
}
