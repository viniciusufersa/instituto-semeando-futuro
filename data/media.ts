import { getPublicAssetPath } from "@/lib/get-public-asset-path";

export type InstitutionalMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  category: "about" | "project" | "impact" | "cta" | "gallery";
  objectPosition?: string;
};

export const institutionalMedia = {
  aboutTeam: {
    id: "equipe-instituto-03",
    type: "image",
    src: getPublicAssetPath("/images/instituto/equipe-instituto-03.webp"),
    alt: "Equipe do Instituto Semeando o Futuro reunida em ação",
    category: "about",
    objectPosition: "center",
  },
  aboutCare: {
    id: "atendimento-infantil-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/atendimento-infantil-01.webp"),
    alt: "Criança e profissional após atendimento no Instituto",
    category: "about",
    objectPosition: "center",
  },
  projectPsychology: {
    id: "atendimento-psicologia-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/atendimento-psicologia-01.webp"),
    alt: "Profissional realiza atendimento psicológico com uma criança",
    category: "about",
    objectPosition: "center",
  },
  projectUltrasound: {
    id: "acao-ultrassonografia-03",
    type: "image",
    src: getPublicAssetPath("/images/instituto/acao-ultrassonografia-03.webp"),
    alt: "Público acompanhado durante ação de ultrassonografia",
    category: "cta",
    objectPosition: "center",
  },
  supportChildren: {
    id: "criancas-atendidas-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/criancas-atendidas-01.webp"),
    alt: "Duas crianças atendidas pelo Instituto Semeando o Futuro",
    category: "cta",
    objectPosition: "center",
  },
  galleryChild: {
    id: "crianca-atendida-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/crianca-atendida-01.webp"),
    alt: "Criança atendida pelo Instituto Semeando o Futuro",
    category: "gallery",
    objectPosition: "center",
  },
  galleryInclusion: {
    id: "criancas-inclusao-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/criancas-inclusao-01.webp"),
    alt: "Duas crianças participantes das ações de inclusão do Instituto",
    category: "gallery",
    objectPosition: "center",
  },
  galleryPsychology: {
    id: "atendimento-psicologia-02",
    type: "image",
    src: getPublicAssetPath("/images/instituto/atendimento-psicologia-02.webp"),
    alt: "Profissional acolhe criança durante atendimento no Instituto",
    category: "gallery",
    objectPosition: "center",
  },
  galleryTeamOne: {
    id: "equipe-instituto-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/equipe-instituto-01.webp"),
    alt: "Integrantes e apoiadores do Instituto Semeando o Futuro",
    category: "gallery",
    objectPosition: "center",
  },
  galleryTeamTwo: {
    id: "equipe-instituto-02",
    type: "image",
    src: getPublicAssetPath("/images/instituto/equipe-instituto-02.webp"),
    alt: "Representantes do Instituto durante encontro institucional",
    category: "gallery",
    objectPosition: "center",
  },
  galleryTriage: {
    id: "triagem-neuropsicopedagogica-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/triagem-neuropsicopedagogica-01.webp"),
    alt: "Profissional realiza triagem neuropsicopedagógica no Instituto",
    category: "gallery",
    objectPosition: "center",
  },
  galleryUltrasoundOne: {
    id: "acao-ultrassonografia-01",
    type: "image",
    src: getPublicAssetPath("/images/instituto/acao-ultrassonografia-01.webp"),
    alt: "Mulheres aguardam atendimento durante ação de ultrassonografia",
    category: "gallery",
    objectPosition: "center",
  },
  galleryUltrasoundTwo: {
    id: "acao-ultrassonografia-02",
    type: "image",
    src: getPublicAssetPath("/images/instituto/acao-ultrassonografia-02.webp"),
    alt: "Participantes reunidos durante ação de ultrassonografia",
    category: "gallery",
    objectPosition: "center",
  },
  galleryHeadquartersVideo: {
    id: "sede-instituto-01",
    type: "video",
    src: getPublicAssetPath("/videos/instituto/sede-instituto-01.mp4"),
    alt: "Fachada e entrada da sede do Instituto Semeando o Futuro",
    category: "gallery",
    objectPosition: "center",
  },
} satisfies Record<string, InstitutionalMedia>;
