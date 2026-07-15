import { useEffect, useState } from "react";
import { profile } from "@/data/resume";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      data-testid="site-nav"
      className={`no-print sticky top-0 z-50 w-full bg-white transition-colors ${
        scrolled ? "border-b border-[#E5E5E5]" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" onClick={handleNav("top")} className="flex items-baseline gap-2" data-testid="nav-logo">
          <span className="font-display text-lg font-black tracking-tight">{profile.name.split(" ")[0]}.</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#52525B]">IT Architect</span>
        </a>

        <nav data-testid="nav-links" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={handleNav(l.id)}
              data-testid={`nav-link-${l.id}`}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:text-[#002FA7]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={handleNav("contact")}
            data-testid="nav-contact-cta"
            className="btn-primary hidden md:inline-flex"
          >
            Contact
          </a>
          <button
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#E5E5E5] md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1">
              <span className="block h-[2px] w-5 bg-[#0A0A0A]" />
              <span className="block h-[2px] w-5 bg-[#0A0A0A]" />
              <span className="block h-[2px] w-5 bg-[#0A0A0A]" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="nav-mobile-menu" className="border-t border-[#E5E5E5] bg-white md:hidden">
          <div className="container-x flex flex-col gap-3 py-4">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={handleNav(l.id)}
                data-testid={`nav-mobile-link-${l.id}`}
                className="font-mono text-xs uppercase tracking-[0.2em]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={handleNav("contact")}
              data-testid="nav-mobile-contact-cta"
              className="btn-primary w-max"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
