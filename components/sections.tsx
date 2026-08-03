import { ArrowUpRight, Globe2, Heart, PlusCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { institutionalMedia } from "@/data/media";
import { goals, principles, purpose, support } from "@/data/site";
import { ProjectsCarousel } from "./projects-carousel";
import { BrandMotif } from "./brand-motif";
import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <section className="section section--about" id="quem-somos" aria-labelledby="about-title">
      <BrandMotif className="about__brand-motif" variant="halo" />
      <div className="container about-layout">
        <div className="about-content">
          <Reveal className="about-heading"><p className="eyebrow"><span className="eyebrow__dot" /> Nossa história</p><h2 id="about-title">Quem <em>Somos</em></h2></Reveal>
          <Reveal className="about-copy" delay={0.1}>
            <p className="lead">O Instituto Semeando o Futuro nasceu do sonho de transformar realidades. Somos uma organização sem fins lucrativos que atua em Fernando Pedroza/RN, oferecendo acolhimento, esperança e dignidade para famílias em situação de vulnerabilidade social.</p>
            <p>Através de projetos sociais nas áreas de assistência básica, saúde, educação e inclusão, trabalhamos para que cada pessoa atendida possa redescobrir seu valor e construir um futuro melhor.</p>
          </Reveal>
        </div>
        <Reveal className="about-media" delay={0.16}>
          <div className="about-photo-slot about-photo-slot--primary">
            <Image
              src={institutionalMedia.aboutTeam.src}
              alt={institutionalMedia.aboutTeam.alt}
              fill
              sizes="(max-width: 800px) 82vw, 38vw"
              style={{ objectPosition: institutionalMedia.aboutTeam.objectPosition }}
            />
          </div>
          <div className="about-photo-slot about-photo-slot--secondary">
            <Image
              src={institutionalMedia.projectPsychology.src}
              alt={institutionalMedia.projectPsychology.alt}
              fill
              sizes="(max-width: 800px) 42vw, 18vw"
              style={{ objectPosition: institutionalMedia.projectPsychology.objectPosition }}
            />
          </div>
          <span className="about-media__accent" aria-hidden="true" />
        </Reveal>
      </div>
      <div className="container principles-grid">
        {principles.map((principle, index) => { const Icon = principle.icon; return <Reveal key={principle.label} delay={index * 0.06}><div className={`principle principle--${principle.color}`}><Icon size={23} /><span>{principle.label}</span></div></Reveal>; })}
      </div>
    </section>
  );
}

export function PurposeSection() {
  return (
    <section className="section section--purpose" aria-labelledby="purpose-title">
      <BrandMotif className="purpose__brand-motif" variant="geometry" />
      <div className="container">
      <Reveal className="section-heading section-heading--center"><p className="eyebrow"><Sparkles size={15} /> Nosso propósito</p><h2 id="purpose-title">O que nos <em>move</em></h2><p>Cada ação do Instituto é guiada por princípios que colocam o ser humano no centro.</p></Reveal>
      <div className="purpose-cards">
        {purpose.map((item, index) => {
          const Icon = item.icon;
          const tone = ["red", "blue", "green"][index];

          return (
            <Reveal className={`purpose-card-wrap purpose-card-wrap--${tone}`} key={item.title} delay={index * 0.08}>
              <article className="purpose-card">
                <div className="purpose-card__top">
                  <span className="purpose-card__icon"><Icon size={23} /></span>
                  <span className="purpose-card__number">0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="purpose-card__accent" aria-hidden="true" />
              </article>
            </Reveal>
          );
        })}
      </div>
    </div></section>
  );
}

export function ProjectsSection() {
  return (
    <section className="section section--projects" id="projetos" aria-labelledby="projects-title"><div className="container">
      <Reveal className="section-heading section-heading--split"><div><p className="eyebrow eyebrow--light"><PlusCircle size={15} /> Nossas ações</p><h2 id="projects-title">Projetos que <em>transformam</em></h2></div><p>Cada projeto é uma semente plantada com amor, regada com dedicação e colhida com esperança.</p></Reveal>
      <Reveal delay={0.1}><ProjectsCarousel /></Reveal>
    </div></section>
  );
}

export function GoalsSection() {
  return (
    <section className="section section--goals" aria-labelledby="goals-title">
      <BrandMotif className="goals__brand-motif" variant="halo" />
      <div className="container">
      <Reveal className="section-heading section-heading--center"><p className="eyebrow"><Globe2 size={15} /> Compromisso global</p><h2 id="goals-title">Objetivos de Desenvolvimento <em>Sustentável</em></h2><p>Nossas ações estão alinhadas com os ODS da ONU, contribuindo para um mundo mais justo e sustentável.</p></Reveal>
      <div className="goals-line" aria-hidden="true" />
      <div className="goals-grid">
        {goals.map((goal, index) => (
          <Reveal key={goal.number} delay={index * 0.045}>
            <article
              className="goal-card"
              style={{ "--ods-color": goal.color } as CSSProperties}
              tabIndex={0}
            >
              <span className="sr-only">ODS {goal.number}</span>
              <div className="goal-card__icon-area">
                <Image
                  className="goal-card__icon"
                  src={goal.icon}
                  width={150}
                  height={82}
                  alt=""
                  aria-hidden="true"
                  unoptimized
                />
              </div>
              <div className="goal-card__content">
                <h3>{goal.title}</h3>
                <p>{goal.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="agenda-badge"><Globe2 size={18} /> Alinhados com a Agenda 2030 da ONU</Reveal>
    </div></section>
  );
}

export function SupportSection() {
  return (
    <section className="section section--support" id="como-apoiar" aria-labelledby="support-title">
      <BrandMotif className="support__brand-motif" variant="flow" />
      <div className="container">
      <div className="support-layout">
        <div className="support-photo-column">
          <Reveal className="support-photo-slot" delay={0.08}>
            <div>
              <Image
                src={institutionalMedia.projectUltrasound.src}
                alt={institutionalMedia.projectUltrasound.alt}
                fill
                sizes="(max-width: 800px) calc(100vw - 32px), 420px"
                style={{ objectPosition: institutionalMedia.projectUltrasound.objectPosition }}
              />
            </div>
          </Reveal>
        </div>
        <div className="support-content">
          <Reveal className="section-heading support-heading"><p className="eyebrow eyebrow--light"><Heart size={15} fill="currentColor" /> Faça parte</p><h2 id="support-title">Como você pode <em>ajudar</em></h2><p>Existem diversas formas de contribuir com nossa missão. Escolha a que melhor se encaixa para você.</p></Reveal>
          <div className="support-grid">{support.map((item, index) => { const Icon = item.icon; return <Reveal key={item.title} delay={index * 0.08}><article className={`support-card support-card--${item.color}`}><div className="support-card__icon"><Icon /></div><h3>{item.title}</h3><p>{item.text}</p><ul aria-label={`Formas de ${item.title.toLowerCase()}`}>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><a href="#contato" aria-label={`${item.title}: entrar em contato`}><ArrowUpRight /></a></article></Reveal>; })}</div>
        </div>
      </div>
    </div></section>
  );
}
