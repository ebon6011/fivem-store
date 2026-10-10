import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { ChatIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: `Get help with ${site.name} scripts on Discord or send us a message.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container>
      <PageHeader eyebrow="Support" title="Contact & support" description="The fastest way to get help is our Discord." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass h-fit space-y-4 p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <ChatIcon className="h-6 w-6" />
          </span>
          <h2 className="font-display text-xl font-semibold text-white">Discord support</h2>
          <p className="text-sm text-zinc-400">
            Join the server and open a ticket. Include your framework, script version and any console errors.
          </p>
          <ButtonLink href={site.discordUrl} external className="w-full">
            <ChatIcon className="h-4 w-4" /> Join Discord
          </ButtonLink>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
