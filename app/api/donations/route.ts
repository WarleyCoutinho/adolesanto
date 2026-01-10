import { prisma } from "@/lib/prisma";
import { savePixReceipt } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

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
