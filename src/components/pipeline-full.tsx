"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 15 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { delay, duration: 0.5 },
});

const datasets = [
  {
    name: "HAM10000",
    border: "border-amber-400/70",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    shadow: "shadow-amber-500/20",
    images: ["/lesions/mel.jpg", "/lesions/nv.jpg", "/lesions/bcc.jpg", "/lesions/akiec.jpg", "/lesions/df.jpg", "/lesions/bkl.jpg"],
  },
  {
    name: "ISIC 2019",
    border: "border-emerald-400/70",
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    shadow: "shadow-emerald-500/20",
    images: ["/lesions/vasc.jpg", "/lesions/extra1.jpg", "/lesions/mel2.jpg", "/lesions/extra2.jpg", "/lesions/mel.jpg", "/lesions/nv.jpg"],
  },
  {
    name: "Longitudinal",
    border: "border-sky-400/70",
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    shadow: "shadow-sky-500/20",
    images: ["/lesions/bcc.jpg", "/lesions/akiec.jpg", "/lesions/df.jpg", "/lesions/bkl.jpg", "/lesions/vasc.jpg", "/lesions/extra1.jpg"],
  },
];

const diffusionModels = [
  {
    name: "SD 2.1 + LoRA",
    border: "border-pink-400/70",
    bg: "bg-pink-500/15",
    text: "text-pink-100",
    shadow: "shadow-pink-500/20",
    synthBorder: "border-pink-400/50",
    synthBg: "bg-pink-500/10",
    synthText: "text-pink-200",
  },
  {
    name: "SD XL + LoRA",
    border: "border-violet-400/70",
    bg: "bg-violet-500/15",
    text: "text-violet-100",
    shadow: "shadow-violet-500/20",
    synthBorder: "border-violet-400/50",
    synthBg: "bg-violet-500/10",
    synthText: "text-violet-200",
  },
  {
    name: "SD 3.5 + LoRA",
    border: "border-cyan-400/70",
    bg: "bg-cyan-500/15",
    text: "text-cyan-100",
    shadow: "shadow-cyan-500/20",
    synthBorder: "border-cyan-400/50",
    synthBg: "bg-cyan-500/10",
    synthText: "text-cyan-200",
  },
];

function ArrowDown({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className || ""}`}>
      <div className="w-[2px] h-6 bg-white/70" />
      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white/70" />
    </div>
  );
}

export function PipelineFull() {
  return (
    <div className="overflow-x-auto bg-[#0a0a0a]">
      <div className="min-w-[860px] py-10 flex flex-col items-center gap-0 px-6">

        {/* Row 1: Dataset label */}
        <motion.div {...fadeIn(0)} className="mb-5">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-white/90 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
            Dataset
          </span>
        </motion.div>

        {/* Row 2: Three datasets */}
        <motion.div
          {...fadeIn(0.1)}
          className="rounded-2xl border-2 border-blue-400/30 bg-blue-500/[0.06] p-5 w-full max-w-[820px] shadow-[0_0_30px_-5px_rgba(96,165,250,0.15)]"
        >
          <div className="grid grid-cols-3 gap-4">
            {datasets.map((ds) => (
              <div
                key={ds.name}
                className={`rounded-xl border-2 p-4 ${ds.border} ${ds.bg} flex flex-col items-center gap-3 shadow-lg ${ds.shadow}`}
              >
                <div className="flex gap-1.5 flex-wrap justify-center">
                  {ds.images.map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative w-10 h-7 rounded-md overflow-hidden ring-1 ring-white/20"
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                  ))}
                </div>
                <span className={`text-sm font-bold px-2 ${ds.text}`}>{ds.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SVG: Connecting lines from datasets down to columns */}
        <motion.div {...fadeIn(0.25)} className="w-full max-w-[820px]">
          <svg
            viewBox="0 0 820 170"
            fill="none"
            className="w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 
              Column positions (approx centers within 820px grid):
              Col 0 (No Aug / HAM left): x=103
              Col 1 (SD 2.1 / HAM right): x=250
              Col 2 (SD XL / ISIC): x=455
              Col 3 (SD 3.5 / Long): x=660
              
              Dataset card centers:
              HAM10000 center: ~137
              ISIC 2019 center: ~410
              Longitudinal center: ~683
            */}

            {/* Training Only Real Dataset */}
            <line x1="115" y1="0" x2="115" y2="150" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <polygon points="110,150 120,150 115,160" fill="white" fillOpacity="0.8" />
            <text
              x="90"
              y="80"
              fill="white"
              fillOpacity="0.65"
              fontSize="9"
              textAnchor="middle"
              fontFamily="system-ui"
              transform="rotate(-90, 90, 80)"
            >
              Training Only Real Dataset
            </text>

            {/* Combined with Synthetic — col1 */}
            <line x1="310" y1="0" x2="310" y2="138" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <polygon points="305,138 315,138 310,148" fill="white" fillOpacity="0.8" />
            <text
              x="288"
              y="75"
              fill="white"
              fillOpacity="0.55"
              fontSize="9"
              textAnchor="middle"
              fontFamily="system-ui"
              transform="rotate(-90, 288, 75)"
            >
              Combined with Synthetic
            </text>

            {/* Combined with Synthetic — col2 */}
            <line x1="510" y1="0" x2="510" y2="138" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <polygon points="505,138 515,138 510,148" fill="white" fillOpacity="0.8" />
            <text
              x="488"
              y="75"
              fill="white"
              fillOpacity="0.55"
              fontSize="9"
              textAnchor="middle"
              fontFamily="system-ui"
              transform="rotate(-90, 488, 75)"
            >
              Combined with Synthetic
            </text>

            {/* Combined with Synthetic — col3 */}
            <line x1="710" y1="0" x2="710" y2="138" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <polygon points="705,138 715,138 710,148" fill="white" fillOpacity="0.8" />
            <text
              x="688"
              y="75"
              fill="white"
              fillOpacity="0.55"
              fontSize="9"
              textAnchor="middle"
              fontFamily="system-ui"
              transform="rotate(-90, 688, 75)"
            >
              Combined with Synthetic
            </text>
          </svg>
        </motion.div>

        {/* Row 3: No Augmentation + 3 Diffusion Models */}
        <motion.div
          {...fadeIn(0.35)}
          className="grid grid-cols-4 gap-4 w-full max-w-[820px]"
        >
          {/* Exp A — No Augmentation */}
          <div className="flex flex-col items-center gap-0">
            <div className="rounded-xl border-2 border-red-400/60 bg-red-500/12 px-4 py-20 text-center w-full shadow-lg shadow-red-500/15">
              <span className="text-[10px] uppercase tracking-widest text-red-300/80 block mb-1.5 px-1">Exp A</span>
              <span className="text-sm font-bold text-white px-1">No Augmentation</span>
            </div>
          </div>

          {/* 3 diffusion models */}
          {diffusionModels.map((model, idx) => (
            <div key={model.name} className="flex flex-col items-center gap-0">
              <div
                className={`rounded-xl border-2 px-4 py-5 text-center w-full shadow-lg ${model.border} ${model.bg} ${model.shadow}`}
              >
                <span className={`text-sm font-bold px-1 ${model.text}`}>
                  {model.name}
                </span>
              </div>

              <ArrowDown />

              {/* Synthetic dataset */}
              <div
                className={`rounded-xl border-2 p-3 w-full ${model.synthBorder} ${model.synthBg}`}
              >
                <div className="flex gap-1 flex-wrap justify-center mb-2">
                  {datasets[idx].images.map((src, i) => (
                    <div
                      key={`synth-${idx}-${i}`}
                      className="relative w-8 h-6 rounded-md overflow-hidden ring-1 ring-white/20"
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="32px" />
                    </div>
                  ))}
                </div>
                <p className={`text-xs font-semibold text-center py-0.5 ${model.synthText}`}>
                  Synthetic Dataset
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 4 separate arrows — each column goes straight down to PanDerm ViT */}
        <motion.div {...fadeIn(0.5)} className="w-full max-w-[820px] relative">
          <svg
            viewBox="0 0 820 60"
            fill="none"
            className="w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* No Augmentation → down */}
            <line x1="115" y1="0" x2="115" y2="48" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" />
            <polygon points="110,48 120,48 115,56" fill="white" fillOpacity="0.75" />

            {/* SD 2.1 → down */}
            <line x1="310" y1="0" x2="310" y2="48" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" />
            <polygon points="305,48 315,48 310,56" fill="white" fillOpacity="0.75" />

            {/* SD XL → down */}
            <line x1="510" y1="0" x2="510" y2="48" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" />
            <polygon points="505,48 515,48 510,56" fill="white" fillOpacity="0.75" />

            {/* SD 3.5 → down */}
            <line x1="710" y1="0" x2="710" y2="48" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" />
            <polygon points="705,48 715,48 710,56" fill="white" fillOpacity="0.75" />
          </svg>
        </motion.div>

        {/* PanDerm ViT */}
        <motion.div
          {...fadeIn(0.6)}
          className="w-full max-w-[820px] rounded-xl border-2 border-amber-400/60 bg-amber-500/12 py-6 px-8 text-center shadow-lg shadow-amber-500/15"
        >
          <span className="text-xl font-bold text-white tracking-wide">PanDerm ViT</span>
        </motion.div>

        <motion.div {...fadeIn(0.65)}>
          <ArrowDown />
        </motion.div>

        {/* Evaluations */}
        <motion.div
          {...fadeIn(0.7)}
          className="grid grid-cols-2 gap-5 w-full max-w-[560px]"
        >
          <div className="rounded-xl border-2 border-amber-400/50 bg-amber-500/10 p-5 text-center shadow-lg shadow-amber-500/10">
            <p className="text-base font-bold text-white mb-1.5">Evaluation</p>
            <p className="text-xs text-amber-200/70 px-2">
              SD 2.1, SDXL, and SD 3.5
            </p>
          </div>
          <div className="rounded-xl border-2 border-violet-400/50 bg-violet-500/10 p-5 text-center shadow-lg shadow-violet-500/10">
            <p className="text-base font-bold text-white mb-1.5">Evaluation</p>
            <p className="text-xs text-violet-200/70 px-2">
              Cross Domain
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}