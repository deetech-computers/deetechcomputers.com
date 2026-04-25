import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "Shopping guide",
  title: "How It Works",
  intro:
    "A quick guide to how shopping, payment, delivery, and support work at DEETECH COMPUTERS.",
  sections: [
    {
      title: "1. Browse and Choose",
      blocks: [
        {
          paragraphs: [
            "Explore products by category, brand, or homepage promotions such as Just Landed, Hot Deals, and Trusted Brands.",
            "Open any product to view details, stock status, and pricing before adding to cart or wishlist.",
          ],
        },
      ],
    },
    {
      title: "2. Add to Cart and Checkout",
      blocks: [
        {
          paragraphs: [
            "Add the products you want, review your cart, and proceed to checkout.",
            "Enter your delivery details once, then choose your preferred payment method.",
          ],
        },
      ],
    },
    {
      title: "3. Select Your Payment Method",
      blocks: [
        {
          items: [
            "Manual payment options (MTN, Telecel, Bank Transfer).",
            "Automatic payment via Hubtel checkout flow.",
            "Coupon and affiliate code support during checkout when applicable.",
          ],
        },
      ],
      note: "For automatic payments, your order is confirmed after payment verification.",
    },
    {
      title: "4. Order Confirmation and Delivery",
      blocks: [
        {
          paragraphs: [
            "After successful checkout, we create your order and send confirmation details.",
            "You can track order progress from your account under My Orders.",
            "Delivery timelines and conditions follow our delivery policy.",
          ],
        },
      ],
    },
    {
      title: "5. After-Sales Support",
      blocks: [
        {
          paragraphs: [
            "Need help after purchase? Contact support or continue conversation through your account messages/requests section.",
            "For returns, refunds, warranty, and privacy information, visit the dedicated policy pages.",
          ],
        },
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

export default function HowItWorksPage() {
  return <StaticContentPage page={page} />;
}

