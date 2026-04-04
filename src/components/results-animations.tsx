"use client";

import { useEffect, useRef } from "react";
// import { motion } from "motion/react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Section, SectionHeader } from "@/components/section";
import { ResultsCharts } from "@/components/results-charts";
import { ResultsGenCharts } from "@/components/results-gen-charts";
import { ConfusionMatrixSection, ConfusionMatrixData } from "@/components/confusion-matrix-section";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5 },
});

function getModelStyle(model: string) {
  if (model.includes("Baseline")) {
    return { text: "text-red-400", row: "bg-red-500/5" };
  }
  if (model.includes("SD 2.1")) {
    return { text: "text-amber-400", row: "bg-amber-500/5" };
  }
  if (model.includes("SDXL")) {
    return { text: "text-emerald-400", row: "bg-emerald-500/5" };
  }
  if (model.includes("SD 3.5")) {
    return { text: "text-sky-400", row: "bg-sky-500/5" };
  }
  return { text: "text-white", row: "" };
}

/* ------------------------------------------------------------------ */
/*  KaTeX inline renderer                                              */
/* ------------------------------------------------------------------ */
function Latex({ math, display = false }: { math: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && typeof window !== "undefined") {
      import("katex").then((katex) => {
        if (ref.current) {
          katex.default.render(math, ref.current, {
            throwOnError: false,
            displayMode: display,
          });
        }
      });
    }
  }, [math, display]);

  return <span ref={ref} />;
}

/* ------------------------------------------------------------------ */
/*  Formula card with LaTeX                                            */
/* ------------------------------------------------------------------ */
function FormulaCard({
  title,
  formulas,
  note,
}: {
  title: string;
  formulas: { label: string; tex: string; description?: string }[];
  note?: string;
}) {
  return (
    <Card className="bg-card/40 border border-white/10 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formulas.map((f, i) => (
          <div key={i} className="space-y-1">
            <p className="text-xs font-medium text-foreground/60">{f.label}</p>
            <div className="rounded-md bg-white/[0.03] border border-white/5 px-4 py-3 overflow-x-auto flex items-center justify-center min-h-[3rem]">
              <Latex math={f.tex} display />
            </div>
            {f.description && (
              <p className="text-xs text-muted-foreground italic pl-1">
                {f.description}
              </p>
            )}
          </div>
        ))}
        {note && (
          <p className="text-xs text-muted-foreground border-t border-white/5 pt-3">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PerClassMetricRow {
  model: string;
  akiec: string;
  bcc: string;
  bkl: string;
  df: string;
  mel: string;
  nv: string;
  vasc: string;
}

interface GenPerClassRow {
  model: string;
  akiec: string;
  bcc: string;
  df: string;
  mel: string;
  vasc: string;
}

interface OverallGenMetricRow {
  model: string;
  fid: string;
  is: string;
  lpips: string;
  ppl: string;
}

interface Props {
  avgData: {
    model: string;
    macroRecall: string;
    weightedRecall: string;
    macroF1: string;
    weightedF1: string;
    macroPrecision: string;
    weightedPrecision: string;
    accuracy: string;
  }[];
  recallData: PerClassMetricRow[];
  f1Data: PerClassMetricRow[];
  expectedPerformance: {
    cls: string;
    clsFull: string;
    noAug: string;
    diffusion: string;
    gain: string;
    note: string;
  }[];
  /* Generative quality metrics */
  fidPerClass?: GenPerClassRow[];
  isPerClass?: GenPerClassRow[];
  lpipsPerClass?: GenPerClassRow[];
  pplPerClass?: GenPerClassRow[];
  genOverall?: OverallGenMetricRow[];
  confusionMatrices?: ConfusionMatrixData[];
}

/* ------------------------------------------------------------------ */
/*  Reusable 7-class table (classification)                            */
/* ------------------------------------------------------------------ */
function SevenClassTable({
  title,
  data,
  delay = 0,
}: {
  title: string;
  data: PerClassMetricRow[];
  delay?: number;
}) {
  return (
    <motion.div {...fadeIn(delay)}>
      <Card className="bg-card/60 border border-white/10 mt-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Model</TableHead>
                <TableHead>AKIEC</TableHead>
                <TableHead>BCC</TableHead>
                <TableHead>BKL</TableHead>
                <TableHead>DF</TableHead>
                <TableHead>MEL</TableHead>
                <TableHead>NV</TableHead>
                <TableHead>VASC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => {
                const style = getModelStyle(row.model);
                return (
                  <TableRow
                    key={row.model}
                    className={`${style.row} hover:bg-white/5 transition`}
                  >
                    <TableCell className={`font-medium ${style.text}`}>
                      {row.model}
                    </TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.akiec}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.bcc}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.bkl}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.df}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.mel}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.nv}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.vasc}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  5-class table (generative — minority classes only)                 */
/* ------------------------------------------------------------------ */
function FiveClassTable({
  title,
  data,
  delay = 0,
}: {
  title: string;
  data: GenPerClassRow[];
  delay?: number;
}) {
  return (
    <motion.div {...fadeIn(delay)}>
      <Card className="bg-card/60 border border-white/10 mt-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Model</TableHead>
                <TableHead>AKIEC</TableHead>
                <TableHead>BCC</TableHead>
                <TableHead>DF</TableHead>
                <TableHead>MEL</TableHead>
                <TableHead>VASC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => {
                const style = getModelStyle(row.model);
                return (
                  <TableRow
                    key={row.model}
                    className={`${style.row} hover:bg-white/5 transition`}
                  >
                    <TableCell className={`font-medium ${style.text}`}>
                      {row.model}
                    </TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.akiec}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.bcc}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.df}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.mel}</TableCell>
                    <TableCell className={`font-mono ${style.text}`}>{row.vasc}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export function AnimatedResultsPage({
  avgData,
  recallData,
  f1Data,
  expectedPerformance,
  fidPerClass,
  isPerClass,
  lpipsPerClass,
  pplPerClass,
  genOverall,
  confusionMatrices,
}: Props) {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 text-xs">
              Section 4
            </Badge>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Evaluation Metrics
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Three-way comparison measuring the specific contribution of diffusion
            augmentation beyond both baselines.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION: Classification Metric Formulas                      */}
      {/* ============================================================ */}
      <Section className="space-y-8">
        <SectionHeader
          badge="Formulas"
          title="Classification Metrics"
          description="Mathematical definitions for the metrics used to evaluate PanDerm classifier performance."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div {...fadeIn(0)}>
            <FormulaCard
              title="Recall (Sensitivity)"
              formulas={[
                {
                  label: "Per-class",
                  tex: "\\text{Recall}_c = \\frac{\\text{TP}_c}{\\text{TP}_c + \\text{FN}_c}",
                  description:
                    "Proportion of actual positives correctly identified. Critical for minority classes where missed diagnoses are costly.",
                },
                {
                  label: "Macro Recall",
                  tex: "\\text{Macro Recall} = \\frac{1}{C} \\sum_{c=1}^{C} \\text{Recall}_c",
                  description: "Unweighted mean across all C classes — treats every class equally regardless of size.",
                },
                {
                  label: "Weighted Recall",
                  tex: "\\text{Weighted Recall} = \\sum_{c=1}^{C} \\frac{n_c}{N} \\cdot \\text{Recall}_c",
                  description: "Weighted by class support n_c. Equivalent to overall accuracy.",
                },
              ]}
            />
          </motion.div>

          <motion.div {...fadeIn(0.1)}>
            <FormulaCard
              title="F1 Score"
              formulas={[
                {
                  label: "Per-class",
                  tex: "F1_c = \\frac{2 \\cdot \\text{Precision}_c \\cdot \\text{Recall}_c}{\\text{Precision}_c + \\text{Recall}_c}",
                  description: "Harmonic mean of precision and recall. Penalizes extreme imbalance between the two.",
                },
                {
                  label: "Precision (for reference)",
                  tex: "\\text{Precision}_c = \\frac{\\text{TP}_c}{\\text{TP}_c + \\text{FP}_c}",
                  description: "Proportion of predicted positives that are actually positive.",
                },
                {
                  label: "Macro F1",
                  tex: "\\text{Macro } F1 = \\frac{1}{C} \\sum_{c=1}^{C} F1_c",
                },
              ]}
            />
          </motion.div>
        </div>
      </Section>

      {confusionMatrices && confusionMatrices.length > 0 && (
        <ConfusionMatrixSection matrices={confusionMatrices} />
      )}

      {/* ============================================================ */}
      {/*  SECTION: Primary Result Tables                               */}
      {/* ============================================================ */}
      <Section className="space-y-15 border-t border-border/40">
        <SectionHeader
          badge="Primary Result"
          title="Three-Way Comparison Table"
          description="The central result of this project. We expect the largest gains for the rarest classes (df, vasc, akiec) and clinically critical classes (mel, bcc)."
        />

        <SevenClassTable title="Per-Class Recall" data={recallData} delay={0} />
        <SevenClassTable title="Per-Class F1 Score" data={f1Data} delay={0.1} />

        {/* AVERAGE */}
        <motion.div {...fadeIn(0.2)}>
          <Card className="bg-card/60 border border-white/10 mt-10">
            <CardHeader>
              <CardTitle>Average Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Model</TableHead>
                    <TableHead>Macro Recall</TableHead>
                    <TableHead>Weighted Recall</TableHead>
                    <TableHead>Macro F1</TableHead>
                    <TableHead>Weighted F1</TableHead>
                    <TableHead>Macro Precision</TableHead>
                    <TableHead>Weighted Precision</TableHead>
                    <TableHead>Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avgData.map((row) => {
                    const style = getModelStyle(row.model);
                    return (
                      <TableRow
                        key={row.model}
                        className={`${style.row} hover:bg-white/5 transition`}
                      >
                        <TableCell className={`font-medium ${style.text}`}>
                          {row.model}
                        </TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.macroRecall}</TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.weightedRecall}</TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.macroF1}</TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.weightedF1}</TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.macroPrecision}</TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.weightedPrecision}</TableCell>
                        <TableCell className={`font-mono ${style.text}`}>{row.accuracy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-xs text-white/60 text-center mt-6">
          Table 4: Four-way comparison results. A = Baseline, C2 = SD 2.1, C3 = SDXL, C4 = SD 3.5 Large.
        </p>
      </Section>

      {/* Visual Charts */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Visualizations"
          title="Graphical Analysis"
          description="Visual comparison of experiment results across all metrics and classes."
        />
        <motion.div {...fadeIn(0)}>
          <ResultsCharts />
        </motion.div>
      </Section>


      {/* ============================================================ */}
      {/*  SECTION: Generative Quality Metric Formulas (LaTeX)          */}
      {/* ============================================================ */}
      <Section className="space-y-8 border-t border-border/40">
        <SectionHeader
          badge="Formulas"
          title="Generative Quality Metrics"
          description="Mathematical definitions for metrics evaluating the quality, diversity, and perceptual fidelity of synthetic dermoscopic images."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div {...fadeIn(0)}>
            <FormulaCard
              title="Fréchet Inception Distance (FID)"
              formulas={[
                {
                  label: "Definition",
                  tex: "\\text{FID} = \\|\\mu_r - \\mu_g\\|^2 + \\text{Tr}\\!\\left(\\Sigma_r + \\Sigma_g - 2\\left(\\Sigma_r \\Sigma_g\\right)^{\\frac{1}{2}}\\right)",
                  description:
                    "Fréchet distance between two multivariate Gaussians fitted to InceptionV3 pool3 features (2048-d) of real (r) and generated (g) image sets.",
                },
              ]}
              note="Lower is better. FID = 0 means identical distributions. Sensitive to mode collapse, image quality, and diversity simultaneously."
            />
          </motion.div>

          <motion.div {...fadeIn(0.1)}>
            <FormulaCard
              title="Inception Score (IS)"
              formulas={[
                {
                  label: "Definition",
                  tex: "\\text{IS} = \\exp\\!\\left(\\mathbb{E}_{\\mathbf{x}} \\left[ D_{\\text{KL}}\\!\\left( p(y|\\mathbf{x}) \\,\\|\\, p(y) \\right) \\right]\\right)",
                  description:
                    "KL divergence between conditional class distribution p(y|x) and marginal p(y) from InceptionV3.",
                },
                {
                  label: "KL Divergence",
                  tex: "D_{\\text{KL}}(P \\| Q) = \\sum_{y} P(y) \\ln \\frac{P(y)}{Q(y)}",
                },
              ]}
              note="Higher is better. Measures quality (sharp predictions) × diversity (uniform marginal). IS uses ImageNet classes, so medical image scores are typically low (1–3)."
            />
          </motion.div>

          <motion.div {...fadeIn(0.2)}>
            <FormulaCard
              title="LPIPS Diversity"
              formulas={[
                {
                  label: "Pairwise perceptual distance",
                  tex: "\\text{LPIPS}(x, \\hat{x}) = \\sum_{l} \\frac{1}{H_l W_l} \\sum_{h,w} \\left\\| w_l \\odot \\left(\\phi_l(x) - \\phi_l(\\hat{x})\\right) \\right\\|_2^2",
                  description:
                    "Weighted L2 in deep feature space φₗ (AlexNet). Learned weights wₗ calibrated to human perceptual judgments.",
                },
                {
                  label: "Diversity score",
                  tex: "\\text{Diversity} = \\frac{1}{|\\mathcal{P}|} \\sum_{(i,j) \\in \\mathcal{P}} \\text{LPIPS}(x_i, x_j)",
                  description:
                    "Average LPIPS over random pairs 𝒫 of generated images.",
                },
              ]}
              note="Higher diversity is better (less mode collapse). Typical range: 0.3–0.7. Values < 0.2 may indicate near-identical outputs."
            />
          </motion.div>

          <motion.div {...fadeIn(0.3)}>
            <FormulaCard
              title="Perceptual Path Length (PPL)"
              formulas={[
                {
                  label: "Definition",
                  tex: "\\text{PPL} = \\mathbb{E}\\!\\left[ \\frac{1}{\\epsilon^2} \\, d\\!\\left( G\\!\\left(\\text{slerp}(z_1, z_2, t)\\right),\\; G\\!\\left(\\text{slerp}(z_1, z_2, t{+}\\epsilon)\\right) \\right) \\right]",
                  description:
                    "Expected perceptual distance d (LPIPS) between images generated at nearby points along a latent space interpolation path.",
                },
                {
                  label: "Spherical interpolation",
                  tex: "\\text{slerp}(z_1, z_2, t) = \\frac{\\sin\\!\\left((1{-}t)\\,\\theta\\right)}{\\sin\\theta}\\, z_1 + \\frac{\\sin(t\\,\\theta)}{\\sin\\theta}\\, z_2",
                },
              ]}
              note="Lower is better. Measures latent space smoothness — how consistently the generator maps nearby latent codes to perceptually similar images. Requires model access for computation."
            />
          </motion.div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SECTION: Generative Quality Charts                          */}
      {/* ============================================================ */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Visualizations"
          title="Generative Quality Analysis"
          description="Visual comparison of FID, IS, and LPIPS diversity across diffusion models and lesion classes."
        />

        {/* FID Bar Chart */}
        <motion.div {...fadeIn(0)}>
          <Card className="bg-card/60 border border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-base">Per-Class FID ↓</CardTitle>
              <p className="text-xs text-muted-foreground">Lower bars indicate better distributional similarity to real images.</p>
            </CardHeader>
            <CardContent>
              {fidPerClass && fidPerClass.length > 0 && (() => {
                const classes = ["akiec", "bcc", "df", "mel", "vasc"] as const;
                const maxFid = Math.max(
                  ...fidPerClass.flatMap((r) =>
                    classes.map((c) => parseFloat(r[c]) || 0)
                  )
                );
                return (
                  <div className="space-y-6">
                    {fidPerClass.map((row) => {
                      const style = getModelStyle(row.model);
                      return (
                        <div key={row.model} className="space-y-2">
                          <p className={`text-sm font-medium ${style.text}`}>{row.model}</p>
                          <div className="grid grid-cols-5 gap-3">
                            {classes.map((cls) => {
                              const val = parseFloat(row[cls]);
                              const pct = isNaN(val) ? 0 : (val / (maxFid * 1.1)) * 100;
                              return (
                                <div key={cls} className="space-y-1">
                                  <div className="h-24 relative flex items-end rounded-sm overflow-hidden bg-white/[0.02]">
                                    {isNaN(val) ? (
                                      <div className="w-full flex items-center justify-center h-full">
                                        <span className="text-xs text-white/30">—</span>
                                      </div>
                                    ) : (
                                      <motion.div
                                        className="w-full rounded-t-sm bg-gradient-to-t from-red-500/80 to-red-400/40"
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${pct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                      />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider">{cls}</p>
                                  <p className="text-xs text-center font-mono text-foreground/70">
                                    {isNaN(val) ? "—" : val.toFixed(1)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>

        {/* IS + LPIPS side by side */}
        <div className="grid gap-6 sm:grid-cols-2 mt-6">
          {/* IS Radar-style horizontal bars */}
          <motion.div {...fadeIn(0.1)}>
            <Card className="bg-card/60 border border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-base">Per-Class IS ↑</CardTitle>
                <p className="text-xs text-muted-foreground">Higher values indicate sharper, more recognizable outputs.</p>
              </CardHeader>
              <CardContent>
                {isPerClass && isPerClass.length > 0 && (() => {
                  const classes = ["akiec", "bcc", "df", "mel", "vasc"] as const;
                  return (
                    <div className="space-y-5">
                      {isPerClass.map((row) => {
                        const style = getModelStyle(row.model);
                        return (
                          <div key={row.model} className="space-y-2">
                            <p className={`text-xs font-medium ${style.text}`}>{row.model}</p>
                            <div className="space-y-1.5">
                              {classes.map((cls) => {
                                const raw = row[cls];
                                const val = parseFloat(raw);
                                const pct = isNaN(val) ? 0 : Math.min((val / 5) * 100, 100);
                                return (
                                  <div key={cls} className="flex items-center gap-2">
                                    <span className="text-[10px] w-10 text-muted-foreground uppercase tracking-wider">{cls}</span>
                                    <div className="flex-1 h-3 rounded-full bg-white/[0.03] overflow-hidden">
                                      {isNaN(val) ? null : (
                                        <motion.div
                                          className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400/90"
                                          initial={{ width: 0 }}
                                          whileInView={{ width: `${pct}%` }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 0.5, delay: 0.1 }}
                                        />
                                      )}
                                    </div>
                                    <span className="text-xs font-mono text-foreground/70 w-16 text-right">
                                      {isNaN(val) ? "—" : raw}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </motion.div>

          {/* LPIPS Diversity horizontal bars */}
          <motion.div {...fadeIn(0.2)}>
            <Card className="bg-card/60 border border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-base">Per-Class LPIPS Diversity ↑</CardTitle>
                <p className="text-xs text-muted-foreground">Higher values indicate greater perceptual diversity (less mode collapse).</p>
              </CardHeader>
              <CardContent>
                {lpipsPerClass && lpipsPerClass.length > 0 && (() => {
                  const classes = ["akiec", "bcc", "df", "mel", "vasc"] as const;
                  return (
                    <div className="space-y-5">
                      {lpipsPerClass.map((row) => {
                        const style = getModelStyle(row.model);
                        return (
                          <div key={row.model} className="space-y-2">
                            <p className={`text-xs font-medium ${style.text}`}>{row.model}</p>
                            <div className="space-y-1.5">
                              {classes.map((cls) => {
                                const val = parseFloat(row[cls]);
                                const pct = isNaN(val) ? 0 : Math.min((val / 0.7) * 100, 100);
                                return (
                                  <div key={cls} className="flex items-center gap-2">
                                    <span className="text-[10px] w-10 text-muted-foreground uppercase tracking-wider">{cls}</span>
                                    <div className="flex-1 h-3 rounded-full bg-white/[0.03] overflow-hidden">
                                      {isNaN(val) ? null : (
                                        <motion.div
                                          className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/90"
                                          initial={{ width: 0 }}
                                          whileInView={{ width: `${pct}%` }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 0.5, delay: 0.1 }}
                                        />
                                      )}
                                    </div>
                                    <span className="text-xs font-mono text-foreground/70 w-14 text-right">
                                      {isNaN(val) ? "—" : val.toFixed(4)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Overall comparison summary cards */}
        {genOverall && genOverall.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mt-6">
            {genOverall
              .filter((row) => row.fid !== "—")
              .map((row, i) => {
                const style = getModelStyle(row.model);
                const fidVal = parseFloat(row.fid);
                const lpipsVal = parseFloat(row.lpips);
                return (
                  <motion.div key={row.model} {...fadeIn(0.1 * i)}>
                    <Card className={`${style.row} border border-white/10`}>
                      <CardHeader className="pb-2">
                        <CardTitle className={`text-sm ${style.text}`}>{row.model}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground">FID ↓</span>
                          <span className={`text-xl font-mono font-bold ${fidVal < 100 ? "text-emerald-400" : fidVal < 150 ? "text-amber-400" : "text-red-400"}`}>
                            {row.fid}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground">IS ↑</span>
                          <span className="text-lg font-mono text-foreground/80">{row.is}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground">LPIPS ↑</span>
                          <span className={`text-lg font-mono ${lpipsVal > 0.4 ? "text-emerald-400" : "text-amber-400"}`}>
                            {row.lpips}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground">PPL ↓</span>
                          <span className="text-lg font-mono text-foreground/50">{row.ppl}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        )}
      </Section>

      {/* ============================================================ */}
      {/*  SECTION: Generative Quality Charts                          */}
      {/* ============================================================ */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Visualizations"
          title="Generative Quality Analysis"
          description="Visual comparison of FID, IS, and LPIPS diversity across diffusion models and lesion classes."
        />
        <motion.div {...fadeIn(0)}>
          {fidPerClass && isPerClass && lpipsPerClass && genOverall && (
            <ResultsGenCharts
              fidPerClass={fidPerClass}
              isPerClass={isPerClass}
              lpipsPerClass={lpipsPerClass}
              genOverall={genOverall}
            />
          )}
        </motion.div>
      </Section>

      {/* Expected Performance */}
      {/* <Section className="border-t border-border/40">
        <SectionHeader
          badge="Estimates"
          title="Per-Class Performance"
          description="Rarest classes are expected to show the largest gains from diffusion augmentation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expectedPerformance.map((row, i) => (
            <motion.div
              key={row.cls}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="bg-card/50 border-border/50 hover:border-foreground/10 transition-colors h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-bold text-foreground/70">
                      {row.cls}
                    </code>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    >
                      {row.gain}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-medium">
                    {row.clsFull}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        No Augmentation
                      </p>
                      <p className="font-mono text-red-400">{row.noAug}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        &rarr;
                      </p>
                      <p className="text-muted-foreground text-lg">&rarr;</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">
                        Diffusion Aug.
                      </p>
                      <p className="font-mono text-emerald-400">
                        {row.diffusion}
                      </p>
                    </div>
                  </div>
                  {row.note && (
                    <p className="mt-3 text-xs text-muted-foreground italic">
                      {row.note}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section> */}

      {/* Key Insight */}
      <Section className="border-t border-border/40">
        <motion.div {...fadeIn(0)}>
          <Card className="bg-foreground/5 border-foreground/10">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-foreground/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Insight</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Overall accuracy may not improve dramatically because nv (67%
                    of data) dominates the metric. The real story is in{" "}
                    <strong className="text-foreground">
                      per-class recall for minority classes
                    </strong>{" "}
                    — that&apos;s where diffusion augmentation makes the biggest
                    impact and where clinical value lies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Section>

      {/* Augmentation Ratio Experiment */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Ablation Study"
          title="Augmentation Ratio Experiment"
          description="Testing three generation ratios (1x, 2x, 5x) to find the optimal augmentation level."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              ratio: "1x",
              description: "Match original minority class size",
              tradeoff: "Minimal augmentation — may be insufficient to meaningfully impact classifier performance",
            },
            {
              ratio: "2x",
              description: "Double the original minority class size",
              tradeoff: "Moderate augmentation — likely sweet spot balancing diversity gain vs. synthetic noise",
            },
            {
              ratio: "5x",
              description: "Quintuple the original minority class size",
              tradeoff: "Aggressive augmentation — risk of synthetic noise degrading real signal quality",
            },
          ].map((r, i) => (
            <motion.div
              key={r.ratio}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="bg-card/50 border-border/50 h-full">
                <CardHeader>
                  <span className="text-3xl font-bold text-foreground/70">
                    {r.ratio}
                  </span>
                  <CardTitle className="text-sm">{r.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {r.tradeoff}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="mt-6 text-sm text-muted-foreground"
          {...fadeIn(0.3)}
        >
          This systematic ablation study answers:{" "}
          <em>&quot;How much synthetic data is optimal?&quot;</em> Too few
          synthetic images means insufficient impact. Too many means synthetic
          noise degrades quality.
        </motion.p>
      </Section>
    </>
  );
}