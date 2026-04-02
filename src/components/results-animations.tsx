"use client";

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
  recallData: {
    model: string;
    akiec: string;
    bcc: string;
    bkl: string;
    df: string;
    mel: string;
    nv: string;
    vasc: string;
  }[];
  f1Data: {
    model: string;
    akiec: string;
    bcc: string;
    bkl: string;
    df: string;
    mel: string;
    nv: string;
    vasc: string;
  }[];
  expectedPerformance: {
    cls: string;
    clsFull: string;
    noAug: string;
    diffusion: string;
    gain: string;
    note: string;
  }[];
}

export function AnimatedResultsPage({
  avgData,
  recallData,
  f1Data,
  expectedPerformance,
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
            Expected Results & Evaluation
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

      {/* Primary Result Table */}
      <Section className="space-y-15">
        <SectionHeader
          badge="Primary Result"
          title="Three-Way Comparison Table"
          description="The central result of this project. We expect the largest gains for the rarest classes (df, vasc, akiec) and clinically critical classes (mel, bcc)."
        />

        {/* PER-CLASS RECALL */}
        <motion.div {...fadeIn(0)}>
          <Card className="bg-card/60 border border-white/10 mt-6">
            <CardHeader>
              <CardTitle>Per-Class Recall</CardTitle>
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
                  {recallData.map((row) => {
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

        {/* PER-CLASS F1 */}
        <motion.div {...fadeIn(0.1)}>
          <Card className="bg-card/60 border border-white/10 mt-10">
            <CardHeader>
              <CardTitle>Per-Class F1 Score</CardTitle>
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
                  {f1Data.map((row) => {
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

      {/* Expected Performance */}
      <Section className="border-t border-border/40">
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
      </Section>

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
