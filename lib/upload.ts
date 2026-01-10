import { mkdir, writeFile } from "fs/promises";
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
