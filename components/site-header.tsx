"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/site";
import { Brand } from "./brand";

const NAVBAR_SHOW_OFFSET = 80;

type NavbarMode = "hidden" | "transparent" | "solid";

export function SiteHeader() {
  const navbarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [navbarMode, setNavbarMode] = useState<NavbarMode>("hidden");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const navbar = navbarRef.current;
    const aboutSection = document.getElementById("quem-somos");
    if (!navbar || !aboutSection) return;

    let scrollFrame = 0;

    const updateNavbarMode = () => {
      scrollFrame = 0;
      const aboutTop = aboutSection.getBoundingClientRect().top;
      const nextMode: NavbarMode = window.scrollY <= NAVBAR_SHOW_OFFSET
        ? "hidden"
        : aboutTop > navbar.offsetHeight
          ? "transparent"
          : "solid";

      if (nextMode === "hidden" && navbar.contains(document.activeElement)) return;

      setNavbarMode(nextMode);
      if (nextMode === "hidden") setOpen(false);
    };

    const scheduleVisibilityUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateNavbarMode);
    };

    updateNavbarMode();
    window.addEventListener("scroll", scheduleVisibilityUpdate, { passive: true });
    window.addEventListener("resize", scheduleVisibilityUpdate);
    navbar.addEventListener("focusout", scheduleVisibilityUpdate);

    const sections = ["quem-somos", "projetos", "como-apoiar", "contato"]
      .map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", scheduleVisibilityUpdate);
      window.removeEventListener("resize", scheduleVisibilityUpdate);
      navbar.removeEventListener("focusout", scheduleVisibilityUpdate);
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 800px)");
    const closeOnDesktop = () => {
      if (mobileViewport.matches) return;
      if (document.activeElement === menuButtonRef.current) {
        navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      }
      setOpen(false);
    };

    mobileViewport.addEventListener("change", closeOnDesktop);
    return () => mobileViewport.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const closeMenu = () => {
    if (open) requestAnimationFrame(() => menuButtonRef.current?.focus());
    setOpen(false);
  };

  return (
    <header className={`site-header site-header--${navbarMode}`} ref={navbarRef}>
      <div className="container site-header__inner">
        <a href="#inicio" aria-label="Instituto Semeando o Futuro — início" onClick={closeMenu}>
          <Brand />
        </a>
        <button
          className="menu-button"
          type="button"
          ref={menuButtonRef}
          aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          id="primary-navigation"
          className={`site-nav ${open ? "site-nav--open" : ""}`}
          aria-label="Navegação principal"
          ref={navRef}
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={active === item.href.slice(1) ? "is-active" : ""}
              aria-current={active === item.href.slice(1) ? "location" : undefined} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="button button--small button--primary site-nav__cta" href="#como-apoiar" onClick={closeMenu}>Quero ajudar</a>
        </nav>
      </div>
    </header>
  );
}
