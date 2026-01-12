import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// GET - Buscar comprovante PIX por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const receiptId = params.id;

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

    // Ler o arquivo do disco
    const filePath = path.join(process.cwd(), "public", receipt.filePath);

    try {
      const fileBuffer = await fs.readFile(filePath);

      // Retornar a imagem com o tipo MIME correto
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": receipt.mimeType,
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (fileError) {
      console.error("Erro ao ler arquivo:", fileError);

      // Se o arquivo não existe, retornar erro 404
      return NextResponse.json(
        { error: "Arquivo de comprovante não encontrado no sistema" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar comprovante:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
