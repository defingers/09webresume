import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FiSend, FiMail, FiLinkedin, FiGithub } from "react-icons/fi";
import { profile } from "@/data/resume";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Please share a few sentences (10+ characters).";
    return e;
  };

  const onChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Message sent — I'll be in touch shortly.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(typeof detail === "string" ? detail : "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="border-b border-[#E5E5E5]">
      <div className="container-x grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-28">
        <div className="md:col-span-5">
          <div className="overline">07 / Contact</div>
          <h2 className="section-heading mt-4">Recruiting for something serious?</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#52525B]">
            Drop a short brief — team, scope, timelines. I respond to every recruiter message personally within
            two business days.
          </p>

          <ul className="mt-10 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FiMail className="text-[#002FA7]" />
              <a href={`mailto:${profile.email}`} className="hover:underline" data-testid="contact-email-link">
                {profile.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiLinkedin className="text-[#002FA7]" />
              <a href={profile.linkedin} className="hover:underline" data-testid="contact-linkedin-link" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiGithub className="text-[#002FA7]" />
              <a href={profile.github} className="hover:underline" data-testid="contact-github-link" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          data-testid="contact-form"
          className="md:col-span-7"
          noValidate
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                placeholder="Priya Ranganathan"
                data-testid="contact-input-name"
                className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/20"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                placeholder="you@company.com"
                data-testid="contact-input-email"
                className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/20"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Company (optional)">
              <input
                type="text"
                value={form.company}
                onChange={onChange("company")}
                placeholder="Company or agency name"
                data-testid="contact-input-company"
                className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/20"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={onChange("message")}
                rows={6}
                placeholder="Tell me a bit about the role, team and timeline."
                data-testid="contact-input-message"
                className="w-full resize-y border border-[#E5E5E5] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/20"
              />
            </Field>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              data-testid="contact-submit-btn"
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send message"} {!submitting && <FiSend />}
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#52525B]">
              Replies within 2 business days
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#52525B]">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-[#B91C1C]" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
