import { useEffect } from "react";
import Navigation from "@/components/portfolio/Navigation";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Experience from "@/components/portfolio/Experience";
import Skills from "@/components/portfolio/Skills";
import Certifications from "@/components/portfolio/Certifications";
import Projects from "@/components/portfolio/Projects";
import Testimonials from "@/components/portfolio/Testimonials";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import { profile } from "@/data/resume";

export default function Portfolio() {
  useEffect(() => {
    // SEO meta tags for recruiter link sharing
    document.title = `${profile.name} — ${profile.title} | Portfolio`;

    const upsertMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc = `${profile.title} — ${profile.summary}`;
    upsertMeta("name", "description", desc);
    upsertMeta("name", "keywords", "IT Architect, Solutions Architect, Enterprise Architect, Cloud Architect, AWS, Azure, GCP, TOGAF, Portfolio, Resume, Hire");
    upsertMeta("name", "author", profile.name);
    upsertMeta("property", "og:title", `${profile.name} — ${profile.title}`);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:type", "profile");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", `${profile.name} — ${profile.title}`);
    upsertMeta("name", "twitter:description", desc);
  }, []);

  return (
    <div data-testid="portfolio-root" className="min-h-screen bg-white text-[#0A0A0A]">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Certifications />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
