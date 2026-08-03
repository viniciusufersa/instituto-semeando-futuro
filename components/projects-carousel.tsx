"use client";

import { projects } from "@/data/site";
import { StatNumber } from "./stat-number";

export function ProjectsCarousel() {
  return (
    <div className="projects-grid">
      {projects.slice(0, 3).map((project, index) => {
        const Icon = project.icon;

        return (
          <article
            className={`project-card project-card--${project.color}${index === 2 ? " project-card--wide" : ""}`}
            key={project.title}
          >
            <div className="project-card__content">
              <div className="project-card__label">
                <span className="project-card__label-dot" aria-hidden="true" />
                <span>0{index + 1}</span>
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <div className="project-card__copy">
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </div>

              <div className="project-card__footer">
                <div className="project-card__stat">
                  <strong><StatNumber value={project.count} /></strong>
                  <span>{project.statLabel}</span>
                </div>
                <div className="project-card__line" aria-hidden="true" />
              </div>
            </div>

            <div className={`project-card__visual project-card__visual--${project.color}`} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>
        );
      })}
    </div>
  );
}
