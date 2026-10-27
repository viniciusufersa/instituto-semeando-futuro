"use client";

import gsap from "gsap";
import Lenis from "lenis";
import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function Experience() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let frame = 0;
    let revertIntro: (() => void) | undefined;

    const stopMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lenis?.destroy();
      lenis = null;
      revertIntro?.();
      revertIntro = undefined;
    };

    const startMotion = () => {
      if (reducedMotion.matches || lenis) return;

      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const update = (time: number) => {
        lenis?.raf(time);
        if (lenis) frame = requestAnimationFrame(update);
      };
      frame = requestAnimationFrame(update);

      const context = gsap.context(() => {
        gsap.fromTo(
          ".hero__intro > *",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.15 },
        );
      });
      revertIntro = () => context.revert();
    };

    const updateMotionPreference = () => {
      if (reducedMotion.matches) stopMotion();
      else startMotion();
    };

    startMotion();
    reducedMotion.addEventListener("change", updateMotionPreference);

    return () => {
      reducedMotion.removeEventListener("change", updateMotionPreference);
      stopMotion();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: reduceMotion ? scrollYProgress : progress }} aria-hidden="true" />
      <button
        className={`back-to-top ${showTop ? "back-to-top--visible" : ""}`}
        type="button"
        aria-label="Voltar ao topo"
        onClick={() => {
          const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
          document.getElementById("hero-title")?.focus({ preventScroll: true });
        }}
      >
        <ArrowUp size={19} />
      </button>
    </>
  );
}
