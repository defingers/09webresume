import { motion } from "framer-motion";
import { profile } from "@/data/resume";
import { FiArrowDownRight, FiMapPin } from "react-icons/fi";

export default function Hero() {
  return (
    <section id="top" data-testid="hero-section" className="relative border-b border-[#E5E5E5]">
      <div className="container-x grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-8"
        >
          <div className="overline" data-testid="hero-overline">SENIOR IT ARCHITECT · AVAILABLE FOR SELECT ROLES</div>

          <h1
            data-testid="hero-title"
            className="mt-6 text-5xl font-black tracking-tighter text-[#0A0A0A] sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[0.95]"
          >
            {profile.tagline}
          </h1>

          <p data-testid="hero-summary" className="mt-8 max-w-2xl text-base leading-relaxed text-[#52525B] md:text-lg">
            {profile.summary}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              data-testid="hero-contact-btn"
              className="btn-primary"
            >
              Hire me <FiArrowDownRight />
            </a>
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
              }}
              data-testid="hero-view-work-btn"
              className="btn-secondary"
            >
              View experience
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.2em] text-[#52525B]">
            <span className="inline-flex items-center gap-2" data-testid="hero-location">
              <FiMapPin className="text-[#002FA7]" /> {profile.location}
            </span>
            <span data-testid="hero-email">{profile.email}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-4"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#0A0A0A]">
            <img
              src="https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Professional portrait of a senior IT architect"
              className="h-full w-full object-cover"
              data-testid="hero-portrait"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.35))]" />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              <span>{profile.name}</span>
              <span>· EST. 2010</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
