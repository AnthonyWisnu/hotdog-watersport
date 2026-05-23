interface AdminCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function AdminCard({
  title,
  description,
  children,
}: AdminCardProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-5">
      {title ? (
        <div className="mb-4">
          <h2 className="font-semibold text-text-primary">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-text-muted">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
