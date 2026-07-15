import { skills } from "@/data/resume";

export default function Skills() {
  return (
    <section id="skills" data-testid="skills-section" className="border-b border-[#E5E5E5]">
      <div className="container-x py-20 md:py-28">
        <div className="overline">03 / Skills</div>
        <h2 className="section-heading mt-4">Deep across the stack, precise where it counts.</h2>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="skills-grid">
          {skills.map((group) => (
            <div key={group.category} className="grid-card" data-testid={`skill-group-${group.category.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#002FA7]">{group.category}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <span
                    key={s}
                    className="border border-[#E5E5E5] bg-[#F7F7F8] px-2.5 py-1 text-xs text-[#0A0A0A]"
                    data-testid={`skill-tag-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
