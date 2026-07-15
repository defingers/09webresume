import { profile } from "@/data/resume";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#0A0A0A] text-white">
      <div className="container-x py-20 md:py-28">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Let&rsquo;s work together</div>
        <h2 className="mt-4 font-display text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Let&rsquo;s build something<br />that outlasts the quarter.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 md:grid-cols-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Contact</div>
            <a href={`mailto:${profile.email}`} className="mt-3 block text-lg hover:underline" data-testid="footer-email">
              {profile.email}
            </a>
            <div className="mt-1 text-sm text-white/70">{profile.phone}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Social</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer" data-testid="footer-linkedin">LinkedIn</a></li>
              <li><a className="hover:underline" href={profile.github} target="_blank" rel="noreferrer" data-testid="footer-github">GitHub</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Based in</div>
            <div className="mt-3 text-sm text-white/80">{profile.location}</div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            Built for recruiters &amp; hiring leaders.
          </div>
        </div>
      </div>
    </footer>
  );
}
