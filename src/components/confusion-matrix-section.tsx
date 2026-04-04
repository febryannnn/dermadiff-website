"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/section";

/* ------------------------------------------------------------------ */
/*  Fade-in helper (matches results-animations.tsx)                    */
/* ------------------------------------------------------------------ */
const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.5 },
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface ConfusionMatrixData {
    model: string;
    labels: string[]; // e.g. ["akiec","bcc","bkl","df","mel","nv","vasc"]
    matrix: number[][]; // rows = true, cols = predicted
}

interface Props {
    matrices: ConfusionMatrixData[];
}

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */
function getModelAccent(model: string) {
    if (model.includes("Baseline")) return { bg: "bg-red-500", ring: "ring-red-500/30", text: "text-red-400", badge: "bg-red-500/10 text-red-400 border-red-500/20" };
    if (model.includes("SD 2.1")) return { bg: "bg-amber-500", ring: "ring-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    if (model.includes("SDXL")) return { bg: "bg-emerald-500", ring: "ring-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    if (model.includes("SD 3.5")) return { bg: "bg-sky-500", ring: "ring-sky-500/30", text: "text-sky-400", badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" };
    return { bg: "bg-white", ring: "ring-white/30", text: "text-white", badge: "" };
}

/** Map a value 0..max → opacity for the heatmap cell */
function cellOpacity(value: number, maxVal: number): number {
    if (maxVal === 0) return 0;
    return 0.08 + (value / maxVal) * 0.82; // range 0.08 – 0.90
}

/** Determine text color for readability on the heatmap */
function cellTextClass(value: number, maxVal: number, isDiag: boolean): string {
    const ratio = maxVal > 0 ? value / maxVal : 0;
    if (isDiag) {
        return ratio > 0.4 ? "text-white font-semibold" : "text-emerald-300 font-semibold";
    }
    return ratio > 0.35 ? "text-white/90" : "text-white/50";
}

/* ------------------------------------------------------------------ */
/*  Single confusion matrix heatmap                                    */
/* ------------------------------------------------------------------ */
function ConfusionHeatmap({
    data,
    normalize,
}: {
    data: ConfusionMatrixData;
    normalize: boolean;
}) {
    const { labels, matrix } = data;
    const accent = getModelAccent(data.model);
    const n = labels.length;

    // Compute display values (raw or row-normalized percentages)
    const displayMatrix: number[][] = [];
    const maxVal = { raw: 0, norm: 0 };

    for (let r = 0; r < n; r++) {
        const rowSum = matrix[r].reduce((a, b) => a + b, 0);
        const row: number[] = [];
        for (let c = 0; c < n; c++) {
            const raw = matrix[r][c];
            const norm = rowSum > 0 ? (raw / rowSum) * 100 : 0;
            row.push(normalize ? norm : raw);
            if (raw > maxVal.raw) maxVal.raw = raw;
            if (norm > maxVal.norm) maxVal.norm = norm;
        }
        displayMatrix.push(row);
    }

    const max = normalize ? maxVal.norm : maxVal.raw;

    // Per-class recall (diagonal / row sum)
    const recalls = matrix.map((row, i) => {
        const rowSum = row.reduce((a, b) => a + b, 0);
        return rowSum > 0 ? ((row[i] / rowSum) * 100).toFixed(1) : "—";
    });

    return (
        <div className="space-y-4">
            {/* Matrix grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[420px]">
                    {/* Column headers (Predicted) */}
                    <div className="flex">
                        {/* Corner spacer */}
                        <div className="w-16 shrink-0" />
                        {/* "Predicted" spanning label */}
                        <div className="flex-1 text-center mb-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                Predicted
                            </span>
                        </div>
                        {/* Recall column header */}
                        <div className="w-14 shrink-0" />
                    </div>

                    <div className="flex">
                        <div className="w-16 shrink-0" />
                        <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                            {labels.map((label) => (
                                <div
                                    key={`col-${label}`}
                                    className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-1.5 font-medium"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="w-14 shrink-0 text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-1.5 font-medium">
                            Recall
                        </div>
                    </div>

                    {/* Rows */}
                    {displayMatrix.map((row, r) => (
                        <div key={`row-${r}`} className="flex items-center">
                            {/* Row label (True) */}
                            <div className="w-16 shrink-0 text-right pr-2">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                                    {labels[r]}
                                </span>
                            </div>

                            {/* Cells */}
                            <div
                                className="flex-1 grid gap-[2px]"
                                style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                            >
                                {row.map((val, c) => {
                                    const isDiag = r === c;
                                    const opacity = cellOpacity(val, max);
                                    const bgColor = isDiag
                                        ? `rgba(52, 211, 153, ${opacity})`  // emerald for diagonal
                                        : `rgba(239, 68, 68, ${opacity * 0.7})`; // red-ish for off-diagonal

                                    return (
                                        <motion.div
                                            key={`cell-${r}-${c}`}
                                            className={`
                        aspect-square flex items-center justify-center rounded-[3px] text-xs font-mono
                        ${cellTextClass(val, max, isDiag)}
                        ${isDiag ? "ring-1 ring-emerald-400/20" : ""}
                        transition-colors duration-200
                      `}
                                            style={{ backgroundColor: bgColor }}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: 0.02 * (r * n + c),
                                                duration: 0.3,
                                                ease: "easeOut",
                                            }}
                                            title={`True: ${labels[r]}, Pred: ${labels[c]} — ${normalize ? val.toFixed(1) + "%" : val}`}
                                        >
                                            <span className="text-[11px] leading-none">
                                                {normalize ? val.toFixed(1) : val}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Recall value */}
                            <div className="w-14 shrink-0 text-center">
                                <span className="text-xs font-mono text-emerald-400/80">
                                    {recalls[r]}%
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* "True" label on the left side */}
                    <div className="flex mt-1">
                        <div className="w-16 shrink-0 text-right pr-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                True ↑
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Tab selector for switching between experiments                     */
/* ------------------------------------------------------------------ */
function ModelTabSelector({
    models,
    selected,
    onSelect,
}: {
    models: string[];
    selected: number;
    onSelect: (i: number) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {models.map((model, i) => {
                const accent = getModelAccent(model);
                const isActive = i === selected;
                return (
                    <button
                        key={model}
                        onClick={() => onSelect(i)}
                        className={`
              relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                                ? `${accent.badge} border ring-2 ${accent.ring}`
                                : "bg-white/[0.03] border border-white/10 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground/80"
                            }
            `}
                    >
                        {model}
                    </button>
                );
            })}
        </div>
    );
}

/* ================================================================== */
/*  EXPORTED SECTION COMPONENT                                         */
/* ================================================================== */
export function ConfusionMatrixSection({ matrices }: Props) {
    const [selectedIdx, setSelectedIdx] = useState(matrices.length - 1); // default to latest experiment
    const [normalize, setNormalize] = useState(true);

    const current = matrices[selectedIdx];
    const accent = getModelAccent(current.model);

    return (
        <Section className="space-y-8 border-t border-border/40">
            <SectionHeader
                badge="Confusion Matrix"
                title="Confusion Matrix"
                description="Heatmap of true vs. predicted labels. Diagonal cells represent correct classifications; off-diagonal cells reveal systematic misclassification patterns."
            />

            <motion.div {...fadeIn(0)}>
                <Card className="bg-card/60 border border-white/10">
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-lg">
                                Confusion Matrix
                                <span className={`ml-2 ${accent.text}`}>
                                    — {current.model}
                                </span>
                            </CardTitle>

                            {/* Normalize toggle */}
                            <button
                                onClick={() => setNormalize((v) => !v)}
                                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium
                  border transition-all duration-200
                  ${normalize
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-white/[0.03] border-white/10 text-muted-foreground hover:text-foreground/70"
                                    }
                `}
                            >
                                <div
                                    className={`w-7 h-4 rounded-full transition-colors duration-200 relative ${normalize ? "bg-emerald-500/40" : "bg-white/10"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${normalize
                                            ? "left-3.5 bg-emerald-400"
                                            : "left-0.5 bg-white/40"
                                            }`}
                                    />
                                </div>
                                {normalize ? "Row-Normalized (%)" : "Raw Counts"}
                            </button>
                        </div>

                        {/* Model tabs */}
                        <ModelTabSelector
                            models={matrices.map((m) => m.model)}
                            selected={selectedIdx}
                            onSelect={setSelectedIdx}
                        />
                    </CardHeader>

                    <CardContent>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${current.model}-${normalize}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <ConfusionHeatmap data={current} normalize={normalize} />
                            </motion.div>
                        </AnimatePresence>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-[2px] bg-emerald-500/50 ring-1 ring-emerald-400/20" />
                                <span className="text-xs text-muted-foreground">
                                    Diagonal (correct)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-[2px] bg-red-500/30" />
                                <span className="text-xs text-muted-foreground">
                                    Off-diagonal (misclassified)
                                </span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-[10px] text-muted-foreground/60">
                                    {normalize
                                        ? "Values show row-normalized percentages (recall view)"
                                        : "Values show raw prediction counts"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Section>
    );
}