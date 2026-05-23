interface AdminStateProps {
  title: string;
  description?: string;
  variant?: "empty" | "loading" | "error" | "success";
}

const variantClasses = {
  empty: "border-border bg-white text-text-muted",
  loading: "border-cyan-100 bg-cyan-50 text-primary",
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function AdminState({
  title,
  description,
  variant = "empty",
}: AdminStateProps) {
  return (
    <div className={`rounded-lg border p-5 ${variantClasses[variant]}`}>
      <p className="font-semibold">{title}</p>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed opacity-80">{description}</p>
      ) : null}
    </div>
  );
}
