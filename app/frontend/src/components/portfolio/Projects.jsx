import { motion } from "framer-motion";
import { projects } from "@/data/resume";

export default function Projects() {
  return (
    <section id="projects" data-testid="projects-section" className="border-b border-[#E5E5E5]">
      <div className="container-x py-20 md:py-28">
        <div className="overline">05 / Featured Projects</div>
        <h2 className="section-heading mt-4">Selected engagements. Real outcomes.</h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12" data-testid="projects-grid">
          {projects.map((p, idx) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className={`grid-card flex h-full flex-col p-0 ${p.span}`}
              data-testid={`project-${idx}`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[#E5E5E5]">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 border border-white/50 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  {p.client}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{p.title}</h3>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#002FA7]">Problem</div>
                  <p className="mt-1 text-sm leading-relaxed text-[#3f3f46]">{p.problem}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#002FA7]">Solution</div>
                  <p className="mt-1 text-sm leading-relaxed text-[#3f3f46]">{p.solution}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-[#E5E5E5] bg-[#F7F7F8] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#0A0A0A]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-[#E5E5E5] pt-4 text-sm font-semibold text-[#0A0A0A]">
                    {p.impact}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
