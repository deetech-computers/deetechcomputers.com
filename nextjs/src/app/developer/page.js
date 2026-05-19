import Image from "next/image";
import Link from "next/link";

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

const paymentCapabilities = [
  "Multi-method payment setup covering MTN Mobile Money, Telecel Cash, Hubtel, and direct CalBank transfer",
  "Dual Hubtel implementation with both manual shortcode payment and automatic secure checkout flow",
  "Payment-proof upload handling for manual transactions with image validation and order attachment",
  "Automatic payment-status confirmation flow with success, cancellation, and retry handling",
  "Order-state updates connected to checkout, account history, invoices, thank-you flow, and admin management",
  "Ability to adapt and connect similar manual or gateway-based payment systems for other businesses and use cases",
];

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
          I wanted this page to be simple and honest. It is a short introduction to who I am, what I have learned, and the kind of work I can do for people and businesses that need a solid web presence.
        </p>

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
            One thing I value about my growth is that it is not based only on theory. I am learning in school, but I am also applying what I learn by building real features and improving real user experiences.
          </p>
          <p>
            I am an alumnus of UCC, where I pursued BSc Information Technology, and I am proficient in HTML, CSS, JavaScript, React, Next.js, MongoDB, and the wider set of tools needed to build, refine, and ship a project like this one.
          </p>
          <p>
            I also believe one of my strengths is how I work with people as well as code. I have good communication skills, strong problem-solving abilities, and an innovative mindset that helps me look for better ways to approach both technical and user-facing challenges.
          </p>
        </section>

        <section className="policy-content-section developer-capability-section">
          <h2>Payment Integration and Commerce Workflow Experience</h2>
          <p>
            One part of this project that I am especially proud of is the payment and checkout workflow. I did not want it to feel like a basic page with payment details dropped on it. I wanted it to work like a proper system.
          </p>
          <p>
            The setup supports multiple payment channels including MTN Mobile Money, Telecel Cash, Hubtel, and direct bank transfer through CalBank. For manual payments, I built a flow that gives the user the right instructions, accepts proof of payment, checks that the required steps are completed, and ties that proof back to the order itself.
          </p>
          <p>
            I also implemented a more advanced Hubtel automatic checkout flow. That part prepares the checkout session, sends the customer into a secure Hubtel payment process, keeps track of the payment state, handles return cases, checks status, and completes the order only after confirmation comes back. So it is more than just linking to a payment option. It is properly connected to the application.
          </p>
          <p>
            Beyond the customer side, I connected the payment workflow to order summaries, completion pages, invoices, account order history, and the admin side of the system. That was important to me because a real business workflow should stay organized from payment to tracking and support.
          </p>
          <p>
            I think this shows an important side of my work. I can handle both manual and gateway-based payment systems, and I can adapt them based on what a business actually needs. Whether the goal is secure hosted checkout, Mobile Money instructions, manual proof confirmation, or a hybrid payment setup, I can work through the structure and build it in a practical way.
          </p>
          <ul className="policy-point-list">
            {paymentCapabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="policy-content-section">
          <h2>What This Page Represents</h2>
          <p>
            This site is more than a store to me. It is also a live example of how I think, build, test, and improve digital products over time.
          </p>
          <p>
            For anyone visiting this page, I want it to show that I am not only studying software development academically. I am also putting in the work to build complete and useful systems that people can interact with in real life.
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
            If you feel I would be a good fit for your project or team, feel free to reach out.
          </p>
          <div className="policy-cta-actions">
            <a href="mailto:cartadaniel01@gmail.com">Send Email</a>
            <a href="tel:+2330509673406">Call Phone</a>
          </div>
        </section>
      </article>
    </main>
  );
}
