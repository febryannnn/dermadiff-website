import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/section";
import { Separator } from "@/components/ui/separator";

const teamMembers = [
  {
    id: "A",
    role: "Classifier Lead",
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dotColor: "bg-violet-400",
    weeks: [
      {
        label: "Week 1 (Days 1-5)",
        tasks: [
          "Download HAM10000 + ISIC 2019 via Kaggle API",
          "Explore class distribution, verify image quality",
          "Create stratified train/val/test split (grouped by lesion_id)",
          "Set up PanDerm: clone repo, download weights, verify loading",
          "Train Experiment A: baseline classifier (no augmentation)",
        ],
      },
      {
        label: "Week 2 (Days 6-10)",
        tasks: [
          "Evaluate Experiment A: per-class accuracy, recall, F1, confusion matrix",
          "Train Experiment B: traditional augmentation (rotation, flip, color jitter)",
          "Evaluate Experiment B with same metrics",
          "Document baseline vs traditional comparison",
        ],
      },
      {
        label: "Week 3 (Days 11-15)",
        tasks: [
          "Receive synthetic images from Person B",
          "Train Experiment C: real + diffusion-generated images",
          "Run augmentation ratio experiments (1x, 2x, 5x)",
          "Evaluate all three experiments, create comparison tables",
        ],
      },
      {
        label: "Week 4 (Days 16-20)",
        tasks: [
          "Write results section of report",
          "Create visualizations (confusion matrices, per-class bar charts)",
          "Help with final presentation",
        ],
      },
    ],
  },
  {
    id: "B",
    role: "Diffusion & Generation Lead",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dotColor: "bg-orange-400",
    weeks: [
      {
        label: "Week 1 (Days 1-5)",
        tasks: [
          "Set up Stable Diffusion 2.0 pipeline in Colab (HuggingFace diffusers)",
          "Configure LoRA fine-tuning (rank 4-8, DDIM scheduler)",
          'Design text prompts: "a dermoscopic lesion photo of {class_name}"',
          "Begin SD 2.0 LoRA fine-tuning on HAM10000 + ISIC 2019",
        ],
      },
      {
        label: "Week 2 (Days 6-10)",
        tasks: [
          "Complete diffusion fine-tuning, verify generation quality",
          "Tune hyperparameters: guidance scale, inference steps, LoRA rank",
          "Compute FID per class, SSIM against real images",
          "Generate synthetic images at 1x, 2x, 5x ratios for all minority classes",
          "Quality filter: remove low-quality outputs",
        ],
      },
      {
        label: "Week 3 (Days 11-15)",
        tasks: [
          "Deliver synthetic image batches to Person A for classifier training",
          "Generate additional batches if needed based on initial results",
          "Create visual comparison grids (real vs synthetic per class)",
          "Document generation quality metrics",
        ],
      },
      {
        label: "Week 4 (Days 16-20)",
        tasks: [
          "Write methodology section of report (diffusion fine-tuning details)",
          "Create generation quality figures for presentation",
          "Build demo notebook: generate new images on demand",
        ],
      },
    ],
  },
  {
    id: "C",
    role: "Evaluation & Report Lead",
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    dotColor: "bg-teal-400",
    weeks: [
      {
        label: "Week 1 (Days 1-5)",
        tasks: [
          "Literature review: gather related work papers (SkinDualGen, LesionGen, etc.)",
          "Build evaluation framework: metrics computation scripts",
          "Implement 3-level risk mapping (7-class → low/suspicious/malignant)",
          "Set up experiment logging (Weights & Biases or TensorBoard)",
        ],
      },
      {
        label: "Week 2 (Days 6-10)",
        tasks: [
          "Run evaluation on Experiment A results from Person A",
          "Run evaluation on Experiment B results from Person A",
          "Quality-check synthetic images from Person B (FID, visual inspection)",
          "Implement confusion matrix visualization and per-class bar charts",
        ],
      },
      {
        label: "Week 3 (Days 11-15)",
        tasks: [
          "Run evaluation on Experiment C (all augmentation ratios)",
          "Create three-way comparison tables and visualizations",
          "Statistical significance tests (paired t-test on per-class metrics)",
          "Ablation study analysis: optimal augmentation ratio",
        ],
      },
      {
        label: "Week 4 (Days 16-20)",
        tasks: [
          "Write introduction, related work, and evaluation sections",
          "Compile final report (combine all sections)",
          "Create and rehearse presentation slides",
          "Final proofreading and submission",
        ],
      },
    ],
  },
];

const timelineSummary = [
  {
    week: 1,
    days: "1-5",
    a: "Data prep + baseline classifier (Exp A)",
    b: "SD 2.0 setup + begin LoRA fine-tune",
    c: "Lit review + eval framework",
  },
  {
    week: 2,
    days: "6-10",
    a: "Eval Exp A + train Exp B (trad. aug)",
    b: "Complete fine-tune + generate synthetic",
    c: "Eval Exp A&B + quality check synth.",
  },
  {
    week: 3,
    days: "11-15",
    a: "Train Exp C (1x, 2x, 5x ratios)",
    b: "Support generation + visual grids",
    c: "Eval Exp C + three-way comparison",
  },
  {
    week: 4,
    days: "16-20",
    a: "Results section + figures",
    b: "Methods section + demo notebook",
    c: "Report compilation + presentation",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Badge variant="secondary" className="mb-4 text-xs">
            Section 5 & 6
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Team & Timeline
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            3-person team, 20 days. All three tracks run in parallel during
            Weeks 1-2, then converge in Week 3 for integration and comparison.
          </p>
        </div>
      </section>

      {/* Notion Board Screenshots + Link */}
      <Section>
        <SectionHeader
          badge="Project Board"
          title="Task Tracker"
          description="Track our progress on the live Notion board."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {["/notion/notion-1.png", "/notion/notion-2.png", "/notion/notion-3.png"].map((src, i) => (
            <div key={i} className="rounded-xl border border-border/50 overflow-hidden bg-card/50">
              <Image
                src={src}
                alt={`Notion board screenshot ${i + 1}`}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
        <a
          href="https://little-keyboard-07a.notion.site/325b3c5d8b7d803db22cdc67ceac5518?v=325b3c5d8b7d8176850e000c78c96a75"
          target="_blank"
          rel="noopener noreferrer"
          className="group block mt-4"
        >
          <Card className="bg-card/50 border-border/50 transition-all hover:border-foreground/20 hover:bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5">
                    <svg className="h-6 w-6 text-foreground/60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 18 22H6.5A2.5 2.5 0 0 1 4 19.5v-15ZM6.5 4a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5H18a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H6.5ZM8 7h8v2H8V7Zm0 4h5v2H8v-2Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-lg group-hover:text-foreground transition-colors">
                      Open Notion Board
                    </p>
                    <p className="text-sm text-muted-foreground">
                      View the full task tracker, assignments, and progress
                    </p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </a>
      </Section>

      {/* Team Photos */}
      <Section>
        <SectionHeader
          badge="Our Team"
          title="Kenalan Dulu"
          description="The people behind DermaDiff."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { id: "A", name: "Farel Febryan", role: "5025241137", src: "/team/farel.jpg", color: "border-violet-500/40" },
            { id: "B", name: "Jason Kumarkono", role: "5025241105", src: "/team/jason.jpg", color: "border-orange-500/40" },
            { id: "C", name: "M. Ilyas Rusdi", role: "Evaluation & Report Lead", src: "/team/ilyas.png", color: "border-teal-500/40" },
          ].map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center">
              <div className={`rounded-2xl border-2 ${member.color} overflow-hidden mb-4`}>
                <Image
                  src={member.src}
                  alt={member.name}
                  width={400}
                  height={500}
                  className="aspect-[4/5] object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline Summary */}
      <Section>
        <SectionHeader
          badge="Overview"
          title="Timeline Summary"
          description="Week-by-week timeline with parallel task assignments across all three team members."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {timelineSummary.map((w) => (
            <Card key={w.week} className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-foreground/70 text-sm font-bold">
                    {w.week}
                  </div>
                  <div>
                    <CardTitle className="text-sm">Week {w.week}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Days {w.days}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="h-2 w-2 rounded-full bg-violet-400" />
                    <span className="font-medium text-violet-400">Person A</span>
                  </div>
                  <p className="text-muted-foreground pl-3.5">{w.a}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="h-2 w-2 rounded-full bg-orange-400" />
                    <span className="font-medium text-orange-400">Person B</span>
                  </div>
                  <p className="text-muted-foreground pl-3.5">{w.b}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="h-2 w-2 rounded-full bg-teal-400" />
                    <span className="font-medium text-teal-400">Person C</span>
                  </div>
                  <p className="text-muted-foreground pl-3.5">{w.c}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>



      {/* Key Dependency */}
      <Section className="border-t border-border/40 py-8 sm:py-12">
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-amber-400">
                  Key Dependency
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Person B must deliver synthetic images to Person A by{" "}
                  <strong className="text-foreground">Day 10</strong> so
                  Experiment C can begin in Week 3. If diffusion fine-tuning
                  takes longer, Person A continues with augmentation ratio
                  experiments using whatever synthetic images are available, and
                  Person B delivers additional batches incrementally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Detailed Breakdown */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Detailed Breakdown"
          title="Per-Person Task Schedule"
        />
        <div className="space-y-8">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-card/50 border-border/50 overflow-hidden"
            >
              <CardHeader className="border-b border-border/30">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={member.color}>
                    Person {member.id}
                  </Badge>
                  <CardTitle className="text-lg">{member.role}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {member.weeks.map((week, i) => (
                    <div key={week.label}>
                      {i > 0 && <Separator className="mb-6" />}
                      <h4 className="text-sm font-semibold mb-3">
                        {week.label}
                      </h4>
                      <ul className="space-y-2">
                        {week.tasks.map((task, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground"
                          >
                            <div
                              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${member.dotColor}`}
                            />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
