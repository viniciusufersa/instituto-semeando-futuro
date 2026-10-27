import { ArrowRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { navigation } from "@/data/site";
import { Brand } from "./brand";

const socialNetworks = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Youtube },
];

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container">
        <div className="footer-cta">
          <div>
            <span>Faça parte</span>
            <h2>Sua ajuda transforma vidas. Junte-se a nós nessa missão de amor.</h2>
          </div>
          <a
            className="button button--light"
            href="https://wa.me/5584991464792"
            aria-label="Entrar em contato com o Instituto pelo WhatsApp"
            target="_blank"
            rel="noreferrer"
          >
            Clique aqui <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-about">
            <a href="#inicio" aria-label="Voltar ao início"><Brand inverse /></a>
            <p>Transformando vidas através do acolhimento, amor e solidariedade no Rio Grande do Norte.</p>
            <div className="social-list" aria-label="Redes sociais">
              {socialNetworks.map(({ label, icon: Icon }) => (
                <span key={label} title="Endereço da rede social não informado" aria-label={`${label}: endereço não informado`}>
                  <Icon size={19} />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Navegação</h3>
            <ul className="footer-links">
              {navigation.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h3>Contato</h3>
            <ul className="contact-list">
              <li>
                <MessageCircle size={18} />
                <a href="https://wa.me/5584991464792" target="_blank" rel="noreferrer">(84) 99146-4792</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:contato@semeandoofuturo.org">contato@semeandoofuturo.org</a>
              </li>
              <li><MapPin size={18} /><span>Fernando Pedroza, RN</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Instituto Semeando o Futuro</span>
          <span>Fernando Pedroza · Rio Grande do Norte</span>
        </div>
      </div>
    </footer>
  );
}
