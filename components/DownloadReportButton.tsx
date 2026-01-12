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
  // Função auxiliar para converter imagem para base64
  const loadImageAsBase64 = async (
    receiptId: string
  ): Promise<string | null> => {
    try {
      // Tentar carregar via API
      const response = await fetch(`/api/receipts/${receiptId}`);

      if (!response.ok) {
        console.error(
          `Erro ao carregar comprovante ${receiptId}:`,
          response.status
        );
        return null;
      }

      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      return null;
    }
  };

  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    const primaryColor: [number, number, number] = [30, 58, 138];
    const secondaryColor: [number, number, number] = [212, 175, 55];
    const lightGray: [number, number, number] = [243, 244, 246];

    const donatedItems = items.filter(
      (item) => item.donated || (item.donations?.length ?? 0) > 0
    );

    if (donatedItems.length === 0) {
      alert("Ainda não há doações para gerar relatório.");
      return;
    }

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // CABEÇALHO
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("ADOLESANTO", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...secondaryColor);
    doc.text("Santíssima Trindade", pageWidth / 2, 28, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("06, 07 e 08 de fevereiro", pageWidth / 2, 36, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("Relatório de Doações", pageWidth / 2, 43, { align: "center" });

    let yPosition = 60;

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(
      `Data de geração: ${new Date().toLocaleString("pt-BR")}`,
      14,
      yPosition
    );

    yPosition += 10;

    // ESTATÍSTICAS
    const totalItems = items.length;
    const fullyDonatedCount = items.filter((item) => item.donated).length;
    const partiallyDonatedCount = items.filter(
      (item) => !item.donated && (item.donations?.length ?? 0) > 0
    ).length;
    const totalDonatedCount = fullyDonatedCount + partiallyDonatedCount;
    const progressPercentage = Math.round(
      (fullyDonatedCount / totalItems) * 100
    );

    doc.setFillColor(...lightGray);
    doc.roundedRect(14, yPosition, pageWidth - 28, 35, 3, 3, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Estatísticas Gerais", 20, yPosition + 8);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const statsY = yPosition + 16;
    doc.text(`Total de itens: ${totalItems}`, 20, statsY);
    doc.text(`Completos: ${fullyDonatedCount}`, 80, statsY);
    doc.text(`Parciais: ${partiallyDonatedCount}`, 130, statsY);

    doc.text(`Pendentes: ${totalItems - totalDonatedCount}`, 20, statsY + 6);

    const progressBarY = yPosition + 28;
    const progressBarWidth = pageWidth - 40;
    const progressBarHeight = 4;

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

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text(`${progressPercentage}%`, pageWidth - 20, progressBarY + 3, {
      align: "right",
    });

    yPosition += 45;

    // TABELA DE DOAÇÕES DETALHADA
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Detalhes das Doações", 14, yPosition);

    yPosition += 8;

    // Preparar dados expandidos para a tabela
    const tableData: any[] = [];
    let itemIndex = 1;

    donatedItems.forEach((item) => {
      if (item.donations && item.donations.length > 0) {
        item.donations.forEach((donation: any, donationIdx: number) => {
          const donationDate = donation.createdAt
            ? new Date(donation.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-";

          const quantityInfo =
            donation.partialQuantity && item.unit
              ? `${donation.partialQuantity} ${item.unit}`
              : item.requiresQuantity && item.totalQuantity
              ? `${item.totalQuantity} ${item.unit}`
              : "Completo";

          const statusInfo = item.requiresQuantity
            ? `${item.donatedQuantity}/${item.totalQuantity} ${item.unit}`
            : "Completo";

          tableData.push([
            donationIdx === 0 ? itemIndex : "",
            donationIdx === 0 ? item.name : "",
            donation.donorName,
            donation.donorPhone,
            quantityInfo,
            statusInfo,
            donation.donationType === "PIX" ? "PIX" : "Item",
            donationDate,
          ]);
        });
        itemIndex++;
      } else {
        const donorName = getDonorName(item);
        const donorPhone = getDonorPhone(item);
        const donationType = getDonationType(item);
        const donationDate = getDonationDate(item);

        tableData.push([
          itemIndex,
          item.name,
          donorName,
          donorPhone,
          "Completo",
          "Completo",
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
        ]);
        itemIndex++;
      }
    });

    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          "#",
          "Item",
          "Doador",
          "Telefone",
          "Qtd Doada",
          "Status",
          "Tipo",
          "Data",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 28 },
        3: { cellWidth: 24 },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 20, halign: "center" },
        6: { cellWidth: 15, halign: "center" },
        7: { cellWidth: 28, fontSize: 6 },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // RESUMO POR ITEM
    const itemsWithPartialDonations = items.filter(
      (item) => item.requiresQuantity && (item.donations?.length ?? 0) > 1
    );

    if (itemsWithPartialDonations.length > 0) {
      if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("Resumo de Itens com Múltiplas Doações", 14, yPosition);

      yPosition += 8;

      const partialItemsData = itemsWithPartialDonations.map((item, index) => {
        const donorsList = (item.donations || [])
          .map(
            (d: any) =>
              `${d.donorName} (${d.partialQuantity || 0} ${item.unit})`
          )
          .join("; ");

        return [
          index + 1,
          item.name,
          `${item.donatedQuantity}/${item.totalQuantity} ${item.unit}`,
          item.donated ? "Completo" : "Parcial",
          donorsList,
        ];
      });

      autoTable(doc, {
        startY: yPosition,
        head: [["#", "Item", "Progresso", "Status", "Doadores"]],
        body: partialItemsData,
        theme: "grid",
        headStyles: {
          fillColor: secondaryColor,
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
          2: { cellWidth: 25, halign: "center" },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 87 },
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250],
        },
        margin: { left: 14, right: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // LISTA DE DOADORES
    const uniqueDonors = new Map<
      string,
      { name: string; phone: string; items: number; quantities: string[] }
    >();

    donatedItems.forEach((item) => {
      if (item.donations && item.donations.length > 0) {
        item.donations.forEach((donation: any) => {
          if (uniqueDonors.has(donation.donorPhone)) {
            const donor = uniqueDonors.get(donation.donorPhone)!;
            donor.items += 1;
            if (donation.partialQuantity && item.unit) {
              donor.quantities.push(`${donation.partialQuantity} ${item.unit}`);
            }
          } else {
            const quantities: string[] = [];
            if (donation.partialQuantity && item.unit) {
              quantities.push(`${donation.partialQuantity} ${item.unit}`);
            }
            uniqueDonors.set(donation.donorPhone, {
              name: donation.donorName,
              phone: donation.donorPhone,
              items: 1,
              quantities,
            });
          }
        });
      } else {
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
            quantities: [],
          });
        }
      }
    });

    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(`Lista de Doadores (${uniqueDonors.size})`, 14, yPosition);

    yPosition += 8;

    const donorsData = Array.from(uniqueDonors.values())
      .sort((a, b) => b.items - a.items)
      .map((donor, index) => [index + 1, donor.name, donor.phone, donor.items]);

    autoTable(doc, {
      startY: yPosition,
      head: [["#", "Nome", "Telefone", "Doações"]],
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

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // COMPROVANTES PIX
    const pixDonations = donatedItems.flatMap((item) => {
      if (item.donations && item.donations.length > 0) {
        return item.donations
          .filter((d: any) => d.donationType === "PIX" && d.pixReceipt)
          .map((d: any) => ({
            item: item.name,
            donor: d.donorName,
            phone: d.donorPhone,
            receipt: d.pixReceipt,
            quantity: d.partialQuantity
              ? `${d.partialQuantity} ${item.unit}`
              : "Completo",
            date: d.createdAt
              ? new Date(d.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
          }));
      }
      return [];
    });

    if (pixDonations.length > 0) {
      doc.addPage();
      yPosition = 20;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("Comprovantes PIX", pageWidth / 2, yPosition, {
        align: "center",
      });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Total de comprovantes: ${pixDonations.length}`,
        pageWidth / 2,
        yPosition + 6,
        { align: "center" }
      );

      yPosition += 15;

      // Carregar todas as imagens primeiro usando o ID do comprovante
      console.log("Carregando comprovantes PIX...");
      const loadedReceipts = await Promise.all(
        pixDonations.map(async (donation) => {
          let imageData = null;

          try {
            if (donation.receipt.id) {
              console.log(`Carregando comprovante ID: ${donation.receipt.id}`);
              imageData = await loadImageAsBase64(donation.receipt.id);
              console.log(
                `Comprovante ${donation.receipt.id} carregado:`,
                imageData ? "Sucesso" : "Falhou"
              );
            }
          } catch (error) {
            console.error("Erro ao carregar comprovante:", error);
          }

          return {
            ...donation,
            imageData,
          };
        })
      );

      for (let i = 0; i < loadedReceipts.length; i++) {
        const donation = loadedReceipts[i];

        if (i > 0) {
          doc.addPage();
          yPosition = 20;
        }

        // CABEÇALHO DO COMPROVANTE
        doc.setFillColor(...primaryColor);
        doc.roundedRect(14, yPosition, pageWidth - 28, 30, 3, 3, "F");

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(`Comprovante PIX #${i + 1}`, 20, yPosition + 10);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...secondaryColor);
        doc.text(`Data: ${donation.date}`, 20, yPosition + 17);

        doc.setTextColor(255, 255, 255);
        doc.text(
          `${i + 1} de ${pixDonations.length}`,
          pageWidth - 20,
          yPosition + 13,
          { align: "right" }
        );

        yPosition += 35;

        // BOX DE INFORMAÇÕES
        doc.setFillColor(...lightGray);
        doc.roundedRect(14, yPosition, pageWidth - 28, 32, 2, 2, "F");

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text("Informações da Doação:", 20, yPosition + 7);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);

        doc.text(`Item doado:`, 20, yPosition + 14);
        doc.setFont("helvetica", "bold");
        doc.text(donation.item, 45, yPosition + 14);

        doc.setFont("helvetica", "normal");
        doc.text(`Quantidade:`, 20, yPosition + 20);
        doc.setFont("helvetica", "bold");
        doc.text(donation.quantity, 45, yPosition + 20);

        doc.setFont("helvetica", "normal");
        doc.text(`Doador:`, 20, yPosition + 26);
        doc.setFont("helvetica", "bold");
        doc.text(donation.donor, 45, yPosition + 26);

        doc.setFont("helvetica", "normal");
        doc.text(`Telefone:`, pageWidth / 2 + 10, yPosition + 26);
        doc.setFont("helvetica", "bold");
        doc.text(donation.phone, pageWidth / 2 + 30, yPosition + 26);

        yPosition += 38;

        // TÍTULO DA IMAGEM
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text("Comprovante de Transferência:", 14, yPosition);

        yPosition += 7;

        // IMAGEM DO COMPROVANTE
        if (donation.imageData) {
          try {
            const maxImgWidth = pageWidth - 28;
            const maxImgHeight = pageHeight - yPosition - 25;

            let imgWidth = maxImgWidth;
            let imgHeight = maxImgHeight;

            const imgX = (pageWidth - imgWidth) / 2;

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.rect(imgX - 1, yPosition - 1, imgWidth + 2, imgHeight + 2);

            doc.addImage(
              donation.imageData,
              "JPEG",
              imgX,
              yPosition,
              imgWidth,
              imgHeight,
              undefined,
              "FAST"
            );

            yPosition += imgHeight + 3;
          } catch (error) {
            console.error("Erro ao adicionar imagem ao PDF:", error);

            doc.setFillColor(255, 240, 240);
            doc.roundedRect(14, yPosition, pageWidth - 28, 20, 2, 2, "F");

            doc.setFontSize(9);
            doc.setTextColor(200, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(
              "⚠ Erro ao processar imagem do comprovante",
              20,
              yPosition + 8
            );

            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text(
              "Entre em contato com o suporte técnico",
              20,
              yPosition + 14
            );

            yPosition += 25;
          }
        } else {
          doc.setFillColor(255, 250, 230);
          doc.roundedRect(14, yPosition, pageWidth - 28, 35, 2, 2, "F");

          doc.setFontSize(9);
          doc.setTextColor(200, 100, 0);
          doc.setFont("helvetica", "bold");
          doc.text("⚠ Comprovante não disponível", 20, yPosition + 10);

          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 100, 100);

          if (donation.receipt.fileName) {
            doc.text(
              `Arquivo: ${donation.receipt.fileName}`,
              20,
              yPosition + 18
            );
          }
          if (donation.receipt.filePath) {
            doc.text(`Path: ${donation.receipt.filePath}`, 20, yPosition + 24);
          }

          doc.text(
            "Entre em contato com o organizador para verificar o comprovante",
            20,
            yPosition + 30
          );

          yPosition += 40;
        }

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Documento gerado automaticamente pelo sistema ADOLESANTO`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }
    }

    // RODAPÉ FINAL
    doc.addPage();
    yPosition = pageHeight / 2 - 30;

    doc.setFillColor(...primaryColor);
    doc.roundedRect(14, yPosition, pageWidth - 28, 45, 3, 3, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Informações de Contato", pageWidth / 2, yPosition + 10, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "WhatsApp: (62) 99248-6492 | (62) 99248-6496",
      pageWidth / 2,
      yPosition + 20,
      {
        align: "center",
      }
    );
    doc.text(
      "PIX: (62) 99468-9297 | Banco: Neon Pagamentos S.A.",
      pageWidth / 2,
      yPosition + 26,
      { align: "center" }
    );
    doc.text(
      "Titular: Warley Coutinho Pereira dos Santos",
      pageWidth / 2,
      yPosition + 32,
      {
        align: "center",
      }
    );

    yPosition += 50;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(
      '"Cada um contribua conforme o impulso do seu coração." (2 Coríntios 9,7)',
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );

    // Números de página
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    }

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
      <span className="hidden sm:inline">Baixar Relatório PDF</span>
      <span className="sm:hidden">Relatório</span>
    </button>
  );
}
