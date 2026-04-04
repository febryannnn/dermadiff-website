"use client";

import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */
interface GenPerClassRow {
    model: string;
    akiec: string;
    bcc: string;
    df: string;
    mel: string;
    vasc: string;
}

interface OverallGenMetricRow {
    model: string;
    fid: string;
    is: string;
    lpips: string;
    ppl: string;
}

interface Props {
    fidPerClass: GenPerClassRow[];
    isPerClass: GenPerClassRow[];
    lpipsPerClass: GenPerClassRow[];
    genOverall: OverallGenMetricRow[];
}

const CLASSES = ["akiec", "bcc", "df", "mel", "vasc"] as const;
type Cls = (typeof CLASSES)[number];

const MODEL_COLORS: Record<string, { bar: string; dot: string; line: string }> = {
    "SD 2.1": { bar: "rgb(251, 191, 36)", dot: "#fbbf24", line: "#fbbf24" },
    "SDXL": { bar: "rgb(52, 211, 153)", dot: "#34d399", line: "#34d399" },
    "SD 3.5": { bar: "rgb(56, 189, 248)", dot: "#38bdf8", line: "#38bdf8" },
};

function getModelColor(model: string) {
    for (const [key, val] of Object.entries(MODEL_COLORS)) {
        if (model.includes(key)) return val;
    }
    return { bar: "rgb(148, 163, 184)", dot: "#94a3b8", line: "#94a3b8" };
}

function getModelShortName(model: string) {
    if (model.includes("SD 2.1")) return "SD 2.1";
    if (model.includes("SDXL")) return "SDXL";
    if (model.includes("SD 3.5")) return "SD 3.5";
    return model;
}

/* ------------------------------------------------------------------ */
/*  SVG Grouped Bar Chart                                              */
/* ------------------------------------------------------------------ */
function GroupedBarChart({
    data,
    title,
    subtitle,
    yLabel,
    higherIsBetter = false,
    maxY: maxYOverride,
}: {
    data: GenPerClassRow[];
    title: string;
    subtitle: string;
    yLabel: string;
    higherIsBetter?: boolean;
    maxY?: number;
}) {
    const activeModels = data.filter((r) =>
        CLASSES.some((c) => r[c] !== "—" && !isNaN(parseFloat(r[c])))
    );
    if (activeModels.length === 0) return null;

    const W = 640;
    const H = 320;
    const padL = 60;
    const padR = 20;
    const padT = 20;
    const padB = 50;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // parse values
    const parsed = activeModels.map((r) => ({
        model: r.model,
        values: CLASSES.map((c) => {
            const raw = r[c].split("±")[0].trim();
            return parseFloat(raw);
        }),
    }));

    const allVals = parsed.flatMap((p) => p.values.filter((v) => !isNaN(v)));
    const maxVal = maxYOverride ?? Math.ceil(Math.max(...allVals) * 1.15);
    const nGroups = CLASSES.length;
    const groupW = chartW / nGroups;
    const barW = Math.min(groupW / (activeModels.length + 1), 32);
    const totalBarGroupW = barW * activeModels.length;

    // y-axis ticks
    const nTicks = 5;
    const tickStep = maxVal / nTicks;
    const ticks = Array.from({ length: nTicks + 1 }, (_, i) =>
        Math.round(i * tickStep * 100) / 100
    );

    return (
        <Card className="bg-card/60 border border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardHeader>
            <CardContent>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                    {/* grid lines */}
                    {ticks.map((t, i) => {
                        const y = padT + chartH - (t / maxVal) * chartH;
                        return (
                            <g key={i}>
                                <line
                                    x1={padL}
                                    x2={W - padR}
                                    y1={y}
                                    y2={y}
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeDasharray={i === 0 ? "0" : "4 4"}
                                />
                                <text
                                    x={padL - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-white/40"
                                    fontSize={10}
                                    fontFamily="monospace"
                                >
                                    {t % 1 === 0 ? t : t.toFixed(2)}
                                </text>
                            </g>
                        );
                    })}

                    {/* y-axis label */}
                    <text
                        x={14}
                        y={padT + chartH / 2}
                        textAnchor="middle"
                        className="fill-white/50"
                        fontSize={11}
                        transform={`rotate(-90, 14, ${padT + chartH / 2})`}
                    >
                        {yLabel} {higherIsBetter ? "↑" : "↓"}
                    </text>

                    {/* bars */}
                    {CLASSES.map((cls, gi) => {
                        const groupX = padL + gi * groupW + (groupW - totalBarGroupW) / 2;
                        return (
                            <g key={cls}>
                                {parsed.map((model, mi) => {
                                    const val = model.values[gi];
                                    if (isNaN(val)) return null;
                                    const barH = (val / maxVal) * chartH;
                                    const x = groupX + mi * barW;
                                    const y = padT + chartH - barH;
                                    const color = getModelColor(model.model);
                                    return (
                                        <g key={model.model}>
                                            <motion.rect
                                                x={x + 1}
                                                width={barW - 2}
                                                rx={2}
                                                fill={color.bar}
                                                fillOpacity={0.75}
                                                initial={{ y: padT + chartH, height: 0 }}
                                                whileInView={{ y, height: barH }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: gi * 0.05 + mi * 0.1 }}
                                            />
                                            <text
                                                x={x + barW / 2}
                                                y={y - 4}
                                                textAnchor="middle"
                                                className="fill-white/60"
                                                fontSize={8}
                                                fontFamily="monospace"
                                            >
                                                {val % 1 === 0 ? val : val.toFixed(val >= 10 ? 1 : 2)}
                                            </text>
                                        </g>
                                    );
                                })}
                                {/* class label */}
                                <text
                                    x={padL + gi * groupW + groupW / 2}
                                    y={H - padB + 16}
                                    textAnchor="middle"
                                    className="fill-white/50"
                                    fontSize={11}
                                    fontFamily="monospace"
                                >
                                    {cls.toUpperCase()}
                                </text>
                            </g>
                        );
                    })}

                    {/* legend */}
                    {parsed.map((model, mi) => {
                        const color = getModelColor(model.model);
                        const lx = padL + mi * 120;
                        return (
                            <g key={model.model}>
                                <rect
                                    x={lx}
                                    y={H - 14}
                                    width={10}
                                    height={10}
                                    rx={2}
                                    fill={color.bar}
                                    fillOpacity={0.8}
                                />
                                <text
                                    x={lx + 14}
                                    y={H - 5}
                                    className="fill-white/60"
                                    fontSize={10}
                                >
                                    {getModelShortName(model.model)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/*  SVG Scatter Plot: LPIPS vs FID                                     */
/* ------------------------------------------------------------------ */
function LpipsFidScatter({
    fidData,
    lpipsData,
}: {
    fidData: GenPerClassRow[];
    lpipsData: GenPerClassRow[];
}) {
    // Build points: each point = (fid, lpips) for one class in one model
    const points: { model: string; cls: string; fid: number; lpips: number }[] = [];
    fidData.forEach((fidRow) => {
        const lpipsRow = lpipsData.find((l) => l.model === fidRow.model);
        if (!lpipsRow) return;
        CLASSES.forEach((cls) => {
            const f = parseFloat(fidRow[cls]);
            const l = parseFloat(lpipsRow[cls]);
            if (!isNaN(f) && !isNaN(l)) {
                points.push({ model: fidRow.model, cls, fid: f, lpips: l });
            }
        });
    });

    if (points.length === 0) return null;

    const W = 520;
    const H = 380;
    const padL = 65;
    const padR = 30;
    const padT = 25;
    const padB = 55;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const allFid = points.map((p) => p.fid);
    const allLpips = points.map((p) => p.lpips);
    const minFid = Math.floor(Math.min(...allFid) * 0.9);
    const maxFid = Math.ceil(Math.max(...allFid) * 1.1);
    const minLpips = Math.floor(Math.min(...allLpips) * 100 - 2) / 100;
    const maxLpips = Math.ceil(Math.max(...allLpips) * 100 + 2) / 100;

    const toX = (fid: number) => padL + ((fid - minFid) / (maxFid - minFid)) * chartW;
    const toY = (lpips: number) => padT + chartH - ((lpips - minLpips) / (maxLpips - minLpips)) * chartH;

    // Group by model for lines
    const models = [...new Set(points.map((p) => p.model))];

    // FID ticks
    const fidTicks = 5;
    const fidStep = (maxFid - minFid) / fidTicks;
    const fTicks = Array.from({ length: fidTicks + 1 }, (_, i) =>
        Math.round(minFid + i * fidStep)
    );

    // LPIPS ticks
    const lpipsTicks = 5;
    const lpipsStep = (maxLpips - minLpips) / lpipsTicks;
    const lTicks = Array.from({ length: lpipsTicks + 1 }, (_, i) =>
        Math.round((minLpips + i * lpipsStep) * 1000) / 1000
    );

    return (
        <Card className="bg-card/60 border border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">LPIPS vs FID — Per-Class Scatter</CardTitle>
                <p className="text-xs text-muted-foreground">
                    Ideal position: bottom-left (low FID, moderate-high LPIPS). Each point represents one lesion class.
                </p>
            </CardHeader>
            <CardContent>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                    {/* grid */}
                    {fTicks.map((t, i) => {
                        const x = toX(t);
                        return (
                            <line key={`fx${i}`} x1={x} x2={x} y1={padT} y2={padT + chartH}
                                stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        );
                    })}
                    {lTicks.map((t, i) => {
                        const y = toY(t);
                        return (
                            <g key={`ly${i}`}>
                                <line x1={padL} x2={padL + chartW} y1={y} y2={y}
                                    stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                                <text x={padL - 8} y={y + 3} textAnchor="end"
                                    className="fill-white/40" fontSize={9} fontFamily="monospace">
                                    {t.toFixed(3)}
                                </text>
                            </g>
                        );
                    })}

                    {/* axis labels */}
                    <text
                        x={padL + chartW / 2} y={H - 8}
                        textAnchor="middle" className="fill-white/50" fontSize={11}
                    >
                        FID ↓
                    </text>
                    <text
                        x={12} y={padT + chartH / 2}
                        textAnchor="middle" className="fill-white/50" fontSize={11}
                        transform={`rotate(-90, 12, ${padT + chartH / 2})`}
                    >
                        LPIPS ↑
                    </text>

                    {/* x-axis tick labels */}
                    {fTicks.map((t, i) => (
                        <text key={`ftl${i}`} x={toX(t)} y={padT + chartH + 16}
                            textAnchor="middle" className="fill-white/40" fontSize={9} fontFamily="monospace">
                            {t}
                        </text>
                    ))}

                    {/* lines connecting classes per model */}
                    {models.map((model) => {
                        const mPoints = points
                            .filter((p) => p.model === model)
                            .sort((a, b) => a.fid - b.fid);
                        if (mPoints.length < 2) return null;
                        const color = getModelColor(model);
                        const pathD = mPoints
                            .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.fid)} ${toY(p.lpips)}`)
                            .join(" ");
                        return (
                            <motion.path
                                key={model}
                                d={pathD}
                                fill="none"
                                stroke={color.line}
                                strokeWidth={1.5}
                                strokeOpacity={0.5}
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        );
                    })}

                    {/* dots */}
                    {points.map((p, i) => {
                        const color = getModelColor(p.model);
                        return (
                            <g key={i}>
                                <motion.circle
                                    cx={toX(p.fid)}
                                    cy={toY(p.lpips)}
                                    r={6}
                                    fill={color.dot}
                                    fillOpacity={0.85}
                                    stroke={color.dot}
                                    strokeWidth={1}
                                    strokeOpacity={0.3}
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                                />
                                <text
                                    x={toX(p.fid)}
                                    y={toY(p.lpips) - 10}
                                    textAnchor="middle"
                                    className="fill-white/50"
                                    fontSize={8}
                                    fontFamily="monospace"
                                >
                                    {p.cls}
                                </text>
                            </g>
                        );
                    })}

                    {/* legend */}
                    {models.map((model, mi) => {
                        const color = getModelColor(model);
                        const lx = padL + mi * 130;
                        return (
                            <g key={model}>
                                <circle cx={lx + 5} cy={H - 30} r={4} fill={color.dot} fillOpacity={0.85} />
                                <text x={lx + 14} y={H - 27} className="fill-white/60" fontSize={10}>
                                    {getModelShortName(model)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/*  SVG Radar Chart                                                    */
/* ------------------------------------------------------------------ */
function RadarChart({
    genOverall,
}: {
    genOverall: OverallGenMetricRow[];
}) {
    const activeModels = genOverall.filter(
        (r) => r.fid !== "—" && r.is !== "—" && r.lpips !== "—"
    );
    if (activeModels.length === 0) return null;

    const metrics = ["FID", "IS", "LPIPS"] as const;
    const W = 400;
    const H = 380;
    const cx = W / 2;
    const cy = H / 2 - 10;
    const R = 130;
    const nAxes = metrics.length;

    // normalize: FID invert (lower=better→higher normalized), IS & LPIPS higher=better
    const fidVals = activeModels.map((r) => parseFloat(r.fid));
    const isVals = activeModels.map((r) => parseFloat(r.is.split("±")[0].trim()));
    const lpipsVals = activeModels.map((r) => parseFloat(r.lpips));

    const maxFid = Math.max(...fidVals);
    const maxIs = Math.max(...isVals) * 1.2;
    const maxLpips = 0.7;

    function getNormalized(row: OverallGenMetricRow): number[] {
        const fid = parseFloat(row.fid);
        const is_ = parseFloat(row.is.split("±")[0].trim());
        const lpips = parseFloat(row.lpips);
        return [
            1 - fid / (maxFid * 1.3), // invert: lower FID = higher on radar
            is_ / maxIs,
            lpips / maxLpips,
        ];
    }

    const angleStep = (2 * Math.PI) / nAxes;
    const startAngle = -Math.PI / 2;

    function polarToXY(angle: number, r: number): [number, number] {
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    }

    // concentric rings
    const rings = [0.25, 0.5, 0.75, 1.0];

    return (
        <Card className="bg-card/60 border border-white/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Overall Quality Radar</CardTitle>
                <p className="text-xs text-muted-foreground">
                    Larger area = better overall generative quality. FID is inverted (outer = lower FID).
                </p>
            </CardHeader>
            <CardContent className="flex justify-center">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md h-auto">
                    {/* rings */}
                    {rings.map((r, i) => {
                        const pts = Array.from({ length: nAxes }, (_, ai) => {
                            const angle = startAngle + ai * angleStep;
                            return polarToXY(angle, R * r).join(",");
                        }).join(" ");
                        return (
                            <polygon
                                key={i}
                                points={pts}
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* axes */}
                    {metrics.map((m, i) => {
                        const angle = startAngle + i * angleStep;
                        const [ex, ey] = polarToXY(angle, R);
                        const [lx, ly] = polarToXY(angle, R + 20);
                        return (
                            <g key={m}>
                                <line x1={cx} y1={cy} x2={ex} y2={ey}
                                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                                <text x={lx} y={ly + 4} textAnchor="middle"
                                    className="fill-white/60" fontSize={11} fontWeight={500}>
                                    {m}
                                </text>
                            </g>
                        );
                    })}

                    {/* model polygons */}
                    {activeModels.map((row, mi) => {
                        const norm = getNormalized(row);
                        const color = getModelColor(row.model);
                        const pts = norm.map((v, i) => {
                            const angle = startAngle + i * angleStep;
                            return polarToXY(angle, R * Math.max(v, 0.05)).join(",");
                        }).join(" ");
                        return (
                            <g key={row.model}>
                                <motion.polygon
                                    points={pts}
                                    fill={color.dot}
                                    fillOpacity={0.12}
                                    stroke={color.line}
                                    strokeWidth={2}
                                    strokeOpacity={0.8}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: mi * 0.2 }}
                                />
                                {norm.map((v, i) => {
                                    const angle = startAngle + i * angleStep;
                                    const [dx, dy] = polarToXY(angle, R * Math.max(v, 0.05));
                                    return (
                                        <motion.circle
                                            key={i}
                                            cx={dx}
                                            cy={dy}
                                            r={4}
                                            fill={color.dot}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: mi * 0.2 + i * 0.1 }}
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}

                    {/* legend */}
                    {activeModels.map((row, mi) => {
                        const color = getModelColor(row.model);
                        return (
                            <g key={row.model}>
                                <rect x={cx - 80 + mi * 100} y={H - 30} width={10} height={10} rx={2}
                                    fill={color.dot} fillOpacity={0.8} />
                                <text x={cx - 66 + mi * 100} y={H - 21}
                                    className="fill-white/60" fontSize={10}>
                                    {getModelShortName(row.model)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </CardContent>
        </Card>
    );
}

/* ================================================================== */
/*  EXPORTED COMPONENT                                                 */
/* ================================================================== */
export function ResultsGenCharts({ fidPerClass, isPerClass, lpipsPerClass, genOverall }: Props) {
    return (
        <div className="space-y-6">
            {/* Row 1: FID bar chart full width */}

            {/* Row 3: Scatter + Radar side by side */}
            <div className="grid gap-6 sm:grid-cols-2">
                <LpipsFidScatter fidData={fidPerClass} lpipsData={lpipsPerClass} />
                <RadarChart genOverall={genOverall} />
            </div>
        </div>
    );
}