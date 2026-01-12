import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Buscar comprovante PIX por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: receiptId } = params;

    // Buscar o comprovante no banco
    const receipt = await prisma.pixReceipt.findUnique({
      where: { id: receiptId },
    });

    if (!receipt) {
      return NextResponse.json(
        { error: "Comprovante não encontrado" },
        { status: 404 }
      );
    }

    // Converter base64 em buffer
    const buffer = Buffer.from(receipt.base64, "base64");

    // Retornar a imagem diretamente
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": receipt.mimeType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar comprovante:", error);

    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
