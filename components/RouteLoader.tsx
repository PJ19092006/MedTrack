"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function RouteLoader() {
  const pathname = usePathname();
  const pillRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // how long loader stays

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!pillRef.current || !loading) return;

    gsap.fromTo(
      pillRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3 },
    );

    gsap.to(pillRef.current, {
      rotate: 360,
      duration: 1,
      repeat: -1,
      ease: "linear",
    });
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        ref={pillRef}
        className="w-20 h-10 rounded-full bg-gradient-to-r from-rose-500 to-blue-500 shadow-xl"
      />
    </div>
  );
}
