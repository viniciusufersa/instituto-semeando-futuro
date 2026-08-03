import { BookOpen, Box, Eye, HandHeart, Heart, ShieldCheck, Sparkles, Star, Users, WalletCards } from "lucide-react";
import { getPublicAssetPath } from "@/lib/get-public-asset-path";

export const navigation = [
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Como Apoiar", href: "#como-apoiar" },
  { label: "Contatos", href: "#contato" },
];

export const principles = [
  { label: "Amor", icon: Heart, color: "red" },
  { label: "Empatia", icon: Users, color: "blue" },
  { label: "Solidariedade", icon: ShieldCheck, color: "green" },
  { label: "Inclusão", icon: Star, color: "orange" },
];

export const purpose = [
  { title: "Missão", icon: Sparkles, text: "Promover acolhimento, dignidade e transformação social para famílias em vulnerabilidade, através de ações humanizadas que resgatam a esperança e fortalecem vínculos comunitários." },
  { title: "Visão", icon: Eye, text: "Ser referência em atendimento humanizado no Rio Grande do Norte, reconhecida pela excelência no cuidado às pessoas e pelo impacto transformador em suas vidas." },
  { title: "Valores", icon: Heart, text: "Amor incondicional, inclusão sem barreiras, respeito à dignidade humana, solidariedade ativa, ética em todas as ações e transparência em nossos processos." },
];

export const projects = [
  { title: "Semeando Solidariedade", statLabel: "famílias/mês", count: 1450, icon: Box, color: "red", text: "Distribuição de cestas básicas, leite, fraldas geriátricas e infantis, além de sopas solidárias para famílias em vulnerabilidade alimentar." },
  { title: "Vendo o Futuro com o Olhar", statLabel: "óculos doados", count: 800, icon: Eye, color: "blue", text: "Consultas oftalmológicas gratuitas e doação de óculos para crianças e adultos que não têm acesso à saúde visual." },
  { title: "Preparando para Cuidar no Futuro", statLabel: "alunos formados", count: 200, icon: BookOpen, color: "orange", text: "Disponibilização de cursos profissionalizantes de cuidador de idosos e técnico de enfermagem, abrindo portas para o mercado de trabalho." },
  { title: "Cuidando do Futuro", statLabel: "crianças atendidas", count: 150, icon: HandHeart, color: "green", text: "Atendimento multidisciplinar para crianças com TEA, TDAH, dislexia e outras condições, incluindo terapia, fonoaudiologia e psicologia." },
];

export const goals = [
  { number: "1", title: "Erradicação da Pobreza", text: "Assistência a famílias vulneráveis", icon: getPublicAssetPath("/images/ods/ods-1-erradicacao-da-pobreza.svg"), color: "#FF3018" },
  { number: "2", title: "Fome Zero", text: "Distribuição de alimentos", icon: getPublicAssetPath("/images/ods/ods-2-fome-zero.svg"), color: "#FEE401" },
  { number: "3", title: "Saúde e Bem-Estar", text: "Atendimento multidisciplinar", icon: getPublicAssetPath("/images/ods/ods-3-saude-e-bem-estar.svg"), color: "#119E39" },
  { number: "4", title: "Educação de Qualidade", text: "Cursos profissionalizantes", icon: getPublicAssetPath("/images/ods/ods-4-educacao-de-qualidade.svg"), color: "#379CE1" },
  { number: "10", title: "Redução das Desigualdades", text: "Inclusão e acessibilidade", icon: getPublicAssetPath("/images/ods/ods-10-reducao-das-desigualdades.svg"), color: "#FE0C6D" },
  { number: "17", title: "Parcerias e Meios", text: "Rede colaborativa", icon: getPublicAssetPath("/images/ods/ods-17-parcerias-e-meios.svg"), color: "#0E2C4D" },
];

export const support = [
  { title: "Doação Financeira", icon: WalletCards, color: "red", text: "Contribua com qualquer valor via PIX, transferência bancária ou cartão. Toda ajuda faz diferença na vida de uma família.", tags: ["Pix", "Transferências", "Cartão de Crédito"] },
  { title: "Doação de Itens", icon: Box, color: "orange", text: "Doe alimentos não perecíveis, roupas, materiais de higiene, fraldas, leite e outros itens essenciais.", tags: ["Alimentos", "Materiais", "Fraldas"] },
  { title: "Voluntariado", icon: Users, color: "blue", text: "Doe seu tempo e talento. Precisamos de voluntários em diversas áreas: administrativa, eventos, atendimento e muito mais.", tags: ["Atendimentos", "Eventos", "Comunicação"] },
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Instituto Semeando o Futuro",
  foundingDate: "2025",
  description: "Organização sem fins lucrativos que oferece acolhimento, esperança e dignidade para famílias em situação de vulnerabilidade social.",
  email: "contato@semeandoofuturo.org",
  telephone: "+55 84 99146-4792",
  address: { "@type": "PostalAddress", addressLocality: "Fernando Pedroza", addressRegion: "RN", addressCountry: "BR" },
};
