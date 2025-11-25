# GreenHostel

> Front-end do GreenHostel — site/app para gerenciar reservas e informações de um hostel, feito com foco em performance e experiência mobile.

---

## Visão geral

GreenHostel é um projeto front-end moderno criado para demonstrar uma interface leve e responsiva para um hostel. Ele foi gerado a partir de um template Lovable e utiliza um stack moderno (Vite + React + TypeScript + Tailwind) com integração a um backend Supabase (pasta `supabase` no repositório).

O repositório contém arquivos de configuração para ferramentas modernas (inclui `bun.lockb`), e foi pensado para desenvolvimento rápido e deploy em plataformas estáticas ou serverless.

---

## Tecnologias

* Vite
* React
* TypeScript
* Tailwind CSS
* shadcn-ui (componentes)
* Supabase (backend / autenticação / banco)

> As tecnologias acima foram detectadas no repositório.

---

## Pré-requisitos

* Node.js (v16+) ou Bun (se preferir)
* Git
* Conta/configuração do Supabase (se usar as funções de backend)

---

## Instalação (local)

1. Clone o repositório:

```bash
git clone https://github.com/Erlan-Ctrl/GreenHostel.git
cd GreenHostel
```

2. Instale as dependências (escolha uma):

Com npm/yarn:

```bash
npm install
# ou
# yarn
```

Com Bun (se for usar Bun):

```bash
bun install
```

3. Crie um arquivo `.env` baseado nas variáveis necessárias (ex.: variáveis do Supabase). Exemplo mínimo:

```
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=anon_key_aqui
```

> O repositório já contém uma pasta `supabase` para referência de integração.

---

## Scripts úteis

```bash
npm run dev       # roda em modo desenvolvimento (Vite)
npm run build     # gera build de produção
npm run preview   # testa o build localmente
```

(Se estiver usando Bun, os mesmos scripts podem ser executados com `bun run <script>`.)

---

## Estrutura do projeto (resumo)

* `src/` — código fonte React + TS
* `index.html` — ponto de entrada
* `supabase/` — arquivos/SQL/config relacionados ao Supabase
* `tailwind.config.ts` — configuração do Tailwind
* `vite.config.ts` — configuração do Vite

> Estrutura confirmada no repositório.

---

## Integração com Supabase

Se o projeto utiliza Supabase para dados/autenticação:

1. Crie um projeto no Supabase.
2. Copie a `URL` e `ANON KEY` para o `.env` (ex.: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
3. Ajuste as rotas/nomes de tabelas conforme o SQL na pasta `supabase` (se houver).

---

## Deploy

O projeto é compatível com deploy em plataformas como Vercel, Netlify ou qualquer host estático que suporte apps geradas por Vite.

* No Vercel: basta criar um novo projeto apontando para este repositório. Comando de build: `npm run build` e pasta de saída: `dist`.
* Configurar variáveis de ambiente (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) no painel do provedor.

---

## Boas práticas e dicas

* Não comite chaves secretas — use `.env` e adicione ao `.gitignore`.
* Se for ampliar o backend, mantenha migrations/seeders na pasta `supabase` para versionamento.
* Teste rotas de API localmente com `preview` antes de publicar.

---

## Contribuição

Contribuições são bem-vindas. Sugestão de fluxo:

1. Fork este projeto.
2. Crie uma branch: `feature/nome-da-feature`.
3. Abra um Pull Request descrevendo as mudanças.
