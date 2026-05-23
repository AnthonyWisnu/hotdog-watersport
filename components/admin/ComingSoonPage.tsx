import AdminCard from "./AdminCard";
import AdminPageHeader from "./AdminPageHeader";
import AdminState from "./AdminState";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <section aria-labelledby="coming-soon-heading" className="max-w-4xl">
      <AdminPageHeader eyebrow="Admin Module" title={title} description={description} />
      <AdminCard>
        <AdminState
          title="Module pending"
          description="This module is reserved for the next implementation phase."
        />
      </AdminCard>
    </section>
  );
}
