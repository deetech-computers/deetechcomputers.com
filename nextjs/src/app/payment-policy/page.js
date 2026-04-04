import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "Payment policy",
  title: "DEETECH Computers Payment Policy",
  intro: "Secure, convenient payment options for your tech purchases. Your security is our priority.",
  highlights: [
    { title: "Secure Payments", description: "All transactions are protected and verified." },
    { title: "Mobile Money", description: "Quick payments via MTN and Telecel." },
    { title: "Direct Bank Payment", description: "Direct bank payments available." },
  ],
  sections: [
    {
      title: "Payment Methods",
      blocks: [
        {
          title: "Bank Transfer",
          paragraphs: [
            "Bank: CALBANK",
            "Account Number: 1400009398769",
            "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
          ],
        },
        {
          title: "MTN Mobile Money",
          paragraphs: [
            "Merchant Number(ID): 694988",
            "Merchant Name: Deetek 360 Enterprise (DEETECH COMPUTERS)",
            "MoMo Number: 0591755964",
            "Account Name: Daniel Adjei Mensah (DEETECH COMPUTERS)",
          ],
        },
        {
          title: "Hubtel",
          paragraphs: [
            "Dial: *713*5964#",
            "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
          ],
        },
        {
          title: "Telecel (Vodafone) Cash",
          paragraphs: [
            "Merchant ID: 451444",
            "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
          ],
        },
      ],
    },
    {
      title: "After Making Payment",
      blocks: [
        { title: "1. Make Payment", paragraphs: ["Choose your preferred payment method and complete the transaction."] },
        { title: "2. Take Screenshot", paragraphs: ["Capture the transaction confirmation screen as proof of payment."] },
        { title: "3. Share Details", paragraphs: ["Send screenshot and delivery information via WhatsApp or upload on payment page."] },
        { title: "4. Order Confirmation", paragraphs: ["We'll verify and confirm your order instantly."] },
      ],
    },
    {
      title: "Delivery Information",
      blocks: [
        {
          title: "Delivery Charges",
          items: [
            "Free Delivery: Available for laptop purchases anywhere in Ghana.",
            "Delivery Charges Apply: For accessories and other products.",
          ],
        },
        {
          title: "Required Delivery Information",
          items: [
            "Full Name: Your complete name as on ID.",
            "Phone Number: Active contact number.",
            "Region: Your region in Ghana.",
            "Town/City: Your specific town or city.",
            "Delivery Address: Complete address for delivery.",
          ],
        },
      ],
    },
    {
      title: "Save on Transaction Charges",
      points: [
        "Reduce Fees with Cash-Out: Authorize a cash-out payment directly to our certified accounts for faster and cheaper transactions.",
        "Instant Confirmation: Cash-out payments are processed instantly with lower fees compared to standard transfers.",
      ],
    },
  ],
  cta: {
    title: "Need Payment Assistance?",
    description: "Our team is here to help with any payment questions or confirmation issues.",
    href: "/contact",
    label: "Contact Us",
  },
};

export default function PaymentPolicyPage() {
  return <StaticContentPage page={page} />;
}
