import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navigationLinks } from "@/lib/content/navigation";
import { contact, site } from "@/lib/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-brand-dark text-white">
      <Container className="section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Image
              src="/brand/logo-full.png"
              alt="JMartins Móveis"
              width={160}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {site.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/40">
              Navegação
            </h3>
            <ul className="mt-4 space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/40">
              Contato
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  WhatsApp: {contact.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {contact.address}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/40">
              Horário
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Segunda a sexta
              <br />
              8h às 18h
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            © {currentYear} {site.name}. Todos os direitos reservados.
          </p>
          <p className="text-sm text-white/40">
            Santa Cecília, São Paulo — desde {site.foundedYear}
          </p>
        </div>
      </Container>
    </footer>
  );
}
