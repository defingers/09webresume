import { metrics, profile } from "@/data/resume";

export default function About() {
  return (
    <section id="about" data-testid="about-section" className="border-b border-[#E5E5E5]">
      <div className="container-x grid grid-cols-1 gap-10 py-20 md:grid-cols-12 md:gap-10 md:py-28">
        <div className="md:col-span-7">
          <div className="overline">01 / About</div>
          <h2 className="section-heading mt-4">A pragmatic architect for systems that must not fail.</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#52525B] md:text-lg">
            I've spent the last decade and a half embedded with the teams who own the systems the business can't
            afford to lose. My work sits at the intersection of engineering rigor, business outcomes and the
            operational reality of running large platforms under pressure.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#52525B]">
            Currently based in {profile.location}. Open to Principal / Chief Architect roles, fractional advisory,
            and select consulting engagements.
          </p>
        </div>

        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-4" data-testid="about-metrics">
            {metrics.map((m) => (
              <div key={m.label} className="stat-box" data-testid={`metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#52525B]">{m.label}</div>
                <div className="mt-3 font-display text-4xl font-black leading-none tracking-tight text-[#0A0A0A] md:text-5xl">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
