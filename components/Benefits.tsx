import { Container } from "./Container";
import { BoltIcon, BookIcon, ChatIcon, LayersIcon, RefreshIcon, ShieldIcon } from "./icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

// Promises about the product only. No reviews, numbers or customer counts.
const benefits = [
  { icon: BoltIcon, title: "Optimized code", text: "Written to stay light on server resources, with clean, readable config files." },
  { icon: LayersIcon, title: "Multi-framework", text: "Scripts list exactly which frameworks they support: ESX, QBCore, QBox or standalone." },
  { icon: RefreshIcon, title: "Updates included", text: "Bug fixes and improvements arrive in your Cfx.re Portal. Every change is in the changelog." },
  { icon: ChatIcon, title: "Discord support", text: "Stuck? Open a ticket on our Discord and we'll help you get it running." },
  { icon: BookIcon, title: "Clear docs", text: "Every script has a step-by-step installation guide on this site." },
  { icon: ShieldIcon, title: "Secure checkout", text: "Payments are handled by Tebex, FiveM's official store partner. We never see your card details." },
];

export function Benefits() {
  return (
    <section aria-labelledby="benefits-heading" className="py-16">
      <Container>
        <SectionHeading id="benefits-heading" eyebrow="Why Rocky Shop" title="Why buy from us" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.05} className="glass h-full p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
