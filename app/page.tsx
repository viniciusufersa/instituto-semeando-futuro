import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { AboutSection, GoalsSection, ProjectsSection, PurposeSection, SupportSection } from "@/components/sections";
import { GallerySection } from "@/components/sections/gallery-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { organizationSchema } from "@/data/site";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo principal</a>
      <Experience />
      <SiteHeader />
      <main id="conteudo" tabIndex={-1}><Hero /><AboutSection /><PurposeSection /><ProjectsSection /><GallerySection /><GoalsSection /><SupportSection /></main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
