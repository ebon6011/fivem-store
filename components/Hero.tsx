"use client";

import { motion } from "framer-motion";
import { site } from "@/config/site";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { ArrowRightIcon, ChatIcon } from "./icons";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <motion.div
          className="absolute -top-32 left-[15%] h-96 w-96 rounded-full bg-accent/30 blur-3xl"
          animate={{ x: [0, 60, -20, 0], y: [0, 40, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <motion.p {...fadeUp(0)} className="glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-300">
          ESX · QBCore · QBox · Standalone
        </motion.p>
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl"
        >
          Level up your FiveM server with{" "}
          <span className="bg-linear-to-r from-accent to-white bg-clip-text text-transparent">{site.name}</span>
        </motion.h1>
        <motion.p {...fadeUp(0.2)} className="mt-6 max-w-xl text-lg text-zinc-400">
          {site.tagline}
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/store">
            Browse scripts <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={site.discordUrl} external variant="ghost">
            <ChatIcon className="h-4 w-4" /> Join Discord
          </ButtonLink>
        </motion.div>
      </Container>
    </section>
  );
}
