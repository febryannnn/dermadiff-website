import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/section";
import Image from "next/image";

const references = [
  {
    id: 1,
    authors: "Yan, S. et al.",
    title: "A multimodal vision foundation model for clinical dermatology.",
    venue: "Nature Medicine",
    year: 2025,
    tag: "Classification",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 2,
    authors: "SkinDualGen",
    title: "Prompt-Driven Diffusion for Simultaneous Image-Mask Generation in Skin Lesions.",
    venue: "arXiv:2507.19970",
    year: 2025,
    tag: "Generation",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 3,
    authors: "Fayyad, J. et al.",
    title: "LesionGen: A Concept-Guided Diffusion Model for Dermatology Image Synthesis.",
    venue: "MICCAI",
    year: 2025,
    tag: "Generation",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 4,
    authors: "Kim, M. et al.",
    title: "Diffusion-based skin disease data augmentation with fine-grained detail preservation.",
    venue: "PLOS One",
    year: 2025,
    tag: "Augmentation",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 5,
    authors: "Frid-Adar, M. et al.",
    title: "GAN-based synthetic medical image augmentation.",
    venue: "Neurocomputing 321",
    year: 2018,
    tag: "Augmentation",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 6,
    authors: "Tschandl, P. et al.",
    title: "The HAM10000 dataset.",
    venue: "Scientific Data 5: 180161",
    year: 2018,
    tag: "Dataset",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 7,
    authors: "Rombach, R. et al.",
    title: "High-Resolution Image Synthesis with Latent Diffusion Models.",
    venue: "CVPR",
    year: 2022,
    tag: "Diffusion",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 8,
    authors: "Hu, E. et al.",
    title: "LoRA: Low-Rank Adaptation of Large Language Models.",
    venue: "ICLR",
    year: 2022,
    tag: "LoRA",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 9,
    authors: "Codella, N. et al.",
    title: "Skin Lesion Analysis Toward Melanoma Detection 2018.",
    venue: "arXiv:1902.03368",
    year: 2019,
    tag: "Dataset",
    thumbnail: "/papers/panderm.png",
  },
  {
    id: 10,
    authors: "Hernandez-Perez, C. et al.",
    title: "BCN20000: Dermoscopic Lesions in the Wild.",
    venue: "Scientific Data 11: 641",
    year: 2024,
    tag: "Dataset",
    thumbnail: "/papers/panderm.png",
  },
];

function tagColor(tag: string) {
  const colors: Record<string, string> = {
    Classification: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Generation: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Augmentation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Dataset: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    Diffusion: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    LoRA: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return colors[tag] || "";
}

export default function ReferencesPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Badge variant="secondary" className="mb-4 text-xs">
            Section 7
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Key References
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Foundational papers spanning diffusion models, dermatology AI,
            datasets, and augmentation techniques.
          </p>
        </div>
      </section>

      {/* References */}
      <Section>
        <SectionHeader
          badge="Literature"
          title="10 Key Papers"
        />
        <div className="space-y-3">
          {references.map((ref) => (
            <Card
              key={ref.id}
              className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors"
            >
              <CardContent className="flex items-center gap-4 py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {ref.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">
                    {ref.authors}{" "}
                    <span className="text-muted-foreground">
                      &ldquo;{ref.title}&rdquo;
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {ref.venue} ({ref.year})
                    </span>
                    <Badge variant="outline" className={tagColor(ref.tag)}>
                      {ref.tag}
                    </Badge>
                  </div>
                </div>

                {/* Paper thumbnail — landscape, right side */}
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/30">
                  <Image
                    src={ref.thumbnail}
                    alt={`${ref.authors} paper`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
