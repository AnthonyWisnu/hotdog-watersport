export default function AboutHero() {
  return (
    <section className="pt-32 pb-16 bg-surface-muted border-b border-border">
      <div className="container-content">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm text-text-muted list-none p-0">
            <li><a href="/" className="hover:text-text-primary transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-primary font-medium">About</li>
          </ol>
        </nav>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-primary">
          Our Story
        </h1>
      </div>
    </section>
  );
}
