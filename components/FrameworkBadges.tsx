import type { Framework } from "@/data/products";

export function FrameworkBadges({
  frameworks,
  size = "md",
}: {
  frameworks: readonly Framework[];
  size?: "sm" | "md";
}) {
  const sizing = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <ul aria-label="Supported frameworks" className="flex flex-wrap gap-1.5">
      {frameworks.map((framework) => (
        <li key={framework} className={`rounded-md border border-accent/40 bg-accent/15 font-medium text-zinc-100 ${sizing}`}>
          {framework}
        </li>
      ))}
    </ul>
  );
}
