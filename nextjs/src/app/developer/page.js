import Image from "next/image";
import Link from "next/link";
import "@/components/content/static-content-page-desktop.css";
import "@/components/content/static-content-page-mobile.css";
import "./developer-desktop.css";
import "./developer-mobile.css";

const educationTimeline = [
  "Started junior high school at Cambridge International School, Suntreso, Kumasi",
  "Completed JHS at Prempeh JHS / Basic School in 2016",
  "Continued senior high school at OKESS SHS, Kumasi Tafo",
  "Pursued BSc Information Technology at the University of Cape Coast",
];

const coreSkills = [
  "HTML, CSS, and JavaScript",
  "React and Next.js application development",
  "MongoDB and data-driven product workflows",
  "Responsive frontend implementation for desktop and mobile",
  "UI polishing, debugging, testing, and production refinements",
  "Commerce flows including product pages, cart, account areas, and checkout systems",
];

const PORTFOLIO_URL = "https://iamdanieladjeimensah.vercel.app";

export default function DeveloperPage() {
  return (
    <main className="policy-standalone developer-page">
      <header className="policy-standalone__hero" role="banner">
        <div className="shell policy-standalone__hero-inner">
          <h1>Developer</h1>
          <p className="policy-standalone__crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Developer</span>
          </p>
        </div>
      </header>

      <article className="shell page-section policy-content policy-content--standalone developer-profile">
        <p className="policy-kicker">Developer profile</p>
        <p className="policy-intro">
          A short introduction to who I am and the kind of work I do. For the full picture of my projects and experience, my portfolio is the best place to look.
        </p>

        <section className="policy-content-section policy-content-section--cta developer-portfolio-cta">
          <h2>See My Full Portfolio</h2>
          <p>Projects, experience, and more of my work are all there.</p>
          <div className="policy-cta-actions">
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
              iamdanieladjeimensah.vercel.app
            </a>
          </div>
        </section>

        <section className="developer-profile-intro">
          <div className="developer-profile-intro__photo">
            <Image
              src="/developer/daniel-carta.jpg"
              alt="Daniel Carta standing outdoors at the University of Cape Coast"
              width={860}
              height={1147}
              priority
            />
          </div>
          <div className="developer-profile-intro__copy">
            <h2>Daniel Adjei Mensah</h2>
            <p>
              My name is Daniel Adjei Mensah. I am an alumnus of the University of Cape Coast, where I pursued BSc Information Technology. I am currently based in Kumasi Kenyasi.
            </p>
            <p>
              I enjoy building things that people can actually use. For me, development is not just about writing code. It is about solving problems well, paying attention to detail, and creating something that feels useful, clear, and reliable from beginning to end.
            </p>
          </div>
        </section>

        <section className="policy-content-section">
          <h2>Background and Education</h2>
          <p>
            My journey has been shaped by both school and hands-on learning. As I moved through each stage of my education, I also kept growing my interest in technology and practical problem solving.
          </p>
          <ul className="policy-point-list">
            {educationTimeline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="policy-content-section">
          <h2>Core Technical Skills</h2>
          <p>
            Over time, I have become comfortable working with the main tools used in modern web development, especially the ones behind this project.
          </p>
          <ul className="policy-point-list">
            {coreSkills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            I also have intermediate experience in Cloud Engineering, which helps me think beyond just the interface and pay attention to how applications are deployed, managed, and kept dependable.
          </p>
        </section>

        <section className="policy-content-section">
          <h2>Highlights and Accolades</h2>
          <p>
            One thing I value about my growth is that it is not based only on theory, because I learnt in school and also applied what I learnt by building real features and improving real user experiences.
          </p>
          <p>
            I am an alumnus of UCC, where I pursued BSc Information Technology, and I am proficient in HTML, CSS, JavaScript, React, Next.js, MongoDB, and the wider set of tools needed to build, refine, and ship a project like this one.
          </p>
          <p>
            I also believe one of my strengths is how I work with people as well as code. I have good communication skills, strong problem-solving abilities, and an innovative mindset that helps me look for better ways to approach both technical and user-facing challenges.
          </p>
          <p>
            I also bring a lot of patience and tolerance into the way I work. A big part of that comes from taking care of family and handling real responsibilities in life, which has taught me how to stay calm, keep going, and deal with people and situations with maturity.
          </p>
          <p>
            I see myself as a good teammate and a good listener. I pay attention, I try to understand people well, and I like contributing in a way that helps the whole team move forward.
          </p>
        </section>

        <section className="policy-content-section">
          <h2>Motivation and Work Style</h2>
          <p>
            A good work environment motivates me a lot. I do my best work when there is mutual respect, focus, and a real sense that everyone is working toward something meaningful.
          </p>
          <p>
            Clear goals also give me a strong heads-up on what I am doing and what is expected. Once I understand the direction clearly, it becomes easier for me to work with confidence, stay organized, and give my best effort.
          </p>
          <p>
            I am also motivated by being able to help solve complex issues and bring strong ideas into a project or cause. I enjoy thinking through difficult problems and helping turn rough ideas into something clearer and more useful.
          </p>
        </section>

        <section className="policy-content-section">
          <h2>Core Values</h2>
          <p>
            Some of my simple core values are service to others and efficiency for people. I like work that is useful and practical, especially when it helps people save time, reduce stress, or get better results.
          </p>
          <p>
            I do not like messes, whether in code, design, process, or communication. I naturally try to make things cleaner, more concise, and better explained, so that whatever I am working on feels more organized and easier for people to understand.
          </p>
        </section>

        <section className="policy-content-section developer-capability-section">
          <h2>Payment Integration Experience</h2>
          <p>
            This site&apos;s checkout supports multiple payment methods, including Mobile Money, Hubtel, and bank transfer. Building it gave me hands-on experience with both manual and gateway-based payment systems. Happy to talk through specifics if you&apos;re looking for someone who can build this kind of system for you.
          </p>
        </section>

        <section className="policy-content-section developer-contact-section">
          <h2>Contact and Availability</h2>
          <p>
            If you would like to discuss a project, freelance opportunity, collaboration, internship, or full-time role, you can reach me directly through email or phone.
          </p>
          <p>
            I am open to conversations around business websites, e-commerce systems, frontend implementation, platform improvements, and payment-enabled web applications.
          </p>
          <div className="policy-cta-actions developer-contact-actions">
            <a href="mailto:cartadaniel01@gmail.com">cartadaniel01@gmail.com</a>
            <a href="tel:+2330509673406">+233 050 967 3406</a>
          </div>
        </section>

        <section className="policy-content-section policy-content-section--cta developer-cta">
          <h2>Let&apos;s Talk</h2>
          <p>
            If you feel I would be a good fit for your project or team, feel free to reach out, or see more of my work on my portfolio.
          </p>
          <div className="policy-cta-actions">
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
              View Portfolio
            </a>
            <a href="mailto:cartadaniel01@gmail.com">Send Email</a>
            <a href="tel:+2330509673406">Call Phone</a>
          </div>
        </section>
      </article>
    </main>
  );
}
