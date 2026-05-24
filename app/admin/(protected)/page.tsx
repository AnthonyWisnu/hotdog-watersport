import {
  BadgeHelp,
  BriefcaseBusiness,
  Image,
  Images,
  MessageSquareQuote,
  Settings,
  Tags,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/server";

interface DashboardStat {
  label: string;
  value: number;
  detail: string;
}

interface DashboardModule {
  title: string;
  description: string;
  href: string;
  action: string;
  icon: LucideIcon;
  stat: DashboardStat;
}

async function getDashboardStats() {
  const supabase = await createClient();
  const [
    services,
    publishedServices,
    media,
    gallery,
    publishedGallery,
    faqs,
    testimonials,
    taxonomies,
  ] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("media_assets").select("id", { count: "exact", head: true }),
    supabase
      .from("gallery_items")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("gallery_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
    supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true }),
    supabase.from("taxonomies").select("id", { count: "exact", head: true }),
  ]);

  const errors = [
    services.error,
    publishedServices.error,
    media.error,
    gallery.error,
    publishedGallery.error,
    faqs.error,
    testimonials.error,
    taxonomies.error,
  ].filter(Boolean);

  if (errors[0]) {
    throw errors[0];
  }

  return {
    services: services.count ?? 0,
    publishedServices: publishedServices.count ?? 0,
    media: media.count ?? 0,
    gallery: gallery.count ?? 0,
    publishedGallery: publishedGallery.count ?? 0,
    faqs: faqs.count ?? 0,
    testimonials: testimonials.count ?? 0,
    taxonomies: taxonomies.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const modules: DashboardModule[] = [
    {
      title: "Services",
      description: "Kelola paket watersport, harga, durasi, badge, dan media.",
      href: "/admin/services",
      action: "Manage services",
      icon: BriefcaseBusiness,
      stat: {
        label: "Published",
        value: stats.publishedServices,
        detail: `${stats.services} total services`,
      },
    },
    {
      title: "Media Library",
      description: "Simpan file pusat untuk logo, gallery, hero, dan service.",
      href: "/admin/media",
      action: "Open media",
      icon: Image,
      stat: {
        label: "Assets",
        value: stats.media,
        detail: "images and videos",
      },
    },
    {
      title: "Taxonomy",
      description: "Kelola kategori service, badge, gallery, dan FAQ.",
      href: "/admin/taxonomy",
      action: "Manage taxonomy",
      icon: Tags,
      stat: {
        label: "Options",
        value: stats.taxonomies,
        detail: "controlled values",
      },
    },
    {
      title: "Gallery",
      description: "Atur foto/video yang tampil di halaman gallery publik.",
      href: "/admin/gallery",
      action: "Manage gallery",
      icon: Images,
      stat: {
        label: "Published",
        value: stats.publishedGallery,
        detail: `${stats.gallery} total items`,
      },
    },
    {
      title: "FAQ",
      description: "Perbarui pertanyaan dan jawaban yang sering ditanyakan tamu.",
      href: "/admin/faqs",
      action: "Manage FAQ",
      icon: BadgeHelp,
      stat: {
        label: "Questions",
        value: stats.faqs,
        detail: "available entries",
      },
    },
    {
      title: "Testimonials",
      description: "Kelola review tamu, rating, dan featured testimonials.",
      href: "/admin/testimonials",
      action: "Manage reviews",
      icon: MessageSquareQuote,
      stat: {
        label: "Reviews",
        value: stats.testimonials,
        detail: "guest testimonials",
      },
    },
    {
      title: "Settings",
      description: "Ganti logo, hero, kontak, lokasi, SEO, dan profil bisnis.",
      href: "/admin/settings",
      action: "Open settings",
      icon: Settings,
      stat: {
        label: "Site",
        value: 1,
        detail: "global configuration",
      },
    },
  ];

  return (
    <section aria-labelledby="admin-dashboard-heading" className="max-w-7xl">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Dashboard"
        description="Ringkasan konten dan pintasan untuk mengelola website PT Hot Dog Water Sport."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Published Services"
          value={stats.publishedServices}
          detail={`${stats.services} total`}
        />
        <SummaryCard
          label="Media Assets"
          value={stats.media}
          detail="library files"
        />
        <SummaryCard
          label="Published Gallery"
          value={stats.publishedGallery}
          detail={`${stats.gallery} total`}
        />
        <SummaryCard
          label="Guest Content"
          value={stats.faqs + stats.testimonials}
          detail={`${stats.faqs} FAQ / ${stats.testimonials} reviews`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {modules.map((module) => (
          <ModuleLink key={module.href} module={module} />
        ))}
      </div>
    </section>
  );
}

function SummaryCard({ label, value, detail }: DashboardStat) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-4xl font-bold text-text-primary">{value}</p>
        <p className="pb-1 text-sm text-text-muted">{detail}</p>
      </div>
    </div>
  );
}

function ModuleLink({ module }: { module: DashboardModule }) {
  const Icon = module.icon;

  return (
    <Link
      href={module.href}
      className="group rounded-lg border border-border bg-white p-5 transition-colors hover:border-primary"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white">
          <Icon aria-hidden="true" size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-text-primary">{module.title}</h2>
            <span className="rounded-md bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-muted">
              {module.stat.label}: {module.stat.value}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {module.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-text-muted">{module.stat.detail}</span>
            <span className="text-sm font-semibold text-primary">
              {module.action}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
