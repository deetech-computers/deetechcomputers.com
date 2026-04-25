import StaticContentPage from "@/components/content/static-content-page";

const page = {
  variant: "privacy",
  kicker: "Privacy policy",
  title: "DEETECH COMPUTERS Privacy Policy",
  intro: "Your privacy is our priority. We are committed to protecting your personal information with transparency and care.",
  quickFacts: [
    { value: "Access", label: "Your data rights" },
    { value: "Secure", label: "Restricted access" },
    { value: "Consent", label: "Promo control" },
  ],
  highlights: [
    { title: "Data Protection", description: "Strict security measures for your information." },
    { title: "Transparency", description: "Clear about how we use your data." },
    { title: "Your Rights", description: "Control over your personal information." },
  ],
  sections: [
    {
      title: "About This Policy",
      blocks: [
        {
          title: "1. Our Commitment",
          items: [
            "Describes how DEETECH COMPUTERS (DEETEK 360 Enterprise) handles personal data.",
            "Covers customers, partners, and job applicants.",
            "Applies to website, online platforms, and all service channels.",
            "By using our services, you consent to this policy.",
          ],
        },
      ],
    },
    {
      title: "The Information We Collect",
      blocks: [
        {
          title: "2A. Information You Provide",
          items: [
            "Personal Details: Full name, phone number, email, delivery address.",
            "Payment Information: Mobile Money or bank transaction confirmations.",
            "Preferences: Product interests, feedback, inquiries.",
            "Recruitment Data: Qualifications, experience, employment history.",
          ],
        },
        {
          title: "2B. Automatically Collected",
          items: [
            "Device Information: IP address, browser type, operating system.",
            "Browsing Data: Pages visited and user interactions.",
            "Location Data: Only with your consent where applicable.",
          ],
        },
        {
          title: "2C. From Third Parties",
          items: [
            "Payment Providers: Banks, mobile money platforms.",
            "Logistics Partners: Courier and delivery services.",
            "Recruitment Sources: Platforms, schools, professional references.",
          ],
        },
      ],
    },
    {
      title: "How We Use Your Information",
      blocks: [
        {
          title: "3. Purpose of Data Use",
          items: [
            "Processing and confirming product orders.",
            "Facilitating payments and issuing receipts.",
            "Communicating order updates and delivery status.",
            "Managing customer relationships and after-sales service.",
            "Handling warranty claims and product support.",
            "Conducting recruitment and employment processes.",
            "Improving website and customer experience.",
            "Sending promotional offers (with your consent).",
          ],
          note: "Principle: We only collect and use data relevant for legitimate business purposes.",
        },
      ],
    },
    {
      title: "Information Sharing and Security",
      blocks: [
        {
          title: "4. How We Share Information",
          items: [
            "Service Providers: Delivery companies, payment processors.",
            "Technical Partners: IT systems and website management.",
            "Authorities: When legally required.",
            "Recruitment Partners: Employment-related processes.",
          ],
          note: "Protection: Partners adhere to confidentiality standards and data is only used for specific purposes.",
        },
        {
          title: "5. Data Security",
          items: [
            "Strict security measures to prevent unauthorized access.",
            "Restricted access to authorized personnel only.",
            "Confidentiality agreements with all service providers.",
            "Continuous system monitoring for potential breaches.",
            "Prompt notification in case of data breaches as required by law.",
          ],
        },
      ],
    },
    {
      title: "Your Rights and Contact",
      blocks: [
        {
          title: "6. Your Rights",
          items: [
            "Access: View the personal data we hold about you.",
            "Correction: Request updates to inaccurate information.",
            "Deletion: Request removal when no longer necessary.",
            "Objection: Restrict processing in certain cases.",
            "Withdraw Consent: Opt-out of promotional communications.",
          ],
        },
        {
          title: "7. Contact and Details",
          paragraphs: [
            "Data Protection Officer",
            "Email: deetechcomputers01@gmail.com",
            "Phone: 0591755964",
            "Business: DEETECH COMPUTERS (DEETEK 360 Enterprise)",
            "We respond promptly to all privacy-related inquiries.",
          ],
        },
      ],
    },
    {
      title: "Additional Information",
      points: [
        "International Transfers: Your data may be transferred internationally with protection in line with Ghanaian data protection laws.",
        "Data Retention: We retain data only as long as necessary for legal, accounting, or service purposes.",
        "Policy Updates: We may update this policy periodically to reflect business or legal changes.",
        "Secure Deletion: When data is no longer needed, it is securely deleted or anonymized.",
      ],
    },
  ],
  cta: {
    title: "Need Privacy Assistance?",
    description: "Contact our Data Protection Officer for any privacy concerns or to exercise your rights.",
    links: [
      { href: "mailto:deetechcomputers01@gmail.com", label: "Email Data Protection Officer" },
      { href: "https://wa.me/233591755964", label: "WhatsApp Support", external: true, secondary: true },
    ],
  },
};

export default function PrivacyPolicyPage() {
  return <StaticContentPage page={page} />;
}
