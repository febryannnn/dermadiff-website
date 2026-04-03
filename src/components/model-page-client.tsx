"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/section";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";

const models = [
    {
        id: "exp-a",
        experiment: "Experiment A",
        title: "Baseline",
        subtitle: "No Augmentation",
        description:
            "PanDerm ViT-Large trained on the original HAM10000 dataset without any synthetic augmentation. Serves as the control benchmark for measuring improvement.",
        tags: ["PanDerm", "ViT-Large", "HAM10000"],
        accent: "from-neutral-500/20 to-neutral-800/0",
        borderAccent: "hover:border-neutral-500/30",
        badgeClass: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
        url: "#",
        status: "Live",
    },
    {
        id: "exp-b",
        experiment: "Experiment B",
        title: "Traditional Aug",
        subtitle: "Classical Augmentation",
        description:
            "PanDerm classifier enhanced with traditional augmentation techniques — rotation, flipping, color jitter, and elastic transforms applied to minority classes.",
        tags: ["PanDerm", "Geometric Aug", "Color Jitter"],
        accent: "from-amber-500/15 to-amber-900/0",
        borderAccent: "hover:border-amber-500/25",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        url: "#",
        status: "Live",
    },
    {
        id: "exp-c",
        experiment: "Experiment C",
        title: "DermaDiff",
        subtitle: "Diffusion Augmentation",
        description:
            "Our proposed method — Stable Diffusion 2.0 fine-tuned with LoRA generates targeted synthetic dermoscopic images for rare malignant classes, then used to augment PanDerm training.",
        tags: ["SD 2.0 + LoRA", "PanDerm", "Synthetic Aug"],
        accent: "from-emerald-500/15 to-emerald-900/0",
        borderAccent: "hover:border-emerald-500/25",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        url: "#",
        status: "Live",
        featured: true,
    },
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

export default function ModelPageClient() {
    return (
        <>
            {/* Hero */}
            <section className="relative border-b border-border/40 overflow-hidden">
                {/* Subtle gradient orb */}
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
                            Three experiments, three deployed classifiers. Each model is
                            trained on a different augmentation strategy — test them
                            side-by-side and see the difference diffusion makes.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Model Cards */}
            <Section>
                <SectionHeader
                    badge="Experiments"
                    title="Deployed Classifiers"
                    description="Select a model to open its live deployment. Upload a dermoscopic image and get real-time classification results."
                />

                <motion.div
                    className="grid gap-6 lg:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {models.map((model, i) => (
                        <motion.div key={model.id} custom={i} variants={fadeUp}>
                            <SpotlightCard
                                className={`relative h-full !bg-card/50 !border-border/50 ${model.borderAccent} transition-colors duration-300 group`}
                                spotlightColor={
                                    model.featured
                                        ? "rgba(52, 211, 153, 0.06)"
                                        : "rgba(255, 255, 255, 0.04)"
                                }
                            >
                                {/* Top gradient accent */}
                                <div
                                    className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${model.accent} rounded-t-[inherit] pointer-events-none`}
                                />

                                <div className="relative flex flex-col h-full p-1">
                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50">
                                                {model.experiment}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={model.badgeClass}
                                            >
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

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                                        {model.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {model.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-border/40 text-muted-foreground/50 bg-muted/10"
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
                                            variant: model.featured ? "default" : "outline",
                                            className:
                                                "w-full rounded-full group-hover:shadow-sm transition-shadow",
                                        })}
                                    >
                                        <span>Open Classifier</span>
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
                    ))}
                </motion.div>
            </Section>

            {/* How to Use */}
            <Section className="border-t border-border/40">
                <SectionHeader badge="Guide" title="How to Use" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto"
                >
                    {[
                        {
                            step: "01",
                            title: "Choose a Model",
                            text: "Select one of the three experiment deployments above to open the classifier web app.",
                        },
                        {
                            step: "02",
                            title: "Upload an Image",
                            text: "Drag and drop or select a dermoscopic image from your device. The model accepts standard image formats.",
                        },
                        {
                            step: "03",
                            title: "View Prediction",
                            text: "The classifier outputs the predicted lesion class with confidence scores across all 7 HAM10000 categories.",
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
                            <h3 className="text-sm font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground/70 leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>

            {/* Back CTA */}
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