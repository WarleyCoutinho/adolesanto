import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";

import pkg from "../generated/prisma/index.js";

const { PrismaClient } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Dados dos itens de doação
const donationItems = [
  // SEXTA-FEIRA - 06/02 - Caldo de milho
  {
    itemId: "sex-milho-1",
    name: "02 mãos de milho",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-2",
    name: "05 kg de peito de frango",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-3",
    name: "02 lt de óleo",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-4",
    name: "03 moldes de cebolinha",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-5",
    name: "02 bandejas de pimenta de cheiro",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-6",
    name: "02 pt de Sazón sabor frango",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-7",
    name: "100 g de açafrão",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-8",
    name: "200 g de alho",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-9",
    name: "02 kg de cebola de cabeça",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-milho-10",
    name: "100 g de pimenta do reino",
    category: "Caldo de milho",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },

  // SEXTA-FEIRA - 06/02 - Caldo de mandioca
  {
    itemId: "sex-mand-1",
    name: "10 kg de mandioca",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-2",
    name: "03 kg de costela",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-3",
    name: "02 kg de carne acém ou músculo",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-4",
    name: "100 g de colorau",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-5",
    name: "100 g de pimenta do reino",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-6",
    name: "02 pt Sazón de costela",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-7",
    name: "02 kg de cebola",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },
  {
    itemId: "sex-mand-8",
    name: "01 kg de sal",
    category: "Caldo de mandioca",
    day: "Sexta-feira 06/02",
    meal: "Noite de Caldos",
  },

  // SÁBADO - 07/02 - Almoço
  {
    itemId: "sab-alm-1",
    name: "15 kg de arroz",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-2",
    name: "06 kg de feijão",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-3",
    name: "30 kg de carne de porco pernil",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-4",
    name: "22 kg de batata",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-5",
    name: "10 lt de leite",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-6",
    name: "01 kg de margarina",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-7",
    name: "02 pt Sazón para massa",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-8",
    name: "08 lt de óleo",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-9",
    name: "1/2 kg de alho",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-10",
    name: "04 kg de cebola",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-alm-11",
    name: "100 g de pimenta do reino",
    category: "Almoço",
    day: "Sábado 07/02",
    meal: "Almoço",
  },

  // SÁBADO - 07/02 - Salada
  {
    itemId: "sab-sal-1",
    name: "05 cabeças de repolho grande",
    category: "Salada",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-sal-2",
    name: "10 kg de tomate",
    category: "Salada",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-sal-3",
    name: "03 moldes de cebolinha",
    category: "Salada",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-sal-4",
    name: "12 limões",
    category: "Salada",
    day: "Sábado 07/02",
    meal: "Almoço",
  },
  {
    itemId: "sab-sal-5",
    name: "01 vidro de azeite",
    category: "Salada",
    day: "Sábado 07/02",
    meal: "Almoço",
  },

  // SÁBADO - 07/02 - Jantar (Noite de Massas)
  {
    itemId: "sab-jan-1",
    name: "10 pt macarrão espaguete",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-2",
    name: "10 pt macarrão de sua preferência (Parafuso ou Penha)",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-3",
    name: "12 kg de carne moída",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-4",
    name: "08 kg de filé de peito de frango",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-5",
    name: "05 kg de extrato de tomate",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-6",
    name: "10 lt de leite",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-7",
    name: "01 kg de margarina",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-8",
    name: "01 kg de amido de milho",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-9",
    name: "100 g de orégano",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-10",
    name: "02 pt Sazón para massas",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-11",
    name: "01 kg de sal",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-12",
    name: "01 balde de azeitona sem caroço",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-13",
    name: "04 kg de mussarela",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-14",
    name: "04 kg de presunto",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-15",
    name: "01 lata de 5 kg de milho",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-16",
    name: "02 lt de creme de leite",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-17",
    name: "02 bandejas de pimenta de cheiro",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-18",
    name: "03 moldes de cebolinha",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-19",
    name: "1/2 kg de alho",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-20",
    name: "03 kg de cebola",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-21",
    name: "04 kg de cebola de cabeça",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },
  {
    itemId: "sab-jan-22",
    name: "100 g de pimenta do reino",
    category: "Jantar - Massas",
    day: "Sábado 07/02",
    meal: "Jantar - Noite de Massas",
  },

  // DOMINGO - 08/02 - Almoço
  {
    itemId: "dom-alm-1",
    name: "15 kg de arroz",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-2",
    name: "06 kg de feijão",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-3",
    name: "02 kg de bacon",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-4",
    name: "02 kg de linguiça calabresa",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-5",
    name: "01 kg de farinha de mandioca",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-6",
    name: "20 kg de filé de peito de frango",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-7",
    name: "10 lt de leite",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-8",
    name: "03 lt de creme de leite",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-9",
    name: "01 kg de amido de milho",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-10",
    name: "01 kg de margarina",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-11",
    name: "1/2 kg de alho",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-12",
    name: "03 kg de cebola",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-13",
    name: "04 kg de batata palha",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-14",
    name: "01 kg de sal",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-15",
    name: "04 lt de óleo",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-16",
    name: "01 kg de requeijão",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
  {
    itemId: "dom-alm-17",
    name: "1/2 kg de ketchup",
    category: "Almoço",
    day: "Domingo 08/02",
    meal: "Almoço",
  },
];

async function main() {
  console.log("🌱 Iniciando atualização do banco de dados...");

  // NÃO deletar dados existentes - apenas atualizar
  console.log(
    "🔄 Atualizando itens de doação (preservando status de doação)...",
  );

  let updatedCount = 0;
  let createdCount = 0;

  for (const item of donationItems) {
    const result = await prisma.donationItem.upsert({
      where: { itemId: item.itemId },
      update: {
        // Atualiza APENAS nome, categoria, dia e refeição
        // NÃO toca no campo 'donated' para preservar doações já feitas
        name: item.name,
        category: item.category,
        day: item.day,
        meal: item.meal,
      },
      create: {
        // Se o item não existir, cria um novo com donated: false
        itemId: item.itemId,
        name: item.name,
        category: item.category,
        day: item.day,
        meal: item.meal,
        donated: false,
      },
    });

    // Verifica se foi atualizado ou criado
    const existingItem = await prisma.donationItem.findUnique({
      where: { itemId: item.itemId },
    });

    if (existingItem) {
      updatedCount++;
    } else {
      createdCount++;
    }
  }

  console.log(`✅ ${updatedCount} itens atualizados`);
  console.log(`✅ ${createdCount} itens novos criados`);

  // Criar log de atividade
  await prisma.activityLog.create({
    data: {
      action: "DATABASE_UPDATED",
      description:
        "Lista de itens de doação atualizada (preservando doações existentes)",
      metadata: {
        updatedCount,
        createdCount,
        timestamp: new Date().toISOString(),
      },
    },
  });

  console.log("🎉 Atualização concluída com sucesso!");
  console.log("✅ Todas as doações anteriores foram preservadas!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante a atualização:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
