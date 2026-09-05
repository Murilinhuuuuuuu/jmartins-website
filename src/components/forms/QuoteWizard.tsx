"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, FileUp, MessageCircle, PackageSearch, RefreshCcw } from "lucide-react";
import { analyticsReadyEvent, trackEvent } from "@/components/analytics/AnalyticsProvider";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { Button } from "@/components/ui/Button";
import { quoteSchema } from "@/features/quotes/schema";
import { buildQuoteWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type QuoteDraft = {
  type: "repair" | "purchase";
  name: string;
  whatsapp: string;
  email: string;
  postal_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  quantity: number;
  chair_type: string;
  description: string;
  services: string[];
  desired_date: string;
  needs_pickup: boolean;
  needs_delivery: boolean;
  customer_type: "individual" | "company" | "condominium" | "public_body";
  company_name: string;
  cnpj: string;
  budget_range: string;
};

const serviceOptions = ["Tecido / revestimento", "Espuma", "Pistão", "Rodízios", "Braços", "Base", "Mecanismo", "Pintura", "Estrutura", "Higienização", "Restauração completa", "Não sei / quero uma avaliação"];
const clientTypes = [{ value: "individual", label: "Pessoa física" }, { value: "company", label: "Empresa" }, { value: "condominium", label: "Condomínio" }, { value: "public_body", label: "Órgão público" }] as const;
const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10";

export function QuoteWizard({ initialType = "repair" }: { initialType?: "repair" | "purchase" }) {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [protocol, setProtocol] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startedRef = useRef(false);
  const { register, handleSubmit, control, subscribe, setValue, getValues, reset } = useForm<QuoteDraft>({ defaultValues: { type: initialType, name: "", whatsapp: "", email: "", postal_code: "", street: "", neighborhood: "", city: "", state: "SP", quantity: 1, chair_type: "", description: "", services: [], desired_date: "", needs_pickup: false, needs_delivery: false, customer_type: "individual", company_name: "", cnpj: "", budget_range: "" } });
  const type = useWatch({ control, name: "type" });
  const customerType = useWatch({ control, name: "customer_type" });

  useEffect(() => {
    const saved = window.localStorage.getItem("jmartins-quote-draft");
    if (saved) { try { reset({ ...JSON.parse(saved), type: initialType }); } catch { /* ignore an invalid local draft */ } }
  }, [initialType, reset]);

  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => window.localStorage.setItem("jmartins-quote-draft", JSON.stringify(values)),
    });
  }, [subscribe]);

  useEffect(() => {
    const captureStarted = () => {
      if (startedRef.current) return;
      startedRef.current = trackEvent("quote_started", { quote_type: initialType });
    };

    captureStarted();
    window.addEventListener(analyticsReadyEvent, captureStarted);
    return () => window.removeEventListener(analyticsReadyEvent, captureStarted);
  }, [initialType]);

  const progress = useMemo(() => `${step * 20}%`, [step]);

  function next() {
    setMessage("");
    const values = getValues();
    if (step === 2 && !values.chair_type.trim()) return setMessage("Informe o tipo de móvel ou cadeira.");
    if (step === 2 && type === "repair" && values.description.trim().length < 10) return setMessage("Conte um pouco mais sobre o que precisa.");
    if (step === 2 && type === "purchase" && !values.budget_range) return setMessage("Informe a faixa de orçamento.");
    if (step === 3 && (values.postal_code.replace(/\D/g, "").length !== 8 || !values.city.trim() || values.state.trim().length !== 2)) return setMessage("Revise o CEP, a cidade e o estado.");
    if (step === 4 && (values.name.trim().length < 2 || values.whatsapp.replace(/\D/g, "").length < 10)) return setMessage("Informe seu nome e WhatsApp.");
    if (step === 4 && ["company", "public_body"].includes(values.customer_type) && (!values.company_name.trim() || values.cnpj.replace(/\D/g, "").length !== 14)) return setMessage("Informe o nome e o CNPJ da empresa ou órgão.");
    trackEvent("quote_step_completed", { quote_type: type, step });
    setStep((current) => Math.min(current + 1, 5));
  }

  async function lookupPostalCode() {
    const postalCode = getValues("postal_code").replace(/\D/g, "");
    if (postalCode.length !== 8) return;
    setLoadingAddress(true);
    try {
      const response = await fetch(`/api/address/${postalCode}`);
      if (!response.ok) return;
      const address = await response.json();
      setValue("postal_code", address.postalCode);
      setValue("street", address.street);
      setValue("neighborhood", address.neighborhood);
      setValue("city", address.city);
      setValue("state", address.state);
    } finally { setLoadingAddress(false); }
  }

  async function submit(values: QuoteDraft) {
    setSubmitting(true);
    setMessage("");
    const parsed = quoteSchema.safeParse(values);
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? "Revise os campos."); setSubmitting(false); return; }
    const data = new FormData();
    data.append("payload", JSON.stringify(parsed.data));
    files.forEach((file) => data.append("files", file));
    try {
      const response = await fetch("/api/quotes", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Não foi possível enviar.");
      setProtocol(result.protocol);
      trackEvent("quote_submitted", { quote_type: parsed.data.type, attachments: files.length });
      setMessage(result.attachmentWarning ?? "");
      window.localStorage.removeItem("jmartins-quote-draft");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível enviar."); }
    finally { setSubmitting(false); }
  }

  if (protocol) return <div className="mx-auto max-w-2xl rounded-3xl border border-black/5 bg-white p-8 text-center shadow-xl sm:p-12"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-8 w-8" /></span><p className="mt-6 font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Solicitação recebida!</p><h2 className="heading-display mt-3 text-3xl">Seu protocolo é {protocol}.</h2><p className="mt-5 text-brand-dark/65">Nossa equipe analisará sua solicitação e retornará em até 24 horas.</p>{message && <p className="mt-4 text-sm text-amber-700">{message}</p>}<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><TrackedWhatsAppButton href={buildQuoteWhatsAppUrl(protocol)} context="quote_success"><MessageCircle className="h-4 w-4" />Continuar pelo WhatsApp</TrackedWhatsAppButton><Button href="/acompanhar" variant="secondary">Acompanhar solicitação</Button></div></div>;

  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-4xl" noValidate>
      <div className="mb-10"><div className="flex items-center justify-between text-sm font-semibold text-brand-dark/55"><span>Etapa {step} de 5</span><span>{["Escolha", "Necessidade", "Localização", "Contato", "Revisão"][step - 1]}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/8"><div className="h-full rounded-full bg-brand-red transition-all" style={{ width: progress }} /></div></div>
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
        {step === 1 && <fieldset><legend className="heading-display text-3xl">Como podemos ajudar?</legend><p className="mt-3 text-brand-dark/60">Escolha uma opção para ver apenas as perguntas necessárias.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><label className={cn("cursor-pointer rounded-3xl border p-7 transition", type === "repair" ? "border-brand-red bg-brand-red/[0.04]" : "border-black/10 hover:border-brand-red/40")}><input type="radio" value="repair" className="sr-only" {...register("type")} /><RefreshCcw className="h-8 w-8 text-brand-red" /><span className="mt-6 block font-heading text-xl font-bold">Quero reformar</span><span className="mt-2 block text-sm text-brand-dark/60">Avaliação para recuperar uma ou mais peças.</span></label><label className={cn("cursor-pointer rounded-3xl border p-7 transition", type === "purchase" ? "border-brand-red bg-brand-red/[0.04]" : "border-black/10 hover:border-brand-red/40")}><input type="radio" value="purchase" className="sr-only" {...register("type")} /><PackageSearch className="h-8 w-8 text-brand-red" /><span className="mt-6 block font-heading text-xl font-bold">Quero comprar</span><span className="mt-2 block text-sm text-brand-dark/60">Consulta de cadeiras ou mobiliário.</span></label></div></fieldset>}
        {step === 2 && <fieldset className="space-y-6"><legend className="heading-display text-3xl">Conte o que você procura</legend><div><label className="mb-2 block text-sm font-bold" htmlFor="chair_type">{type === "repair" ? "Tipo do móvel *" : "Tipo de cadeira ou móvel *"}</label><input id="chair_type" className={inputClass} placeholder="Ex.: cadeira de escritório ou não sei o modelo" {...register("chair_type")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="quantity">Quantidade</label><input id="quantity" type="number" min="1" className={inputClass} {...register("quantity", { valueAsNumber: true })} /></div>{type === "repair" ? <><div><label className="mb-2 block text-sm font-bold" htmlFor="description">O que precisa ser feito? *</label><textarea id="description" rows={5} className={inputClass} placeholder="Descreva o problema, desgaste ou resultado esperado." {...register("description")} /></div><div><p className="mb-3 text-sm font-bold">Serviços de interesse</p><div className="grid gap-3 sm:grid-cols-2">{serviceOptions.map((service) => <label key={service} className="flex items-center gap-3 rounded-2xl border border-black/8 p-4 text-sm"><input type="checkbox" value={service} className="h-4 w-4 accent-brand-red" {...register("services")} />{service}</label>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><label className="flex items-center gap-3 rounded-2xl bg-brand-light p-4"><input type="checkbox" className="h-4 w-4 accent-brand-red" {...register("needs_pickup")} />Precisa que a JMartins retire?</label><label className="flex items-center gap-3 rounded-2xl bg-brand-light p-4"><input type="checkbox" className="h-4 w-4 accent-brand-red" {...register("needs_delivery")} />Precisa de entrega depois?</label></div></> : <><div><label className="mb-2 block text-sm font-bold" htmlFor="budget_range">Faixa de orçamento *</label><select id="budget_range" className={inputClass} {...register("budget_range")}><option value="">Selecione</option><option>Até R$ 500 por unidade</option><option>R$ 500 a R$ 1.000 por unidade</option><option>Acima de R$ 1.000 por unidade</option><option>Preciso de orientação</option></select></div><label className="flex items-center gap-3 rounded-2xl bg-brand-light p-4"><input type="checkbox" className="h-4 w-4 accent-brand-red" {...register("needs_delivery")} />Precisa de entrega?</label></>}</fieldset>}
        {step === 3 && <fieldset className="space-y-6"><legend className="heading-display text-3xl">Onde será o atendimento?</legend><p className="text-brand-dark/60">O endereço ajuda a avaliar a logística. Você poderá corrigir os dados preenchidos automaticamente.</p><div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-bold" htmlFor="postal_code">CEP *</label><input id="postal_code" inputMode="numeric" className={inputClass} {...register("postal_code", { onBlur: lookupPostalCode })} /><span className="mt-2 block text-xs text-brand-dark/50">{loadingAddress ? "Buscando endereço..." : "Digite o CEP para preencher automaticamente."}</span></div><div><label className="mb-2 block text-sm font-bold" htmlFor="street">Rua</label><input id="street" className={inputClass} {...register("street")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="neighborhood">Bairro</label><input id="neighborhood" className={inputClass} {...register("neighborhood")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="city">Cidade *</label><input id="city" className={inputClass} {...register("city")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="state">Estado *</label><input id="state" maxLength={2} className={inputClass} {...register("state")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="desired_date">Para quando precisa?</label><input id="desired_date" type="date" className={inputClass} {...register("desired_date")} /></div></div></fieldset>}
        {step === 4 && <fieldset className="space-y-6"><legend className="heading-display text-3xl">Como falamos com você?</legend><div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-bold" htmlFor="name">Nome *</label><input id="name" autoComplete="name" className={inputClass} {...register("name")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="whatsapp">WhatsApp *</label><input id="whatsapp" type="tel" autoComplete="tel" className={inputClass} {...register("whatsapp")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="email" className={inputClass} {...register("email")} /></div>{type === "purchase" && <div><label className="mb-2 block text-sm font-bold" htmlFor="customer_type">Tipo de cliente *</label><select id="customer_type" className={inputClass} {...register("customer_type")}>{clientTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>}</div>{type === "purchase" && ["company", "public_body"].includes(customerType) && <div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-bold" htmlFor="company_name">Nome da empresa ou órgão *</label><input id="company_name" className={inputClass} {...register("company_name")} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="cnpj">CNPJ *</label><input id="cnpj" inputMode="numeric" className={inputClass} {...register("cnpj")} /></div></div>}<div><label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-black/15 bg-brand-light p-5"><FileUp className="h-6 w-6 text-brand-red" /><span><strong className="block">Adicionar fotos, vídeos ou PDF</strong><span className="mt-1 block text-xs text-brand-dark/55">Até 20 arquivos. Imagens 15 MB, vídeos 80 MB, PDF 20 MB.</span></span><input type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,application/pdf" className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 20))} /></label>{files.length > 0 && <p className="mt-2 text-sm text-brand-dark/60">{files.length} arquivo(s) selecionado(s).</p>}</div></fieldset>}
        {step === 5 && <div><p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Revisão</p><h2 className="heading-display mt-3 text-3xl">Tudo certo para enviar?</h2><div className="mt-8 grid gap-4 sm:grid-cols-2"><Review label="Solicitação" value={type === "repair" ? "Reforma" : "Compra"} /><Review label="Item" value={`${getValues("quantity")} × ${getValues("chair_type")}`} /><Review label="Contato" value={`${getValues("name")} · ${getValues("whatsapp")}`} /><Review label="Localização" value={`${getValues("city")}/${getValues("state")}`} /><Review label="Anexos" value={files.length ? `${files.length} arquivo(s)` : "Nenhum"} /></div><p className="mt-8 text-sm leading-relaxed text-brand-dark/55">Ao enviar, você concorda com o uso dos dados e arquivos para análise, atendimento e elaboração do orçamento, conforme nossa <Link href="/privacidade" className="font-semibold text-brand-red underline">Política de Privacidade</Link>.</p></div>}
        {message && <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800" role="alert">{message}</p>}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">{step > 1 ? <Button type="button" variant="secondary" onClick={() => { setMessage(""); setStep((current) => current - 1); }}><ArrowLeft className="h-4 w-4" />Voltar</Button> : <span />}{step < 5 ? <Button type="button" onClick={next}>Continuar<ArrowRight className="h-4 w-4" /></Button> : <Button type="submit" disabled={submitting}>{submitting ? "Enviando..." : "Enviar solicitação"}</Button>}</div>
    </form>
  );
}

function Review({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-brand-light p-5"><p className="text-xs font-bold uppercase tracking-wider text-brand-dark/45">{label}</p><p className="mt-2 font-semibold">{value || "Não informado"}</p></div>; }
