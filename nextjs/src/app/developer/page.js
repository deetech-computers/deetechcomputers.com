import StaticContentPage from "@/components/content/static-content-page";

const page = {
  kicker: "Developer profile",
  title: "Developer",
  intro:
    "This page introduces the developer behind this platform, highlighting my background, technical strengths, and the kind of digital work I can build for individuals, brands, and businesses.",
  sections: [
    {
      title: "Who I Am",
      blocks: [
        {
          paragraphs: [
            "I am a Level 400 student at the University of Cape Coast (UCC), currently pursuing a BSc in Information Technology.",
            "Beyond academics, I am focused on building practical digital products that solve real problems, improve user experience, and help businesses present themselves more professionally online.",
          ],
        },
      ],
    },
    {
      title: "My Educational Journey",
      blocks: [
        {
          items: [
            "Started junior high school at Cambridge International School, Suntreso, Kumasi",
            "Completed JHS at Prempeh JHS / Basic School in 2016",
            "Continued senior high school at OKESS SHS, Kumasi Tafo",
            "Currently studying BSc Information Technology at the University of Cape Coast",
          ],
        },
      ],
    },
    {
      title: "What I Can Build",
      blocks: [
        {
          paragraphs: [
            "I build modern web experiences that combine clean interfaces, responsive layouts, structured content, and practical business flows.",
            "This project itself reflects the kind of work I can deliver: product catalog systems, account flows, cart and checkout experiences, mobile-friendly interfaces, and ongoing refinement based on real usage.",
          ],
        },
        {
          title: "Core Skills",
          items: [
            "HTML, CSS, and JavaScript",
            "React and Next.js",
            "MongoDB and database-driven application flows",
            "Frontend styling, responsive design, and UI refinement",
            "Feature integration, debugging, and production-focused improvements",
          ],
        },
      ],
    },
    {
      title: "Technical Strengths",
      blocks: [
        {
          title: "Web Development",
          paragraphs: [
            "I am proficient in the technologies used across this project and comfortable building full user-facing experiences from layout to interaction.",
          ],
        },
        {
          title: "Cloud Engineering",
          paragraphs: [
            "I also have intermediate-level experience in Cloud Engineering, which supports how I think about deployment, scalability, and dependable application delivery.",
          ],
        },
      ],
    },
    {
      title: "Why This Page Exists",
      points: [
        "To show potential clients, collaborators, and employers the quality of work I can produce",
        "To present both the person and the technical ability behind this platform",
        "To make this site not only a product platform, but also a live portfolio of my development skills",
      ],
    },
  ],
  cta: {
    title: "Interested In Working With Me?",
    description:
      "If you need a developer who can build polished, practical, and business-ready web experiences, feel free to reach out.",
    links: [
      { href: "/contact", label: "Contact Me" },
      { href: "/products", label: "See Live Project" },
    ],
  },
};

export default function DeveloperPage() {
  return <StaticContentPage page={page} />;
}
