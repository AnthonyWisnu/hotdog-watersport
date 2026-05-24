import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MoveOrderButtons from "@/components/admin/MoveOrderButtons";
import ServiceForm from "@/components/admin/ServiceForm";
import { getAdminServices } from "@/lib/cms/services";
import { getServiceFormTaxonomyOptions } from "@/lib/cms/taxonomies";
import { createService, moveService } from "./actions";

export default async function AdminServicesPage() {
  const [services, taxonomy] = await Promise.all([
    getAdminServices(),
    getServiceFormTaxonomyOptions(),
  ]);

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="Services"
        description="Create and manage watersport services, prices, duration, categories, ratings, badges, and publishing status."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="Existing Services">
          <div className="space-y-3">
            {services.length > 0 ? (
              services.map((service, index) => (
                <div
                  key={service.id}
                  className="rounded-md border border-border p-4 transition-colors hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="min-w-0 flex-1"
                    >
                      <p className="font-semibold text-text-primary">
                        {service.title}
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        {service.price || "No price"} /{" "}
                        {service.duration || "No duration"}
                      </p>
                    </Link>
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted">
                      {service.status}
                    </span>
                  </div>
                  <form className="mt-3">
                    <MoveOrderButtons
                      moveUpAction={moveService.bind(null, service.id, "up")}
                      moveDownAction={moveService.bind(null, service.id, "down")}
                      disableUp={index === 0}
                      disableDown={index === services.length - 1}
                    />
                  </form>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted">No services in CMS yet.</p>
            )}
          </div>
        </AdminCard>

        <ServiceForm
          action={createService}
          categoryOptions={taxonomy.serviceCategories}
          badgeOptions={taxonomy.serviceBadges}
        />
      </div>
    </div>
  );
}
