"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/section";
import BlurText from "@/components/BlurText";
import SpotlightCard from "@/components/SpotlightCard";
import { LesionGrid } from "@/components/lesion-grid";
import { motion } from "framer-motion";
import LiquidEther from "@/components/LiquidEther";

const classData = [
  { name: "nv", full: "Melanocytic Nevi", count: 6705, pct: "66.9%", imbalance: "1.0x", risk: "Low" },
  { name: "mel", full: "Melanoma", count: 1113, pct: "11.1%", imbalance: "6.0x", risk: "Malignant" },
  { name: "bkl", full: "Benign Keratosis", count: 1099, pct: "11.0%", imbalance: "6.1x", risk: "Low" },
  { name: "bcc", full: "Basal Cell Carcinoma", count: 514, pct: "5.1%", imbalance: "13.0x", risk: "Malignant" },
  { name: "akiec", full: "Actinic Keratosis", count: 327, pct: "3.3%", imbalance: "20.5x", risk: "Suspicious" },
  { name: "vasc", full: "Vascular Lesions", count: 142, pct: "1.4%", imbalance: "47.2x", risk: "Low" },
  { name: "df", full: "Dermatofibroma", count: 115, pct: "1.2%", imbalance: "58.3x", risk: "Low" },
];

const highlights = [
  {
    title: "Fine-Tuned Stable Diffusion for Dermascopy Image with LoRA ",
    description:
      "Fine-tuned latent diffusion model generates high-quality synthetic dermoscopic images for underrepresented classes.",
  },
  {
    title: "PanDerm ViT-Large",
    description:
      "State-of-the-art dermatology foundation model (Nature Medicine 2025) serves as the downstream classifier.",
  },
  {
    title: "Four-Way Comparison",
    description:
      "Rigorous experimental design comparing no augmentation, Stable Diffusion 2.1 Base, Stable Diffusion XL, and Stable Diffusion 3.5 Large.",
  },
];

function riskColor(risk: string) {
  switch (risk) {
    case "Malignant":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Suspicious":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Low":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    default:
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const maxCount = classData[0].count;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 min-h-[90vh] flex items-center">
        {/* Dermoscopic image grid background */}
        <LesionGrid />


        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40 w-full">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-8 text-xs tracking-wider uppercase">
                KCVanguard Final Project &middot; April 2026
              </Badge>
            </motion.div>

            <BlurText
              text="DermaDiff"
              className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl justify-center"
              delay={80}
              animateBy="letters"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Improving Skin Lesion Classification of Rare Malignant Classes via
              Targeted Synthetic Augmentation with Latent Diffusion and Vision
              Foundation Models
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-3 text-sm text-muted-foreground/60"
            >
              KCV na atuu &middot; Teknik Informatika, ITS Surabaya
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/methodology"
                className={buttonVariants({ size: "lg", className: "rounded-full px-6" })}
              >
                Try Our Model
              </Link>
              <Link
                href="/model"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "rounded-full px-6",
                })}
              >
                View Results
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Abstract */}
      <Section>
        <SectionHeader badge="Abstract" title="Project Overview" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                Skin lesion classification using deep learning suffers from
                severe class imbalance in standard benchmarks: in HAM10000
                (Tschandl et al., 2018; Alam et al., 2022), melanoma is{" "}
                <strong className="text-foreground">
                  6x underrepresented
                </strong>{" "}
                and dermatofibroma is{" "}
                <strong className="text-foreground">
                  58x underrepresented
                </strong>{" "}
                compared to benign nevi. We propose a targeted synthetic
                augmentation pipeline using{" "}
                <strong className="text-foreground">
                  Stable Diffusion 2.0 fine-tuned with LoRA
                </strong>{" "}
                to generate high-quality dermoscopic images specifically for rare
                malignant and pre-cancerous classes, building upon prior work in
                generative augmentation (Alsaidi et al., 2023; SkinGenBench, 2025).{" "}
                <strong className="text-foreground">PanDerm</strong>{" "}
                (Nature Medicine, 2025), the state-of-the-art dermatology
                foundation model, serves as our classifier.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </Section>

      {/* The Problem - with lesion image gallery */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="The Problem"
          title="Class Imbalance in HAM10000"
          description="The HAM10000 dataset exhibits extreme class imbalance, with clinically critical classes dramatically underrepresented."
        />

        {/* Dermoscopic image strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex justify-center gap-3 flex-wrap"
        >
          {classData.map((cls) => (
            <div key={cls.name} className="text-center group">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border/30 group-hover:border-foreground/20 transition-colors">
                <Image
                  src={`/lesions/${cls.name}.jpg`}
                  alt={`${cls.full} dermoscopic image`}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-90"
                />
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-muted-foreground/60 font-mono uppercase">
                {cls.name}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="space-y-2">
          {classData.map((cls, i) => (
            <motion.div
              key={cls.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
              variants={fadeUp}
              className="group flex items-center gap-4 rounded-lg border border-border/30 bg-card/20 p-4 hover:bg-card/40 transition-colors"
            >
              <div className="w-14 shrink-0">
                <code className="text-sm font-bold text-foreground/80">
                  {cls.name}
                </code>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate text-muted-foreground">
                    {cls.full}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs text-muted-foreground/60">
                      {cls.count.toLocaleString()}
                    </span>
                    <Badge variant="outline" className={riskColor(cls.risk)}>
                      {cls.risk}
                    </Badge>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-foreground/20"
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${(cls.count / maxCount) * 100}%`,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
              <div className="w-14 shrink-0 text-right">
                <span className="text-xs font-mono text-muted-foreground/60">
                  {cls.imbalance}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Key Components */}
      <Section className="border-t border-border/40">
        <SectionHeader
          badge="Key Components"
          title="What Makes DermaDiff Different"
          description="Combining state-of-the-art generative and classification models with a rigorous experimental design."
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <SpotlightCard
                className="h-full !bg-card/50 !border-border/50"
                spotlightColor="rgba(255, 255, 255, 0.06)"
              >
                <h3 className="text-base font-semibold mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {h.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </Section>



      {/* Research Objectives */}
      <Section className="border-t border-border/40">
        <SectionHeader badge="Objectives" title="Research Objectives" />
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              num: "01",
              label: "Primary",
              text: "Demonstrate that targeted diffusion-based augmentation improves PanDerm classifier performance on rare malignant and pre-cancerous skin lesion classes beyond both baselines.",
            },
            {
              num: "02",
              label: "Secondary",
              text: "Evaluate synthetic image quality (FID, SSIM) and determine the optimal augmentation ratio (1x, 2x, 5x) for minority classes.",
            },
            {
              num: "03",
              label: "Tertiary",
              text: "Measure impact on a clinically relevant 3-level risk triage scheme (low / suspicious / malignant), quantifying improvement in sensitivity.",
            },
          ].map((obj, i) => (
            <motion.div
              key={obj.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="bg-card/50 border-border/50 h-full">
                <CardHeader>
                  <span className="text-4xl font-bold text-foreground/10">
                    {obj.num}
                  </span>
                  <CardTitle className="text-base">{obj.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {obj.text}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border/40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Explore the Full Proposal
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Dive deeper into the methodology, expected results, team structure,
            and references.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/methodology" className={buttonVariants({ className: "rounded-full px-5" })}>
              Methodology
            </Link>
            <Link
              href="/results"
              className={buttonVariants({ variant: "outline", className: "rounded-full px-5" })}
            >
              Results
            </Link>
            <Link
              href="/team"
              className={buttonVariants({ variant: "outline", className: "rounded-full px-5" })}
            >
              Team
            </Link>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
