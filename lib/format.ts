import { site } from "@/config/site";

const formatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
});

export function formatPrice(amount: number): string {
  return amount === 0 ? "Free" : formatter.format(amount);
}
