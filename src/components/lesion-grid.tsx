"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FloatingPhoto {
  src: string;
  x: string;
  y: string;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  width: number;
  height: number;
  delay: number;
}

const photos: FloatingPhoto[] = [
  // Back layer (far away, larger, more blurred)
  { src: "/lesions/mel.jpg", x: "5%", y: "8%", z: -200, rotateX: 12, rotateY: -18, rotateZ: -5, width: 240, height: 180, delay: 0 },
  { src: "/lesions/nv.jpg", x: "68%", y: "5%", z: -180, rotateX: -8, rotateY: 15, rotateZ: 3, width: 260, height: 195, delay: 0.3 },
  { src: "/lesions/bkl.jpg", x: "35%", y: "65%", z: -220, rotateX: 10, rotateY: 12, rotateZ: -2, width: 230, height: 172, delay: 0.6 },
  { src: "/lesions/extra2.jpg", x: "75%", y: "60%", z: -160, rotateX: -15, rotateY: -10, rotateZ: 4, width: 220, height: 165, delay: 0.9 },

  // Mid layer
  { src: "/lesions/bcc.jpg", x: "18%", y: "35%", z: -80, rotateX: -6, rotateY: 20, rotateZ: -8, width: 200, height: 150, delay: 0.2 },
  { src: "/lesions/akiec.jpg", x: "60%", y: "30%", z: -100, rotateX: 8, rotateY: -22, rotateZ: 5, width: 190, height: 142, delay: 0.5 },
  { src: "/lesions/vasc.jpg", x: "8%", y: "62%", z: -90, rotateX: -10, rotateY: 14, rotateZ: -3, width: 180, height: 135, delay: 0.8 },
  { src: "/lesions/mel2.jpg", x: "48%", y: "10%", z: -70, rotateX: 14, rotateY: -8, rotateZ: 6, width: 210, height: 157, delay: 1.1 },

  // Front layer (closer, sharper, more prominent)
  { src: "/lesions/df.jpg", x: "2%", y: "15%", z: -30, rotateX: -4, rotateY: 25, rotateZ: -10, width: 170, height: 127, delay: 0.4 },
  { src: "/lesions/extra1.jpg", x: "72%", y: "40%", z: -20, rotateX: 6, rotateY: -28, rotateZ: 7, width: 185, height: 138, delay: 0.7 },
  { src: "/lesions/nv.jpg", x: "30%", y: "45%", z: -40, rotateX: -12, rotateY: 16, rotateZ: -4, width: 160, height: 120, delay: 1.0 },
  { src: "/lesions/mel.jpg", x: "82%", y: "12%", z: -50, rotateX: 10, rotateY: -12, rotateZ: 8, width: 175, height: 131, delay: 1.3 },
];

function FloatingCard({ photo }: { photo: FloatingPhoto }) {
  const depth = Math.abs(photo.z);
  // Closer photos are brighter, farther photos are dimmer
  const brightness = depth > 150 ? 0.3 : depth > 80 ? 0.45 : 0.6;
  const blur = depth > 150 ? 2 : depth > 80 ? 1 : 0;

  return (
    <motion.div
      className="absolute"
      style={{
        left: photo.x,
        top: photo.y,
        width: photo.width,
        height: photo.height,
        transformStyle: "preserve-3d",
      }}
      initial={{
        opacity: 0,
        z: photo.z - 100,
        rotateX: photo.rotateX + 10,
        rotateY: photo.rotateY + 10,
        rotateZ: photo.rotateZ,
        scale: 0.7,
      }}
      animate={{
        opacity: [0, brightness, brightness * 0.85, brightness],
        z: [photo.z - 100, photo.z, photo.z + 10, photo.z],
        rotateX: [photo.rotateX + 10, photo.rotateX, photo.rotateX - 2, photo.rotateX],
        rotateY: [photo.rotateY + 10, photo.rotateY, photo.rotateY + 3, photo.rotateY],
        rotateZ: photo.rotateZ,
        scale: [0.7, 1, 0.98, 1],
        y: [0, -4, 4, 0],
      }}
      transition={{
        delay: photo.delay,
        duration: 12,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.15, 0.6, 1],
      }}
    >
      <div
        className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl shadow-black/50"
        style={{
          filter: `blur(${blur}px)`,
        }}
      >
        <Image
          src={photo.src}
          alt=""
          fill
          className="object-cover grayscale"
          aria-hidden="true"
          sizes="250px"
        />
        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/[0.08]" />
        {/* Top-left light reflection for 3D depth feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/20" />
      </div>
    </motion.div>
  );
}

export function LesionGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1200px" }}>
      {/* 3D floating photos */}
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {photos.map((photo, i) => (
          <FloatingCard key={`${photo.src}-${i}`} photo={photo} />
        ))}
      </div>

      {/* Center readability zone - strong vignette for text */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,_var(--background)_0%,_transparent_100%)]" />
      {/* Edge darkening */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,_var(--background)_100%)]" />
      {/* Top/bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
    </div>
  );
}
