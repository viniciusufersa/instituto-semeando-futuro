import { institutionalMedia } from "@/data/media";
import { getPublicAssetPath } from "@/lib/get-public-asset-path";

export type GalleryItem = {
  id: string;
  type: "image" | "video" | "placeholder";
  src?: string;
  alt?: string;
  objectPosition?: string;
  mimeType?: "video/mp4" | "video/webm";
};

const galleryMedia = [
  institutionalMedia.galleryChild,
  institutionalMedia.galleryPsychology,
  institutionalMedia.galleryTeamOne,
  institutionalMedia.galleryInclusion,
  institutionalMedia.galleryTeamTwo,
  institutionalMedia.galleryTriage,
  institutionalMedia.galleryUltrasoundOne,
  institutionalMedia.galleryUltrasoundTwo,
  institutionalMedia.galleryHeadquartersVideo,
];

export const galleryItems: GalleryItem[] = [
  ...galleryMedia.map((item) => ({
    id: item.id,
    type: item.type,
    src: item.src,
    alt: item.alt,
    objectPosition: item.objectPosition,
    mimeType: item.type === "video" ? "video/mp4" as const : undefined,
  })),
  {
    id: "galeria-institucional-01",
    type: "video",
    src: getPublicAssetPath("/videos/galeria-instituto-semeando-futuro-01.webm"),
    alt: "Vídeo institucional do Instituto Semeando o Futuro",
    objectPosition: "center",
    mimeType: "video/webm",
  },
];
