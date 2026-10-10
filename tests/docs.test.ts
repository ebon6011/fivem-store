import { describe, expect, it } from "vitest";
import { getDoc, listDocSlugs } from "@/lib/docs";

describe("getDoc", () => {
  it("loads a guide with its title and rendered HTML", async () => {
    const doc = await getDoc("placeholder-delivery-job");
    expect(doc?.slug).toBe("placeholder-delivery-job");
    expect(doc?.title).toBe("[PLACEHOLDER] Delivery Job — Installation");
    expect(doc?.html).toContain("<h2>Requirements</h2>");
    expect(doc?.html).toContain("<code");
  });

  it("returns null for a guide that does not exist", async () => {
    expect(await getDoc("no-such-script")).toBeNull();
  });

  it("refuses slugs that are not plain file names", async () => {
    expect(await getDoc("../README")).toBeNull();
    expect(await getDoc("..\\README")).toBeNull();
    expect(await getDoc("Placeholder-Delivery-Job")).toBeNull();
    expect(await getDoc("")).toBeNull();
  });
});

describe("listDocSlugs", () => {
  it("lists every guide, sorted", async () => {
    const slugs = await listDocSlugs();
    expect(slugs).toContain("placeholder-delivery-job");
    expect(slugs).toHaveLength(6);
    expect(slugs).toEqual([...slugs].sort());
  });
});
