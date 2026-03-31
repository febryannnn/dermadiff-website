"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ── Shared SVG helpers ── */
function Box({
  x, y, w, h, fill, stroke, rx = 10,
}: {
  x: number; y: number; w: number; h: number; fill: string; stroke: string; rx?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth="1.2" />;
}

function Txt({
  x, y, text, size = 11, weight = "600", fill = "white",
}: {
  x: number; y: number; text: string; size?: number; weight?: string; fill?: string;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={weight} fill={fill}>
      {text}
    </text>
  );
}

function Arr({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2 - 8} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <polygon points={`${x2 - 4},${y2 - 8} ${x2 + 4},${y2 - 8} ${x2},${y2}`} fill="white" fillOpacity="0.7" />
    </>
  );
}

/* ── Dermoscopic image strip in SVG via foreignObject ── */
function SkinImages({ x, y, w, images, border }: { x: number; y: number; w: number; images: string[]; border: string }) {
  return (
    <foreignObject x={x} y={y} width={w} height={32}>
      <div style={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
        {images.map((src, i) => (
          <img key={i} src={src} alt="" style={{
            width: 28, height: 22, objectFit: "cover", borderRadius: 3,
            border: `1px solid ${border}`, opacity: 0.9,
          }} />
        ))}
      </div>
    </foreignObject>
  );
}

/* side annotation box */
function SideNote({ x, y, w, h, fill, stroke, lines }: {
  x: number; y: number; w: number; h: number; fill: string; stroke: string; lines: { text: string; color: string; size?: number }[];
}) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} fill={fill} stroke={stroke} rx={8} />
      {lines.map((l, i) => (
        <Txt key={i} x={x + w / 2} y={y + 14 + i * 13} text={l.text} size={l.size || 8} weight={i === 0 ? "600" : "400"} fill={l.color} />
      ))}
    </>
  );
}

const lesionImgs = ["/lesions/mel.jpg", "/lesions/bcc.jpg", "/lesions/akiec.jpg", "/lesions/df.jpg", "/lesions/vasc.jpg"];
const lesionImgs2 = ["/lesions/nv.jpg", "/lesions/extra1.jpg", "/lesions/mel2.jpg", "/lesions/bkl.jpg", "/lesions/extra2.jpg"];

/* ════════════════════════════════════════════════
   SD 2.1 Pipeline — from SD-2.0-LoRA.ipynb
   ════════════════════════════════════════════════ */
function PipelineSD21() {
  const W = 720, H = 580;
  const cx = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Dataset input */}
      <Box x={cx - 140} y={8} w={280} h={62} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" />
      <SkinImages x={cx - 130} y={12} w={260} images={lesionImgs} border="rgba(251,191,36,0.4)" />
      <Txt x={cx} y={58} text="HAM10000 + ISIC2019 + Longitudinal" size={9} weight="500" fill="rgba(251,191,36,0.7)" />

      <Arr x1={cx} y1={70} x2={cx} y2={96} />

      {/* Text Prompt */}
      <Box x={cx - 130} y={96} w={260} h={36} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" />
      <Txt x={cx} y={110} text={'"a dermoscopic image of {class} skin lesion"'} size={9} weight="400" fill="rgba(255,255,255,0.65)" />
      <Txt x={cx} y={124} text="3 prompt variants per class × 5 minority classes" size={7.5} weight="400" fill="rgba(255,255,255,0.35)" />

      <Arr x1={cx} y1={132} x2={cx} y2={158} />

      {/* CLIP Text Encoder */}
      <Box x={cx - 100} y={158} w={200} h={44} fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" />
      <Txt x={cx} y={177} text="CLIP Text Encoder" size={11} fill="#c4b5fd" />
      <Txt x={cx} y={193} text="CLIPTextModel (OpenCLIP ViT-H/14)" size={8} weight="400" fill="rgba(196,181,253,0.5)" />

      <Arr x1={cx} y1={202} x2={cx} y2={232} />

      {/* UNet + LoRA */}
      <Box x={cx - 120} y={232} w={240} h={56} fill="rgba(236,72,153,0.15)" stroke="rgba(236,72,153,0.5)" />
      <Txt x={cx} y={254} text="UNet2D + LoRA" size={12} fill="#f9a8d4" />
      <Txt x={cx} y={270} text="r=32, α=64 • MSE Noise Prediction" size={9} weight="400" fill="rgba(249,168,212,0.55)" />
      <Txt x={cx} y={282} text="target: to_q, to_k, to_v, to_out, proj_in/out, ff" size={7} weight="400" fill="rgba(249,168,212,0.35)" />

      {/* Side: Scheduler */}
      <SideNote x={cx - 230} y={240} w={100} h={38}
        fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.25)"
        lines={[
          { text: "DDPM → DPM++", color: "#67e8f9" },
          { text: "50 steps, CFG=9.0", color: "rgba(103,232,249,0.5)" },
        ]}
      />
      <line x1={cx - 130} y1={260} x2={cx - 120} y2={260} stroke="rgba(34,211,238,0.25)" strokeWidth="1" strokeDasharray="4" />

      {/* Side: Training */}
      <SideNote x={cx + 130} y={236} w={110} h={48}
        fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.25)"
        lines={[
          { text: "Training Config", color: "#fbbf24" },
          { text: "50 epochs, BS=4", color: "rgba(251,191,36,0.45)" },
          { text: "LR=1e-4, cosine", color: "rgba(251,191,36,0.45)" },
        ]}
      />
      <line x1={cx + 120} y1={260} x2={cx + 130} y2={260} stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="4" />

      <Arr x1={cx} y1={288} x2={cx} y2={318} />

      {/* VAE Decoder */}
      <Box x={cx - 90} y={318} w={180} h={44} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" />
      <Txt x={cx} y={337} text="VAE Decoder" size={11} fill="#6ee7b7" />
      <Txt x={cx} y={353} text="4ch latent • 8× upsample" size={9} weight="400" fill="rgba(110,231,183,0.5)" />

      <Arr x1={cx} y1={362} x2={cx} y2={390} />

      {/* Generated images */}
      <Box x={cx - 110} y={390} w={220} h={56} fill="rgba(236,72,153,0.06)" stroke="rgba(236,72,153,0.25)" />
      <SkinImages x={cx - 100} y={394} w={200} images={lesionImgs} border="rgba(236,72,153,0.4)" />
      <Txt x={cx} y={438} text="512×512 Synthetic Dermoscopic Images" size={9} weight="500" fill="rgba(236,72,153,0.7)" />

      <Arr x1={cx} y1={446} x2={cx} y2={472} />

      {/* BiomedCLIP + LPIPS Filter */}
      <Box x={cx - 130} y={472} w={260} h={50} fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.4)" />
      <Txt x={cx} y={491} text="BiomedCLIP + LPIPS Filtering" size={11} fill="#fbbf24" />
      <Txt x={cx} y={507} text="Quality threshold (μ-1.5σ) • Specificity • Diversity" size={8} weight="400" fill="rgba(251,191,36,0.5)" />
      <Txt x={cx} y={518} text="Remove low-quality + near-duplicates" size={7.5} weight="400" fill="rgba(251,191,36,0.35)" />

      <Arr x1={cx} y1={522} x2={cx} y2={548} />

      {/* Output */}
      <Box x={cx - 100} y={548} w={200} h={28} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" />
      <Txt x={cx} y={567} text="Filtered Synthetic Dataset (1x / 2x / 5x)" size={9} weight="500" fill="#6ee7b7" />
    </svg>
  );
}

/* ════════════════════════════════════════════════
   SDXL Pipeline — from exp_c3_sdxl notebooks
   ════════════════════════════════════════════════ */
function PipelineSDXL() {
  const W = 720, H = 560;
  const cx = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Dataset input */}
      <Box x={cx - 140} y={8} w={280} h={62} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" />
      <SkinImages x={cx - 130} y={12} w={260} images={lesionImgs} border="rgba(251,191,36,0.4)" />
      <Txt x={cx} y={58} text="HAM10000 (train) + ISIC2019 + Longitudinal" size={9} weight="500" fill="rgba(251,191,36,0.7)" />

      <Arr x1={cx} y1={70} x2={cx} y2={96} />

      {/* Prompt + metadata.jsonl */}
      <Box x={cx - 130} y={96} w={260} h={36} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" />
      <Txt x={cx} y={110} text={'"a dermoscopic photograph of a {class} skin lesion"'} size={9} weight="400" fill="rgba(255,255,255,0.65)" />
      <Txt x={cx} y={124} text="5 prompt variants per class • metadata.jsonl" size={7.5} weight="400" fill="rgba(255,255,255,0.35)" />

      <Arr x1={cx} y1={132} x2={cx} y2={156} />

      {/* Dual Text Encoders */}
      <line x1={cx} y1={156} x2={cx} y2={165} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx - 110} y1={165} x2={cx + 110} y2={165} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <Arr x1={cx - 110} y1={165} x2={cx - 110} y2={178} />
      <Arr x1={cx + 110} y1={165} x2={cx + 110} y2={178} />

      <Box x={cx - 200} y={178} w={180} h={42} fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" />
      <Txt x={cx - 110} y={196} text="CLIP ViT-L/14" size={10} fill="#c4b5fd" />
      <Txt x={cx - 110} y={212} text="768-dim, 77 tokens" size={8} weight="400" fill="rgba(196,181,253,0.5)" />

      <Box x={cx + 20} y={178} w={180} h={42} fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" />
      <Txt x={cx + 110} y={196} text="OpenCLIP ViT-bigG/14" size={10} fill="#a5b4fc" />
      <Txt x={cx + 110} y={212} text="1280-dim, 77 tokens" size={8} weight="400" fill="rgba(165,180,252,0.5)" />

      {/* Concat merge */}
      <line x1={cx - 110} y1={220} x2={cx - 110} y2={235} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx + 110} y1={220} x2={cx + 110} y2={235} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx - 110} y1={235} x2={cx + 110} y2={235} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <Arr x1={cx} y1={235} x2={cx} y2={252} />

      <Box x={cx - 50} y={228} w={100} h={14} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" rx={6} />
      <Txt x={cx} y={238} text="Concat → 2048-dim" size={7} weight="400" fill="rgba(255,255,255,0.45)" />

      {/* U-Net + LoRA */}
      <Box x={cx - 120} y={252} w={240} h={56} fill="rgba(236,72,153,0.15)" stroke="rgba(236,72,153,0.5)" />
      <Txt x={cx} y={274} text="UNet + LoRA" size={12} fill="#f9a8d4" />
      <Txt x={cx} y={290} text="r=16 • ~2.6B params • fp16" size={9} weight="400" fill="rgba(249,168,212,0.55)" />
      <Txt x={cx} y={302} text="train_text_to_image_lora_sdxl.py (diffusers)" size={7} weight="400" fill="rgba(249,168,212,0.35)" />

      {/* Side: Training */}
      <SideNote x={cx + 130} y={256} w={110} h={48}
        fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.25)"
        lines={[
          { text: "Training Config", color: "#fbbf24" },
          { text: "800-1500 steps", color: "rgba(251,191,36,0.45)" },
          { text: "LR=1e-4, BS=1×4", color: "rgba(251,191,36,0.45)" },
        ]}
      />
      <line x1={cx + 120} y1={280} x2={cx + 130} y2={280} stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="4" />

      {/* Side: Generation */}
      <SideNote x={cx - 230} y={256} w={100} h={38}
        fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.25)"
        lines={[
          { text: "30 steps", color: "#67e8f9" },
          { text: "CFG=7.5, fp16", color: "rgba(103,232,249,0.5)" },
        ]}
      />
      <line x1={cx - 130} y1={280} x2={cx - 120} y2={280} stroke="rgba(34,211,238,0.25)" strokeWidth="1" strokeDasharray="4" />

      <Arr x1={cx} y1={308} x2={cx} y2={338} />

      {/* VAE Decoder */}
      <Box x={cx - 90} y={338} w={180} h={44} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" />
      <Txt x={cx} y={357} text="SDXL VAE Decoder" size={11} fill="#6ee7b7" />
      <Txt x={cx} y={373} text="4ch latent • improved quality" size={9} weight="400" fill="rgba(110,231,183,0.5)" />

      <Arr x1={cx} y1={382} x2={cx} y2={410} />

      {/* Generated images */}
      <Box x={cx - 110} y={410} w={220} h={56} fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" />
      <SkinImages x={cx - 100} y={414} w={200} images={lesionImgs2} border="rgba(139,92,246,0.4)" />
      <Txt x={cx} y={458} text="512×512 Synthetic Dermoscopic Images" size={9} weight="500" fill="rgba(139,92,246,0.7)" />

      <Arr x1={cx} y1={466} x2={cx} y2={492} />

      {/* Output */}
      <Box x={cx - 110} y={492} w={220} h={50} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)" />
      <Txt x={cx} y={512} text="2x Ratio Generation" size={10} weight="600" fill="#6ee7b7" />
      <Txt x={cx} y={528} text="~3,096 synthetic images saved to Drive" size={8} weight="400" fill="rgba(110,231,183,0.5)" />
    </svg>
  );
}

/* ════════════════════════════════════════════════
   SD 3.5 Pipeline — from sd-3.5-large.ipynb
   ════════════════════════════════════════════════ */
function PipelineSD35() {
  const W = 720, H = 620;
  const cx = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Dataset input */}
      <Box x={cx - 140} y={8} w={280} h={62} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" />
      <SkinImages x={cx - 130} y={12} w={260} images={lesionImgs} border="rgba(251,191,36,0.4)" />
      <Txt x={cx} y={58} text="HAM10000 + ISIC2019 + Longitudinal (~35K sampled)" size={9} weight="500" fill="rgba(251,191,36,0.7)" />

      <Arr x1={cx} y1={70} x2={cx} y2={96} />

      {/* Text Prompt */}
      <Box x={cx - 140} y={96} w={280} h={36} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" />
      <Txt x={cx} y={110} text={'"a dermoscopic image of {class}, irregular pigment..."'} size={9} weight="400" fill="rgba(255,255,255,0.65)" />
      <Txt x={cx} y={124} text="3 detailed prompts/class + negative prompts" size={7.5} weight="400" fill="rgba(255,255,255,0.35)" />

      <Arr x1={cx} y1={132} x2={cx} y2={152} />

      {/* Triple Text Encoders */}
      <line x1={cx} y1={152} x2={cx} y2={160} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx - 190} y1={160} x2={cx + 190} y2={160} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <Arr x1={cx - 190} y1={160} x2={cx - 190} y2={172} />
      <Arr x1={cx} y1={160} x2={cx} y2={172} />
      <Arr x1={cx + 190} y1={160} x2={cx + 190} y2={172} />

      <Box x={cx - 260} y={172} w={140} h={42} fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" />
      <Txt x={cx - 190} y={190} text="CLIP-L" size={10} fill="#c4b5fd" />
      <Txt x={cx - 190} y={206} text="768-dim, 77 tok" size={8} weight="400" fill="rgba(196,181,253,0.5)" />

      <Box x={cx - 70} y={172} w={140} h={42} fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" />
      <Txt x={cx} y={190} text="CLIP-G" size={10} fill="#a5b4fc" />
      <Txt x={cx} y={206} text="1280-dim, 77 tok" size={8} weight="400" fill="rgba(165,180,252,0.5)" />

      <Box x={cx + 120} y={172} w={140} h={42} fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.5)" />
      <Txt x={cx + 190} y={190} text="T5-XXL" size={10} fill="#67e8f9" />
      <Txt x={cx + 190} y={206} text="4096-dim, 256 tok" size={8} weight="400" fill="rgba(103,232,249,0.5)" />

      {/* Merge */}
      <line x1={cx - 190} y1={214} x2={cx - 190} y2={230} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx} y1={214} x2={cx} y2={230} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx + 190} y1={214} x2={cx + 190} y2={230} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1={cx - 190} y1={230} x2={cx + 190} y2={230} stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />

      <Box x={cx - 75} y={223} w={150} h={14} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" rx={6} />
      <Txt x={cx} y={233} text="CLIP pooled concat + T5 sequence" size={7} weight="400" fill="rgba(255,255,255,0.45)" />

      <Arr x1={cx} y1={237} x2={cx} y2={260} />

      {/* MMDiT + LoRA */}
      <Box x={cx - 130} y={260} w={260} h={62} fill="rgba(236,72,153,0.15)" stroke="rgba(236,72,153,0.5)" />
      <Txt x={cx} y={282} text="MMDiT Transformer + LoRA" size={12} fill="#f9a8d4" />
      <Txt x={cx} y={298} text="r=64, α=64 • ~8B params • bfloat16" size={9} weight="400" fill="rgba(249,168,212,0.55)" />
      <Txt x={cx} y={314} text="attn.to_q/k/v, ff, ff_context (dual attention)" size={7.5} weight="400" fill="rgba(249,168,212,0.35)" />

      {/* Side: Flow Matching */}
      <SideNote x={cx + 140} y={264} w={120} h={52}
        fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.25)"
        lines={[
          { text: "Flow Matching", color: "#fbbf24" },
          { text: "v = noise - x₀", color: "rgba(251,191,36,0.5)" },
          { text: "logit-normal t", color: "rgba(251,191,36,0.4)" },
          { text: "28 steps, CFG=4.5", color: "rgba(251,191,36,0.4)" },
        ]}
      />
      <line x1={cx + 130} y1={290} x2={cx + 140} y2={290} stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="4" />

      {/* Side: Training */}
      <SideNote x={cx - 260} y={264} w={120} h={52}
        fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.25)"
        lines={[
          { text: "DreamBooth LoRA", color: "#67e8f9" },
          { text: "1500 steps, BS=2×8", color: "rgba(103,232,249,0.45)" },
          { text: "LR=1e-5, cosine", color: "rgba(103,232,249,0.45)" },
          { text: "grad checkpoint", color: "rgba(103,232,249,0.4)" },
        ]}
      />
      <line x1={cx - 140} y1={290} x2={cx - 130} y2={290} stroke="rgba(34,211,238,0.25)" strokeWidth="1" strokeDasharray="4" />

      <Arr x1={cx} y1={322} x2={cx} y2={352} />

      {/* VAE Decoder */}
      <Box x={cx - 100} y={352} w={200} h={50} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" />
      <Txt x={cx} y={373} text="VAE Decoder" size={11} fill="#6ee7b7" />
      <Txt x={cx} y={391} text="16-channel latent • 8× upsample" size={9} weight="400" fill="rgba(110,231,183,0.5)" />

      {/* 16ch callout */}
      <SideNote x={cx + 120} y={358} w={100} h={34}
        fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.25)"
        lines={[
          { text: "16 channels", color: "#fbbf24", size: 9 },
          { text: "(vs 4 in SD 2.1)", color: "rgba(251,191,36,0.4)" },
        ]}
      />
      <line x1={cx + 100} y1={377} x2={cx + 120} y2={377} stroke="rgba(245,158,11,0.25)" strokeWidth="1" strokeDasharray="4" />

      <Arr x1={cx} y1={402} x2={cx} y2={430} />

      {/* Generated images */}
      <Box x={cx - 110} y={430} w={220} h={56} fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.25)" />
      <SkinImages x={cx - 100} y={434} w={200} images={lesionImgs2} border="rgba(34,211,238,0.4)" />
      <Txt x={cx} y={478} text="1024×1024 Synthetic Dermoscopic Images" size={9} weight="500" fill="rgba(34,211,238,0.7)" />

      <Arr x1={cx} y1={486} x2={cx} y2={512} />

      {/* Output */}
      <Box x={cx - 110} y={512} w={220} h={50} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)" />
      <Txt x={cx} y={532} text="5x Ratio Generation" size={10} weight="600" fill="#6ee7b7" />
      <Txt x={cx} y={548} text="per class: train_count × 5 images" size={8} weight="400" fill="rgba(110,231,183,0.5)" />

      {/* Key innovations footer */}
      <Box x={55} y={576} w={W - 110} h={34} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" rx={8} />
      <Txt x={cx} y={592} text="Flow Matching • Joint Attention • 16ch VAE • Triple Encoders (CLIP-L + CLIP-G + T5-XXL)" size={8} weight="500" fill="rgba(255,255,255,0.3)" />
      <Txt x={cx} y={604} text="vs SD 2.1: 4× VAE channels, 9× params, velocity prediction instead of noise prediction" size={7} weight="400" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

/* ════════════════════════════════════════════════
   Accordion wrapper
   ════════════════════════════════════════════════ */
const models = [
  {
    id: "sd21",
    name: "Stable Diffusion 2.1",
    badge: "Exp B",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-400/40",
    desc: "CLIP → UNet + LoRA (r=32) → VAE (4ch) → BiomedCLIP Filter",
    specs: [
      { label: "Base Model", value: "stabilityai/sd-2-1-base" },
      { label: "Text Encoder", value: "CLIP (OpenCLIP ViT-H/14)" },
      { label: "Denoiser", value: "UNet2D + LoRA r=32, α=64" },
      { label: "Training", value: "50 epochs, LR=1e-4, BS=4×4" },
      { label: "Generation", value: "50 steps, CFG=9.0, 512×512" },
      { label: "Filtering", value: "BiomedCLIP + LPIPS diversity" },
    ],
    Pipeline: PipelineSD21,
  },
  {
    id: "sdxl",
    name: "Stable Diffusion XL",
    badge: "Exp C",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-400/40",
    desc: "Dual CLIP → UNet + LoRA (r=16) → SDXL VAE (4ch)",
    specs: [
      { label: "Base Model", value: "stabilityai/sdxl-base-1.0" },
      { label: "Text Encoders", value: "CLIP ViT-L + OpenCLIP bigG (2048d concat)" },
      { label: "Denoiser", value: "UNet ~2.6B + LoRA r=16" },
      { label: "Training", value: "800-1500 steps, LR=1e-4, fp16" },
      { label: "Generation", value: "30 steps, CFG=7.5, 512×512" },
      { label: "Output", value: "2x ratio, ~3,096 synthetic images" },
    ],
    Pipeline: PipelineSDXL,
  },
  {
    id: "sd35",
    name: "Stable Diffusion 3.5 Large",
    badge: "Exp D",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-400/40",
    desc: "CLIP-L + CLIP-G + T5-XXL → MMDiT + LoRA (r=64) → 16ch VAE",
    specs: [
      { label: "Base Model", value: "stabilityai/sd-3.5-large (~8B)" },
      { label: "Text Encoders", value: "CLIP-L + CLIP-G + T5-XXL (4096d, 256 tok)" },
      { label: "Denoiser", value: "MMDiT + LoRA r=64, dual attention" },
      { label: "Training", value: "1500 steps, LR=1e-5, bfloat16, DreamBooth" },
      { label: "Generation", value: "28 steps, CFG=4.5, 1024×1024" },
      { label: "Loss", value: "Flow Matching (velocity, logit-normal t)" },
    ],
    Pipeline: PipelineSD35,
  },
];

export function SDModelArchitectures() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {models.map((model) => (
        <div
          key={model.id}
          className="rounded-xl border border-border/50 bg-card/30 overflow-hidden transition-colors hover:border-foreground/10"
        >
          <button
            onClick={() => setOpen(open === model.id ? null : model.id)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${model.badgeColor}`}>
                {model.badge}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{model.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{model.desc}</p>
              </div>
            </div>
            <svg
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open === model.id ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <AnimatePresence>
            {open === model.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" as const }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/30 px-5 py-5 space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {model.specs.map((spec) => (
                      <div key={spec.label} className="rounded-lg bg-foreground/[0.03] border border-border/30 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{spec.label}</p>
                        <p className="text-xs font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center pt-2">
                    <model.Pipeline />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
