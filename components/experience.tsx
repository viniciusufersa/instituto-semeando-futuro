"use client";

import gsap from "gsap";
import Lenis from "lenis";
import { ArrowUp } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function Experience() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;
    const update = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero__intro > *",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.15 },
      );
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      context.revert();
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
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <button
        className={`back-to-top ${showTop ? "back-to-top--visible" : ""}`}
        type="button"
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={19} />
      </button>
    </>
  );
}
