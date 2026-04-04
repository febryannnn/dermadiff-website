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
import { AnimatedResultsPage } from "@/components/results-animations";

import { ConfusionMatrixData } from "@/components/confusion-matrix-section";

export const confusionMatrices: ConfusionMatrixData[] = [
  {
    model: "Exp A (Baseline)",
    labels: ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"],
    // matrix[row][col] = matrix[true][predicted]
    // Replace with your actual values
    matrix: [
      //  akiec  bcc  bkl   df  mel   nv  vasc   ← predicted
      [36, 2, 5, 0, 3, 3, 0], // akiec (true)
      [1, 70, 2, 0, 3, 1, 0], // bcc
      [3, 1, 139, 0, 10, 12, 0], // bkl
      [1, 0, 3, 10, 1, 2, 0], // df
      [3, 5, 14, 0, 119, 26, 0], // mel
      [2, 3, 14, 1, 13, 367, 0], // nv
      [0, 0, 1, 0, 0, 2, 19], // vasc
    ],
  },
  {
    model: "Exp C2 (SD 2.1)",
    labels: ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"],
    matrix: [
      //  akiec  bcc  bkl   df  mel   nv  vasc
      [39, 1, 4, 0, 2, 3, 0],
      [0, 72, 1, 0, 2, 2, 0],
      [3, 1, 139, 0, 9, 13, 0],
      [1, 0, 3, 10, 1, 2, 0],
      [2, 3, 14, 0, 133, 15, 0],
      [3, 4, 16, 1, 18, 358, 0],
      [0, 0, 1, 0, 0, 2, 19],
    ],
  },
  {
    model: "Exp C3 (SDXL)",
    labels: ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"],
    matrix: [
      //  akiec  bcc  bkl   df  mel   nv  vasc
      [41, 1, 3, 0, 2, 2, 0],
      [1, 67, 3, 0, 3, 3, 0],
      [2, 1, 138, 0, 11, 13, 0],
      [0, 0, 2, 12, 1, 2, 0],
      [3, 4, 13, 0, 132, 15, 0],
      [2, 2, 13, 1, 16, 366, 0],
      [0, 0, 1, 0, 0, 1, 19],
    ],
  },
  {
    model: "Exp C4 (SD 3.5 Large)",
    labels: ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"],
    matrix: [
      //  akiec  bcc  bkl   df  mel   nv  vasc
      [38, 1, 4, 0, 3, 3, 0],
      [0, 69, 2, 0, 3, 3, 0],
      [2, 0, 140, 0, 10, 13, 0],
      [0, 0, 2, 12, 1, 2, 0],
      [2, 3, 10, 0, 137, 15, 0],
      [2, 3, 13, 1, 16, 365, 0],
      [0, 0, 1, 0, 0, 2, 19],
    ],
  },
];

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
  {
    model: "Exp C4 (SD 3.5 Large)",
    macroRecall: "0.8318",
    weightedRecall: "0.8869",
    macroF1: "0.8482",
    weightedF1: "0.8913",
    macroPrecision: "0.8769",
    weightedPrecision: "0.9011",
    accuracy: "0.8869",
  },
];



const comparisonMetrics = [
  { metric: "7-class accuracy", a: "—", b: "—", c: "—", d: "0.8869", cva: "—", cvb: "—" },
  { metric: "Weighted F1", a: "0.8785", b: "0.8786", c: "0.8891", d: "0.8913", cva: "+1.2%", cvb: "+1.2%" },
  { metric: "mel recall", a: "0.7126", b: "0.7964", c: "0.7904", d: "0.8204", cva: "+10.9%", cvb: "-0.75%" },
  { metric: "bcc recall", a: "0.9091", b: "0.9351", c: "0.8701", d: "0.8961", cva: "-4.29%", cvb: "-6.96%" },
  { metric: "akiec recall", a: "0.7347", b: "0.7959", c: "0.8367", d: "0.7755", cva: "+13.89%", cvb: "+5.13%" },
  { metric: "df recall", a: "0.5882", b: "0.5882", c: "0.7059", d: "0.7059", cva: "+20.0%", cvb: "+20.0%" },
  { metric: "vasc recall", a: "0.8636", b: "0.8636", c: "0.8636", d: "0.8636", cva: "0%", cvb: "0%" },
  { metric: "3-level risk acc.", a: "—", b: "—", c: "—", d: "—", cva: "—", cvb: "—" },
  { metric: "FID (gen. quality)", a: "N/A", b: "—", c: "—", d: "—", cva: "", cvb: "" },
];

const recallData = [
  { model: "Exp A (Baseline)", akiec: "0.7347", bcc: "0.9091", bkl: "0.8424", df: "0.5882", mel: "0.7126", nv: "0.9175", vasc: "0.8636" },
  { model: "Exp C2 (SD 2.1)", akiec: "0.7959", bcc: "0.9351", bkl: "0.8424", df: "0.5882", mel: "0.7964", nv: "0.8946", vasc: "0.8636" },
  { model: "Exp C3 (SDXL)", akiec: "0.8367", bcc: "0.8701", bkl: "0.8364", df: "0.7059", mel: "0.7904", nv: "0.9145", vasc: "0.8636" },
  { model: "Exp C4 (SD 3.5 Large)", akiec: "0.7755", bcc: "0.8961", bkl: "0.8485", df: "0.7059", mel: "0.8204", nv: "0.9125", vasc: "0.8636" },
];



const f1Data = [
  { model: "Exp A (Baseline)", akiec: "0.8000", bcc: "0.8589", bkl: "0.7493", df: "0.7407", mel: "0.6879", nv: "0.9385", vasc: "0.9048" },
  { model: "Exp C2 (SD 2.1)", akiec: "0.8125", bcc: "0.8944", bkl: "0.7989", df: "0.7407", mel: "0.6717", nv: "0.9298", vasc: "0.9048" },
  { model: "Exp C3 (SDXL)", akiec: "0.8454", bcc: "0.8816", bkl: "0.8142", df: "0.8000", mel: "0.6787", nv: "0.9397", vasc: "0.9268" },
  { model: "Exp C4 (SD 3.5 Large)", akiec: "0.8444", bcc: "0.9079", bkl: "0.8211", df: "0.8000", mel: "0.7008", nv: "0.9363", vasc: "0.9268" },
];

// Tambahkan setelah expectedPerformance array dan sebelum export default

const fidPerClass = [
  { model: "Exp C2 (SD 2.1)", akiec: "136.83", bcc: "111.42", df: "214.49", mel: "107.57", vasc: "149.80" },
  { model: "Exp C3 (SDXL)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
  { model: "Exp C4 (SD 3.5 Large)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
];

const isPerClass = [
  { model: "Exp C2 (SD 2.1)", akiec: "3.08 ± 0.50", bcc: "3.17 ± 0.19", df: "2.51 ± 0.42", mel: "2.89 ± 0.28", vasc: "2.53 ± 0.39" },
  { model: "Exp C3 (SDXL)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
  { model: "Exp C4 (SD 3.5 Large)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
];

const lpipsPerClass = [
  { model: "Exp C2 (SD 2.1)", akiec: "0.4190", bcc: "0.4877", df: "0.3506", mel: "0.5149", vasc: "0.4208" },
  { model: "Exp C3 (SDXL)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
  { model: "Exp C4 (SD 3.5 Large)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
];

const pplPerClass = [
  { model: "Exp C2 (SD 2.1)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
  { model: "Exp C3 (SDXL)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
  { model: "Exp C4 (SD 3.5 Large)", akiec: "—", bcc: "—", df: "—", mel: "—", vasc: "—" },
];

const genOverall = [
  { model: "Exp C2 (SD 2.1)", fid: "144.02", is: "3.43 ± 0.53", lpips: "0.4386", ppl: "—" },
  { model: "Exp C3 (SDXL)", fid: "—", is: "—", lpips: "—", ppl: "—" },
  { model: "Exp C4 (SD 3.5 Large)", fid: "—", is: "—", lpips: "—", ppl: "—" },
];

const expectedPerformance = [
  { cls: "nv", clsFull: "Melanocytic Nevi", noAug: "95-98%", diffusion: "95-98%", gain: "~0%", note: "Already high" },
  { cls: "mel", clsFull: "Melanoma", noAug: "80-85%", diffusion: "85-90%", gain: "+5%", note: "" },
  { cls: "bcc", clsFull: "Basal Cell Carcinoma", noAug: "75-82%", diffusion: "80-88%", gain: "+6%", note: "" },
  { cls: "akiec", clsFull: "Actinic Keratosis", noAug: "60-72%", diffusion: "70-80%", gain: "+8-10%", note: "Largest expected gain" },
  { cls: "vasc", clsFull: "Vascular Lesions", noAug: "70-80%", diffusion: "78-86%", gain: "+6-8%", note: "" },
  { cls: "df", clsFull: "Dermatofibroma", noAug: "55-70%", diffusion: "65-78%", gain: "+8-12%", note: "Most underrepresented" },
];

export default function ResultsPage() {
  return (
    <AnimatedResultsPage
          avgData={avgData}
          recallData={recallData}
          f1Data={f1Data}
          expectedPerformance={expectedPerformance}
          fidPerClass={fidPerClass}
          isPerClass={isPerClass}
          lpipsPerClass={lpipsPerClass}
          pplPerClass={pplPerClass}
          genOverall={genOverall}
          confusionMatrices={confusionMatrices}   // ← add this
        />
  );
}
