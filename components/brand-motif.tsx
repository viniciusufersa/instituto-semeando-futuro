type BrandMotifProps = {
  className?: string;
  variant: "flow" | "halo" | "geometry";
};

export function BrandMotif({ className = "", variant }: BrandMotifProps) {
  return (
    <div className={`brand-motif brand-motif--${variant} ${className}`.trim()} aria-hidden="true">
      <svg className="brand-motif__drawing" viewBox="0 0 720 360" fill="none">
        <path className="brand-motif__line brand-motif__line--primary" d="M-34 286C98 98 246 67 354 178C451 278 570 303 760 86" />
        <path className="brand-motif__line brand-motif__line--secondary" d="M-18 86C122 230 270 277 402 150C514 43 615 21 748 112" />
        <path className="brand-motif__line brand-motif__line--accent" d="M111 386C218 224 377 213 488 310C561 374 645 358 757 239" />
      </svg>
      <span className="brand-motif__halo" />
      <span className="brand-motif__block brand-motif__block--one" />
      <span className="brand-motif__block brand-motif__block--two" />
      <span className="brand-motif__petal brand-motif__petal--one" />
      <span className="brand-motif__petal brand-motif__petal--two" />
      <span className="brand-motif__petal brand-motif__petal--three" />
    </div>
  );
}
