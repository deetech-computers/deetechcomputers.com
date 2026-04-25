import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "About us",
  title: "About Us",
  intro:
    "DEETECH COMPUTERS is a Ghanaian technology retailer focused on quality devices, practical support, and reliable nationwide delivery.",
  sections: [
    {
      title: "Who We Are",
      blocks: [
        {
          paragraphs: [
            "We help students, professionals, creators, and businesses choose the right laptops, phones, monitors, accessories, printers, storage devices, and other everyday tech products.",
            "Our approach is simple: honest recommendations, clear pricing, secure payment options, and support that responds quickly.",
          ],
        },
      ],
    },
    {
      title: "What We Offer",
      blocks: [
        {
          items: [
            "Laptops and desktops for school, work, and business",
            "Smartphones and mobile devices across multiple price levels",
            "Monitors, accessories, and productivity peripherals",
            "Storage devices and printers for home and office use",
            "After-sales support, warranty guidance, and customer assistance",
          ],
        },
      ],
    },
    {
      title: "Our Mission and Values",
      blocks: [
        {
          title: "Mission",
          paragraphs: [
            "To make quality technology easier to access through trusted products, fast delivery, and dependable customer support.",
          ],
        },
        {
          title: "Core Values",
          items: [
            "Integrity: transparent communication and fair service",
            "Quality: carefully selected products and support standards",
            "Reliability: consistent order handling and delivery updates",
            "Customer Focus: practical help before and after purchase",
          ],
        },
      ],
    },
    {
      title: "Why Customers Choose DEETECH",
      points: [
        "Strong product mix across major categories",
        "Responsive support through phone, email, and WhatsApp",
        "Secure checkout options including manual and Hubtel flow",
        "Nationwide delivery service across Ghana",
      ],
    },
  ],
  cta: {
    title: "Need Help Choosing a Device?",
    description:
      "Our team can guide you to the right product based on your budget and use case.",
    links: [
      { href: "/products", label: "Browse Products" },
      { href: "/contact", label: "Contact Support" },
    ],
  },
};

export default function AboutPage() {
  return <StaticContentPage page={page} />;
}

