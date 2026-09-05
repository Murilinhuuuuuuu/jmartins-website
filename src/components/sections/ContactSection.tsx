import Image from "next/image";
import { Camera, Clock3, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact } from "@/lib/content/site";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function ContactSection() {
  return (
    <section id="contato" className="section-padding bg-white" aria-labelledby="contato-title">
      <Container>
        <AnimateIn><SectionHeading eyebrow="Visite ou fale com a gente" title="Atendimento próximo, em Santa Cecília" description="Segunda a sábado, das 8h às 18h. Domingo, fechado." align="center" className="mx-auto" /></AnimateIn>
        <div className="mt-12 grid overflow-hidden rounded-3xl border border-black/5 bg-brand-light lg:grid-cols-2">
          <div className="relative min-h-80 lg:min-h-[34rem]"><Image src="/media/portfolio/page-05-image-02.png" alt="Fachada da JMartins na Avenida São João" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
          <div className="p-7 sm:p-10 lg:p-12">
            <h2 id="contato-title" className="sr-only">Contato e localização</h2>
            <div className="space-y-6">
              <ContactItem icon={MapPin} label="Endereço" value={contact.address} href="https://www.google.com/maps/search/?api=1&query=Av.%20S%C3%A3o%20Jo%C3%A3o%2C%202023%2C%20S%C3%A3o%20Paulo" />
              <ContactItem icon={Phone} label="Telefone e WhatsApp" value={contact.phone} href={contact.phoneHref} />
              <ContactItem icon={Clock3} label="Horário" value="Segunda a sábado, 8h às 18h" />
              <ContactItem icon={Camera} label="Instagram" value="@jmartins.expressao" href="https://www.instagram.com/jmartins.expressao/" />
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="/orcamento">Solicitar orçamento</Button><TrackedWhatsAppButton href={buildDefaultWhatsAppUrl()} context="contact_section" variant="secondary"><MessageCircle className="h-4 w-4" />Falar no WhatsApp</TrackedWhatsAppButton></div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-black/5"><iframe title="Mapa da JMartins Móveis" src="https://maps.google.com/maps?q=Av.+S%C3%A3o+Jo%C3%A3o,+2023,+Santa+Cec%C3%ADlia,+S%C3%A3o+Paulo&output=embed" className="h-52 w-full grayscale-[25%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ContactItem({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: string; href?: string }) {
  const content = <><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-red shadow-sm"><Icon className="h-5 w-5" /></span><span><span className="block text-xs font-bold uppercase tracking-wider text-brand-dark/45">{label}</span><span className="mt-1 block font-semibold leading-relaxed text-brand-dark">{value}</span></span></>;
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex gap-4 transition hover:text-brand-red">{content}</a> : <div className="flex gap-4">{content}</div>;
}
