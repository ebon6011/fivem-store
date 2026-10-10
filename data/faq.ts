// Edit these answers to match your own policies.
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What does \"escrow\" mean?",
    answer:
      "Escrow scripts are protected by Cfx.re's asset escrow system. The core code is encrypted, but config files and anything you'd normally customise stay open. Your purchase is linked to the Cfx.re account you use at checkout, and the script appears in your Cfx.re Portal under Granted Assets.",
  },
  {
    question: "Do I get updates?",
    answer:
      "Yes. When we release an update, the new version appears in your Cfx.re Portal for you to download. Each script's page has a changelog listing what changed.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Scripts are digital goods delivered instantly, so please read our Refund Policy before buying. If something isn't working, contact us on Discord first. We'd much rather fix it for you.",
  },
  {
    question: "How do I get support?",
    answer:
      "Join our Discord and open a support ticket. Include your framework, the script version and any errors from your server console so we can help faster.",
  },
  {
    question: "Which frameworks are supported?",
    answer:
      "Each script lists its supported frameworks (ESX, QBCore, QBox or Standalone) on its page and in the store filters. Please only buy a script if your framework is listed.",
  },
  {
    question: "How do I install a script?",
    answer:
      "Every script has a step-by-step guide on our Docs page. In short: download it from your Cfx.re Portal, put it in your resources folder, add it to server.cfg and restart your server.",
  },
  {
    question: "Which payment methods can I use?",
    answer:
      "Checkout is handled by Tebex, which offers common options such as cards and PayPal depending on your region. We never see or store your payment details.",
  },
];
