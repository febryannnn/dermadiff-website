"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function MathFormulas({ formulas }: { formulas: { label: string; tex: string; note?: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-[720px]">
      {formulas.map((f, i) => (
        <div key={i} className="rounded-lg bg-foreground/[0.02] border border-border/20 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{f.label}</p>
          <div className="text-xs text-foreground/80 leading-relaxed overflow-x-auto">
            <InlineMath math={f.tex} />
          </div>
          {f.note && <p className="text-[10px] text-muted-foreground mt-1">{f.note}</p>}
        </div>
      ))}
    </div>
  );
}

const pandermFormulas = [
  { label: "Patch Embedding", tex: "z_0 = [x_{\\text{cls}} \\;\\|\\; E \\cdot x_p^1 \\;\\|\\; \\cdots \\;\\|\\; E \\cdot x_p^N] + E_{\\text{pos}}", note: "N = 196 patches, E ∈ ℝ^{(P²·C) × D}" },
  { label: "Multi-Head Self-Attention", tex: "\\text{MHSA}(Z) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_{16})W^O" },
  { label: "Attention Head", tex: "\\text{head}_i = \\text{softmax}\\!\\left(\\frac{Q_i K_i^\\top}{\\sqrt{d_k}}\\right) V_i", note: "d_k = 1024/16 = 64" },
  { label: "Transformer Block", tex: "z'_\\ell = \\text{MHSA}(\\text{LN}(z_{\\ell-1})) + z_{\\ell-1}" },
  { label: "FFN Sub-layer", tex: "z_\\ell = \\text{FFN}(\\text{LN}(z'_\\ell)) + z'_\\ell", note: "FFN: Linear → GELU → Linear" },
  { label: "Classification", tex: "\\hat{y} = \\text{softmax}(W_c \\cdot z_L^{\\text{cls}} + b_c)", note: "W_c ∈ ℝ^{7×1024}" },
  { label: "Cross-Entropy Loss", tex: "\\mathcal{L} = -\\sum_{i=1}^{7} y_i \\log \\hat{y}_i", note: "with weighted sampling for imbalance" },
  { label: "CAEv2 Pretraining", tex: "\\mathcal{L}_{\\text{CAE}} = \\|\\hat{x}_{\\text{masked}} - x_{\\text{masked}}\\|^2", note: "reconstruct masked patches in latent space" },
];

const loraFormulas = [
  { label: "Standard Fine-tuning", tex: "h = (W_0 + \\Delta W)\\, x, \\quad \\Delta W \\in \\mathbb{R}^{d \\times d}", note: "full rank update — d² parameters" },
  { label: "LoRA Decomposition", tex: "h = W_0 x + \\frac{\\alpha}{r} \\cdot B A x", note: "B ∈ ℝ^{d×r}, A ∈ ℝ^{r×d}, r ≪ d" },
  { label: "Parameter Count", tex: "\\text{LoRA}: 2dr \\ll d^2 \\quad \\text{(e.g. } \\frac{2 \\times 1024 \\times 16}{1024^2} \\approx 3\\%\\text{)}" },
  { label: "Initialization", tex: "A \\sim \\mathcal{N}(0, \\sigma^2), \\quad B = 0", note: "ΔW = BA = 0 at start → stable training" },
  { label: "Effective Weight", tex: "W_{\\text{eff}} = W_0 + \\frac{\\alpha}{r} \\cdot BA", note: "merged at inference — no extra latency" },
  { label: "Gradient (A only)", tex: "\\frac{\\partial \\mathcal{L}}{\\partial A} = \\frac{\\alpha}{r} \\cdot B^\\top \\frac{\\partial \\mathcal{L}}{\\partial h} x^\\top", note: "W₀ frozen, grad flows through B·A only" },
];

/* ── Shared SVG helpers (same style as pipeline-sd-models) ── */
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

/* ════════════════════════════════════════════════
   PanDerm ViT-Large Architecture
   ════════════════════════════════════════════════ */
function PipelinePanDerm() {
  const W = 720, H = 620;
  const cx = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Self-Supervised Pretraining (top banner) ── */}
      <Box x={cx - 220} y={8} w={440} h={44} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)" rx={12} />
      <Txt x={cx} y={28} text="Self-Supervised Pretraining on 2M+ Dermatology Images" size={10} weight="600" fill="rgba(16,185,129,0.85)" />
      <Txt x={cx} y={43} text="4 Modalities: Dermoscopy · Clinical · TBP · Dermatopathology" size={8} weight="400" fill="rgba(16,185,129,0.5)" />

      <Arr x1={cx} y1={52} x2={cx} y2={78} />

      {/* ── Input Image ── */}
      <Box x={cx - 100} y={78} w={200} h={46} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" />
      <Txt x={cx} y={98} text="Input Dermoscopic Image" size={10} fill="rgba(251,191,36,0.85)" />
      <Txt x={cx} y={114} text="224 × 224 px" size={8} weight="400" fill="rgba(251,191,36,0.5)" />

      <Arr x1={cx} y1={124} x2={cx} y2={152} />

      {/* ── Patch Embedding ── */}
      <Box x={cx - 120} y={152} w={240} h={50} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" />
      <Txt x={cx} y={172} text="Patch Embedding" size={11} fill="#c4b5fd" />
      <Txt x={cx} y={190} text="16×16 patches → 196 tokens + [CLS] → 1024-dim" size={8} weight="400" fill="rgba(196,181,253,0.5)" />

      {/* Side note: Patch details */}
      <SideNote x={cx + 140} y={148} w={160} h={58} fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.2)"
        lines={[
          { text: "Patch Tokenization", color: "rgba(196,181,253,0.7)", size: 8 },
          { text: "14 × 14 = 196 patches", color: "rgba(196,181,253,0.45)", size: 7.5 },
          { text: "+ 1 [CLS] = 197 tokens", color: "rgba(196,181,253,0.45)", size: 7.5 },
          { text: "Linear projection to d=1024", color: "rgba(196,181,253,0.45)", size: 7.5 },
        ]}
      />

      <Arr x1={cx} y1={202} x2={cx} y2={232} />

      {/* ── ViT-Large Transformer Encoder ── */}
      <Box x={cx - 140} y={232} w={280} h={100} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.45)" />
      <Txt x={cx} y={254} text="ViT-Large/16 Transformer Encoder" size={12} fill="rgba(52,211,153,0.95)" />

      {/* Stacked transformer blocks */}
      <Box x={cx - 110} y={264} w={220} h={22} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" rx={6} />
      <Txt x={cx} y={279} text="Multi-Head Self-Attention (16 heads) + FFN" size={8} weight="400" fill="rgba(52,211,153,0.6)" />
      <Box x={cx - 110} y={290} w={220} h={22} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" rx={6} />
      <Txt x={cx} y={305} text="× 24 Transformer Blocks" size={8.5} weight="600" fill="rgba(52,211,153,0.7)" />
      <Box x={cx - 110} y={316} w={220} h={12} fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.15)" rx={4} />

      {/* Side note: ViT-L specs */}
      <SideNote x={cx + 160} y={235} w={160} h={92} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)"
        lines={[
          { text: "ViT-Large Configuration", color: "rgba(52,211,153,0.7)", size: 8 },
          { text: "Hidden dim: 1024", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "Heads: 16", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "Layers: 24", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "Params: ~307M", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "SSL: CAEv2 + MAE", color: "rgba(52,211,153,0.45)", size: 7.5 },
        ]}
      />

      {/* Side note: Pretraining */}
      <SideNote x={10} y={235} w={155} h={92} fill="rgba(251,191,36,0.06)" stroke="rgba(251,191,36,0.2)"
        lines={[
          { text: "Pretraining Datasets", color: "rgba(251,191,36,0.7)", size: 8 },
          { text: "2M+ images (unlabeled)", color: "rgba(251,191,36,0.45)", size: 7.5 },
          { text: "ISIC Archive, Fitzpatrick17k", color: "rgba(251,191,36,0.45)", size: 7.5 },
          { text: "DermNet, Atlas Derm.", color: "rgba(251,191,36,0.45)", size: 7.5 },
          { text: "BCN20000, PAD-UFES", color: "rgba(251,191,36,0.45)", size: 7.5 },
          { text: "+ Clinical/TBP/Pathology", color: "rgba(251,191,36,0.45)", size: 7.5 },
        ]}
      />

      <Arr x1={cx} y1={332} x2={cx} y2={362} />

      {/* ── [CLS] Token Extraction ── */}
      <Box x={cx - 100} y={362} w={200} h={40} fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" />
      <Txt x={cx} y={380} text="[CLS] Token → 1024-dim vector" size={10} fill="rgba(96,165,250,0.9)" />
      <Txt x={cx} y={395} text="Global representation of input image" size={7.5} weight="400" fill="rgba(96,165,250,0.45)" />

      <Arr x1={cx} y1={402} x2={cx} y2={432} />

      {/* ── Classification Head ── */}
      <Box x={cx - 110} y={432} w={220} h={48} fill="rgba(236,72,153,0.12)" stroke="rgba(236,72,153,0.4)" />
      <Txt x={cx} y={452} text="Classification Head (Linear)" size={10.5} fill="rgba(244,114,182,0.9)" />
      <Txt x={cx} y={470} text="1024 → 7 classes (softmax)" size={8} weight="400" fill="rgba(244,114,182,0.5)" />

      {/* Side note: Fine-tuning config */}
      <SideNote x={cx + 130} y={425} w={160} h={58} fill="rgba(236,72,153,0.06)" stroke="rgba(236,72,153,0.2)"
        lines={[
          { text: "Fine-tuning Config", color: "rgba(244,114,182,0.7)", size: 8 },
          { text: "LR: 5e-4, BS: 128", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "Epochs: 50, AdamW", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "Weighted sampling", color: "rgba(244,114,182,0.45)", size: 7.5 },
        ]}
      />

      <Arr x1={cx} y1={480} x2={cx} y2={510} />

      {/* ── 7-class Output ── */}
      {(() => {
        const classes = [
          { name: "nv", color: "rgba(16,185,129,0.5)" },
          { name: "mel", color: "rgba(239,68,68,0.6)" },
          { name: "bkl", color: "rgba(16,185,129,0.5)" },
          { name: "bcc", color: "rgba(239,68,68,0.6)" },
          { name: "akiec", color: "rgba(251,191,36,0.6)" },
          { name: "vasc", color: "rgba(16,185,129,0.5)" },
          { name: "df", color: "rgba(16,185,129,0.5)" },
        ];
        const totalW = 560;
        const boxW = 68;
        const gap = (totalW - boxW * 7) / 6;
        const startX = cx - totalW / 2;
        return (
          <>
            {classes.map((c, i) => {
              const bx = startX + i * (boxW + gap);
              return (
                <g key={c.name}>
                  <Box x={bx} y={510} w={boxW} h={32} fill={c.color.replace(/[\d.]+\)$/, "0.1)")} stroke={c.color} rx={8} />
                  <Txt x={bx + boxW / 2} y={530} text={c.name} size={10} weight="700" fill={c.color.replace(/[\d.]+\)$/, "1)")} />
                </g>
              );
            })}
            <Txt x={cx} y={560} text="HAM10000: 7-Class Skin Lesion Classification" size={8.5} weight="400" fill="rgba(255,255,255,0.35)" />
          </>
        );
      })()}

      {/* ── Reference ── */}
      <Box x={cx - 160} y={575} w={320} h={30} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" rx={8} />
      <Txt x={cx} y={594} text="Yan et al. — PanDerm (Nature Medicine 2025)" size={8} weight="400" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

/* ════════════════════════════════════════════════
   LoRA (Low-Rank Adaptation) Architecture
   ════════════════════════════════════════════════ */
function PipelineLoRA() {
  const W = 720, H = 600;
  const cx = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Title ── */}
      <Txt x={cx} y={20} text="LoRA: Low-Rank Adaptation of Large Language/Vision Models" size={11} weight="600" fill="rgba(251,191,36,0.85)" />
      <Txt x={cx} y={36} text="Hu et al. (2021) — applied to both Stable Diffusion & PanDerm ViT" size={8} weight="400" fill="rgba(251,191,36,0.45)" />

      {/* ═══ LEFT SIDE: Frozen pretrained weight path ═══ */}
      {/* Input */}
      <Box x={100} y={60} w={180} h={38} fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.35)" />
      <Txt x={190} y={77} text="Input x" size={10} fill="rgba(196,181,253,0.85)" />
      <Txt x={190} y={92} text="(hidden dim d)" size={8} weight="400" fill="rgba(196,181,253,0.45)" />

      {/* Branch arrows: left (frozen W) and right (LoRA) */}
      {/* Left arrow down to frozen W */}
      <line x1={150} y1={98} x2={150} y2={148} stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 3" />
      <polygon points="146,140 154,140 150,148" fill="white" fillOpacity="0.5" />

      {/* Right arrow down to LoRA branch */}
      <line x1={230} y1={98} x2={420} y2={98} stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" />
      <line x1={420} y1={98} x2={420} y2={148} stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" />
      <polygon points="416,140 424,140 420,148" fill="rgba(251,191,36,0.6)" />

      {/* ── Frozen W (pretrained) ── */}
      <Box x={60} y={148} w={180} h={56} fill="rgba(100,116,139,0.12)" stroke="rgba(100,116,139,0.4)" />
      <Txt x={150} y={169} text="W₀ (Pretrained)" size={11} fill="rgba(148,163,184,0.9)" />
      <Txt x={150} y={185} text="Frozen — no gradient update" size={8} weight="400" fill="rgba(148,163,184,0.5)" />
      <Txt x={150} y={198} text="d × d weight matrix" size={7.5} weight="400" fill="rgba(148,163,184,0.4)" />

      {/* Frozen badge */}
      <Box x={62} y={143} w={46} h={16} fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.4)" rx={8} />
      <Txt x={85} y={155} text="❄ frozen" size={7} weight="600" fill="rgba(96,165,250,0.8)" />

      {/* ── LoRA Branch: Down-projection A ── */}
      <Box x={340} y={148} w={160} h={50} fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.4)" />
      <Txt x={420} y={167} text="A (Down-Project)" size={10} fill="rgba(251,191,36,0.9)" />
      <Txt x={420} y={183} text="d → r  (r ≪ d)" size={8.5} weight="400" fill="rgba(251,191,36,0.5)" />
      <Txt x={420} y={194} text="Gaussian init" size={7.5} weight="400" fill="rgba(251,191,36,0.4)" />

      {/* trainable badge */}
      <Box x={342} y={143} w={55} h={16} fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.4)" rx={8} />
      <Txt x={369} y={155} text="🔥 trainable" size={7} weight="600" fill="rgba(251,191,36,0.8)" />

      <Arr x1={420} y1={198} x2={420} y2={228} />

      {/* ── LoRA Bottleneck visualization ── */}
      <Box x={390} y={228} w={60} h={34} fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.5)" rx={6} />
      <Txt x={420} y={249} text={`rank r`} size={9} weight="600" fill="rgba(251,191,36,0.9)" />

      <Arr x1={420} y1={262} x2={420} y2={292} />

      {/* ── Up-projection B ── */}
      <Box x={340} y={292} w={160} h={50} fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.4)" />
      <Txt x={420} y={311} text="B (Up-Project)" size={10} fill="rgba(251,191,36,0.9)" />
      <Txt x={420} y={327} text="r → d" size={8.5} weight="400" fill="rgba(251,191,36,0.5)" />
      <Txt x={420} y={338} text="Zero init (stable start)" size={7.5} weight="400" fill="rgba(251,191,36,0.4)" />

      {/* trainable badge */}
      <Box x={342} y={287} w={55} h={16} fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.4)" rx={8} />
      <Txt x={369} y={299} text="🔥 trainable" size={7} weight="600" fill="rgba(251,191,36,0.8)" />

      {/* ── Scale factor ── */}
      <Arr x1={420} y1={342} x2={420} y2={368} />
      <Box x={385} y={368} w={70} h={26} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.25)" rx={6} />
      <Txt x={420} y={385} text="× α / r" size={9} weight="600" fill="rgba(251,191,36,0.7)" />

      {/* ── Frozen W output arrow ── */}
      <Arr x1={150} y1={204} x2={150} y2={425} />

      {/* ── LoRA output arrow merging ── */}
      <line x1={420} y1={394} x2={420} y2={425} stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" />
      <line x1={420} y1={425} x2={290} y2={425} stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" />

      {/* ── Addition node ── */}
      <circle cx={265} cy={425} r={16} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <Txt x={265} y={430} text="+" size={16} weight="700" fill="rgba(52,211,153,0.9)" />

      {/* Left arrow into addition */}
      <line x1={150} y1={425} x2={249} y2={425} stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />

      {/* ── Output ── */}
      <Arr x1={265} y1={441} x2={265} y2={474} />
      <Box x={155} y={474} w={220} h={44} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.45)" />
      <Txt x={265} y={493} text="h = W₀x + (α/r) · BAx" size={11} weight="700" fill="rgba(52,211,153,0.9)" />
      <Txt x={265} y={510} text="Effective weight: W₀ + ΔW" size={8} weight="400" fill="rgba(52,211,153,0.5)" />

      {/* ── Side note: LoRA config for SD ── */}
      <SideNote x={540} y={130} w={165} h={108} fill="rgba(236,72,153,0.06)" stroke="rgba(236,72,153,0.2)"
        lines={[
          { text: "LoRA for Stable Diffusion", color: "rgba(244,114,182,0.7)", size: 8 },
          { text: "SD 2.1: r=32, α=64", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "SDXL: r=16, α=16", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "SD 3.5: r=64, α=64", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "Target: to_q, to_k, to_v, to_out", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "~0.1-1% of full params", color: "rgba(244,114,182,0.45)", size: 7.5 },
          { text: "Attn layers only", color: "rgba(244,114,182,0.45)", size: 7.5 },
        ]}
      />

      {/* ── Side note: LoRA config for PanDerm ── */}
      <SideNote x={540} y={290} w={165} h={82} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)"
        lines={[
          { text: "LoRA for PanDerm ViT", color: "rgba(52,211,153,0.7)", size: 8 },
          { text: "Applied to QKV projections", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "24 transformer layers", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "Pretrained weights frozen", color: "rgba(52,211,153,0.45)", size: 7.5 },
          { text: "Only LoRA + head trained", color: "rgba(52,211,153,0.45)", size: 7.5 },
        ]}
      />

      {/* ── Key insight box ── */}
      <Box x={cx - 220} y={535} w={440} h={48} fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.2)" rx={10} />
      <Txt x={cx} y={554} text="Key Insight: Train only r × d + d × r parameters instead of d × d" size={9} weight="600" fill="rgba(196,181,253,0.7)" />
      <Txt x={cx} y={572} text="For d=1024, r=16: 32,768 params vs 1,048,576 — a 32× reduction" size={8} weight="400" fill="rgba(196,181,253,0.45)" />
    </svg>
  );
}

/* ════════════════════════════════════════════════
   Accordion wrapper — same pattern as SDModelArchitectures
   ════════════════════════════════════════════════ */
const classifierModels = [
  {
    id: "panderm",
    name: "PanDerm — Dermatology Foundation Model",
    badge: "Classifier",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    desc: "ViT-Large/16 pretrained on 2M+ dermatology images via self-supervised learning (CAEv2 + MAE)",
    specs: [
      { label: "Architecture", value: "ViT-Large/16 (307M params)" },
      { label: "Pretraining", value: "SSL on 2M+ images, 4 modalities" },
      { label: "Hidden Dim", value: "1024, 16 heads, 24 layers" },
      { label: "Input", value: "224 × 224 px, ImageNet norm" },
      { label: "Fine-tuning", value: "LR=5e-4, BS=128, 50 epochs" },
      { label: "Reference", value: "Yan et al. — Nature Medicine 2025" },
    ],
    Pipeline: PipelinePanDerm,
  },
  {
    id: "lora",
    name: "LoRA — Low-Rank Adaptation",
    badge: "Fine-tuning",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-400/40",
    desc: "Parameter-efficient fine-tuning via low-rank decomposition of weight updates (ΔW = BA)",
    specs: [
      { label: "Method", value: "Low-Rank Decomposition (Hu et al. 2021)" },
      { label: "Concept", value: "ΔW = B·A where B∈ℝᵈˣʳ, A∈ℝʳˣᵈ" },
      { label: "SD Targets", value: "to_q, to_k, to_v, to_out (attn)" },
      { label: "ViT Targets", value: "QKV projections (24 layers)" },
      { label: "Scaling", value: "α / r scaling factor per layer" },
      { label: "Efficiency", value: "~0.1-1% trainable params vs full" },
    ],
    Pipeline: PipelineLoRA,
  },
];

export function ClassifierModelArchitectures() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {classifierModels.map((model) => (
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
                  <div className="flex justify-center">
                    <MathFormulas formulas={
                      model.id === "panderm" ? pandermFormulas : loraFormulas
                    } />
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
