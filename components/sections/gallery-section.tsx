"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { galleryItems, type GalleryItem } from "@/data/gallery";
import { BrandMotif } from "@/components/brand-motif";

const GALLERY_COPY_COUNT = 3;
const INITIAL_GALLERY_INDEX = galleryItems.length;
const carouselItems = Array.from({ length: GALLERY_COPY_COUNT }, (_, copyIndex) =>
  galleryItems.map((item) => ({ copyIndex, item })),
).flat();
const DESKTOP_MIN_SCALE = 0.76;
const DESKTOP_MAX_SCALE = 1.08;
const MOBILE_MIN_SCALE = 0.82;
const MOBILE_MAX_SCALE = 1.04;
const CENTER_SHIFT_Y = 14;
const GALLERY_GAP = {
  desktop: 16,
  tablet: 14,
  mobile: 12,
} as const;

function getGalleryGap(viewportWidth: number) {
  if (viewportWidth <= 520) return GALLERY_GAP.mobile;
  if (viewportWidth <= 800) return GALLERY_GAP.tablet;
  return GALLERY_GAP.desktop;
}

function GalleryVideo({ item, onMediaReady }: { item: GalleryItem; onMediaReady: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isNearViewport = false;
    const updatePlayback = () => {
      if (!isNearViewport) {
        video.pause();
        return;
      }

      if (reducedMotion.matches) {
        video.pause();
        video.preload = "metadata";
        if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
        return;
      }

      void video.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isNearViewport = entry.isIntersecting;
      updatePlayback();
    }, { rootMargin: "100px" });

    observer.observe(video);
    reducedMotion.addEventListener("change", updatePlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updatePlayback);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="gallery-card__media"
      muted
      playsInline
      loop
      draggable={false}
      preload="none"
      aria-hidden="true"
      onLoadedMetadata={onMediaReady}
    >
      <source src={item.src} type={item.mimeType ?? "video/webm"} />
    </video>
  );
}

function GalleryCard({
  item,
  isAccessible,
  slideNumber,
  slideCount,
  onMediaReady,
}: {
  item: GalleryItem;
  isAccessible: boolean;
  slideNumber: number;
  slideCount: number;
  onMediaReady: () => void;
}) {
  const isPlaceholder = item.type === "placeholder" || !item.src;

  return (
    <div
      className="embla__slide gallery-slide"
      role="group"
      aria-roledescription="slide"
      aria-label={`${slideNumber} de ${slideCount}`}
      aria-hidden={!isAccessible}
      inert={!isAccessible}
    >
      <figure
        className={`gallery-card${isPlaceholder ? " gallery-card--placeholder" : ""}`}
        style={{ "--gallery-object-position": item.objectPosition ?? "center" } as CSSProperties}
      >
        {item.type === "image" && item.src && item.alt ? (
          <Image
            className="gallery-card__media"
            src={item.src}
            alt={item.alt}
            fill
            draggable={false}
            unoptimized
            onLoad={onMediaReady}
            sizes="(max-width: 520px) 164px, (max-width: 800px) 176px, 190px"
          />
        ) : item.type === "video" && item.src ? (
          <GalleryVideo item={item} onMediaReady={onMediaReady} />
        ) : (
          <div className="gallery-card__placeholder" aria-hidden="true">
            <ImageIcon aria-hidden="true" />
          </div>
        )}
        {item.type === "video" && item.alt && <figcaption className="sr-only">{item.alt}</figcaption>}
      </figure>
    </div>
  );
}

export function GallerySection() {
  const hasUserInteracted = useRef(false);
  const horizontalShifts = useRef(new Map<HTMLElement, number>());
  const reducedMotionRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(INITIAL_GALLERY_INDEX);
  const [viewportRef, embla] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    dragFree: true,
    loop: true,
    skipSnaps: true,
    startIndex: INITIAL_GALLERY_INDEX,
  });

  const updateTunnelEffect = useCallback(() => {
    if (!embla || reducedMotionRef.current) return;

    const viewportRect = embla.rootNode().getBoundingClientRect();
    if (viewportRect.width === 0) return;

    const viewportCenter = viewportRect.left + (viewportRect.width / 2);
    const isMobile = viewportRect.width <= 520;
    const minScale = isMobile ? MOBILE_MIN_SCALE : DESKTOP_MIN_SCALE;
    const maxScale = isMobile ? MOBILE_MAX_SCALE : DESKTOP_MAX_SCALE;
    const galleryGap = getGalleryGap(window.innerWidth);

    const slides = embla.slideNodes().flatMap((slide) => {
      const card = slide.querySelector<HTMLElement>(".gallery-card");
      if (!card) return [];

      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + (slideRect.width / 2);
      const distanceFromCenter = Math.abs(slideCenter - viewportCenter);
      const distanceRatio = Math.min(distanceFromCenter / (viewportRect.width / 2), 1);
      const positionFactor = distanceRatio * distanceRatio * (3 - (2 * distanceRatio));
      const scale = minScale + ((maxScale - minScale) * positionFactor);
      const shiftY = CENTER_SHIFT_Y * (1 - positionFactor);

      card.style.setProperty("--gallery-scale", scale.toFixed(4));
      card.style.setProperty("--gallery-shift-y", `${shiftY.toFixed(2)}px`);
      slide.style.zIndex = String(Math.round(positionFactor * 10));

      return [{
        card,
        center: slideCenter,
        visualWidth: card.offsetWidth * scale,
      }];
    }).sort((first, second) => first.center - second.center);

    if (slides.length === 0) return;

    const targetCenters = new Map<HTMLElement, number>();
    targetCenters.set(slides[0].card, slides[0].center);

    for (let index = 1; index < slides.length; index += 1) {
      const previous = slides[index - 1];
      const current = slides[index];
      const previousTarget = targetCenters.get(previous.card) ?? previous.center;

      targetCenters.set(
        current.card,
        previousTarget + (previous.visualWidth / 2) + galleryGap + (current.visualWidth / 2),
      );
    }

    const rawShifts = slides.map((slide) => ({
      ...slide,
      shift: (targetCenters.get(slide.card) ?? slide.center) - slide.center,
    }));
    const visibleShifts = rawShifts.filter(({ center, visualWidth }) => (
      center + (visualWidth / 2) >= viewportRect.left
      && center - (visualWidth / 2) <= viewportRect.right
    ));
    const previousCorrections = visibleShifts.flatMap(({ card, shift }) => {
      const previousShift = horizontalShifts.current.get(card);
      return previousShift === undefined ? [] : [previousShift - shift];
    });
    const centerSlide = rawShifts.reduce((closest, current) => (
      Math.abs(current.center - viewportCenter) < Math.abs(closest.center - viewportCenter)
        ? current
        : closest
    ));
    const correction = previousCorrections.length > 0
      ? previousCorrections.reduce((total, value) => total + value, 0) / previousCorrections.length
      : -centerSlide.shift;

    rawShifts.forEach(({ card, shift }) => {
      const compensatedShift = shift + correction;
      horizontalShifts.current.set(card, compensatedShift);
      card.style.setProperty("--gallery-shift-x", `${compensatedShift.toFixed(2)}px`);
    });
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotion.matches;

    const markAsInteracted = () => {
      hasUserInteracted.current = true;
    };
    const updateSelectedIndex = () => setSelectedIndex(embla.selectedScrollSnap());
    const updateReducedMotion = () => {
      reducedMotionRef.current = reducedMotion.matches;
      updateTunnelEffect();
    };

    embla.on("scroll", updateTunnelEffect);
    embla.on("select", updateTunnelEffect);
    embla.on("reInit", updateTunnelEffect);
    embla.on("resize", updateTunnelEffect);
    embla.on("select", updateSelectedIndex);
    embla.on("reInit", updateSelectedIndex);
    embla.on("pointerDown", markAsInteracted);
    reducedMotion.addEventListener("change", updateReducedMotion);
    embla.reInit();
    embla.scrollTo(INITIAL_GALLERY_INDEX, true);
    updateSelectedIndex();
    updateTunnelEffect();

    return () => {
      embla.off("scroll", updateTunnelEffect);
      embla.off("select", updateTunnelEffect);
      embla.off("reInit", updateTunnelEffect);
      embla.off("resize", updateTunnelEffect);
      embla.off("select", updateSelectedIndex);
      embla.off("reInit", updateSelectedIndex);
      embla.off("pointerDown", markAsInteracted);
      reducedMotion.removeEventListener("change", updateReducedMotion);
    };
  }, [embla, updateTunnelEffect]);

  const handleMediaReady = useCallback(() => {
    if (!embla) return;

    embla.reInit();
    if (!hasUserInteracted.current) {
      embla.scrollTo(INITIAL_GALLERY_INDEX, true);
    }
    updateTunnelEffect();
  }, [embla, updateTunnelEffect]);

  const scrollPrevious = () => {
    if (!embla) return;
    hasUserInteracted.current = true;
    embla.scrollPrev(reducedMotionRef.current);
  };

  const scrollNext = () => {
    if (!embla) return;
    hasUserInteracted.current = true;
    embla.scrollNext(reducedMotionRef.current);
  };

  if (galleryItems.length === 0) return null;

  const selectedItem = galleryItems[selectedIndex % galleryItems.length];

  return (
    <section className="section section--gallery" aria-labelledby="gallery-title">
      <BrandMotif className="gallery__brand-motif" variant="geometry" />
      <header className="container gallery-heading">
        <h2 id="gallery-title">Galeria</h2>
        <p className="gallery-heading__description">
          Conheça de perto os momentos, ações e histórias que dão vida ao nosso trabalho.
        </p>
      </header>

      <div className="embla gallery-embla">
        <div
          className="embla__viewport gallery-marquee"
          ref={viewportRef}
          id="gallery-carousel"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Galeria institucional"
          onDragStart={(event) => event.preventDefault()}
        >
          <div className="embla__container gallery-marquee__track">
            {carouselItems.map(({ copyIndex, item }, index) => (
              <GalleryCard
                item={item}
                isAccessible={copyIndex === 1}
                slideNumber={(index % galleryItems.length) + 1}
                slideCount={galleryItems.length}
                onMediaReady={handleMediaReady}
                key={`${copyIndex}-${item.id}`}
              />
            ))}
          </div>
        </div>
        <div className="gallery-controls" role="group" aria-label="Controles da galeria">
          <button className="gallery-control" type="button" aria-label="Imagem anterior da galeria" aria-controls="gallery-carousel" onClick={scrollPrevious}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <button className="gallery-control" type="button" aria-label="Próxima imagem da galeria" aria-controls="gallery-carousel" onClick={scrollNext}>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Imagem {(selectedIndex % galleryItems.length) + 1} de {galleryItems.length}: {selectedItem.alt ?? selectedItem.id}
        </p>
      </div>
    </section>
  );
}
