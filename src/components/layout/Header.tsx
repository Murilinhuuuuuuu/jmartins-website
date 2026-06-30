"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "@/lib/content/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        isScrolled
          ? "border-b border-black/5 bg-white/85 shadow-sm backdrop-blur-md"
          : "bg-white/60 backdrop-blur-sm",
      )}
    >
      <div className="container-premium flex h-20 items-center justify-between">
        <Link href="#inicio" className="relative z-50 shrink-0" aria-label="JMartins Móveis - Início">
          <Image
            src="/brand/logo-full.png"
            alt="JMartins Móveis"
            width={160}
            height={48}
            className="h-10 w-auto md:h-12"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-sm font-semibold text-brand-dark/80 transition-colors hover:text-brand-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#contato" variant="primary">
            Solicite um orçamento
          </Button>
        </div>

        <button
          type="button"
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-black/5 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-white transition-all duration-500 lg:hidden",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-8"
          aria-label="Navegação mobile"
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-heading text-2xl font-bold text-brand-dark transition-colors hover:text-brand-red"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contato"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-xl bg-brand-red px-6 py-3.5 font-heading text-sm font-bold tracking-wide text-white transition-all hover:bg-brand-red/90"
          >
            Solicite um orçamento
          </Link>
        </nav>
      </div>
    </header>
  );
}
