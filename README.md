Adolesanto – Sistema de Doações (Technical Overview)

Sistema web para gerenciamento e acompanhamento de doações do evento Adolesanto, da Paróquia Santíssima Trindade (06, 07 e 08 de fevereiro).

O projeto foi desenvolvido com Next.js App Router, foco em organização de dados, visualização clara do progresso e geração de relatórios profissionais em PDF, incluindo comprovantes PIX.

🧠 Visão Geral da Arquitetura

Frontend e Backend no mesmo projeto (Next.js App Router)

API interna via app/api

Persistência de dados:

Versão inicial: LocalStorage

Versão atual: PostgreSQL + Prisma ORM

Geração de PDF no client-side

Armazenamento de comprovantes PIX em base64 no banco

Compatível com ambiente serverless (Vercel)

🧱 Stack Tecnológica
Frontend

React 19

Next.js 16 (App Router)

TypeScript

Tailwind CSS

jsPDF

jsPDF AutoTable

Backend

Next.js Route Handlers (app/api)

Prisma ORM

PostgreSQL

Zod (validação de dados)

📂 Estrutura de Pastas

adolesanto-doacoes/
├── app/
│ ├── api/
│ │ └── receipts/[id]/route.ts # Endpoint para buscar comprovante PIX
│ ├── layout.tsx
│ └── page.tsx
├── lib/
│ ├── prisma.ts # Prisma Client
│ └── types.ts # Tipagens e helpers
├── prisma/
│ ├── schema.prisma # Modelos do banco
│ └── seed.ts # Seed de dados
├── public/
├── package.json
└── tailwind.config.ts

🗄️ Modelagem de Dados (Prisma)
PixReceipt

Armazena comprovantes PIX em base64

Relacionamento 1:1 com doação

Seguro para ambiente serverless (sem filesystem)

Campos principais:

id

base64

mimeType

donationId

uploadedAt

🔌 API Interna
GET /api/receipts/[id]

Retorna o comprovante PIX como imagem binária.

Fluxo:

Busca registro no banco via Prisma

Converte base64 → Buffer

Retorna imagem com headers corretos

Compatível com:

Android

iOS

WhatsApp

WEBP / PNG / JPEG

📄 Geração de PDF

A geração do PDF ocorre no client-side, utilizando:

jsPDF

jsPDF AutoTable

Seções do PDF

Cabeçalho institucional

Resumo Geral

Barra de progresso dinâmica

Tabela completa de doações

Resumo por item

Lista de doadores

Comprovantes PIX (uma página por comprovante)

Tratamento de Imagens

Imagens são carregadas via API

Conversão automática:

WEBP / PNG → JPEG

Conversão feita via Canvas

Evita falhas do jsPDF com formatos não suportados

📊 Barra de Progresso

Percentual calculado dinamicamente

Regra visual:

Até 99% → percentual no final da barra

100% → percentual centralizado

Cores contrastantes para evitar perda de legibilidade

🚀 Deploy (Vercel)

Projeto preparado para deploy serverless.

Configuração recomendada

Framework: Next.js

Build Command: npm run build

Output Directory: .next

Banco: PostgreSQL (Neon / Supabase / Railway)

🧪 Desenvolvimento Local

Instalar dependências:

npm install

Gerar cliente Prisma:

npx prisma generate

Rodar migrations:

npx prisma migrate dev

Iniciar servidor:

npm run dev

🧩 Scripts

dev – ambiente de desenvolvimento

build – build de produção

start – executar build

lint – análise estática

seed – popular banco de dados

Obs.: Sempre que for popular o banco, renomeie o arquivo seed-create.ts para seed.ts e execute o comando pnpm run seed.

Caso você queira apenas atualizar a lista, adicionando mais itens ou ajustando quantidades, utilize o seed-update.ts. Renomeie-o para seed.ts, faça as alterações necessárias, salve o arquivo e execute novamente o comando pnpm run seed.

⭐ Desafio Técnico

Este projeto foi desenvolvido sem bibliotecas de componentes prontos (ex: ShadCN UI).

Objetivos do desafio:

Dominar App Router

Trabalhar com PDF em produção

Resolver limitações de imagens no jsPDF

Garantir compatibilidade mobile

Manter código simples e legível

Se este projeto te ajudou:

deixe uma ⭐ no repositório

contribuições são bem-vindas

issues e PRs são incentivados

📞 Contato

Paróquia Santíssima Trindade

WhatsApp: (62) 99248-6492 | (62) 99248-6496
PIX: Warley Coutinho Pereira dos Santos
Banco: Neon Pagamentos S.A.

"Cada um contribua conforme o impulso do seu coração."
2 Coríntios 9,7
