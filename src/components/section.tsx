import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12">
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground tracking-wider uppercase">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
