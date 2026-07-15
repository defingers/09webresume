import { motion } from "framer-motion";
import { experience } from "@/data/resume";

export default function Experience() {
  return (
    <section id="experience" data-testid="experience-section" className="border-b border-[#E5E5E5] bg-[#FAFAFB]">
      <div className="container-x py-20 md:py-28">
        <div className="overline">02 / Experience</div>
        <h2 className="section-heading mt-4">A track record you can verify.</h2>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="max-w-xs text-sm leading-relaxed text-[#52525B]">
              Selected roles from four companies across banking, healthcare and retail. Full timeline available on
              request.
            </p>
          </div>

          <ol className="relative md:col-span-9" data-testid="experience-timeline">
            <div className="absolute left-0 top-2 h-full w-px bg-[#E5E5E5]" aria-hidden="true" />
            {experience.map((role, idx) => (
              <motion.li
                key={role.company}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative mb-12 pl-8 last:mb-0"
                data-testid={`experience-item-${idx}`}
              >
                <span className="absolute -left-[5px] top-2 h-[10px] w-[10px] bg-[#002FA7]" aria-hidden="true" />
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#52525B]">{role.period} · {role.location}</div>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {role.role} <span className="text-[#52525B]">— {role.company}</span>
                </h3>
                <ul className="mt-4 space-y-3">
                  {role.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#3f3f46]">
                      <span className="mt-2 h-1 w-3 flex-none bg-[#0A0A0A]" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
