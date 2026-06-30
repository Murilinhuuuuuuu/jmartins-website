"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact } from "@/lib/content/site";
import {
  contactFormSchema,
  serviceOptions,
  type ContactFormData,
} from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setFeedbackMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Erro ao enviar mensagem.");
      }

      setStatus("success");
      setFeedbackMessage("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      reset();
    } catch (error) {
      setStatus("error");
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua mensagem. Tente novamente.",
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm text-brand-dark transition-colors placeholder:text-brand-dark/40 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-brand-dark">
          Nome completo *
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={cn(inputClass, errors.name && "border-brand-red")}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-brand-red" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-brand-dark">
            E-mail *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={cn(inputClass, errors.email && "border-brand-red")}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-brand-red" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-brand-dark">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="(11) 99999-9999"
            {...register("phone")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-brand-dark">
          Serviço de interesse *
        </label>
        <select
          id="service"
          className={cn(inputClass, errors.service && "border-brand-red")}
          defaultValue=""
          {...register("service")}
        >
          <option value="" disabled>
            Selecione um serviço
          </option>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="mt-1 text-sm text-brand-red" role="alert">
            {errors.service.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-brand-dark">
          Mensagem *
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass, "resize-none", errors.message && "border-brand-red")}
          placeholder="Conte-nos sobre seu projeto..."
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-brand-red" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Enviando..." : "Enviar mensagem"}
      </Button>

      {feedbackMessage && (
        <p
          className={cn(
            "text-sm",
            status === "success" ? "text-green-700" : "text-brand-red",
          )}
          role="status"
          aria-live="polite"
        >
          {feedbackMessage}
        </p>
      )}
    </form>
  );
}

export function ContactSection() {
  return (
    <section
      id="contato"
      className="bg-white section-padding"
      aria-label="Contato"
    >
      <Container>
        <AnimateIn>
          <SectionHeading
            eyebrow="Contato"
            title="Fale conosco"
            description="Estamos prontos para ouvir seu projeto e elaborar um orçamento personalizado."
            align="center"
            className="mx-auto"
          />
        </AnimateIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimateIn>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/8 text-brand-red">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-brand-dark/50">
                    Telefone
                  </h3>
                  <a
                    href={contact.phoneHref}
                    className="mt-1 block text-lg font-semibold text-brand-dark transition-colors hover:text-brand-red"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/8 text-brand-red">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-brand-dark/50">
                    WhatsApp
                  </h3>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-lg font-semibold text-brand-dark transition-colors hover:text-brand-red"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/8 text-brand-red">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-brand-dark/50">
                    E-mail
                  </h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-1 block text-lg font-semibold text-brand-dark transition-colors hover:text-brand-red"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/8 text-brand-red">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-brand-dark/50">
                    Endereço
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-brand-dark">
                    {contact.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-black/5">
              <iframe
                title="Localização JMartins Móveis"
                src="https://maps.google.com/maps?q=Av.+S%C3%A3o+Jo%C3%A3o,+2023,+Santa+Cec%C3%ADlia,+S%C3%A3o+Paulo&output=embed"
                className="h-64 w-full grayscale-[30%] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </AnimateIn>

          <AnimateIn>
            <div className="rounded-2xl border border-black/5 bg-brand-light p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-brand-dark">
                Envie sua mensagem
              </h3>
              <p className="mt-2 text-sm text-brand-dark/60">
                Preencha o formulário e retornaremos o mais breve possível.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
