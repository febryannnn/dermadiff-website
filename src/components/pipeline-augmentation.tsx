"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const rareImages = [
  "/lesions/mel.jpg",
  "/lesions/bcc.jpg",
  "/lesions/akiec.jpg",
  "/lesions/vasc.jpg",
  "/lesions/df.jpg",
  "/lesions/bkl.jpg",
];

const majorityImages = [
  "/lesions/nv.jpg",
  "/lesions/extra1.jpg",
  "/lesions/extra2.jpg",
];

const syntheticImages = [
  "/lesions/mel.jpg",
  "/lesions/bcc.jpg",
  "/lesions/akiec.jpg",
  "/lesions/vasc.jpg",
  "/lesions/df.jpg",
  "/lesions/bkl.jpg",
  "/lesions/mel2.jpg",
  "/lesions/mel.jpg",
  "/lesions/bcc.jpg",
  "/lesions/akiec.jpg",
  "/lesions/vasc.jpg",
  "/lesions/df.jpg",
];

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5 },
});

function ImageStrip({
  images,
  label,
  color,
  labelColor,
  tall,
}: {
  images: string[];
  label: string;
  color: string;
  labelColor: string;
  tall?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`text-xs font-bold tracking-wider uppercase ${labelColor}`}>
        {label}
      </span>
      <div
        className={`rounded-xl border-2 p-1.5 flex flex-col gap-1 ${color} ${tall ? "min-h-[200px]" : ""}`}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative w-12 h-9 sm:w-14 sm:h-10 rounded-md overflow-hidden ring-1 ring-white/10"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <div className={`flex items-center ${className || ""}`}>
      <div className="h-[2px] w-6 sm:w-10 bg-white/20" />
      <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white/20" />
    </div>
  );
}

export function PipelineAugmentation() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px] py-6">
        {/* Main flow: left to right */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Input: Majority + Rare columns */}
          <motion.div {...fadeIn(0)} className="flex gap-2">
            <ImageStrip
              images={majorityImages}
              label="Majority"
              color="border-sky-400/40 bg-sky-500/10"
              labelColor="text-sky-400"
            />
            <ImageStrip
              images={rareImages}
              label="Rare"
              color="border-amber-400/40 bg-amber-500/10"
              labelColor="text-amber-400"
              tall
            />
          </motion.div>

          {/* Lines converging */}
          <motion.div {...fadeIn(0.2)}>
            <svg
              width="60"
              height="200"
              viewBox="0 0 60 200"
              fill="none"
              className="text-white/20 shrink-0 hidden sm:block"
            >
              <path d="M0 30 L50 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 60 L50 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 90 L50 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 120 L50 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 150 L50 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 170 L50 100" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="50,96 50,104 58,100" fill="currentColor" />
            </svg>
            <div className="sm:hidden">
              <Arrow />
            </div>
          </motion.div>

          {/* Generative Model box */}
          <motion.div {...fadeIn(0.4)} className="shrink-0">
            <div className="rounded-xl border-2 border-emerald-400/50 bg-emerald-500/15 px-4 py-6 sm:px-5 sm:py-8 text-center shadow-lg shadow-emerald-500/5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 mb-1">
                SD 2.0 + LoRA
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-300">
                Generative
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-300">
                Model
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeIn(0.5)}>
            <Arrow />
          </motion.div>

          {/* Augmented Dataset */}
          <motion.div {...fadeIn(0.6)} className="shrink-0">
            <div className="rounded-xl border-2 border-blue-400/30 bg-blue-500/8 p-3 sm:p-4 shadow-lg shadow-blue-500/5">
              <p className="text-xs font-bold text-center text-blue-300 mb-3">
                Augmented Dataset
              </p>
              <div className="flex gap-3">
                {/* Synthetic (lots of images) */}
                <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-2">
                  <p className="text-[10px] font-semibold text-amber-300 mb-1.5 text-center">
                    Synthetic (Rare)
                  </p>
                  <div className="grid grid-cols-4 gap-0.5">
                    {syntheticImages.map((src, i) => (
                      <div
                        key={`s-${i}`}
                        className="relative w-7 h-5 sm:w-8 sm:h-6 rounded overflow-hidden ring-1 ring-amber-400/20"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Real (majority) */}
                <div className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-2">
                  <p className="text-[10px] font-semibold text-sky-300 mb-1.5 text-center">
                    Real (Majority)
                  </p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {majorityImages.slice(0, 4).map((src, i) => (
                      <div
                        key={`r-${i}`}
                        className="relative w-9 h-7 sm:w-11 sm:h-8 rounded overflow-hidden ring-1 ring-sky-400/20"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeIn(0.7)}>
            <Arrow />
          </motion.div>

          {/* Classifier */}
          <motion.div {...fadeIn(0.8)} className="shrink-0">
            <div className="rounded-xl border-2 border-orange-400/50 bg-orange-500/15 px-4 py-6 sm:px-5 sm:py-8 text-center shadow-lg shadow-orange-500/5">
              <div className="text-[10px] uppercase tracking-widest text-orange-300/80 mb-1">
                PanDerm ViT
              </div>
              <div className="text-sm sm:text-base font-bold text-orange-300">
                Classifier
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
