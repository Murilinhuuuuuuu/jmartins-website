import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { ViewEvent } from "@/components/analytics/ViewEvent";
import { BeforeAfterSlider } from "@/components/portfolio/BeforeAfterSlider";
import { Container } from "@/components/ui/Container";
import { getProject, projects } from "@/lib/content/catalog";
import { buildProjectWhatsAppUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.description, alternates: { canonical: `/portfolio/${project.slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <main id="conteudo-principal" className="pt-20"><ViewEvent name="project_view" properties={{ slug: project.slug, category: project.category }} /><section className="section-padding bg-white"><Container><div className="mx-auto max-w-5xl"><p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">{project.category}</p><h1 className="heading-display mt-3 text-4xl sm:text-5xl">{project.title}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-dark/70">{project.description}</p><div className="mt-10"><BeforeAfterSlider before={project.before} after={project.after} beforeAlt={project.beforeAlt} afterAlt={project.afterAlt} /></div><p className="mt-5 text-sm text-brand-dark/55">Arraste ou use as setas do teclado para comparar.</p><TrackedWhatsAppButton href={buildProjectWhatsAppUrl(project.title)} context="project_detail" properties={{ project_slug: project.slug }} className="mt-8">Quero avaliar uma peça</TrackedWhatsAppButton></div></Container></section></main>;
}
