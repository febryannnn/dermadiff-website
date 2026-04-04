"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  // Back layer
  { src: "/lesions/mel.jpg", x: "2%", y: "5%", z: -260, rotateX: 14, rotateY: -20, rotateZ: -6, width: 280, height: 210, delay: 0 },
  { src: "/lesions/nv.jpg", x: "65%", y: "2%", z: -240, rotateX: -10, rotateY: 18, rotateZ: 4, width: 300, height: 225, delay: 0.4 },
  { src: "/lesions/bkl.jpg", x: "30%", y: "68%", z: -280, rotateX: 12, rotateY: 14, rotateZ: -3, width: 260, height: 195, delay: 0.8 },
  { src: "/lesions/extra2.jpg", x: "78%", y: "58%", z: -220, rotateX: -16, rotateY: -12, rotateZ: 5, width: 250, height: 187, delay: 1.2 },

  // Mid layer
  { src: "/lesions/bcc.jpg", x: "12%", y: "38%", z: -120, rotateX: -8, rotateY: 22, rotateZ: -9, width: 220, height: 165, delay: 0.2 },
  { src: "/lesions/akiec.jpg", x: "55%", y: "28%", z: -140, rotateX: 10, rotateY: -24, rotateZ: 6, width: 210, height: 157, delay: 0.6 },
  { src: "/lesions/vasc.jpg", x: "5%", y: "65%", z: -110, rotateX: -12, rotateY: 16, rotateZ: -4, width: 200, height: 150, delay: 1.0 },
  { src: "/lesions/mel2.jpg", x: "45%", y: "8%", z: -100, rotateX: 16, rotateY: -10, rotateZ: 7, width: 230, height: 172, delay: 1.4 },

  // Front layer
  { src: "/lesions/df.jpg", x: "-2%", y: "18%", z: -40, rotateX: -5, rotateY: 28, rotateZ: -12, width: 190, height: 142, delay: 0.3 },
  { src: "/lesions/extra1.jpg", x: "70%", y: "42%", z: -25, rotateX: 7, rotateY: -30, rotateZ: 8, width: 200, height: 150, delay: 0.7 },
  { src: "/lesions/nv.jpg", x: "25%", y: "48%", z: -50, rotateX: -14, rotateY: 18, rotateZ: -5, width: 180, height: 135, delay: 1.1 },
  { src: "/lesions/mel.jpg", x: "85%", y: "10%", z: -60, rotateX: 12, rotateY: -14, rotateZ: 10, width: 195, height: 146, delay: 1.5 },
];

function FloatingCard({
  photo,
  mouseX,
  mouseY,
  isActive,
}: {
  photo: FloatingPhoto;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  isActive: boolean;
}) {
  const depth = Math.abs(photo.z);
  const opacity = depth > 200 ? 0.45 : depth > 100 ? 0.6 : 0.75;
  const blur = depth > 200 ? 6 : depth > 100 ? 3 : 1;
  const scale = depth > 200 ? 0.85 : depth > 100 ? 0.92 : 1;

  // Parallax intensity based on depth — closer cards move more
  const parallaxFactor = depth > 200 ? 0.015 : depth > 100 ? 0.035 : 0.06;

  const translateX = useTransform(mouseX, (v) => v * parallaxFactor * (photo.rotateY > 0 ? 1 : -1));
  const translateY = useTransform(mouseY, (v) => v * parallaxFactor);
  const tiltX = useTransform(mouseY, (v) => photo.rotateX + v * 0.02);
  const tiltY = useTransform(mouseX, (v) => photo.rotateY + v * 0.02);

  const floatY = depth > 150 ? 6 : depth > 80 ? 10 : 14;
  const floatX = depth > 150 ? 3 : depth > 80 ? 5 : 8;
  const duration = 5 + depth * 0.04;

  return (
    <motion.div
      className="absolute"
      style={{
        left: photo.x,
        top: photo.y,
        width: photo.width * scale,
        height: photo.height * scale,
        transformStyle: "preserve-3d",
        x: translateX,
        y: translateY,
        rotateX: isActive ? tiltX : photo.rotateX,
        rotateY: isActive ? tiltY : photo.rotateY,
      }}
      initial={{
        opacity: 0,
        z: photo.z - 150,
        rotateZ: photo.rotateZ,
        scale: 0.5,
      }}
      animate={{
        opacity: [0, opacity, opacity * 0.85, opacity * 0.95, opacity],
        z: [photo.z - 150, photo.z, photo.z + 15, photo.z - 8, photo.z],
        rotateZ: photo.rotateZ,
        scale: [0.5, 1, 0.97, 1.01, 1],
      }}
      transition={{
        delay: photo.delay,
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.12, 0.45, 0.75, 1],
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          filter: `blur(${blur}px) saturate(0.2)`,
          mixBlendMode: "luminosity",
          boxShadow: `
            0 ${8 + depth * 0.1}px ${20 + depth * 0.2}px rgba(0, 0, 0, 0.4),
            0 2px 6px rgba(0, 0, 0, 0.25)
          `,
        }}
      >
        <Image
          src={photo.src}
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          sizes="300px"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-40" />
      </div>
    </motion.div>
  );
}

export function LesionGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Smooth spring for fluid mouse-following
  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20, mass: 0.5 });
  const mouseY = useSpring(rawMouseX, { stiffness: 50, damping: 20, mass: 0.5 });

  // Fix: mouseY spring should follow rawMouseY
  const mouseYCorrected = useSpring(rawMouseY, { stiffness: 50, damping: 20, mass: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Normalize to -1..1 from center
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      rawMouseX.set(x * 100);
      rawMouseY.set(y * 100);
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => {
      setIsActive(false);
      rawMouseX.set(0);
      rawMouseY.set(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rawMouseX, rawMouseY]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ perspective: "1000px", perspectiveOrigin: "50% 40%", cursor: "default" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.04] blur-[120px]"
          style={{
            x: useTransform(mouseX, (v) => v * 0.3),
            y: useTransform(mouseYCorrected, (v) => v * 0.3),
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-[450px] h-[450px] rounded-full bg-blue-500/[0.03] blur-[120px]"
          style={{
            x: useTransform(mouseX, (v) => v * -0.2),
            y: useTransform(mouseYCorrected, (v) => v * -0.2),
          }}
        />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/[0.02] blur-[150px]" />
      </div>

      {/* Floating photos with parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {photos.map((photo, i) => (
          <FloatingCard
            key={`${photo.src}-${i}`}
            photo={photo}
            mouseX={mouseX}
            mouseY={mouseYCorrected}
            isActive={isActive}
          />
        ))}
      </div>

      {/* === Vignette layers === */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_50%_45%,_var(--background)_0%,_transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_65%_55%_at_50%_45%,_var(--background)_0%,_transparent_80%)] opacity-70" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_25%,_var(--background)_85%)]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/80 via-transparent to-transparent h-[30%]" />
      <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}