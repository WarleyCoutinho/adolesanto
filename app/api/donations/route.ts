import { prisma } from "@/lib/prisma";
import { savePixReceipt } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

// GET - Buscar todos os itens de doação
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

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar itens do banco de dados" },
      { status: 500 }
    );
  }
}

// POST - Criar nova doação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, donorName, donorPhone, donorObs, donationType, pixFile } =
      body;

    // Validações básicas
    if (!itemId || !donorName || !donorPhone || !donationType) {
      return NextResponse.json(
        { error: "Dados incompletos. Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // Validar nome mínimo
    if (donorName.trim().length < 3) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    // Se for PIX, validar comprovante
    if (donationType === "PIX" && !pixFile) {
      return NextResponse.json(
        { error: "Comprovante PIX obrigatório para doações em dinheiro" },
        { status: 400 }
      );
    }

    // Buscar item no banco de dados
    const item = await prisma.donationItem.findUnique({
      where: { itemId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se item já foi doado
    if (item.donated) {
      return NextResponse.json(
        { error: "Este item já foi doado por outra pessoa" },
        { status: 400 }
      );
    }

    // Criar doação no banco de dados
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
        // Continua mesmo se falhar o upload (doação já foi salva)
        // Você pode optar por reverter a transação aqui se preferir
      }
    }

    // Criar log de atividade
    await prisma.activityLog.create({
      data: {
        action: "DONATION_CREATED",
        description: `Doação realizada: ${item.name} por ${donorName.trim()}`,
        metadata: {
          donationId: donation.id,
          itemId: item.itemId,
          donorName: donorName.trim(),
          donationType,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        donation,
        message: "Doação confirmada com sucesso!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar doação:", error);

    // Verificar se é erro de validação do Prisma
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Este item já foi doado" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar doação. Tente novamente." },
      { status: 500 }
    );
  }
}
