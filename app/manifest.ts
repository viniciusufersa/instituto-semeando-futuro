import type { MetadataRoute } from "next";
import { getPublicAssetPath } from "@/lib/get-public-asset-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Instituto Semeando o Futuro",
    short_name: "Semeando o Futuro",
    description: "Acolhimento, inclusão e esperança para famílias em situação de vulnerabilidade social.",
    start_url: getPublicAssetPath("/"),
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0E2C4D",
    icons: [{ src: getPublicAssetPath("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
