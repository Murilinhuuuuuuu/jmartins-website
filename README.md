# JMartins Móveis

Plataforma web institucional e comercial da JMartins Móveis, construída com Next.js 16, TypeScript, Tailwind CSS, Supabase, PostHog e Resend.

## Rodar localmente

1. Copie `.env.local.example` para `.env.local` e preencha as chaves públicas.
2. Instale as dependências com `npm install`.
3. Inicie o ambiente local com `npm run dev`.
4. Acesse `http://localhost:3000`.

## Verificações

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Banco de dados

As mudanças versionadas do Supabase ficam em `supabase/migrations`. A fundação V1 inclui RLS, permissões por função, orçamento público com protocolo, acompanhamento seguro e buckets separados por finalidade.

## Painel administrativo

O painel em `/admin/login` permite acompanhar os indicadores, filtrar orçamentos, consultar dados e anexos, registrar observações internas e manter o histórico de status.

Os usuários devem ser criados no Supabase Auth. O perfil é gerado automaticamente; depois, associe o usuário a uma função em `public.user_roles`. As funções `admin` e `super_admin` recebem todas as permissões operacionais da V1.

## Configuração externa

- Supabase: URL e chave publicável no cliente; nunca use uma chave secreta no navegador.
- PostHog: carregado somente depois do consentimento de cookies.
- Resend: opcional em desenvolvimento e necessário para e-mails transacionais em produção.
- Vercel: configure as mesmas variáveis do arquivo de exemplo antes de promover para produção.
