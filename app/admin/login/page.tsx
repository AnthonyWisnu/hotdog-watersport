import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-muted px-5 py-12">
      <section
        aria-labelledby="admin-login-heading"
        className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Admin Area
        </p>
        <h1
          id="admin-login-heading"
          className="mt-2 font-display text-4xl font-bold text-text-primary"
        >
          Login
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Use an authorized Supabase admin account to manage website content.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
