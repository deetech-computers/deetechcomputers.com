import StaticContentPage from "@/components/content/static-content-page";

const page = {
  variant: "terms",
  kicker: "Terms of use",
  title: "DEETECH COMPUTERS Terms of Use",
  intro: "Please read these terms carefully before using our website, services, or products.",
  meta: "Last updated: February 11, 2026",
  quickFacts: [
    { value: "Ghana", label: "Governing law" },
    { value: "Official", label: "Payment channels" },
    { value: "Fair use", label: "Platform conduct" },
  ],
  highlights: [
    { title: "User Responsibilities", description: "Your obligations when using our platform." },
    { title: "Secure Transactions", description: "Safe and authorized payments only." },
    { title: "Your Protection", description: "Clear terms for your security." },
  ],
  sections: [
    {
      title: "Terms Overview",
      blocks: [
        {
          title: "1. Acceptance of Terms",
          items: [
            "By accessing or using our website, services, or products, you agree to be bound by these Terms of Use.",
            "If you disagree with any part of these terms, discontinue use immediately.",
            "Continued use after changes constitutes acceptance of modified terms.",
          ],
        },
        {
          title: "2. User Responsibilities",
          items: [
            "Maintain confidentiality and security of your account credentials.",
            "Use the platform only for lawful purposes and in compliance with applicable laws.",
            "Provide accurate, complete, and current information in all interactions.",
            "Refrain from posting misleading, harmful, inappropriate, or infringing content.",
            "Do not engage in any activity that could disrupt or interfere with our services.",
          ],
          note: "Note: We reserve the right to review, edit, or remove content that violates our policies and to suspend or terminate accounts for violations.",
        },
      ],
    },
    {
      title: "Transactions and Payments",
      blocks: [
        {
          title: "3. Secure Transactions",
          items: [
            "Official Channels Only: Use only verified agents or authorized merchant accounts.",
            "Currency: All payments must be made in the specified website or invoice currency.",
            "No Responsibility: We are not liable for payments made to unauthorized third parties.",
            "Fees: Customers are responsible for payment processing fees or bank charges.",
            "Receipts: Official receipts are issued only after payment confirmation and verification.",
            "Fraud Prevention: Fraudulent transactions result in immediate account suspension and may lead to legal action.",
          ],
        },
        {
          title: "4. Product Availability and Pricing",
          items: [
            "Prices, product specifications, and availability are subject to change without prior notice.",
            "We reserve the right to correct pricing or description errors at any time.",
            "Orders may be canceled or quantity adjusted for incorrect pricing or insufficient stock.",
            "Promotional offers and discounts are subject to specific terms and expiration dates.",
          ],
        },
      ],
    },
    {
      title: "Shipping and Legal",
      blocks: [
        {
          title: "5. Shipping and Delivery",
          items: [
            "Delivery timelines are estimates and may vary based on location and circumstances.",
            "We are not liable for delays caused by courier services, weather, or unforeseen circumstances.",
            "Customers must inspect packages for visible damage upon delivery and before signing.",
            "Report discrepancies, damages, or missing items within 48 hours of receipt.",
            "Shipping costs may vary by destination, package weight, and delivery speed.",
          ],
        },
        {
          title: "6. Age Restrictions",
          items: [
            "Users under 18 years of age require parental or guardian consent.",
            "We do not knowingly collect personal data from minors without verified parental consent.",
            "Parents or guardians are responsible for monitoring children use of our services.",
          ],
        },
      ],
    },
    {
      title: "Legal and Intellectual Property",
      blocks: [
        {
          title: "7. Intellectual Property",
          items: [
            "All website content is the exclusive property of DEETECH COMPUTERS.",
            "No content may be copied, reproduced, modified, distributed, or used without written permission.",
            "Third-party trademarks and logos remain the property of their respective owners.",
            "Unauthorized use may result in legal action for copyright or trademark infringement.",
          ],
        },
        {
          title: "8. Limitation of Liability",
          items: [
            "DEETECH COMPUTERS is not liable for indirect, incidental, or consequential damages.",
            "Not liable for loss of data, profits, revenue, or business opportunities from service use.",
            "Not liable for service interruptions, unauthorized access, or data breaches beyond reasonable control.",
            "Total liability shall not exceed the amount paid for the specific product or service in question.",
          ],
        },
      ],
    },
    {
      title: "Service and Modifications",
      blocks: [
        {
          title: "9. Service Modifications and Termination",
          items: [
            "We reserve the right to modify, suspend, or discontinue any service without prior notice.",
            "We are not liable for any modification, suspension, or discontinuation of services.",
            "Users may terminate their account by contacting customer support.",
            "We may suspend access immediately for violations of these terms.",
          ],
        },
        {
          title: "10. Governing Law and Dispute Resolution",
          items: [
            "These terms are governed by the laws of Ghana.",
            "Disputes should first be resolved through good-faith negotiation.",
            "Unresolved disputes may be submitted to competent courts of Ghana.",
            "Users agree to submit to the personal jurisdiction of Ghanaian courts.",
          ],
        },
      ],
    },
    {
      title: "Privacy and Data",
      blocks: [
        {
          title: "11. Privacy and Data Protection",
          items: [
            "Your use of our services is subject to our Privacy Policy, incorporated by reference.",
            "We collect and use personal data as described in our Privacy Policy.",
            "We implement reasonable security measures to protect personal information.",
            "By using our services, you consent to data collection and use as outlined in our Privacy Policy.",
          ],
        },
        {
          title: "12. Severability and Entire Agreement",
          items: [
            "If any provision is invalid or unenforceable, remaining provisions remain in effect.",
            "These Terms of Use constitute the entire agreement between you and DEETECH COMPUTERS.",
            "No waiver of any term is deemed a further or continuing waiver of such term.",
          ],
        },
      ],
    },
    {
      title: "Important Information",
      points: [
        "Report Issues: Report unlawful activity, security concerns, or policy violations to deetechcomputers01@gmail.com.",
        "Account Termination: Accounts may be suspended for violations, fraud, or unlawful conduct without prior notice.",
        "Terms Updates: Terms may be updated periodically; continued use means acceptance of modified terms.",
        "Secure Payments: Use official payment channels and verify agent credentials to avoid fraud.",
        "Contact Verification: Verify contact details via our official website before sharing sensitive information.",
      ],
    },
  ],
  cta: {
    title: "Questions About Our Terms?",
    description: "Contact us for clarification about our Terms of Use or to report concerns.",
    paragraphs: [
      "Email: deetechcomputers01@gmail.com",
      "Phone: +233 059 175 5964",
      "WhatsApp: +233 059 175 5964",
    ],
    links: [
      { href: "mailto:deetechcomputers01@gmail.com", label: "Email Support" },
      { href: "https://wa.me/233591755964", label: "WhatsApp Support", external: true, secondary: true },
    ],
  },
};

export default function TermsOfUsePage() {
  return <StaticContentPage page={page} />;
}
