import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ServiceForm from "@/components/admin/ServiceForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAdminService } from "@/lib/cms/services";
import { deleteService, updateService } from "../actions";
import ServiceMediaUploader from "./ServiceMediaUploader";

interface AdminServiceMedia {
  id: string;
  media_role: string;
  media_assets: { path: string } | null;
}

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getAdminService(id);
  const serviceMedia = (service.service_media || []) as AdminServiceMedia[];
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
        <ServiceForm action={updateAction} service={service} />

        <AdminCard title="Service Media" description="Upload multiple images or promo videos for this service.">
          <ServiceMediaUploader serviceId={id} />
          <div className="mt-5 space-y-2">
            {serviceMedia.length > 0 ? (
              serviceMedia.map((item) => (
                <div key={item.id} className="rounded-md border border-border px-3 py-2 text-sm text-text-muted">
                  {item.media_assets?.path || "Missing media asset"} · {item.media_role}
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
