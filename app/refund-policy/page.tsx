import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalNotice } from "@/components/LegalNotice";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund policy for ${site.name}.`,
  alternates: { canonical: "/refund-policy" },
};

const sections = [
  ["1. Digital products", "[PLACEHOLDER] Explain that scripts are digital goods delivered instantly to the buyer's Cfx.re account."],
  ["2. When refunds are possible", "[PLACEHOLDER] List the cases where you will give a refund (for example: the script cannot be made to work on a supported framework after support has tried to help)."],
  ["3. When refunds are not possible", "[PLACEHOLDER] List the cases where you won't (for example: change of mind, buying a script for an unsupported framework)."],
  ["4. How to ask for a refund", "[PLACEHOLDER] Explain the steps (for example: open a Discord ticket with your Tebex transaction ID)."],
  ["5. Processing", "[PLACEHOLDER] Explain how refunds are paid back through Tebex and roughly how long it takes."],
] as const;

export default function RefundPolicyPage() {
  return (
    <Container size="narrow">
      <PageHeader eyebrow="Legal" title="Refund Policy" />
      <LegalNotice />
      <div className="space-y-8">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-zinc-400">{text}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
