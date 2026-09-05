import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Info } from "lucide-react";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { ViewEvent } from "@/components/analytics/ViewEvent";
import { Container } from "@/components/ui/Container";
import { getProduct, products } from "@/lib/content/catalog";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.name, description: product.description, alternates: { canonical: `/cadeiras/${product.slug}` } };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return <main id="conteudo-principal" className="pt-20"><ViewEvent name="product_view" properties={{ slug: product.slug, category: product.category }} /><section className="section-padding bg-white"><Container><div className="grid gap-12 lg:grid-cols-2 lg:gap-20"><div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-light"><Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div className="self-center"><p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">{product.category}</p><h1 className="heading-display mt-3 text-4xl sm:text-5xl">{product.name}</h1><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-brand-light px-3 py-1 text-sm font-semibold">{product.condition}</span><span className="rounded-full bg-brand-light px-3 py-1 text-sm font-semibold">{product.availability}</span></div><div className="mt-6 flex gap-3 rounded-2xl border border-brand-red/15 bg-brand-red/[0.04] p-4 text-sm text-brand-dark/70"><Info className="h-5 w-5 shrink-0 text-brand-red" /><p>Imagem ilustrativa. Consulte modelos disponíveis. A foto não confirma estoque, marca ou características exatas.</p></div><p className="mt-7 text-lg leading-relaxed text-brand-dark/70">{product.description}</p><ul className="mt-7 space-y-3">{product.features.map((feature) => <li key={feature} className="flex items-center gap-3"><Check className="h-5 w-5 text-brand-red" />{feature}</li>)}</ul>{product.material && <p className="mt-6 text-sm text-brand-dark/60"><strong>Materiais:</strong> {product.material}</p>}{product.color && <p className="mt-2 text-sm text-brand-dark/60"><strong>Cores:</strong> {product.color}</p>}<TrackedWhatsAppButton href={buildProductWhatsAppUrl(product.name)} context="product_detail" properties={{ product_slug: product.slug }} className="mt-8">Consultar disponibilidade</TrackedWhatsAppButton></div></div></Container></section></main>;
}
