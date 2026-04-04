"use client";

import { motion } from "framer-motion";

const teamMembers = [
  { name: "Farel", role: "ML Engineer" },
  { name: "Member 2", role: "Researcher" },
  { name: "Member 3", role: "Developer" },
];

const links = [
  { label: "Architecture", href: "#architecture" },
  { label: "Results", href: "#results" },
  { label: "Team", href: "#team" },
  { label: "Demo", href: "#demo" },
];

const techStack = [
  "Stable Diffusion 2.1",
  "SDXL",
  "SD 3.5 Large",
  "PanDerm ViT-L",
  "BiomedCLIP",
  "LoRA",
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.04]">
      {/* ── Atmospheric background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/[0.03] to-emerald-950/[0.06]" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Corner glow */}
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-emerald-500/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* ── Top section: Brand + Nav + Tech ── */}
        <div className="grid gap-10 py-12 sm:grid-cols-12 sm:gap-8 sm:py-16">
          {/* Brand column */}
          <div className="sm:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 ring-1 ring-white/[0.06]">
                <span className="text-sm font-bold tracking-tight text-emerald-400/90">D</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-400/5 to-transparent" />
              </div>
              <span className="text-base font-semibold tracking-tight">
                Derma<span className="text-white/30">Diff</span>
              </span>
            </div>

            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/30">
              Synthetic dermoscopic image generation via Stable Diffusion with
              LoRA fine-tuning, evaluated on PanDerm ViT-Large for minority
              skin lesion classification.
            </p>

            {/* Tech pills */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-white/[0.04] bg-white/[0.02] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white/25 transition-colors hover:border-emerald-500/15 hover:text-emerald-400/40"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="sm:col-span-3 sm:col-start-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
              Navigate
            </p>
            <ul className="mt-3 space-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="group flex items-center gap-2 text-[13px] text-white/30 transition-colors hover:text-emerald-400/70"
                  >
                    <span className="inline-block h-px w-3 bg-white/10 transition-all group-hover:w-5 group-hover:bg-emerald-500/40" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Affiliation */}
          <div className="sm:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
              Institution
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-[13px] font-medium text-white/40">
                  KCVanguard Lab
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-white/20">
                  Komputasi Cerdas dan Visi
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/40">
                  Institut Teknologi
                </p>
                <p className="mt-0.5 text-[11px] text-white/20">
                  Sepuluh Nopember (ITS)
                </p>
                <p className="mt-0.5 text-[11px] text-white/20">
                  Surabaya, Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-[11px] text-white/15">
            &copy; 2026 DermaDiff &middot; KCV Lab Assistant Selection Project
          </p>

          <div className="flex items-center gap-4">
            {/* GitHub icon */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/15 transition-colors hover:text-emerald-400/50"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Paper / docs icon */}
            <a
              href="#"
              className="text-white/15 transition-colors hover:text-emerald-400/50"
              aria-label="Paper"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </a>

            {/* Separator dot */}
            <span className="text-[10px] text-white/10">&middot;</span>

            <p className="text-[10px] text-white/10">
              Built with Next.js &middot; Tailwind &middot; Framer Motion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}