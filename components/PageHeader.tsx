export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="pb-10 pt-14 sm:pt-20">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-zinc-400">{description}</p>}
    </header>
  );
}
