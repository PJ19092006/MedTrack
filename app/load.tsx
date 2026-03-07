"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loading() {
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pillRef.current) return;

    gsap.to(pillRef.current, {
      rotate: 360,
      duration: 1.2,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(pillRef.current, {
      y: -10,
      duration: 0.6,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div
          ref={pillRef}
          className="relative w-20 h-10 rounded-full bg-gradient-to-r from-rose-500 to-blue-500 shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-white/20" />
            <div className="w-1/2 bg-black/10" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground tracking-wide animate-pulse">
          Loading medical data...
        </p>
      </div>
    </div>
  );
}
