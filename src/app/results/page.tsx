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

const avgData = [
  {
    model: "Exp A (Baseline)",
    macroRecall: "0.7955",
    weightedRecall: "0.8756",
    macroF1: "0.8114",
    weightedF1: "0.8785",
    macroPrecision: "-",
    weightedPrecision: "-",
    accuracy: "-",
  },
  {
    model: "Exp C2 (SD 2.1)",
    macroRecall: "0.8166",
    weightedRecall: "0.8729",
    macroF1: "0.8218",
    weightedF1: "0.8786",
    macroPrecision: "-",
    weightedPrecision: "-",
    accuracy: "-",
  },
  {
    model: "Exp C3 (SDXL)",
    macroRecall: "0.8311",
    weightedRecall: "0.8842",
    macroF1: "0.8409",
    weightedF1: "0.8891",
    macroPrecision: "-",
    weightedPrecision: "-",
    accuracy: "-",
  },
];



const comparisonMetrics = [
  { metric: "7-class accuracy", a: "—", b: "—", c: "—", cva: "—", cvb: "—" },
  { metric: "Weighted F1", a: "0.8785", b: "0.8786", c: "0.8891", cva: "+1.2%", cvb: "+1.2%" },
  { metric: "mel recall", a: "0.7126", b: "0.7964", c: "0.7904", cva: "+10.9%", cvb: "-0.75%" },
  { metric: "bcc recall", a: "0.9091", b: "0.9351", c: "0.8701", cva: "-4.29%", cvb: "-6.96%" },
  { metric: "akiec recall", a: "0.7347", b: "0.7959", c: "0.8367", cva: "+13.89%", cvb: "+5.13%" },
  { metric: "df recall", a: "0.5882", b: "0.5882", c: "0.7059", cva: "+20.0%", cvb: "+20.0%" },
  { metric: "vasc recall", a: "0.8636", b: "0.8636", c: "0.8636", cva: "0%", cvb: "0%" },
  { metric: "3-level risk acc.", a: "—", b: "—", c: "—", cva: "—", cvb: "—" },
  { metric: "FID (gen. quality)", a: "N/A", b: "—", c: "—", cva: "", cvb: "" },
];

const recallData = [
  { model: "Exp A (Baseline)", akiec: "0.7347", bcc: "0.9091", bkl: "0.8424", df: "0.5882", mel: "0.7126", nv: "0.9175", vasc: "0.8636" },
  { model: "Exp C2 (SD 2.1)", akiec: "0.7959", bcc: "0.9351", bkl: "0.8424", df: "0.5882", mel: "0.7964", nv: "0.8946", vasc: "0.8636" },
  { model: "Exp C3 (SDXL)", akiec: "0.8367", bcc: "0.8701", bkl: "0.8364", df: "0.7059", mel: "0.7904", nv: "0.9145", vasc: "0.8636" },
];

const f1Data = [
  { model: "Exp A (Baseline)", akiec: "0.8000", bcc: "0.8589", bkl: "0.7493", df: "0.7407", mel: "0.6879", nv: "0.9385", vasc: "0.9048" },
  { model: "Exp C2 (SD 2.1)", akiec: "0.8125", bcc: "0.8944", bkl: "0.7989", df: "0.7407", mel: "0.6717", nv: "0.9298", vasc: "0.9048" },
  { model: "Exp C3 (SDXL)", akiec: "0.8454", bcc: "0.8816", bkl: "0.8142", df: "0.8000", mel: "0.6787", nv: "0.9397", vasc: "0.9268" },
];


const expectedPerformance = [
  { cls: "nv", clsFull: "Melanocytic Nevi", noAug: "95-98%", diffusion: "95-98%", gain: "~0%", note: "Already high" },
  { cls: "mel", clsFull: "Melanoma", noAug: "80-85%", diffusion: "85-90%", gain: "+5%", note: "" },
  { cls: "bcc", clsFull: "Basal Cell Carcinoma", noAug: "75-82%", diffusion: "80-88%", gain: "+6%", note: "" },
  { cls: "akiec", clsFull: "Actinic Keratosis", noAug: "60-72%", diffusion: "70-80%", gain: "+8-10%", note: "Largest expected gain" },
  { cls: "vasc", clsFull: "Vascular Lesions", noAug: "70-80%", diffusion: "78-86%", gain: "+6-8%", note: "" },
  { cls: "df", clsFull: "Dermatofibroma", noAug: "55-70%", diffusion: "65-78%", gain: "+8-12%", note: "Most underrepresented" },
];

const getModelColor = (model: string) => {
  if (model.includes("Baseline")) return "text-red-400";
  if (model.includes("SD 2.1")) return "text-amber-400";
  if (model.includes("SDXL")) return "text-emerald-400";
  return "text-white";
};

const getModelStyle = (model: string) => {
  if (model.includes("Baseline")) {
    return {
      text: "text-red-400",
      row: "bg-red-500/5",
    };
  }
  if (model.includes("SD 2.1")) {
    return {
      text: "text-amber-400",
      row: "bg-amber-500/5",
    };
  }
  if (model.includes("SDXL")) {
    return {
      text: "text-emerald-400",
      row: "bg-emerald-500/5",
    };
  }
  return {
    text: "text-white",
    row: "",
  };
};

export default function ResultsPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Badge variant="secondary" className="mb-4 text-xs">
            Section 4
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Expected Results & Evaluation
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Three-way comparison measuring the specific contribution of diffusion
            augmentation beyond both baselines.
          </p>
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

        {/* PER-CLASS F1 */}
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

        {/* AVERAGE */}
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

        <p className="text-xs text-white/60 text-center mt-6">
          Table 4: Three-way comparison results. A = Baseline, B = SD 2.1, C = SDXL.
        </p>
      </Section>

      {/* Expected Performance */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Estimates"
          title="Per-Class Performance"
          description="Rarest classes are expected to show the largest gains from diffusion augmentation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expectedPerformance.map((row) => (
            <Card
              key={row.cls}
              className="bg-card/50 border-border/50 hover:border-foreground/10 transition-colors"
            >
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
          ))}
        </div>
      </Section>

      {/* Key Insight */}
      <Section className="border-t border-border/40">
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
          ].map((r) => (
            <Card
              key={r.ratio}
              className="bg-card/50 border-border/50"
            >
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
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          This systematic ablation study answers:{" "}
          <em>&quot;How much synthetic data is optimal?&quot;</em> Too few
          synthetic images means insufficient impact. Too many means synthetic
          noise degrades quality.
        </p>
      </Section>
    </>
  );
}
