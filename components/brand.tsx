import Image from "next/image";
import { getPublicAssetPath } from "@/lib/get-public-asset-path";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand ${inverse ? "brand--inverse" : ""}`}>
      <Image
        className="brand__logo"
        src={getPublicAssetPath("/images/brand/logo-instituto-semeando-futuro.svg")}
        alt="Instituto Semeando o Futuro"
        width={1297}
        height={656}
        unoptimized
      />
    </span>
  );
}
