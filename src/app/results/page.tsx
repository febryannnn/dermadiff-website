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
    />
  );
}
