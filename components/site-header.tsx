"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/site";
import { Brand } from "./brand";

const NAVBAR_SHOW_OFFSET = 80;

type NavbarMode = "hidden" | "transparent" | "solid";

export function SiteHeader() {
  const navbarRef = useRef<HTMLElement>(null);
  const [navbarMode, setNavbarMode] = useState<NavbarMode>("hidden");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const aboutSection = document.getElementById("quem-somos");
    let scrollFrame = 0;

    const updateNavbarMode = () => {
      scrollFrame = 0;
      const navbar = navbarRef.current;
      if (!aboutSection || !navbar) return;

      const aboutTop = aboutSection.getBoundingClientRect().top;
      const nextMode: NavbarMode = window.scrollY <= NAVBAR_SHOW_OFFSET
        ? "hidden"
        : aboutTop > navbar.offsetHeight
          ? "transparent"
          : "solid";

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
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className={`site-header site-header--${navbarMode}`} ref={navbarRef}>
      <div className="container site-header__inner">
        <a href="#inicio" aria-label="Instituto Semeando o Futuro — início" onClick={() => setOpen(false)}>
          <Brand />
        </a>
        <nav className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={active === item.href.slice(1) ? "is-active" : ""}
              aria-current={active === item.href.slice(1) ? "location" : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="button button--small button--primary site-nav__cta" href="#como-apoiar" onClick={() => setOpen(false)}>Quero ajudar</a>
        </nav>
        <button className="menu-button" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
