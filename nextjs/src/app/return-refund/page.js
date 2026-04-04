import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "Return and refund",
  title: "DEETECH COMPUTERS Return and Refund Policy",
  intro: "Customer satisfaction is our top priority. Clear, hassle-free returns and refunds when you need them.",
  highlights: [
    { title: "Warranty Covered", description: "All products include valid warranty protection." },
    { title: "2-5 Day Returns", description: "Quick return process for eligible items." },
    { title: "Easy Process", description: "Straightforward return and refund steps." },
  ],
  sections: [
    {
      title: "Warranty on All Items",
      blocks: [
        {
          title: "Product Protection",
          items: [
            "All products come with valid warranty coverage.",
            "Warranty covers manufacturing defects and quality issues.",
            "Every product meets our strict quality standards.",
            "Contact customer support for warranty claims and assistance.",
          ],
        },
      ],
    },
    {
      title: "Eligibility for Returns",
      blocks: [
        {
          title: "Valid Return Conditions",
          items: [
            "Delivery Errors: Wrong product, incomplete order, or damage during delivery.",
            "Timeframe: Returns must be initiated within 2-5 days of receiving your order.",
          ],
          note: "After 2-5 days, returns are only accepted for warranty-related claims.",
        },
        {
          title: "Condition of Returned Products",
          items: [
            "Original Condition: Item must be in the same state as delivered.",
            "Packaging Intact: Unopened or with all original packaging, labels, and seals.",
            "Accessories Included: All manuals, components, and accessories must be returned.",
          ],
        },
      ],
    },
    {
      title: "Return Process",
      blocks: [
        { title: "1. Contact Support", paragraphs: ["Reach out via WhatsApp or call (0591755964) with order details and issue description."] },
        { title: "2. Receive Instructions", paragraphs: ["Get clear guidance on return address, packaging, and labeling requirements."] },
        { title: "3. Shipping Cost Responsibility", paragraphs: ["We cover costs for our errors; customer covers other reasons."] },
        { title: "4. Inspection and Resolution", paragraphs: ["Item inspection followed by replacement or refund based on your preference."] },
      ],
    },
    {
      title: "Shipping Responsibility",
      blocks: [
        {
          title: "Shipping Costs",
          items: [
            "Our Error: Full return shipping cost covered by DEETECH COMPUTERS.",
            "Customer Reasons: Shipping costs responsibility of customer (change of mind, incorrect order).",
          ],
        },
      ],
    },
    {
      title: "Important Information",
      points: [
        "Refund Method: Refunds are processed using the same payment method used during purchase.",
        "Processing Time: Refunds may take 5-9 business days after product inspection and approval.",
        "Non-Eligible Items: Items showing physical damage, tampering, or misuse are not eligible for return.",
        "Inspection Required: All returned items undergo thorough inspection before refund or replacement.",
      ],
    },
  ],
  cta: {
    title: "Need Refund or Return Assistance?",
    description: "Our customer support team is ready to assist you with returns, refunds, or any questions.",
    href: "/contact",
    label: "Start Return Process",
  },
};

export default function ReturnRefundPage() {
  return <StaticContentPage page={page} />;
}
