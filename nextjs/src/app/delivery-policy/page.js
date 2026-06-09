import StaticContentPage from "@/components/content/static-content-page";

const page = {
  variant: "delivery",
  kicker: "Delivery policy",
  title: "DEETECH COMPUTERS Delivery Policy",
  intro: "Fast, reliable, and transparent delivery services across Ghana. Your convenience is our priority.",
  quickFacts: [
    { value: "16", label: "Regions covered" },
    { value: "4-24h", label: "Typical dispatch" },
    { value: "Free", label: "Laptop delivery" },
  ],
  highlights: [
    { title: "Pickup Available", description: "Collect directly from our Kumasi location." },
    { title: "Fast Delivery", description: "4-24 hours for confirmed orders." },
    { title: "Free Laptop Delivery", description: "Nationwide free delivery for laptops." },
  ],
  sections: [
    {
      title: "Delivery Options",
      blocks: [
        {
          title: "1. Pickup Option",
          items: [
            "Collect items directly from our main pickup point in Kumasi.",
            "Notification sent via phone call, SMS, or WhatsApp when ready.",
            "Complete payment and receive items upon arrival.",
          ],
        },
        {
          title: "2. Payment Before Delivery",
          items: [
            "Required for all deliveries outside Kumasi.",
            "Customer details collected after payment confirmation.",
            "Payment confirmation sent via SMS or WhatsApp.",
          ],
        },
        {
          title: "3. Delivery Timeline",
          items: [
            "Fast and reliable delivery service.",
            "All confirmed orders delivered within 4 to 24 hours.",
            "Timeline depends on location and product availability.",
          ],
        },
      ],
    },
    {
      title: "Delivery Charges",
      blocks: [
        {
          title: "4. Free Nationwide Laptop Delivery",
          items: [
            "Free delivery across Ghana on all laptop purchases.",
            "Valid only after full payment has been received.",
            "Applies exclusively to laptops (not accessories or other items).",
          ],
        },
        {
          title: "5. Non-Laptop Delivery Fees",
          items: [
            "Orders below GHC 60 qualify for free delivery.",
            "Orders from GHC 60 to GHC 300 attract a GHC 30 delivery fee.",
            "Orders above GHC 300 to GHC 999 attract a GHC 50 delivery fee.",
            "Orders from GHC 1,000 to GHC 1,999 attract a GHC 100 delivery fee.",
            "Orders at GHC 2,000 or more qualify for free delivery.",
            "Delivery fee is based on the product subtotal for non-laptop items.",
          ],
        },
      ],
    },
    {
      title: "Payment on Delivery",
      blocks: [
        {
          title: "I. Same Location - Kumasi",
          items: [
            "Customers in Kumasi can opt for payment on delivery.",
            "Delivery fee must be paid to the rider before dispatch.",
            "Specify product details for confirmation before delivery.",
            "Notification sent when delivery process starts.",
          ],
          note: "Note: Delivery is not free for laptops when payment is made upon delivery.",
        },
        {
          title: "II. Payment on Delivery - Outside Kumasi",
          items: [
            "Available for selected products only.",
            "70% commitment fee required before dispatch.",
            "Delivery fee follows the published non-laptop delivery tiers.",
          ],
          extraTitle: "Eligible Items for Payment on Delivery (Outside Kumasi)",
          extraItems: ["Phone Accessories", "Computer Accessories", "Tablets"],
        },
      ],
      note: "Important Notice: All laptop orders require full payment before delivery. No exceptions.",
    },
    {
      title: "Important Information",
      points: [
        "Kumasi Pickup Available: Collect your orders directly from our main location in Kumasi after notification.",
        "Fast Processing: Most orders are processed and delivered within 4-24 hours after confirmation.",
        "Free Laptop Delivery: Enjoy complimentary nationwide delivery on all laptop purchases after full payment.",
        "Tiered Non-Laptop Delivery: Delivery is free below GHC 60, GHC 30 from GHC 60 to GHC 300, GHC 50 above GHC 300 to GHC 999, GHC 100 for GHC 1,000 to GHC 1,999, and free from GHC 2,000 upward.",
        "Clear Communication: We maintain transparent communication about delivery fees and timelines.",
      ],
    },
  ],
  cta: {
    title: "Need Delivery or Order Tracking Assistance?",
    description: "Our team is here to assist you with any delivery inquiries or order tracking.",
    href: "/contact",
    label: "Contact Us",
  },
};

export default function DeliveryPolicyPage() {
  return <StaticContentPage page={page} />;
}
