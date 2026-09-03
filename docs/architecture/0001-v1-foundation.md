# ADR 0001 — Fundação da plataforma JMartins

## Status

Aceito para o primeiro marco da V1.

## Contexto

A JMartins precisa equilibrar reforma e venda, captar orçamentos sem operar como e-commerce, proteger arquivos de clientes e preparar uma área administrativa com autenticação e permissões.

## Decisões

- Next.js App Router e TypeScript para rotas públicas, APIs e painel administrativo.
- Conteúdo público renderizado no servidor sempre que possível; componentes cliente limitados a filtros, comparação antes/depois, formulários e analytics.
- Supabase para PostgreSQL, Auth e Storage. Todas as tabelas públicas usam RLS e privilégios mínimos.
- RBAC por tabelas de papéis e permissões; nenhuma autorização depende de endereço de e-mail.
- Protocolo público sequencial `JM-000001`, com UUID e token interno separados.
- Upload privado autorizado por token temporário, limitado a vinte arquivos e validado por tipo e tamanho.
- Formulário multi-step com estado preservado localmente e validação Zod no servidor.
- WhatsApp centralizado em um módulo, mantendo o link direto como fallback permanente.
- PostHog opcional, sem PII e carregado somente após consentimento. GA4 pode usar o mesmo contrato de eventos futuramente.
- Fotografias reais fornecidas pela empresa no portfólio; catálogo provisório sempre marcado como ilustrativo.
- Integrações de e-mail e WhatsApp Business ficam atrás de configuração de ambiente e feature flags.

## Consequências

O site público pode evoluir de conteúdo local para dados do Supabase sem mudar as rotas. O painel só fica operacional depois que as contas administrativas forem criadas e associadas a papéis. E-mail transacional e automação de WhatsApp dependem das credenciais dos provedores.
