"use client";

import {
  DonationItem,
  getDonationDate,
  getDonationType,
  getDonorName,
  getDonorObs,
  getDonorPhone,
} from "@/lib/types";

interface DownloadReportButtonProps {
  items: DonationItem[];
}

export default function DownloadReportButton({
  items,
}: DownloadReportButtonProps) {
  const generatePDF = async () => {
    // Importacao dinamica do jsPDF e autoTable
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    // Cores do tema
    const primaryColor: [number, number, number] = [30, 58, 138]; // #1e3a8a
    const secondaryColor: [number, number, number] = [212, 175, 55]; // #d4af37
    const lightGray: [number, number, number] = [243, 244, 246];

    // Filtrar apenas itens doados
    const donatedItems = items.filter((item) => item.donated);

    if (donatedItems.length === 0) {
      alert("Ainda nao ha doacoes para gerar relatorio.");
      return;
    }

    // ===== CABECALHO =====
    const pageWidth = doc.internal.pageSize.width;

    // Fundo do cabecalho
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, "F");

    // Titulo principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("ADOLESANTO", pageWidth / 2, 20, { align: "center" });

    // Subtitulo
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...secondaryColor);
    doc.text("Santissima Trindade", pageWidth / 2, 28, { align: "center" });

    // Data do evento
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("06, 07 e 08 de fevereiro", pageWidth / 2, 36, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("Relatorio de Doacoes", pageWidth / 2, 43, { align: "center" });

    // ===== INFO DO RELATORIO =====
    let yPosition = 60;

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(
      `Data de geracao: ${new Date().toLocaleString("pt-BR")}`,
      14,
      yPosition
    );

    yPosition += 10;

    // ===== ESTATISTICAS =====
    const totalItems = items.length;
    const donatedCount = donatedItems.length;
    const progressPercentage = Math.round((donatedCount / totalItems) * 100);

    // Box de estatisticas
    doc.setFillColor(...lightGray);
    doc.roundedRect(14, yPosition, pageWidth - 28, 30, 3, 3, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Estatisticas Gerais", 20, yPosition + 8);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const statsY = yPosition + 16;
    doc.text(`Total de itens: ${totalItems}`, 20, statsY);
    doc.text(`Itens doados: ${donatedCount}`, 80, statsY);
    doc.text(`Pendentes: ${totalItems - donatedCount}`, 140, statsY);

    // Barra de progresso
    const progressBarY = yPosition + 24;
    const progressBarWidth = pageWidth - 40;
    const progressBarHeight = 4;

    // Fundo da barra
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(
      20,
      progressBarY,
      progressBarWidth,
      progressBarHeight,
      2,
      2,
      "F"
    );

    // Progresso
    doc.setFillColor(...secondaryColor);
    const progressWidth = (progressBarWidth * progressPercentage) / 100;
    doc.roundedRect(
      20,
      progressBarY,
      progressWidth,
      progressBarHeight,
      2,
      2,
      "F"
    );

    // Percentual
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text(`${progressPercentage}%`, pageWidth - 20, progressBarY + 3, {
      align: "right",
    });

    yPosition += 40;

    // ===== TABELA DE DOACOES =====
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Detalhes das Doacoes", 14, yPosition);

    yPosition += 8;

    // Preparar dados para a tabela
    const tableData = donatedItems.map((item, index) => {
      const donorName = getDonorName(item);
      const donorPhone = getDonorPhone(item);
      const donorObs = getDonorObs(item);
      const donationType = getDonationType(item);
      const donationDate = getDonationDate(item);

      return [
        index + 1,
        item.name,
        donorName,
        donorPhone,
        donationType,
        donationDate
          ? new Date(donationDate).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        donorObs || "-",
      ];
    });

    // Configurar e adicionar tabela
    autoTable(doc, {
      startY: yPosition,
      head: [["#", "Item", "Doador", "Telefone", "Tipo", "Data", "Obs"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 28 },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 30, fontSize: 7 },
        6: { cellWidth: 24, fontSize: 7 },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      margin: { left: 14, right: 14 },
    });

    // Pegar posicao Y apos a tabela
    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // ===== LISTA DE DOADORES =====
    // Agrupar doadores unicos
    const uniqueDonors = new Map<
      string,
      { name: string; phone: string; items: number }
    >();

    donatedItems.forEach((item) => {
      const donorName = getDonorName(item);
      const donorPhone = getDonorPhone(item);

      if (uniqueDonors.has(donorPhone)) {
        const donor = uniqueDonors.get(donorPhone)!;
        donor.items += 1;
      } else {
        uniqueDonors.set(donorPhone, {
          name: donorName,
          phone: donorPhone,
          items: 1,
        });
      }
    });

    // Verificar se precisa de nova pagina
    if (yPosition > doc.internal.pageSize.height - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(`Lista de Doadores (${uniqueDonors.size})`, 14, yPosition);

    yPosition += 8;

    // Dados dos doadores
    const donorsData = Array.from(uniqueDonors.values())
      .sort((a, b) => b.items - a.items)
      .map((donor, index) => [index + 1, donor.name, donor.phone, donor.items]);

    autoTable(doc, {
      startY: yPosition,
      head: [["#", "Nome", "Telefone", "Itens Doados"]],
      body: donorsData,
      theme: "grid",
      headStyles: {
        fillColor: secondaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 70 },
        2: { cellWidth: 50 },
        3: { cellWidth: 30, halign: "center", fontStyle: "bold" },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      margin: { left: 14, right: 14 },
    });

    // ===== RODAPE =====
    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Verificar se precisa de nova pagina para o rodape
    if (finalY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    } else {
      yPosition = finalY;
    }

    // Box de informacoes de contato
    doc.setFillColor(...primaryColor);
    doc.roundedRect(14, yPosition, pageWidth - 28, 35, 3, 3, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Informacoes de Contato", 20, yPosition + 8);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("WhatsApp: (62) 99248-6492 | (62) 99248-6496", 20, yPosition + 16);
    doc.text(
      "PIX: (62) 99468-9297 | Banco: Neon Pagamentos S.A.",
      20,
      yPosition + 22
    );
    doc.text("Titular: Warley Coutinho Pereira dos Santos", 20, yPosition + 28);

    // Versiculo
    yPosition += 40;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(
      '"Cada um contribua conforme o impulso do seu coracao." (2 Corintios 9,7)',
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );

    // Adicionar numeros de pagina
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Pagina ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Salvar PDF
    const fileName = `relatorio-doacoes-adolesanto-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      <span className="hidden sm:inline">Baixar Relatorio PDF</span>
      <span className="sm:hidden">Relatorio</span>
    </button>
  );
}
