import {
  Card,
  CardContent,
  CardDescription,
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
import { PipelineAugmentation } from "@/components/pipeline-augmentation";
import { PipelineFull } from "@/components/pipeline-full";
import { SDModelArchitectures } from "@/components/pipeline-sd-models";

const experiments = [
  {
    id: "A",
    name: "No Augmentation",
    data: "Real HAM10000 images only (10,015 images)",
    purpose: "Lower bound baseline — raw imbalanced data",
    color: "bg-red-500/15 text-red-400 border-red-400/40",
  },
  {
    id: "B",
    name: "Stable Diffusion 2.1",
    data: "Real image + Stable Diffusion 2.1 LoRA-generated synthetic images for minority classes",
    purpose: "First diffusion variant — classic architecture",
    color: "bg-pink-500/15 text-pink-400 border-pink-400/40",
  },
  {
    id: "C",
    name: "Stable Diffusion XL",
    data: "Real image + Stable Diffusion XL LoRA-generated synthetic images for minority classes",
    purpose: "Larger model — does scale improve generation quality?",
    color: "bg-violet-500/15 text-violet-400 border-violet-400/40",
  },
  {
    id: "D",
    name: "Stable Diffusion 3.5 Large",
    data: "Real image + Stable Diffusion 3.5 LoRA-generated synthetic images for minority classes",
    purpose: "Latest architecture — flow matching vs diffusion",
    color: "bg-cyan-500/15 text-cyan-400 border-cyan-400/40",
  },
];

const pipelineSteps = [
  {
    step: 1,
    what: "Baseline classifier (Exp A)",
    model: "PanDerm ViT",
    output: "Baseline metrics",
    time: "~3 hrs",
  },
  {
    step: 2,
    what: "Fine-tune diffusion model",
    model: "Stable Diffusion (SD 2.1, SDXL, and SD 3.5 Large)",
    output: "Skin-adapted Stable Diffusion model",
    time: "~1-2 days",
  },
  {
    step: 3,
    what: "Generate synthetic minority images",
    model: "Fine-tuned Stable Diffusion Model",
    output: "~10-15K synthetic images",
    time: "~3 hrs",
  },
  {
    step: 4,
    what: "Diffusion aug classifier (Exp B, C, and D)",
    model: "PanDerm + LoRA",
    output: "Diffusion aug. metrics",
    time: "~4 hrs",
  },
];

const generationStrategy = [
  { cls: "nv", real: 6705, imb: "1.0x", s1: 0, s2: 0, s5: 0, risk: "Low" },
  { cls: "mel", real: 1113, imb: "6.0x", s1: 1113, s2: 2226, s5: 5565, risk: "Mal." },
  { cls: "bkl", real: 1099, imb: "6.1x", s1: 1099, s2: 2198, s5: 5495, risk: "Low" },
  { cls: "bcc", real: 514, imb: "13.0x", s1: 514, s2: 1028, s5: 2570, risk: "Mal." },
  { cls: "akiec", real: 327, imb: "20.5x", s1: 327, s2: 654, s5: 1635, risk: "Susp." },
  { cls: "vasc", real: 142, imb: "47.2x", s1: 142, s2: 284, s5: 710, risk: "Low" },
  { cls: "df", real: 115, imb: "58.3x", s1: 115, s2: 230, s5: 575, risk: "Low" },
];

function riskBadge(risk: string) {
  const colors: Record<string, string> = {
    "Low": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Mal.": "bg-red-500/10 text-red-400 border-red-500/20",
    "Susp.": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return colors[risk] || "";
}

export default function MethodologyPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Badge variant="secondary" className="mb-4 text-xs">
            Section 3
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Methodology
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A rigorous four-way experimental design combining latent diffusion
            generation with vision foundation model classification.
          </p>
        </div>
      </section>

      {/* Three-Way Experimental Design */}
      <Section>
        <SectionHeader
          badge="Experimental Design"
          title="Four-Way Experiments"
          description="The core innovation is a three-way comparison that isolates the contribution of diffusion-based augmentation. All three experiments use the exact same PanDerm LoRA configuration, train/val/test split, and evaluation metrics — only the training data differs."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {experiments.map((exp) => (
            <Card
              key={exp.id}
              className="bg-card/50 border-border/50 hover:border-foreground/10 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={exp.color + " text-xs"}>
                    Exp {exp.id}
                  </Badge>
                  <CardTitle className="text-base">{exp.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Training Data
                  </p>
                  <p className="text-sm">{exp.data}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Purpose
                  </p>
                  <CardDescription className="text-sm">
                    {exp.purpose}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Augmentation Concept Diagram */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Concept"
          title="Targeted Augmentation Pipeline"
          description="Rare minority classes are fed into a generative model to produce synthetic images. These are combined with real majority class data to create a balanced augmented dataset for training the classifier."
        />
        <Card className="bg-card/30 border-border/50 overflow-hidden">
          <CardContent className="pt-6">
            <PipelineAugmentation />
          </CardContent>
        </Card>
      </Section>

      {/* Full Pipeline Diagram */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Full Architecture"
          title="End-to-End Pipeline"
          description="Three datasets are processed through three Stable Diffusion variants with LoRA fine-tuning. Synthetic datasets are combined with real data and fed into PanDerm ViT for classification and evaluation."
        />
        <Card className="bg-card/30 border-border/50 overflow-hidden">
          <CardContent className="pt-6">
            <PipelineFull />
          </CardContent>
        </Card>
      </Section>

      {/* SD Model Architectures */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Model Architectures"
          title="Diffusion Model Comparison"
          description="Click each model to explore its architecture pipeline. Each generation represents a significant evolution in text-to-image synthesis."
        />
        <SDModelArchitectures />
      </Section>

      {/* Pipeline Steps */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Pipeline Steps"
          title="4-Step Pipeline Overview"
          description="Sequential pipeline from baseline training through diffusion augmentation, with estimated compute times on A100 GPU."
        />
        <div className="space-y-4">
          {pipelineSteps.map((s) => (
            <div
              key={s.step}
              className="group flex items-start gap-4 rounded-lg border border-border/50 bg-card/30 p-5 hover:bg-card/60 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/70 font-bold text-sm">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{s.what}</h3>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    <strong className="text-foreground/80">Model:</strong>{" "}
                    {s.model}
                  </span>
                  <span>
                    <strong className="text-foreground/80">Output:</strong>{" "}
                    {s.output}
                  </span>
                  <span>
                    <strong className="text-foreground/80">Time:</strong>{" "}
                    {s.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Generation Strategy */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Generation"
          title="Synthetic Generation Strategy"
          description="Generation plan at 1x, 2x, and 5x ratios. The majority class (nv) receives no augmentation — synthetic images are generated only for underrepresented classes."
        />
        <Card className="bg-card/50 border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold">Class</TableHead>
                  <TableHead className="text-right font-semibold">Real</TableHead>
                  <TableHead className="text-right font-semibold">Imbalance</TableHead>
                  <TableHead className="text-right font-semibold">Synth 1x</TableHead>
                  <TableHead className="text-right font-semibold">Synth 2x</TableHead>
                  <TableHead className="text-right font-semibold">Synth 5x</TableHead>
                  <TableHead className="text-center font-semibold">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generationStrategy.map((row) => (
                  <TableRow key={row.cls} className="border-border/30">
                    <TableCell>
                      <code className="text-sm font-bold text-foreground/80">
                        {row.cls}
                      </code>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.real.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {row.imb}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.s1.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.s2.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.s5.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={riskBadge(row.risk)}
                      >
                        {row.risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </Section>

      {/* Technical Details */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Technical Details"
          title="Key Technical Decisions"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Generation Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Stable Diffusion 2.0</strong>{" "}
                with LoRA fine-tuning (rank 4-8)
              </p>
              <p>DDIM scheduler for deterministic generation</p>
              <p>
                Text prompts:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  &quot;a dermoscopic lesion photo of &#123;class_name&#125;&quot;
                </code>
              </p>
              <p>Quality metrics: FID per class, SSIM against real images</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Classification Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">PanDerm ViT-Large</strong>{" "}
                (Nature Medicine 2025)
              </p>
              <p>State-of-the-art dermatology foundation model</p>
              <p>Fine-tuned with LoRA on HAM10000 + synthetic data</p>
              <p>
                Prior work used weaker CNN backbones (ResNet-34, DenseNet-121)
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
