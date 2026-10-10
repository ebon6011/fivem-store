import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { OgCard, ogSize } from "@/lib/og";

export const alt = `${site.name}: FiveM scripts`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<OgCard title={site.name} subtitle={site.tagline} />, size);
}
