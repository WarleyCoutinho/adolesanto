# 🚀 Guia Completo - Sistema de Doações com Next.js + Prisma

## 📋 Estrutura do Projeto Next.js

```
adolesanto-doacoes/
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── seed.ts                # Popular banco
├── src/
│   ├── app/
│   │   ├── page.tsx           # Página principal (seu código atual)
│   │   ├── globals.css
│   │   └── api/
│   │       ├── donations/
│   │       │   └── route.ts   # GET e POST doações
│   │       └── upload/
│   │           └── route.ts   # Upload de imagens
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── upload.ts          # Funções de upload
│   └── components/
│       └── DownloadReportButton.tsx
├── public/
│   └── uploads/
│       └── pix/               # Comprovantes PIX
├── .env
├── .env.example
└── package.json
```

## 🔧 Passo 1: Instalação

### 1.1 Criar projeto Next.js (se ainda não tiver)

```bash
npx create-next-app@latest adolesanto-doacoes
# Escolha: TypeScript, Tailwind CSS, App Router
cd adolesanto-doacoes
```

### 1.2 Instalar dependências

```bash
npm install prisma @prisma/client
npm install -D ts-node
```

## 🗄️ Passo 2: Configurar Prisma

### 2.1 Criar arquivo .env

```env
# .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/adolesanto?schema=public"

# Para desenvolvimento local com SQLite (mais fácil):
# DATABASE_URL="file:./dev.db"

# Para produção (Vercel + Neon/Supabase):
# DATABASE_URL="postgresql://user:pass@host.neon.tech/doacoes"
```

### 2.2 Criar pasta prisma e adicionar arquivos

```bash
mkdir prisma
# Copie os arquivos schema.prisma e seed.ts para a pasta prisma/
```

### 2.3 Adicionar script seed no package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 2.4 Inicializar banco

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npm run db:push

# Popular banco com os dados
npm run db:seed

# Visualizar dados (opcional)
npm run db:studio
```

## 💾 Passo 3: Criar Cliente Prisma

### src/lib/prisma.ts

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## 📤 Passo 4: Criar Função de Upload

### src/lib/upload.ts

```typescript
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function savePixReceipt(
  base64Data: string,
  donationId: string
): Promise<{
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}> {
  // Extrair informações do base64
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error("Formato de imagem inválido");
  }

  const mimeType = matches[1];
  const base64Content = matches[2];
  const buffer = Buffer.from(base64Content, "base64");

  // Validar tamanho (máx 5MB)
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("Arquivo muito grande. Máximo: 5MB");
  }

  // Validar tipo
  if (!mimeType.startsWith("image/")) {
    throw new Error("Apenas imagens são permitidas");
  }

  // Gerar nome único
  const extension = mimeType.split("/")[1];
  const fileName = `pix_${donationId}_${Date.now()}.${extension}`;

  // Criar diretório se não existir
  const uploadDir = join(process.cwd(), "public", "uploads", "pix");
  await mkdir(uploadDir, { recursive: true });

  // Salvar arquivo
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return {
    fileName,
    fileUrl: `/uploads/pix/${fileName}`,
    fileSize: buffer.length,
    mimeType,
  };
}
```

## 🔌 Passo 5: Criar API Routes

### src/app/api/donations/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { savePixReceipt } from "@/lib/upload";

// GET - Buscar todos os itens
export async function GET() {
  try {
    const items = await prisma.donationItem.findMany({
      include: {
        donation: {
          include: {
            pixReceipt: true,
          },
        },
      },
      orderBy: [{ day: "asc" }, { category: "asc" }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar itens" },
      { status: 500 }
    );
  }
}

// POST - Criar doação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, donorName, donorPhone, donorObs, donationType, pixFile } =
      body;

    // Validações básicas
    if (!itemId || !donorName || !donorPhone || !donationType) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    if (donationType === "PIX" && !pixFile) {
      return NextResponse.json(
        { error: "Comprovante PIX obrigatório" },
        { status: 400 }
      );
    }

    // Buscar item
    const item = await prisma.donationItem.findUnique({
      where: { itemId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    if (item.donated) {
      return NextResponse.json({ error: "Item já foi doado" }, { status: 400 });
    }

    // Criar doação
    const donation = await prisma.donation.create({
      data: {
        donorName: donorName.trim(),
        donorPhone: donorPhone.trim(),
        donorObs: donorObs?.trim() || null,
        donationType,
        donationItemId: item.id,
      },
    });

    // Atualizar item como doado
    await prisma.donationItem.update({
      where: { id: item.id },
      data: { donated: true },
    });

    // Salvar comprovante PIX se fornecido
    if (donationType === "PIX" && pixFile) {
      try {
        const receiptData = await savePixReceipt(pixFile, donation.id);

        await prisma.pixReceipt.create({
          data: {
            ...receiptData,
            donationId: donation.id,
          },
        });
      } catch (uploadError) {
        console.error("Erro ao salvar comprovante:", uploadError);
        // Continua mesmo se falhar o upload (já salvou a doação)
      }
    }

    // Criar log
    await prisma.activityLog.create({
      data: {
        action: "DONATION_CREATED",
        description: `Doação realizada: ${item.name}`,
        metadata: {
          donationId: donation.id,
          itemId: item.itemId,
          donorName,
          donationType,
        },
      },
    });

    return NextResponse.json({
      success: true,
      donation,
      message: "Doação confirmada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar doação:", error);
    return NextResponse.json(
      { error: "Erro ao processar doação" },
      { status: 500 }
    );
  }
}
```

## 🎨 Passo 6: Atualizar Página Principal

### src/app/page.tsx

```typescript
"use client";

import { useEffect, useState } from "react";
import DownloadReportButton from "@/components/DownloadReportButton";

interface DonationItem {
  id: string;
  itemId: string;
  name: string;
  category: string;
  day: string;
  meal: string;
  donated: boolean;
  donation?: {
    donorName: string;
    donorPhone: string;
    donorObs?: string;
    donationType: string;
    donationDate: string;
    pixReceipt?: {
      fileUrl: string;
    };
  };
}

export default function Home() {
  const [items, setItems] = useState<DonationItem[]>([]);
  const [selectedDay, setSelectedDay] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorObs, setDonorObs] = useState("");
  const [donationType, setDonationType] = useState("");
  const [pixFile, setPixFile] = useState("");
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/donations");
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      alert("Erro ao carregar itens");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (item: DonationItem) => {
    setSelectedItem(item);
    setDonorName("");
    setDonorPhone("");
    setDonorObs("");
    setDonationType("");
    setPixFile("");
    setConfirmAlert(false);
    setModalOpen(true);
  };

  const confirmDonation = async () => {
    if (
      !selectedItem ||
      !donorName.trim() ||
      !donorPhone.trim() ||
      !donationType
    ) {
      return;
    }

    if (donationType === "PIX" && !pixFile) {
      alert("Anexe o comprovante PIX");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItem.itemId,
          donorName,
          donorPhone,
          donorObs,
          donationType,
          pixFile: donationType === "PIX" ? pixFile : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar");
      }

      await loadItems();
      setModalOpen(false);
      alert("Doação confirmada! 🙏");

      // Limpar campos
      setDonorName("");
      setDonorPhone("");
      setDonorObs("");
      setDonationType("");
      setPixFile("");
      setSelectedItem(null);
      setConfirmAlert(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande (máx 5MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Apenas imagens");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPixFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const days = ["Todos", "Sexta-feira 06/02", "Sábado 07/02", "Domingo 08/02"];

  const filteredItems =
    selectedDay === "Todos"
      ? items
      : items.filter((item) => item.day === selectedDay);

  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = `${item.day} - ${item.meal}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, DonationItem[]>);

  const totalItems = items.length;
  const donatedItems = items.filter((item) => item.donated).length;
  const progressPercentage = Math.round((donatedItems / totalItems) * 100);

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a8a] mx-auto mb-4" />
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* TODO: Cole aqui todo o HTML/JSX do seu componente atual */}
      {/* Apenas modifique as funções de doação para usar as novas */}
    </div>
  );
}
```

## 🚀 Passo 7: Deploy (Vercel)

### 7.1 Configurar banco de dados (escolha uma opção):

**Opção A - Neon (PostgreSQL grátis)**

```bash
# 1. Acesse: https://neon.tech
# 2. Crie um projeto
# 3. Copie a connection string
# 4. Adicione no Vercel como variável DATABASE_URL
```

**Opção B - Supabase (PostgreSQL grátis)**

```bash
# 1. Acesse: https://supabase.com
# 2. Crie um projeto
# 3. Vá em Settings > Database
# 4. Copie a connection string (modo direto)
```

### 7.2 Deploy no Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Adicionar variáveis de ambiente
vercel env add DATABASE_URL

# 5. Executar migrations
vercel env pull
npm run db:push
npm run db:seed

# 6. Deploy production
vercel --prod
```

### 7.3 Adicionar variáveis no dashboard Vercel

```
Settings > Environment Variables:
- DATABASE_URL: sua_connection_string
```

## 🔒 Segurança (Importante!)

### src/lib/validations.ts

```typescript
import { z } from "zod";

export const donationSchema = z.object({
  itemId: z.string().min(1),
  donorName: z.string().min(3).max(100),
  donorPhone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/),
  donorObs: z.string().max(500).optional(),
  donationType: z.enum(["Item", "PIX"]),
  pixFile: z.string().optional(),
});
```

Instalar zod:

```bash
npm install zod
```

## 📊 Comandos Úteis

```bash
# Ver banco de dados visualmente
npm run db:studio

# Resetar banco (apaga tudo e recria)
npm run db:reset

# Atualizar schema
npm run db:push

# Popular novamente
npm run db:seed

# Logs do Prisma
npx prisma studio
```

## 🎯 Checklist Final

- [ ] Instalou dependências
- [ ] Criou .env com DATABASE_URL
- [ ] Copiou schema.prisma e seed.ts para prisma/
- [ ] Rodou `npm run db:push`
- [ ] Rodou `npm run db:seed`
- [ ] Criou src/lib/prisma.ts
- [ ] Criou src/lib/upload.ts
- [ ] Criou src/app/api/donations/route.ts
- [ ] Atualizou src/app/page.tsx
- [ ] Testou localmente
- [ ] Configurou banco em produção
- [ ] Fez deploy

## 🆘 Problemas Comuns

**Erro: Can't reach database**

- Verifique DATABASE_URL no .env
- Para SQLite: use `file:./dev.db`

**Erro: Table doesn't exist**

- Execute: `npm run db:push`

**Erro: No items**

- Execute: `npm run db:seed`

**Erro: Module not found 'fs/promises'**

- O Next.js suporta nativamente, mas certifique-se de estar usando Node 16+

## 📚 Próximos Passos

1. ✅ Adicionar autenticação (NextAuth.js)
2. ✅ Dashboard administrativo
3. ✅ Notificações por WhatsApp (Twilio)
4. ✅ Relatórios em PDF
5. ✅ Sistema de categorias dinâmicas

## 🤝 Suporte

- Documentação Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
