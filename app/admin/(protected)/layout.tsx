import { LayoutDashboard, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { signOutAdmin } from "../actions";
import AdminNavigation from "@/components/admin/AdminNavigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = await requireAdmin();

  return (
    <div className="min-h-svh bg-surface-muted text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <LayoutDashboard size={20} className="text-primary" aria-hidden="true" />
          <span className="font-semibold">Admin CMS</span>
        </div>
        <AdminNavigation />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-white/90 px-5 backdrop-blur-md">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              PT Hot Dog Water Sport
            </p>
            <p className="text-xs text-text-muted">
              {admin.display_name || admin.email}
            </p>
          </div>
          <form action={signOutAdmin}>
            <div className="flex items-center gap-2">
              <a
                href="/admin/preview/enable"
                className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
              >
                Preview Site
              </a>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            </div>
          </form>
        </header>
        <AdminNavigation orientation="horizontal" />

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
