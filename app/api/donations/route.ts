import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Função auxiliar para detectar itens medidos em kg/litros
// function parseItemQuantity(itemName: string): {
//   requiresQuantity: boolean;
//   totalQuantity: number | null;
//   unit: string | null;
// } {
//   const kgMatch = itemName.match(/(\d+(?:[,\.]\d+)?)\s*kg/i);
//   const literMatch = itemName.match(
//     /(\d+(?:[,\.]\d+)?)\s*(?:litros?|lts?|l(?:\s|$))/i
//   );

//   if (kgMatch) {
//     const quantity = parseFloat(kgMatch[1].replace(",", "."));
//     return {
//       requiresQuantity: true,
//       totalQuantity: quantity,
//       unit: "kg",
//     };
//   }

//   if (literMatch) {
//     const quantity = parseFloat(literMatch[1].replace(",", "."));
//     return {
//       requiresQuantity: true,
//       totalQuantity: quantity,
//       unit: "litros",
//     };
//   }

function parseItemQuantity(itemName: string): {
  requiresQuantity: boolean;
  totalQuantity: number | null;
  unit: string | null;
} {
  const kgMatch = itemName.match(/(\d+(?:[,\.]\d+)?)\s*kg/i);
  const literMatch = itemName.match(
    /(\d+(?:[,\.]\d+)?)\s*(?:litros?|lts?|lt?)\b/i,
  );
  const pacoteMatch = itemName.match(
    /(\d+(?:[,\.]\d+)?)\s*(?:pacotes?|pcts?|pct|pt)(?:\s|$)/i,
  );

  if (kgMatch) {
    const quantity = parseFloat(kgMatch[1].replace(",", "."));
    return {
      requiresQuantity: true,
      totalQuantity: quantity,
      unit: "kg",
    };
  }

  if (literMatch) {
    const quantity = parseFloat(literMatch[1].replace(",", "."));
    return {
      requiresQuantity: true,
      totalQuantity: quantity,
      unit: "litros",
    };
  }

  if (pacoteMatch) {
    const quantity = parseFloat(pacoteMatch[1].replace(",", "."));
    return {
      requiresQuantity: true,
      totalQuantity: quantity,
      unit: "pacotes",
    };
  }

  return {
    requiresQuantity: false,
    totalQuantity: null,
    unit: null,
  };
}

// GET - Buscar todos os itens de doação
export async function GET() {
  try {
    const items = await prisma.donationItem.findMany({
      include: {
        donations: {
          include: {
            pixReceipt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: [{ day: "asc" }, { category: "asc" }],
    });

    // Adiciona informações calculadas de doações parciais
    const itemsWithInfo = items.map((item) => {
      // Para compatibilidade com código antigo, mantém "donation" como a primeira doação
      const donation = item.donations[0] || null;

      return {
        ...item,
        donation, // Compatibilidade com código antigo
        remainingQuantity:
          item.requiresQuantity && item.totalQuantity
            ? item.totalQuantity - item.donatedQuantity
            : null,
        percentageDonated:
          item.requiresQuantity && item.totalQuantity
            ? Math.round((item.donatedQuantity / item.totalQuantity) * 100)
            : null,
      };
    });

    return NextResponse.json({ items: itemsWithInfo }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar itens do banco de dados" },
      { status: 500 },
    );
  }
}

// POST - Criar nova doação (com suporte a doações parciais para Item e PIX)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      itemId,
      donorName,
      donorPhone,
      donorObs,
      donationType,
      pixFile,
      isPartialDonation,
      partialQuantity,
    } = body;

    // Validações básicas
    if (!itemId || !donorName || !donorPhone || !donationType) {
      return NextResponse.json(
        { error: "Dados incompletos. Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }

    // Validar nome mínimo
    if (donorName.trim().length < 3) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 },
      );
    }

    // Validar telefone básico
    if (donorPhone.trim().length < 10) {
      return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
    }

    // Validar tipo de doação
    if (!["Item", "PIX"].includes(donationType)) {
      return NextResponse.json(
        { error: "Tipo de doação inválido" },
        { status: 400 },
      );
    }

    // Se for PIX, validar comprovante
    if (donationType === "PIX" && !pixFile) {
      return NextResponse.json(
        { error: "Comprovante PIX obrigatório para doações em dinheiro" },
        { status: 400 },
      );
    }

    // Validar doação parcial
    if (isPartialDonation) {
      if (!partialQuantity || partialQuantity <= 0) {
        return NextResponse.json(
          { error: "Quantidade inválida para doação parcial" },
          { status: 400 },
        );
      }
    }

    // Buscar item no banco de dados
    const item = await prisma.donationItem.findUnique({
      where: { itemId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se item já foi completamente doado
    if (item.donated && !item.requiresQuantity) {
      return NextResponse.json(
        { error: "Este item já foi doado por outra pessoa" },
        { status: 400 },
      );
    }

    const quantityInfo = parseItemQuantity(item.name);

    // Inicializar campos de quantidade se ainda não existirem
    if (quantityInfo.requiresQuantity && !item.requiresQuantity) {
      await prisma.donationItem.update({
        where: { id: item.id },
        data: {
          requiresQuantity: true,
          totalQuantity: quantityInfo.totalQuantity,
          unit: quantityInfo.unit,
        },
      });
    }

    // Processar doação
    if (isPartialDonation) {
      // DOAÇÃO PARCIAL (Item OU PIX)
      if (!quantityInfo.requiresQuantity) {
        return NextResponse.json(
          { error: "Este item não aceita doações parciais" },
          { status: 400 },
        );
      }

      const currentTotal =
        item.totalQuantity || quantityInfo.totalQuantity || 0;
      const remainingQuantity = currentTotal - item.donatedQuantity;

      if (partialQuantity > remainingQuantity) {
        return NextResponse.json(
          {
            error: `Quantidade excede o necessário. Restam apenas ${remainingQuantity.toFixed(
              1,
            )} ${item.unit || quantityInfo.unit}`,
          },
          { status: 400 },
        );
      }

      // Atualizar quantidade doada
      const newDonatedQuantity = item.donatedQuantity + partialQuantity;
      const isNowComplete = newDonatedQuantity >= currentTotal;

      await prisma.donationItem.update({
        where: { id: item.id },
        data: {
          donatedQuantity: newDonatedQuantity,
          donated: isNowComplete,
        },
      });
    } else {
      // DOAÇÃO COMPLETA (Item OU PIX)
      if (item.donated) {
        return NextResponse.json(
          { error: "Este item já foi completamente doado" },
          { status: 400 },
        );
      }

      const updateData: any = {
        donated: true,
      };

      // Se for item medido, atualiza a quantidade doada
      if (quantityInfo.requiresQuantity) {
        updateData.donatedQuantity = quantityInfo.totalQuantity || 0;
      }

      await prisma.donationItem.update({
        where: { id: item.id },
        data: updateData,
      });
    }

    // Criar registro de doação
    const donation = await prisma.donation.create({
      data: {
        donorName: donorName.trim(),
        donorPhone: donorPhone.trim(),
        donorObs: donorObs?.trim() || null,
        donationType,
        donationItemId: item.id,
        isPartialDonation: isPartialDonation || false,
        partialQuantity: isPartialDonation ? partialQuantity : null,
      },
    });

    // Salvar comprovante PIX se fornecido
    if (donationType === "PIX" && pixFile) {
      try {
        const [meta, base64] = pixFile.split(",");
        const mimeType = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";

        await prisma.pixReceipt.create({
          data: {
            donationId: donation.id,
            mimeType,
            base64,
          },
        });
      } catch (uploadError) {
        console.error("Erro ao salvar comprovante:", uploadError);
        // Continua mesmo se falhar o upload (doação já foi salva)
      }
    }

    // Criar log de atividade
    const quantityText =
      isPartialDonation && partialQuantity
        ? ` (${partialQuantity} ${
            item.unit || quantityInfo.unit || "unidades"
          })`
        : "";

    await prisma.activityLog.create({
      data: {
        action: "DONATION_CREATED",
        description: `Doação realizada: ${
          item.name
        }${quantityText} por ${donorName.trim()}`,
        metadata: {
          donationId: donation.id,
          itemId: item.itemId,
          donorName: donorName.trim(),
          donationType,
          isPartialDonation: isPartialDonation || false,
          partialQuantity: partialQuantity || null,
        },
      },
    });

    // Mensagem personalizada baseada no tipo de doação
    let successMessage = "Doação confirmada com sucesso!";
    if (isPartialDonation && partialQuantity) {
      const unit = item.unit || quantityInfo.unit || "unidades";
      successMessage = `Doação parcial confirmada! Você doou ${partialQuantity} ${unit}. Muito obrigado! 🙏`;
    }

    return NextResponse.json(
      {
        success: true,
        donation,
        message: successMessage,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar doação:", error);

    // Verificar se é erro de validação do Prisma
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Erro ao processar doação" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar doação. Tente novamente." },
      { status: 500 },
    );
  }
}
