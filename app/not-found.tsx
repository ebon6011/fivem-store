import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-zinc-400">That page doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/store">Browse scripts</ButtonLink>
        <ButtonLink href="/" variant="ghost">Home</ButtonLink>
      </div>
    </Container>
  );
}
