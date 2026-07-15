import { FiMessageSquare } from "react-icons/fi";
import { testimonials } from "@/data/resume";

export default function Testimonials() {
  return (
    <section id="testimonials" data-testid="testimonials-section" className="border-b border-[#E5E5E5] bg-[#FAFAFB]">
      <div className="container-x py-20 md:py-28">
        <div className="overline">06 / Recommendations</div>
        <h2 className="section-heading mt-4">What leaders say after shipping with me.</h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3" data-testid="testimonials-grid">
          {testimonials.map((t, idx) => (
            <figure
              key={t.name}
              className="grid-card flex h-full flex-col"
              data-testid={`testimonial-${idx}`}
            >
              <FiMessageSquare className="text-[#002FA7]" size={20} />
              <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed italic text-[#0A0A0A]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-[#E5E5E5] pt-4">
                <div className="text-sm font-semibold text-[#0A0A0A]">{t.name}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#52525B]">
                  {t.title} · {t.company}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
