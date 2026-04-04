"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type ClassImages = {
    className: string;
    classLabel: string;
    real: string[];
    synthetic: Record<string, string[]>; // model -> images
};

const models = [
    { id: "sd21", label: "SD 2.1", badge: "C2", badgeColor: "bg-pink-500/15 text-pink-400 border-pink-400/40" },
    { id: "sdxl", label: "SDXL", badge: "C3", badgeColor: "bg-violet-500/15 text-violet-400 border-violet-400/40" },
    { id: "sd35", label: "SD 3.5 Large", badge: "C4", badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-400/40" },
];

const classData: ClassImages[] = [
    {
        className: "mel",
        classLabel: "Melanoma",
        real: Array(64).fill("/lesions/mel.jpg"),
        synthetic: {
            sd21: Array(64).fill("/lesions/mel.jpg"),
            sdxl: Array(64).fill("/lesions/mel.jpg"),
            sd35: Array(64).fill("/lesions/mel.jpg"),
        },
    },
    {
        className: "bcc",
        classLabel: "Basal Cell Carcinoma",
        real: Array(64).fill("/lesions/bcc.jpg"),
        synthetic: {
            sd21: Array(64).fill("/lesions/bcc.jpg"),
            sdxl: Array(64).fill("/lesions/bcc.jpg"),
            sd35: Array(64).fill("/lesions/bcc.jpg"),
        },
    },
    {
        className: "akiec",
        classLabel: "Actinic Keratosis",
        real: Array(64).fill("/lesions/akiec.jpg"),
        synthetic: {
            sd21: Array(64).fill("/lesions/akiec.jpg"),
            sdxl: Array(64).fill("/lesions/akiec.jpg"),
            sd35: Array(64).fill("/lesions/akiec.jpg"),
        },
    },
    {
        className: "df",
        classLabel: "Dermatofibroma",
        real: Array(64).fill("/lesions/df.jpg"),
        synthetic: {
            sd21: Array(64).fill("/lesions/df.jpg"),
            sdxl: Array(64).fill("/lesions/df.jpg"),
            sd35: Array(64).fill("/lesions/df.jpg"),
        },
    },
    {
        className: "vasc",
        classLabel: "Vascular Lesions",
        real: Array(64).fill("/lesions/vasc.jpg"),
        synthetic: {
            sd21: Array(64).fill("/lesions/vasc.jpg"),
            sdxl: Array(64).fill("/lesions/vasc.jpg"),
            sd35: Array(64).fill("/lesions/vasc.jpg"),
        },
    },
];

function ImageGrid({ images, borderColor, label }: { images: string[]; borderColor: string; label: string }) {
    const gridSize = Math.ceil(Math.sqrt(images.length));

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-center">
                <span className="text-[11px] font-medium text-white/40">{label}</span>
            </div>
            <div
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
                {images.map((src, i) => (
                    <motion.div
                        key={`${label}-${i}`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.008, duration: 0.2 }}
                        className="relative aspect-square overflow-hidden rounded-[3px]"
                        style={{ border: `1px solid ${borderColor}` }}
                    >
                        <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-[1.8]"
                            sizes="60px"
                        />
                    </motion.div>
                ))}
            </div>
            <p className="text-center text-[10px] text-white/15">{images.length} samples</p>
        </div>
    );
}

export function RealVsSynthetic() {
    const [activeModel, setActiveModel] = useState("sd21");
    const [activeClass, setActiveClass] = useState("mel");

    const currentModel = models.find((m) => m.id === activeModel)!;
    const currentClass = classData.find((c) => c.className === activeClass)!;

    return (
        <div className="space-y-6">
            {/* Model selector */}
            <div className="space-y-2">
                <p className="text-center text-[10px] uppercase tracking-[0.15em] text-white/20 font-semibold">
                    Generative Model
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {models.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModel(m.id)}
                            className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold
                transition-all duration-200 cursor-pointer border
                ${activeModel === m.id
                                    ? "bg-white/[0.08] border-white/20 text-white shadow-lg shadow-white/5"
                                    : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10"
                                }
              `}
                        >
                            {activeModel === m.id && (
                                <motion.div
                                    layoutId="modelTab"
                                    className="absolute inset-0 rounded-lg bg-white/[0.06]"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <span className={`relative inline-flex items-center rounded border px-1.5 py-0 text-[9px] font-bold ${m.badgeColor}`}>
                                {m.badge}
                            </span>
                            <span className="relative">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Class selector */}
            <div className="space-y-2">
                <p className="text-center text-[10px] uppercase tracking-[0.15em] text-white/20 font-semibold">
                    Lesion Class
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                    {classData.map((c) => (
                        <button
                            key={c.className}
                            onClick={() => setActiveClass(c.className)}
                            className={`
                relative px-3.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider
                transition-all duration-200 cursor-pointer border
                ${activeClass === c.className
                                    ? "bg-white/[0.08] border-white/20 text-white"
                                    : "bg-white/[0.02] border-white/[0.04] text-white/25 hover:text-white/40 hover:border-white/10"
                                }
              `}
                        >
                            {activeClass === c.className && (
                                <motion.div
                                    layoutId="classTab"
                                    className="absolute inset-0 rounded-md bg-white/[0.05]"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <span className="relative">{c.className}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Class description */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={`${activeModel}-${activeClass}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-center text-sm text-white/40"
                >
                    {currentClass.classLabel}
                    <span className="text-white/15"> — </span>
                    <span className="text-white/25">Real vs {currentModel.label}</span>
                </motion.p>
            </AnimatePresence>

            {/* Side-by-side grids */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${activeModel}-${activeClass}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 gap-6 max-w-5xl mx-auto"
                >
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-3">
                        <ImageGrid
                            images={currentClass.real}
                            borderColor="rgba(16,185,129,0.2)"
                            label="Real (HAM10000)"
                        />
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <ImageGrid
                            images={currentClass.synthetic[activeModel]}
                            borderColor="rgba(255,255,255,0.06)"
                            label={`Synthetic (${currentModel.label})`}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Footer note */}
            <p className="text-center text-[10px] text-white/12">
                6 × 6 grid &middot; Hover to zoom &middot; Replace with actual samples from each experiment
            </p>
        </div>
    );
}