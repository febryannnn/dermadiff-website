"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/section";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const generators = [
    {
        id: "sd21",
        experiment: "Experiment C2",
        title: "Stable Diffusion 2.1",
        subtitle: "UNet Architecture · 865M Parameters",
        description:
            "The smallest diffusion generator in our comparison. SD 2.1 uses a single CLIP text encoder with a UNet backbone. Despite its compact size, LoRA fine-tuning produces synthetic dermoscopic images that improve classifier Macro F1 by +1.04% over baseline.",
        tags: ["UNet (865M)", "1× CLIP", "512×512", "LoRA Rank 16"],
        accent: "from-blue-500/15 to-blue-900/0",
        borderAccent: "hover:border-blue-500/25",
        badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        tagColor: "border-blue-500/20 text-blue-400/60",
        url: "#",
        status: "Live",
        macroF1: "0.8218",
        delta: "+1.04%",
    },
    {
        id: "sdxl",
        experiment: "Experiment C3",
        title: "Stable Diffusion XL",
        subtitle: "UNet Architecture · 2.6B Parameters",
        description:
            "SDXL doubles the UNet capacity and adds a second CLIP text encoder for richer prompt understanding. Achieves the best akiec recall (0.837) across all experiments — outperforming even SD 3.5 Large on this challenging class.",
        tags: ["UNet (2.6B)", "2× CLIP", "512×512", "LoRA Rank 16"],
        accent: "from-amber-500/15 to-amber-900/0",
        borderAccent: "hover:border-amber-500/25",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        tagColor: "border-amber-500/20 text-amber-400/60",
        url: "https://jasonkmrkn--dermadiff-sdxl-generator-web-ui.modal.run",
        status: "Live",
        macroF1: "0.8409",
        delta: "+2.95%",
        featured: true,
    },
    {
        id: "sd35",
        experiment: "Experiment C4",
        title: "SD 3.5 Large",
        subtitle: "MMDiT Architecture · 8.1B Parameters",
        description:
            "The most powerful generator — SD 3.5 replaces the UNet with a Multimodal Diffusion Transformer (MMDiT) and adds T5-XXL for deep text understanding. Achieves the highest overall Macro F1 and best melanoma recall (0.820).",
        tags: ["MMDiT (8.1B)", "2× CLIP + T5-XXL", "1024×1024", "LoRA Rank 64"],
        accent: "from-emerald-500/15 to-emerald-900/0",
        borderAccent: "hover:border-emerald-500/25",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        tagColor: "border-emerald-500/20 text-emerald-400/60",
        url: "#",
        status: "Live",
        macroF1: "0.8482",
        delta: "+3.67%",
    },
];

const classifiers = [
    {
        id: "panderm-baseline",
        title: "PanDerm Classifier",
        subtitle: "No Augmentation · Experiment A",
        description:
            "PanDerm ViT-Large trained on the original HAM10000 dataset without any synthetic augmentation. Serves as the control benchmark.",
        tags: ["PanDerm ViT-L", "303M Params", "HAM10000"],
        accent: "from-rose-900/40 to-black/0",
        borderAccent: "hover:border-rose-900/50",
        badgeClass: "bg-rose-900/30 text-rose-300 border-rose-900/40",
        tagColor: "border-rose-900/40 text-rose-300/70",
        url: "#",
        status: "Live",
        macroF1: "0.8114",
        delta: "—",
    }
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.55, ease: "easeOut" as const },
    }),
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

function ModelCard({
    model,
    i,
    ctaLabel,
    spotlightFeatured,
}: {
    model: (typeof generators)[0] | (typeof classifiers)[0];
    i: number;
    ctaLabel: string;
    spotlightFeatured: `rgba(${number}, ${number}, ${number}, ${number})`;
}) {
    const isFeatured = "featured" in model && model.featured;
    return (
        <motion.div key={model.id} custom={i} variants={fadeUp}>
            <SpotlightCard
                className={`relative h-full !bg-card/50 !border-border/50 ${model.borderAccent} transition-colors duration-300 group`}
                spotlightColor={
                    isFeatured ? spotlightFeatured : "rgba(255, 255, 255, 0.04)"
                }
            >
                <div
                    className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${model.accent} rounded-t-[inherit] pointer-events-none`}
                />

                <div className="relative flex flex-col h-full p-1">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50">
                                {"experiment" in model
                                    ? model.experiment
                                    : model.subtitle}
                            </span>
                            <Badge variant="outline" className={model.badgeClass}>
                                {model.status}
                            </Badge>
                        </div>

                        <h3 className="text-xl font-bold tracking-tight">
                            {model.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/70 mt-0.5">
                            {model.subtitle}
                        </p>
                    </div>

                    {/* Metrics row */}
                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 rounded-lg border border-border/30 bg-muted/5 px-3 py-2 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-0.5">
                                Macro F1
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                                {model.macroF1}
                            </div>
                        </div>
                        <div className="flex-1 rounded-lg border border-border/30 bg-muted/5 px-3 py-2 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-0.5">
                                Δ Baseline
                            </div>
                            <div
                                className={`text-sm font-bold tabular-nums ${model.delta !== "—"
                                    ? "text-emerald-400"
                                    : "text-muted-foreground/50"
                                    }`}
                            >
                                {model.delta}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                        {model.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {model.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border bg-muted/10 ${model.tagColor}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <a
                        href={model.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                            variant: isFeatured ? "default" : "default",
                            className:
                                "w-full rounded-full group-hover:shadow-sm transition-shadow",
                        })}
                    >
                        <span>{ctaLabel}</span>
                        <svg
                            className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 17L17 7M17 7H7M17 7v10"
                            />
                        </svg>
                    </a>
                </div>
            </SpotlightCard>
        </motion.div>
    );
}

export default function ModelPageClient() {
    return (
        <>
            {/* Hero */}
            <section className="relative border-b border-border/40 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-foreground/[0.02] to-transparent blur-3xl pointer-events-none" />

                <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge
                                variant="secondary"
                                className="mb-8 text-xs tracking-wider uppercase"
                            >
                                Model Deployment
                            </Badge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                        >
                            Try Our Models
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                            className="mt-6 text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl mx-auto"
                        >
                            Three diffusion generators and three augmented classifiers —
                            from the compact SD 2.1 to the powerful SD 3.5 Large MMDiT.
                            Generate synthetic dermoscopic images or classify skin
                            lesions in real-time.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* ───────── Diffusion Generators ───────── */}
            <Section>
                <SectionHeader
                    badge="Generators"
                    title="Diffusion Models"
                    description="Live deployments of our LoRA fine-tuned diffusion generators. Select a lesion class and generate synthetic dermoscopic images in real-time on GPU."
                />

                <motion.div
                    className="grid gap-6 lg:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {generators.map((model, i) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            i={i}
                            ctaLabel="Open Generator"
                            spotlightFeatured="rgba(251, 191, 36, 0.06)"
                        />
                    ))}
                </motion.div>


            </Section>

            {/* ───────── PanDerm Classifiers ───────── */}
            <Section className="border-t border-border/40">
                <SectionHeader
                    badge="Classifiers"
                    title="PanDerm Skin Lesion Classifiers"
                    description="Upload a dermoscopic image and get real-time classification across 7 HAM10000 categories. Each classifier was trained with a different augmentation strategy."
                />

                <motion.div
                    className="grid gap-6 lg:grid-cols-1"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {classifiers.map((model, i) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            i={i}
                            ctaLabel="Open Classifier"
                            spotlightFeatured="rgba(52, 211, 153, 0.06)"
                        />
                    ))}
                </motion.div>
            </Section>

            {/* ───────── How to Use ───────── */}
            <Section className="border-t border-border/40">
                <SectionHeader badge="Guide" title="How to Use" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto"
                >
                    {[
                        {
                            step: "01",
                            title: "Choose a Model",
                            text: "Pick a diffusion generator to create synthetic images, or a classifier to diagnose skin lesions.",
                        },
                        {
                            step: "02",
                            title: "Generate or Upload",
                            text: "For generators: select a lesion class and click Generate. For classifiers: upload a dermoscopic image.",
                        },
                        {
                            step: "03",
                            title: "View Results",
                            text: "Generators output synthetic dermoscopic images. Classifiers show predicted class with confidence scores across all 7 categories.",
                        },
                        {
                            step: "04",
                            title: "Compare",
                            text: "Try the same task across different models to see how architecture and augmentation strategy affect output quality.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={item.step}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="text-center"
                        >
                            <span className="block text-4xl font-bold text-foreground/[0.07] mb-3">
                                {item.step}
                            </span>
                            <h3 className="text-sm font-semibold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground/70 leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>

            {/* ───────── Back CTA ───────── */}
            <Section className="border-t border-border/40">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-sm text-muted-foreground/60 mb-5">
                        Want to understand the methodology behind each experiment?
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/methodology"
                            className={buttonVariants({
                                variant: "outline",
                                className: "rounded-full px-5",
                            })}
                        >
                            View Methodology
                        </Link>
                        <Link
                            href="/results"
                            className={buttonVariants({
                                variant: "outline",
                                className: "rounded-full px-5",
                            })}
                        >
                            View Results
                        </Link>
                    </div>
                </motion.div>
            </Section>
        </>
    );
}
