import Link from "next/link";
import { isAdminPreviewEnabled } from "@/lib/admin/preview";

export default async function PreviewBanner() {
  const previewEnabled = await isAdminPreviewEnabled();

  if (!previewEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-900">
      Preview mode is active. Draft CMS content may be visible.{" "}
      <Link href="/admin/preview/disable" className="underline">
        Exit preview
      </Link>
    </div>
  );
}
