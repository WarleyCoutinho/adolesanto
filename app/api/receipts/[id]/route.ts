import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// GET - Buscar comprovante PIX por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ - params é uma Promise
    const { id: receiptId } = await params;

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

    // Ler o arquivo do disco usando fileUrl
    // Remove a barra inicial se existir, pois path.join já adiciona os separadores
    const cleanFileUrl = receipt.fileUrl.startsWith("/")
      ? receipt.fileUrl.substring(1)
      : receipt.fileUrl;
    const filePath = path.join(process.cwd(), "public", cleanFileUrl);

    console.log("🔍 Debug:", {
      receiptId,
      fileUrl: receipt.fileUrl,
      cleanFileUrl,
      filePath,
      exists: await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false),
    });

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
