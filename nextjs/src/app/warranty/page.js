import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "Warranty",
  title: "DEETECH Computers Warranty",
  intro: "Your peace of mind is our priority. We stand behind the quality of every product we sell.",
  highlights: [
    { title: "30-Day Limited Warranty", description: "Comprehensive coverage on all laptops and computers." },
    { title: "Professional Service", description: "Expert technicians and genuine parts." },
    { title: "Quick Support", description: "Fast claim processing and communication." },
  ],
  sections: [
    {
      title: "DEETECH Computers Laptop Warranty Terms",
      blocks: [
        {
          title: "Warranty Duration",
          items: [
            "30 Days Limited Warranty on all laptops and computers",
            "15 Days Warranty on phones and tablets",
            "7 Days Warranty on accessories and peripherals",
          ],
          note: "Warranty period starts from the date of purchase.",
        },
        {
          title: "What's Covered",
          items: [
            "Power issues not caused by misuse or power surges",
            "Sudden boot failure or system not powering on",
            "Charging port malfunctions or internal hardware failures",
            "Manufacturing defects in internal components",
            "Faulty RAM, HDD/SSD, or motherboard issues",
          ],
        },
        {
          title: "What's Not Covered",
          items: [
            "Physical damage - broken screens, body cracks, dents, or cosmetic issues",
            "Liquid damage - water, spills, or moisture-related issues",
            "Software issues caused by user (viruses, OS crashes, third-party apps)",
            "Battery life reduction or normal wear and tear",
            "Charger faults after normal usage period",
            "Unauthorized repairs or tampering with manufacturer seals",
            "Overheating due to environmental conditions or improper use",
            "Theft, loss, or accidental damage",
          ],
        },
      ],
    },
    {
      title: "Warranty Claim Process",
      blocks: [
        { title: "1. Contact Support", paragraphs: ["Reach out to us via WhatsApp or phone with your purchase details and issue description."] },
        { title: "2. Inspection", paragraphs: ["Bring the product to our service center for professional diagnosis and assessment."] },
        { title: "3. Approval", paragraphs: ["We'll determine if the issue is covered under warranty and provide repair timeline."] },
        { title: "4. Resolution", paragraphs: ["Repair or replacement with available parts. You'll be notified when ready for pickup."] },
      ],
    },
    {
      title: "Important Information",
      points: [
        "All warranty claims are subject to inspection. Our technicians will thoroughly examine the product to determine the cause of failure.",
        "Repair or replacement: If repairs are approved, we will fix the issue or replace with available equivalent parts.",
        "Return condition: Customer must return the product in its original condition with all accessories.",
        "Proof of purchase required: Keep your receipt/invoice as proof of purchase date and warranty validity.",
        "Repair timeframe: Most repairs are completed within 7-14 business days, depending on parts availability.",
      ],
    },
  ],
  cta: {
    title: "Need Warranty Assistance?",
    description: "Our team is ready to assist you with any warranty claims or technical support. For any warranty related issues or assistance, please reach out to us via WhatsApp.",
    href: "/contact",
    label: "Contact Us",
  },
};

export default function WarrantyPage() {
  return <StaticContentPage page={page} />;
}
