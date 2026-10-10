import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalNotice } from "@/components/LegalNotice";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${site.name}.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  ["1. About these terms", "[PLACEHOLDER] Explain who you are and that buying from this store means agreeing to these terms."],
  ["2. Licence", "[PLACEHOLDER] Describe what buyers may do with a script (for example: use it on servers they own or manage) and what they may not do (for example: resell, share or re-upload it)."],
  ["3. Delivery", "[PLACEHOLDER] Explain that purchases are processed by Tebex and delivered to the buyer's Cfx.re account."],
  ["4. Updates and support", "[PLACEHOLDER] Describe how updates are delivered and how long support is offered."],
  ["5. Chargebacks", "[PLACEHOLDER] Explain what happens to access if a payment is disputed or charged back."],
  ["6. Liability", "[PLACEHOLDER] Limit your liability for server issues, data loss or conflicts with other resources."],
  ["7. Changes", "[PLACEHOLDER] Explain that these terms may change and how buyers will be told."],
  ["8. Contact", "[PLACEHOLDER] Tell buyers how to contact you about these terms (for example: your Discord)."],
] as const;

export default function TermsPage() {
  return (
    <Container size="narrow">
      <PageHeader eyebrow="Legal" title="Terms of Service" />
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
