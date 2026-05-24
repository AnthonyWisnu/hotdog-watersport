import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminState from "@/components/admin/AdminState";
import ServiceForm from "@/components/admin/ServiceForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAdminService } from "@/lib/cms/services";
import { getServiceFormTaxonomyOptions } from "@/lib/cms/taxonomies";
import { deleteService, updateService } from "../actions";
import ServiceMediaUploader from "./ServiceMediaUploader";

interface AdminServiceMedia {
  id: string;
  media_role: string;
  alt_text: string | null;
  caption: string | null;
  media_assets: { path: string; media_type: string; status: string } | null;
}

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [service, taxonomy] = await Promise.all([
    getAdminService(id),
    getServiceFormTaxonomyOptions(),
  ]);
  const serviceMedia = (service.service_media || []) as AdminServiceMedia[];
  const hasCover = serviceMedia.some(
    (item) =>
      item.media_role === "cover" &&
      item.media_assets?.media_type === "image" &&
      item.media_assets.status === "published"
  );
  const updateAction = updateService.bind(null, id);
  const deleteAction = deleteService.bind(null, id);

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        eyebrow="Edit Service"
        title={service.title}
        description="Update service content and attach uploaded media."
      />

      <div className="space-y-6">
        <ServiceForm
          action={updateAction}
          service={service}
          categoryOptions={taxonomy.serviceCategories}
          badgeOptions={taxonomy.serviceBadges}
        />

        <AdminCard
          title="Service Media"
          description="Upload a cover image, supporting gallery media, or a promo video for this service."
        >
          {!hasCover ? (
            <div className="mb-4">
              <AdminState
                variant="error"
                title="Cover image required"
                description="Upload one published cover image before publishing this service."
              />
            </div>
          ) : null}
          <ServiceMediaUploader serviceId={id} />
          <div className="mt-5 space-y-2">
            {serviceMedia.length > 0 ? (
              serviceMedia.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border px-3 py-2 text-sm text-text-muted"
                >
                  <div className="font-medium text-text-primary">
                    {item.media_assets?.path || "Missing media asset"}
                  </div>
                  <div className="mt-1">
                    {item.media_role} / {item.media_assets?.media_type || "unknown"} /{" "}
                    {item.media_assets?.status || "missing"}
                  </div>
                  {item.alt_text ? (
                    <div className="mt-1">Alt: {item.alt_text}</div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted">No media attached yet.</p>
            )}
          </div>
        </AdminCard>

        <form action={deleteAction}>
          <ConfirmButton
            message="Delete this service?"
            type="submit"
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Delete Service
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
