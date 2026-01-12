"use client";

import {
  DonationItem,
  getDonationDate,
  getDonationType,
  getDonorName,
  getDonorPhone,
} from "@/lib/types";

interface DownloadReportButtonProps {
  items: DonationItem[];
}

export default function DownloadReportButton({
  items,
}: DownloadReportButtonProps) {
  /* ================= UTIL ================= */
  const loadImageAsBase64 = async (
    receiptId: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(`/api/receipts/${receiptId}`);
      if (!response.ok) return null;

      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  /* ================= PDF ================= */
  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const primary: [number, number, number] = [30, 58, 138];
    const secondary: [number, number, number] = [212, 175, 55];
    const lightGray: [number, number, number] = [243, 244, 246];

    const donatedItems = items.filter(
      (i) => i.donated || (i.donations?.length ?? 0) > 0
    );

    if (!donatedItems.length) {
      alert("Ainda não há doações.");
      return;
    }

    /* ================= CABEÇALHO ================= */
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageWidth, 50, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text("ADOLESANTO", pageWidth / 2, 20, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(...secondary);
    doc.text("Santíssima Trindade", pageWidth / 2, 28, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("06, 07 e 08 de fevereiro", pageWidth / 2, 36, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("Relatório de Doações", pageWidth / 2, 43, {
      align: "center",
    });

    let y = 60;

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, y);
    y += 10;

    /* ================= ESTATÍSTICAS ================= */
    const total = items.length;
    const completos = items.filter((i) => i.donated).length;
    const parciais = donatedItems.length - completos;
    const pendentes = total - (completos + parciais);
    const progresso = Math.round((completos / total) * 100);

    doc.setFillColor(...lightGray);
    doc.roundedRect(14, y, pageWidth - 28, 35, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primary);
    doc.text("Resumo Geral", 20, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(`Total: ${total}`, 20, y + 16);
    doc.text(`Completos: ${completos}`, 70, y + 16);
    doc.text(`Parciais: ${parciais}`, 130, y + 16);
    doc.text(`Pendentes: ${pendentes}`, 20, y + 24);

    const barY = y + 28;
    const barWidth = pageWidth - 40;

    doc.setFillColor(220, 220, 220);
    doc.roundedRect(20, barY, barWidth, 4, 2, 2, "F");

    doc.setFillColor(...secondary);
    doc.roundedRect(20, barY, (barWidth * progresso) / 100, 4, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...secondary);
    doc.text(`${progresso}%`, pageWidth - 20, barY + 3, {
      align: "right",
    });

    y += 50;

    /* ================= TABELA DE DOAÇÕES ================= */
    const tableData: any[] = [];
    let idx = 1;

    donatedItems.forEach((item) => {
      if (item.donations?.length) {
        item.donations.forEach((d: any, i) => {
          tableData.push([
            i === 0 ? idx : "",
            i === 0 ? item.name : "",
            d.donorName,
            d.donorPhone,
            d.partialQuantity
              ? `${d.partialQuantity} ${item.unit}`
              : "Completo",
            item.requiresQuantity
              ? `${item.donatedQuantity}/${item.totalQuantity} ${item.unit}`
              : "Completo",
            d.donationType,
            d.createdAt ? new Date(d.createdAt).toLocaleString("pt-BR") : "-",
          ]);
        });
        idx++;
      } else {
        tableData.push([
          idx++,
          item.name,
          getDonorName(item),
          getDonorPhone(item),
          "Completo",
          "Completo",
          getDonationType(item),
          getDonationDate(item)
            ? new Date(getDonationDate(item)!).toLocaleString("pt-BR")
            : "-",
        ]);
      }
    });

    autoTable(doc, {
      startY: y,
      head: [
        ["#", "Item", "Doador", "Telefone", "Qtd", "Status", "Tipo", "Data"],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: primary, textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    /* ================= RESUMO POR ITEM ================= */
    const itemsWithPartial = items.filter(
      (i) => i.requiresQuantity && (i.donations?.length ?? 0) > 1
    );

    if (itemsWithPartial.length) {
      autoTable(doc, {
        startY: y,
        head: [["#", "Item", "Progresso", "Status", "Doadores"]],
        body: itemsWithPartial.map((item, i) => [
          i + 1,
          item.name,
          `${item.donatedQuantity}/${item.totalQuantity} ${item.unit}`,
          item.donated ? "Completo" : "Parcial",
          (item.donations || [])
            .map(
              (d: any) =>
                `${d.donorName} (${d.partialQuantity || 0} ${item.unit})`
            )
            .join("; "),
        ]),
        theme: "grid",
        headStyles: { fillColor: secondary, textColor: 255 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    }

    /* ================= LISTA DE DOADORES ================= */
    const donors = new Map<
      string,
      { name: string; phone: string; count: number }
    >();

    donatedItems.forEach((item) => {
      (item.donations || []).forEach((d: any) => {
        const key = d.donorPhone;
        donors.set(key, {
          name: d.donorName,
          phone: d.donorPhone,
          count: (donors.get(key)?.count || 0) + 1,
        });
      });
    });

    autoTable(doc, {
      startY: y,
      head: [["#", "Nome", "Telefone", "Doações"]],
      body: Array.from(donors.values()).map((d, i) => [
        i + 1,
        d.name,
        d.phone,
        d.count,
      ]),
      theme: "grid",
      headStyles: { fillColor: secondary, textColor: 255 },
      margin: { left: 14, right: 14 },
    });

    /* ================= COMPROVANTES PIX ================= */
    const pix = donatedItems.flatMap((item) =>
      (item.donations || [])
        .filter((d: any) => d.donationType === "PIX" && d.pixReceipt)
        .map((d: any) => ({
          item: item.name,
          donor: d.donorName,
          phone: d.donorPhone,
          date: d.createdAt
            ? new Date(d.createdAt).toLocaleString("pt-BR")
            : "-",
          receiptId: d.pixReceipt.id,
        }))
    );

    for (let i = 0; i < pix.length; i++) {
      doc.addPage();
      let yy = 20;

      const imgData = await loadImageAsBase64(pix[i].receiptId);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...primary);
      doc.text(`Comprovante PIX #${i + 1}`, pageWidth / 2, yy, {
        align: "center",
      });

      yy += 25;

      if (imgData) {
        const img = new Image();
        img.src = imgData;
        await new Promise<void>((r) => (img.onload = () => r()));

        const maxW = pageWidth - 40;
        const ratio = img.width / img.height;
        const h = maxW / ratio;
        const x = (pageWidth - maxW) / 2;

        doc.setFillColor(245, 246, 248);
        doc.roundedRect(x - 6, yy - 6, maxW + 12, h + 12, 3, 3, "F");

        doc.addImage(
          imgData,
          imgData.startsWith("data:image/png") ? "PNG" : "JPEG",
          x,
          yy,
          maxW,
          h,
          undefined,
          "MEDIUM"
        );
      }
    }

    /* ================= RODAPÉ ================= */
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    }

    doc.save(
      `relatorio-doacoes-adolesanto-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  return (
    <button
      onClick={generatePDF}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow"
    >
      Baixar Relatório PDF
    </button>
  );
}
