import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "Delivery policy",
  title: "DEETECH COMPUTERS Delivery Policy",
  intro: "Fast, reliable, and transparent delivery services across Ghana. Your convenience is our priority.",
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
          title: "5. Delivery Fee Communication",
          items: [
            "For non-laptop items, delivery personnel will contact you upon arrival.",
            "Delivery fee confirmed before handing over the parcel.",
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
            "Delivery fee communicated upon rider's arrival.",
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
