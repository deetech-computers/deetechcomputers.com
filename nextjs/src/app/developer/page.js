import Image from "next/image";
import Link from "next/link";

const educationTimeline = [
  "Started junior high school at Cambridge International School, Suntreso, Kumasi",
  "Completed JHS at Prempeh JHS / Basic School in 2016",
  "Continued senior high school at OKESS SHS, Kumasi Tafo",
  "Currently pursuing BSc Information Technology at the University of Cape Coast",
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
          This page introduces the developer behind this platform, showing both who I am and the level of practical work I can deliver for businesses, brands, and clients who need modern web solutions.
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
            <h2>Daniel Carta</h2>
            <p>
              I am a Level 400 student at the University of Cape Coast, currently studying BSc Information Technology and actively building real-world digital products.
            </p>
            <p>
              My focus is not only writing code, but creating usable, polished, business-ready experiences that handle real customer journeys from discovery to payment and order completion.
            </p>
          </div>
        </section>

        <section className="policy-content-section">
          <h2>Background and Education</h2>
          <p>
            My journey combines academic training and hands-on product building. I have grown through different stages of education while also sharpening practical technical skills that now show up in the systems I build.
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
            I am proficient in the technologies used throughout this project and comfortable working across interface design, frontend engineering, backend-connected flows, and production improvements.
          </p>
          <ul className="policy-point-list">
            {coreSkills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            I also have intermediate experience in Cloud Engineering, which helps me think beyond code alone and consider deployment structure, reliability, scalability, and operational flow.
          </p>
        </section>

        <section className="policy-content-section">
          <h2>Highlights and Accolades</h2>
          <p>
            My current academic level, practical build experience, and the quality of this live project together reflect the standard of work I am growing into as a developer.
          </p>
          <p>
            I am a Level 400 student at UCC offering BSc Information Technology, proficient in HTML, CSS, JavaScript, React, Next.js, MongoDB, and the broader tools used to plan, build, refine, and ship a project like this one.
          </p>
          <p>
            I also bring intermediate Cloud Engineering knowledge, which strengthens how I think about hosting, deployment, system reliability, and real-world application delivery beyond just writing frontend code.
          </p>
        </section>

        <section className="policy-content-section developer-capability-section">
          <h2>Payment Integration and Commerce Workflow Experience</h2>
          <p>
            One of the strongest parts of this project is the payment and checkout system. I did not build a simple static payment page. I structured a practical commerce workflow that supports different customer preferences while keeping the business side manageable and traceable.
          </p>
          <p>
            The implementation supports multiple payment channels including MTN Mobile Money, Telecel Cash, Hubtel, and direct bank transfer through CalBank. For manual payments, I built channel-specific payment instructions, proof-of-payment upload, validation around required steps, and order attachment so payment evidence becomes part of the transaction flow instead of being handled outside the system.
          </p>
          <p>
            I also implemented a more advanced Hubtel automatic checkout path. That flow prepares the checkout session, redirects the customer into a secure Hubtel payment experience, tracks pending state, handles return scenarios, checks payment status, and completes the order only after confirmation is received. In other words, it is not just a button that links away. It is a controlled payment process tied back into the application.
          </p>
          <p>
            Beyond the customer-facing side, the payment workflow is connected to supporting parts of the system such as order summaries, completion pages, invoices, account order history, and admin-side payment visibility. That means the integration was approached as a full business workflow, not just an isolated frontend feature.
          </p>
          <p>
            This matters because it shows that I can work on both manual and gateway-based payment systems. If a business wants secure hosted checkout, manual payment confirmation, Mobile Money instructions, screenshot-based proof flows, or a hybrid setup like Hubtel plus direct transfer, I can analyze the need and connect the right structure into the application.
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
            This site is also a live example of my work. It reflects how I approach responsive design, e-commerce thinking, user experience issues, account flows, cart behavior, checkout systems, and iterative refinement based on actual usage.
          </p>
          <p>
            For potential clients, collaborators, or employers, this page exists to make one thing clear: I am not only learning software development academically, I am actively applying it to build complete and useful digital products.
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
            If you need someone who can build polished web interfaces, business workflows, and practical payment-enabled digital experiences, feel free to contact me directly.
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
