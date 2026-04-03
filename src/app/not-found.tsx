"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

// Hardcoded positions to avoid SSR/client hydration mismatch
const cells = [
    { id: 0, x: 82, y: 58, size: 10, delay: 0.2, repeatDelay: 5.1 },
    { id: 1, x: 310, y: 82, size: 17, delay: 1.4, repeatDelay: 4.3 },
    { id: 2, x: 178, y: 210, size: 14, delay: 0.8, repeatDelay: 6.2 },
    { id: 3, x: 55, y: 175, size: 8, delay: 2.0, repeatDelay: 4.8 },
    { id: 4, x: 245, y: 125, size: 20, delay: 0.5, repeatDelay: 5.5 },
    { id: 5, x: 140, y: 95, size: 12, delay: 1.7, repeatDelay: 4.1 },
    { id: 6, x: 350, y: 200, size: 15, delay: 0.3, repeatDelay: 6.8 },
    { id: 7, x: 95, y: 250, size: 22, delay: 1.1, repeatDelay: 5.3 },
    { id: 8, x: 270, y: 45, size: 9, delay: 2.3, repeatDelay: 4.6 },
    { id: 9, x: 190, y: 155, size: 16, delay: 0.6, repeatDelay: 5.9 },
    { id: 10, x: 330, y: 265, size: 11, delay: 1.9, repeatDelay: 4.4 },
    { id: 11, x: 65, y: 120, size: 18, delay: 0.1, repeatDelay: 6.5 },
    { id: 12, x: 215, y: 235, size: 13, delay: 1.3, repeatDelay: 5.0 },
    { id: 13, x: 155, y: 55, size: 7, delay: 2.4, repeatDelay: 4.2 },
    { id: 14, x: 295, y: 180, size: 21, delay: 0.9, repeatDelay: 6.1 },
    { id: 15, x: 120, y: 195, size: 10, delay: 0.4, repeatDelay: 5.7 },
    { id: 16, x: 355, y: 110, size: 14, delay: 1.6, repeatDelay: 4.9 },
    { id: 17, x: 48, y: 75, size: 19, delay: 2.1, repeatDelay: 5.4 },
    { id: 18, x: 230, y: 270, size: 8, delay: 0.7, repeatDelay: 6.7 },
    { id: 19, x: 175, y: 140, size: 16, delay: 1.2, repeatDelay: 4.7 },
    { id: 20, x: 305, y: 225, size: 12, delay: 1.8, repeatDelay: 5.2 },
    { id: 21, x: 75, y: 40, size: 23, delay: 0.0, repeatDelay: 6.0 },
    { id: 22, x: 260, y: 165, size: 11, delay: 2.2, repeatDelay: 4.5 },
    { id: 23, x: 145, y: 255, size: 15, delay: 0.5, repeatDelay: 5.8 },
];

function DermCell({ delay, x, y, size, repeatDelay }: { delay: number; x: number; y: number; size: number; repeatDelay: number }) {
    return (
        <motion.circle
            cx={x}
            cy={y}
            r={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-foreground/[0.04]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: [0, 1, 1.1, 1],
                opacity: [0, 0.6, 0.3, 0.15],
            }}
            transition={{
                delay,
                duration: 3,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay,
            }}
        />
    );
}

export default function NotFoundClient() {
    return (
        <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
            {/* Subtle background pattern — echoes the dermoscopic grid feel */}
            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-60">
                <svg
                    viewBox="0 0 400 300"
                    className="w-[min(90vw,600px)] h-auto"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {cells.map((c) => (
                        <DermCell key={c.id} delay={c.delay} x={c.x} y={c.y} size={c.size} repeatDelay={c.repeatDelay} />
                    ))}
                </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-xl px-4 text-center">
                {/* 404 number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <span className="block text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter text-foreground/[0.06] select-none">
                        404
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="-mt-10 text-2xl font-bold tracking-tight sm:text-3xl"
                >
                    mau nyari ape si
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto"
                >
                    This lesion couldn&rsquo;t be classified — the page you&rsquo;re
                    looking for doesn&rsquo;t exist or has been moved.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-8 flex flex-wrap justify-center gap-3"
                >
                    <Link
                        href="/"
                        className={buttonVariants({ size: "lg", className: "rounded-full px-6" })}
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/methodology"
                        className={buttonVariants({
                            variant: "outline",
                            size: "lg",
                            className: "rounded-full px-6",
                        })}
                    >
                        View Methodology
                    </Link>
                </motion.div>

                {/* Subtle hint text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-12 text-[11px] text-muted-foreground/40 font-mono uppercase tracking-widest"
                >
                    DermaDiff &middot; KCVanguard
                </motion.p>
            </div>
        </section>
    );
}