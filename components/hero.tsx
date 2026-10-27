"use client";

import { ArrowRight, Heart } from "lucide-react";
import { useEffect, useRef } from "react";
import { getPublicAssetPath } from "@/lib/get-public-asset-path";
import { StatNumber } from "./stat-number";
import { Button } from "./ui/button";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scrollFrame = 0;
    let seekFrame = 0;
    let targetTime = 0;
    let renderedTime = video.currentTime;

    const seekTowardsTarget = () => {
      seekFrame = 0;
      if (reducedMotion.matches) return;
      const duration = video.duration;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA || !Number.isFinite(duration) || duration <= 0) return;
      if (video.seeking) return;

      const difference = targetTime - renderedTime;
      renderedTime = Math.abs(difference) <= 0.012
        ? targetTime
        : renderedTime + difference * 0.32;

      if (Math.abs(video.currentTime - renderedTime) > 0.006) {
        video.currentTime = renderedTime;
      }

      if (Math.abs(targetTime - renderedTime) > 0.012 && !video.seeking) {
        seekFrame = requestAnimationFrame(seekTowardsTarget);
      }
    };

    const scheduleSeek = () => {
      if (seekFrame || video.seeking) return;
      seekFrame = requestAnimationFrame(seekTowardsTarget);
    };

    const updateTargetTime = () => {
      scrollFrame = 0;
      if (reducedMotion.matches) return;
      const duration = video.duration;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA || !Number.isFinite(duration) || duration <= 0) return;

      const heroTop = window.scrollY + hero.getBoundingClientRect().top;
      const scrollDistance = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, (window.scrollY - heroTop) / scrollDistance));
      targetTime = progress * Math.max(duration - 0.04, 0);
      scheduleSeek();
    };

    const scheduleTargetUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateTargetTime);
    };

    const prepareVideo = () => {
      video.pause();
      renderedTime = video.currentTime;
      scheduleTargetUpdate();
    };

    const continueSeek = () => scheduleSeek();
    const updateMotionPreference = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(scrollFrame);
        cancelAnimationFrame(seekFrame);
        scrollFrame = 0;
        seekFrame = 0;
        video.pause();
        renderedTime = video.currentTime;
        return;
      }

      scheduleTargetUpdate();
    };

    video.addEventListener("loadedmetadata", prepareVideo);
    video.addEventListener("loadeddata", prepareVideo);
    video.addEventListener("seeked", continueSeek);
    window.addEventListener("scroll", scheduleTargetUpdate, { passive: true });
    window.addEventListener("resize", scheduleTargetUpdate);
    reducedMotion.addEventListener("change", updateMotionPreference);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      prepareVideo();
    } else {
      video.load();
    }

    scheduleTargetUpdate();

    return () => {
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(seekFrame);
      video.removeEventListener("loadedmetadata", prepareVideo);
      video.removeEventListener("loadeddata", prepareVideo);
      video.removeEventListener("seeked", continueSeek);
      window.removeEventListener("scroll", scheduleTargetUpdate);
      window.removeEventListener("resize", scheduleTargetUpdate);
      reducedMotion.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" ref={heroRef}>
      <div className="hero__sticky">
        <video
          className="hero__video"
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={getPublicAssetPath("/videos/hero/hero-instituto-semeando-futuro.webm")} type="video/webm" />
        </video>
        <div className="hero__video-overlay" aria-hidden="true" />
        <div className="hero__mesh" aria-hidden="true" />
        <div className="container hero__layout">
          <div className="hero__intro">
            <p className="eyebrow eyebrow--light"><Heart size={15} fill="currentColor" /> Transformando vidas desde 2025</p>
            <h1 id="hero-title" tabIndex={-1}>Cuidando de vidas,<span>promovendo dignidade</span></h1>
            <p className="hero__summary">Acolhimento, inclusão e esperança para famílias em situação de vulnerabilidade social no Rio Grande do Norte.</p>
            <div className="hero__actions">
              <Button asChild variant="light"><a href="#como-apoiar">Apoiar agora <ArrowRight size={18} /></a></Button>
              <Button asChild variant="ghost"><a href="#quem-somos">Conhecer a ONG</a></Button>
            </div>
            <div className="hero__stats" aria-label="Números do Instituto">
              <div><strong><StatNumber value={74} /></strong><span>Famílias atendidas</span></div>
              <div className="hero__stat-divider" aria-hidden="true" />
              <div><strong><StatNumber value={37} /></strong><span>Voluntários</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
