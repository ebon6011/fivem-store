import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { Container } from "@/components/Container";
import { DiscordCta } from "@/components/DiscordCta";
import { PageHeader } from "@/components/PageHeader";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about escrow, updates, refunds, support and installing our FiveM scripts.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <Container size="narrow">
        <PageHeader eyebrow="FAQ" title="Frequently asked questions" description="Can't find your answer? Ask us on Discord." />
        <Accordion items={faqs} />
      </Container>
      <DiscordCta />
    </>
  );
}
