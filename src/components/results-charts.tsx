"use client";

import { useRef } from "react";
// import { motion, useInView } from "motion/react";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"];

const COLORS = {
  baseline: "#f87171", // red-400
  sd21: "#fbbf24", // amber-400
  sdxl: "#34d399", // emerald-400
  sd35: "#38bdf8", // sky-400
};

// ── Per-Class Recall bar chart data ──
const recallBarData = CLASSES.map((cls) => ({
  class: cls,
  "Exp A (Baseline)":
    cls === "akiec" ? 0.735 :
    cls === "bcc" ? 0.909 :
    cls === "bkl" ? 0.842 :
    cls === "df" ? 0.588 :
    cls === "mel" ? 0.713 :
    cls === "nv" ? 0.917 :
    0.864,
  "Exp C2 (SD 2.1)":
    cls === "akiec" ? 0.796 :
    cls === "bcc" ? 0.935 :
    cls === "bkl" ? 0.842 :
    cls === "df" ? 0.588 :
    cls === "mel" ? 0.796 :
    cls === "nv" ? 0.895 :
    0.864,
  "Exp C3 (SDXL)":
    cls === "akiec" ? 0.837 :
    cls === "bcc" ? 0.870 :
    cls === "bkl" ? 0.836 :
    cls === "df" ? 0.706 :
    cls === "mel" ? 0.790 :
    cls === "nv" ? 0.915 :
    0.864,
  "Exp C4 (SD 3.5 Large)":
    cls === "akiec" ? 0.776 :
    cls === "bcc" ? 0.896 :
    cls === "bkl" ? 0.849 :
    cls === "df" ? 0.706 :
    cls === "mel" ? 0.820 :
    cls === "nv" ? 0.913 :
    0.864,
}));

// ── Per-Class F1 bar chart data ──
const f1BarData = CLASSES.map((cls) => ({
  class: cls,
  "Exp A (Baseline)":
    cls === "akiec" ? 0.800 :
    cls === "bcc" ? 0.859 :
    cls === "bkl" ? 0.749 :
    cls === "df" ? 0.741 :
    cls === "mel" ? 0.688 :
    cls === "nv" ? 0.938 :
    0.905,
  "Exp C2 (SD 2.1)":
    cls === "akiec" ? 0.812 :
    cls === "bcc" ? 0.894 :
    cls === "bkl" ? 0.799 :
    cls === "df" ? 0.741 :
    cls === "mel" ? 0.672 :
    cls === "nv" ? 0.930 :
    0.905,
  "Exp C3 (SDXL)":
    cls === "akiec" ? 0.845 :
    cls === "bcc" ? 0.882 :
    cls === "bkl" ? 0.814 :
    cls === "df" ? 0.800 :
    cls === "mel" ? 0.679 :
    cls === "nv" ? 0.940 :
    0.927,
  "Exp C4 (SD 3.5 Large)":
    cls === "akiec" ? 0.844 :
    cls === "bcc" ? 0.908 :
    cls === "bkl" ? 0.821 :
    cls === "df" ? 0.800 :
    cls === "mel" ? 0.701 :
    cls === "nv" ? 0.936 :
    0.927,
}));

// ── Delta heatmap data (recall) ──
const recallDelta: Record<string, Record<string, number | null>> = {
  "Exp C2 (SD 2.1)": { akiec: 8.3, bcc: 2.9, bkl: 0.0, df: 0.0, mel: 11.8, nv: -2.5, vasc: 0.0 },
  "Exp C3 (SDXL)": { akiec: 13.9, bcc: -4.3, bkl: -0.7, df: 20.0, mel: 10.9, nv: -0.3, vasc: 0.0 },
  "Exp C4 (SD 3.5 Large)": { akiec: 5.6, bcc: -1.4, bkl: 0.7, df: 20.0, mel: 15.1, nv: -0.5, vasc: 0.0 },
};

// ── Delta heatmap data (F1) ──
const f1Delta: Record<string, Record<string, number | null>> = {
  "Exp C2 (SD 2.1)": { akiec: 1.6, bcc: 4.1, bkl: 6.6, df: 0.0, mel: -0.9, nv: 0.0, vasc: 0.0 },
  "Exp C3 (SDXL)": { akiec: 5.7, bcc: 2.6, bkl: 8.7, df: 8.0, mel: -1.3, nv: 0.1, vasc: 2.4 },
  "Exp C4 (SD 3.5 Large)": { akiec: 5.6, bcc: 5.7, bkl: 9.6, df: 8.0, mel: 1.9, nv: -0.2, vasc: 2.4 },
};

// ── Recall heatmap (absolute) ──
const recallHeatmap: Record<string, Record<string, number | null>> = {
  "Exp A (Baseline)": { akiec: 0.7347, bcc: 0.9091, bkl: 0.8424, df: 0.5882, mel: 0.7126, nv: 0.9175, vasc: 0.8636 },
  "Exp C2 (SD 2.1)": { akiec: 0.7959, bcc: 0.9351, bkl: 0.8424, df: 0.5882, mel: 0.7964, nv: 0.8946, vasc: 0.8636 },
  "Exp C3 (SDXL)": { akiec: 0.8367, bcc: 0.8701, bkl: 0.8364, df: 0.7059, mel: 0.7904, nv: 0.9145, vasc: 0.8636 },
  "Exp C4 (SD 3.5 Large)": { akiec: 0.7755, bcc: 0.8961, bkl: 0.8485, df: 0.7059, mel: 0.8204, nv: 0.9125, vasc: 0.8636 },
};

// ── F1 heatmap (absolute) ──
const f1Heatmap: Record<string, Record<string, number | null>> = {
  "Exp A (Baseline)": { akiec: 0.8000, bcc: 0.8589, bkl: 0.7493, df: 0.7407, mel: 0.6879, nv: 0.9385, vasc: 0.9048 },
  "Exp C2 (SD 2.1)": { akiec: 0.8125, bcc: 0.8944, bkl: 0.7989, df: 0.7407, mel: 0.6717, nv: 0.9298, vasc: 0.9048 },
  "Exp C3 (SDXL)": { akiec: 0.8454, bcc: 0.8816, bkl: 0.8142, df: 0.8000, mel: 0.6787, nv: 0.9397, vasc: 0.9268 },
  "Exp C4 (SD 3.5 Large)": { akiec: 0.8444, bcc: 0.9079, bkl: 0.8211, df: 0.8000, mel: 0.7008, nv: 0.9363, vasc: 0.9268 },
};

// ── Overall metrics bar chart data ──
const overallMetrics = [
  {
    metric: "Accuracy",
    "Exp A (Baseline)": "-" as string | number,
    "Exp C2 (SD 2.1)": "-" as string | number,
    "Exp C3 (SDXL)": "-" as string | number,
    "Exp C4 (SD 3.5 Large)": 0.8869,
  },
  {
    metric: "Macro F1",
    "Exp A (Baseline)": 0.8114,
    "Exp C2 (SD 2.1)": 0.8218,
    "Exp C3 (SDXL)": 0.8409,
    "Exp C4 (SD 3.5 Large)": 0.8482,
  },
  {
    metric: "Macro Recall",
    "Exp A (Baseline)": 0.7955,
    "Exp C2 (SD 2.1)": 0.8166,
    "Exp C3 (SDXL)": 0.8311,
    "Exp C4 (SD 3.5 Large)": 0.8318,
  },
  {
    metric: "Weighted F1",
    "Exp A (Baseline)": 0.8785,
    "Exp C2 (SD 2.1)": 0.8786,
    "Exp C3 (SDXL)": 0.8891,
    "Exp C4 (SD 3.5 Large)": 0.8913,
  },
  {
    metric: "Weighted Recall",
    "Exp A (Baseline)": 0.8756,
    "Exp C2 (SD 2.1)": 0.8729,
    "Exp C3 (SDXL)": 0.8842,
    "Exp C4 (SD 3.5 Large)": 0.8869,
  },
  {
    metric: "Macro Precision",
    "Exp A (Baseline)": "-" as string | number,
    "Exp C2 (SD 2.1)": "-" as string | number,
    "Exp C3 (SDXL)": "-" as string | number,
    "Exp C4 (SD 3.5 Large)": 0.8769,
  },
  {
    metric: "Weighted Precision",
    "Exp A (Baseline)": "-" as string | number,
    "Exp C2 (SD 2.1)": "-" as string | number,
    "Exp C3 (SDXL)": "-" as string | number,
    "Exp C4 (SD 3.5 Large)": 0.9011,
  },
];

// ── Helper: color interpolation for heatmaps ──
function getDeltaColor(value: number, maxAbs: number): string {
  const norm = Math.min(Math.abs(value) / maxAbs, 1);
  if (value < 0) {
    const r = 220;
    const g = Math.round(220 - norm * 120);
    const b = Math.round(220 - norm * 120);
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.round(220 - norm * 140);
  const g = Math.round(200 + norm * 40);
  const b = Math.round(220 - norm * 140);
  return `rgb(${r},${g},${b})`;
}

function getAbsoluteColor(value: number): string {
  const norm = Math.min(Math.max(value, 0), 1);
  const r = Math.round(30 + (1 - norm) * 80);
  const g = Math.round(60 + (1 - norm) * 100);
  const b = Math.round(140 + (1 - norm) * 80);
  return `rgb(${r},${g},${b})`;
}

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 15 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { delay, duration: 0.5 },
});

// ── Shared bar chart component (renders on scroll into view) ──
function PerClassBarChart({
  title,
  data,
}: {
  title: string;
  data: typeof recallBarData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref}>
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <div style={{ height: 360 }}>
        {isInView && (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="class" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis domain={[0, 1]} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Exp A (Baseline)" fill={COLORS.baseline} radius={[2, 2, 0, 0]} animationBegin={0} animationDuration={1000} animationEasing="ease-out" />
              <Bar dataKey="Exp C2 (SD 2.1)" fill={COLORS.sd21} radius={[2, 2, 0, 0]} animationBegin={300} animationDuration={1000} animationEasing="ease-out" />
              <Bar dataKey="Exp C3 (SDXL)" fill={COLORS.sdxl} radius={[2, 2, 0, 0]} animationBegin={600} animationDuration={1000} animationEasing="ease-out" />
              <Bar dataKey="Exp C4 (SD 3.5 Large)" fill={COLORS.sd35} radius={[2, 2, 0, 0]} animationBegin={900} animationDuration={1000} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ── Delta heatmap component ──
function DeltaHeatmap({
  title,
  data,
}: {
  title: string;
  data: Record<string, Record<string, number | null>>;
}) {
  const experiments = Object.keys(data);
  const allValues = experiments.flatMap((exp) =>
    Object.values(data[exp]).filter((v): v is number => v !== null)
  );
  const maxAbs = Math.max(...allValues.map(Math.abs), 1);

  return (
    <div>
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs text-zinc-400 p-2 w-40">Experiment</th>
              {CLASSES.map((cls) => (
                <th key={cls} className="text-center text-xs text-zinc-400 p-2">{cls}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {experiments.map((exp, expIdx) => (
              <tr key={exp}>
                <motion.td
                  className="text-xs text-zinc-300 p-2 font-medium whitespace-nowrap"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: expIdx * 0.15, duration: 0.4 }}
                >
                  {exp}
                </motion.td>
                {CLASSES.map((cls, clsIdx) => {
                  const val = data[exp][cls];
                  const cellDelay = expIdx * 0.15 + clsIdx * 0.06;
                  if (val === null) {
                    return (
                      <motion.td
                        key={cls}
                        className="text-center text-sm font-mono p-3 bg-zinc-800/50 text-zinc-500"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: cellDelay, duration: 0.3 }}
                      >
                        -
                      </motion.td>
                    );
                  }
                  return (
                    <motion.td
                      key={cls}
                      className="text-center text-sm font-mono font-semibold p-3"
                      style={{
                        backgroundColor: getDeltaColor(val, maxAbs),
                        color: Math.abs(val) > maxAbs * 0.6 ? "#1a1a1a" : "#333",
                      }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: cellDelay, duration: 0.35, ease: "easeOut" as const }}
                    >
                      {val > 0 ? "+" : ""}{val.toFixed(1)}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Absolute heatmap component ──
function AbsoluteHeatmap({
  title,
  data,
}: {
  title: string;
  data: Record<string, Record<string, number | null>>;
}) {
  const experiments = Object.keys(data);

  return (
    <div>
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs text-zinc-400 p-2 w-40">Experiment</th>
              {CLASSES.map((cls) => (
                <th key={cls} className="text-center text-xs text-zinc-400 p-2">{cls}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {experiments.map((exp, expIdx) => (
              <tr key={exp}>
                <motion.td
                  className="text-xs text-zinc-300 p-2 font-medium whitespace-nowrap"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: expIdx * 0.15, duration: 0.4 }}
                >
                  {exp}
                </motion.td>
                {CLASSES.map((cls, clsIdx) => {
                  const val = data[exp][cls];
                  const cellDelay = expIdx * 0.15 + clsIdx * 0.06;
                  if (val === null) {
                    return (
                      <motion.td
                        key={cls}
                        className="text-center text-sm font-mono p-3 bg-zinc-800/50 text-zinc-500"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: cellDelay, duration: 0.3 }}
                      >
                        -
                      </motion.td>
                    );
                  }
                  return (
                    <motion.td
                      key={cls}
                      className="text-center text-sm font-mono font-semibold p-3"
                      style={{
                        backgroundColor: getAbsoluteColor(val),
                        color: "#fff",
                      }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: cellDelay, duration: 0.35, ease: "easeOut" as const }}
                    >
                      {val.toFixed(4)}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Overall metrics bar chart ──
function OverallMetricsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const chartData = overallMetrics.filter(
    (d) => typeof d["Exp A (Baseline)"] === "number"
  );

  return (
    <div ref={ref}>
      <h3 className="text-lg font-semibold text-center mb-4">
        Overall Metrics Comparison
      </h3>
      <div style={{ height: 400 }}>
        {isInView && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="metric" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <YAxis domain={[0.75, 0.95]} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                labelStyle={{ color: "#e4e4e7" }}
                formatter={(value) => typeof value === "number" ? value.toFixed(4) : value}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Exp A (Baseline)" fill={COLORS.baseline} radius={[2, 2, 0, 0]} animationBegin={0} animationDuration={1000} animationEasing="ease-out" />
              <Bar dataKey="Exp C2 (SD 2.1)" fill={COLORS.sd21} radius={[2, 2, 0, 0]} animationBegin={300} animationDuration={1000} animationEasing="ease-out" />
              <Bar dataKey="Exp C3 (SDXL)" fill={COLORS.sdxl} radius={[2, 2, 0, 0]} animationBegin={600} animationDuration={1000} animationEasing="ease-out" />
              <Bar dataKey="Exp C4 (SD 3.5 Large)" fill={COLORS.sd35} radius={[2, 2, 0, 0]} animationBegin={900} animationDuration={1000} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {overallMetrics
          .filter((d) => d["Exp A (Baseline)"] === "-")
          .map((d) => (
            <span
              key={d.metric}
              className="text-xs text-zinc-500 bg-zinc-800/50 rounded px-3 py-1"
            >
              {d.metric}: data not available
            </span>
          ))}
      </div>
    </div>
  );
}

// ── Main export: all charts ──
export function ResultsCharts() {
  return (
    <div className="space-y-16">
      {/* 1. Per-Class Bar Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0)}>
          <PerClassBarChart title="Per-Class Recall Comparison" data={recallBarData} />
        </motion.div>
        <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0.15)}>
          <PerClassBarChart title="Per-Class F1 Score Comparison" data={f1BarData} />
        </motion.div>
      </div>

      {/* 2. Delta Heatmaps */}
      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0)}>
          <DeltaHeatmap title="Recall &Delta;% vs Baseline" data={recallDelta} />
        </motion.div>
        <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0.15)}>
          <DeltaHeatmap title="F1 &Delta;% vs Baseline" data={f1Delta} />
        </motion.div>
      </div>

      {/* 3. Absolute Recall Heatmap */}
      <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0)}>
        <AbsoluteHeatmap title="Per-Class Recall by Experiment" data={recallHeatmap} />
      </motion.div>

      {/* 4. Absolute F1 Heatmap */}
      <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0.1)}>
        <AbsoluteHeatmap title="Per-Class F1 Score by Experiment" data={f1Heatmap} />
      </motion.div>

      {/* 5. Overall Metrics Comparison */}
      <motion.div className="bg-card/60 border border-white/10 rounded-xl p-6" {...fadeIn(0)}>
        <OverallMetricsChart />
      </motion.div>
    </div>
  );
}
