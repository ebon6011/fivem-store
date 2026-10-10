import { site } from "@/config/site";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { ChatIcon } from "./icons";
import { Reveal } from "./Reveal";

export function DiscordCta() {
  return (
    <section aria-labelledby="discord-heading" className="py-16">
      <Container>
        <Reveal className="glass relative overflow-hidden p-8 text-center sm:p-14">
          <div aria-hidden="true" className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
          <h2 id="discord-heading" className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Join the {site.name} Discord
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-zinc-400">
            Get support, see update announcements and be first to hear about new scripts.
          </p>
          <div className="relative mt-8 flex justify-center">
            <ButtonLink href={site.discordUrl} external>
              <ChatIcon className="h-4 w-4" /> Join Discord
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
