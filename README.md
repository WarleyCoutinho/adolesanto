# Adolesanto - Sistema de Doações

Sistema de acompanhamento de doações para o evento Adolesanto da Paróquia Santíssima Trindade (06, 07 e 08 de fevereiro).

## 🎨 Características

- ✅ Design inspirado nas cores do evento (azul e dourado)
- ✅ Sistema de progresso visual das doações
- ✅ Armazenamento local (LocalStorage) - sem necessidade de banco de dados
- ✅ Interface responsiva e animada
- ✅ Filtro por dia do evento
- ✅ Sistema de confirmação de doações com nome do doador

## 🚀 Deploy na Vercel

### Opção 1: Via Interface da Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login ou crie uma conta
3. Clique em "Add New..." → "Project"
4. Importe seu repositório do GitHub
5. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Clique em "Deploy"

### Opção 2: Via CLI da Vercel

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Na pasta do projeto, executar:
vercel

# Seguir as instruções no terminal
# Para deploy de produção:
vercel --prod
```

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

## 📱 Funcionalidades

### Para os Organizadores:
- Visualizar progresso geral e por categoria
- Acompanhar quem doou cada item
- Filtrar doações por dia do evento

### Para os Doadores:
- Ver lista completa de itens necessários
- Registrar sua doação com nome
- Cancelar doação se necessário

## 🗂️ Estrutura do Projeto

```
adolesanto-doacoes/
├── app/
│   ├── data.ts          # Lista completa de itens para doação
│   ├── globals.css      # Estilos globais
│   ├── layout.tsx       # Layout raiz
│   └── page.tsx         # Página principal
├── public/              # Arquivos estáticos
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎯 Tecnologias

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- LocalStorage para persistência

## 📞 Contato

**Paróquia Santíssima Trindade**
- WhatsApp: (62) 99248-6492 | (62) 99248-6496
- PIX: Warley Coutinho Pereira dos Santos
- Banco: Neon Pagamentos S.A.

---

*"Cada um contribua conforme o impulso do seu coração." (2 Coríntios 9,7)*
