import { FiAward } from "react-icons/fi";
import { certifications } from "@/data/resume";

export default function Certifications() {
  return (
    <section id="certifications" data-testid="certifications-section" className="border-b border-[#E5E5E5] bg-[#FAFAFB]">
      <div className="container-x py-20 md:py-28">
        <div className="overline">04 / Certifications</div>
        <h2 className="section-heading mt-4">Credentials, kept current.</h2>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="certifications-grid">
          {certifications.map((c) => (
            <div
              key={c.name}
              className="grid-card flex items-start gap-4"
              data-testid={`cert-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center border border-[#E5E5E5] bg-white">
                <FiAward className="text-[#002FA7]" size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-tight text-[#0A0A0A]">{c.name}</h3>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#52525B]">
                  {c.issuer} · {c.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
