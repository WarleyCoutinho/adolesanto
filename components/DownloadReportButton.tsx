
import jsPDF from "jspdf";
import autoTable, { CellHookData } from "jspdf-autotable";
import { useState } from "react";

import { DonationItem } from "../app/data";

interface DownloadReportButtonProps {
  items: DonationItem[];
}

export default function DownloadReportButton({
  items,
}: DownloadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    try {
      const doc = new jsPDF();
      const now = new Date();
      const downloadDate = now.toLocaleString("pt-BR");

      doc.setFontSize(18);
      doc.text("Relatório de Doações", 14, 20);
      doc.setFontSize(12);
      doc.text(`Data de geração: ${downloadDate}`, 14, 28);

      autoTable(doc, {
        startY: 35,
        head: [
          [
            "Descrição",
            "Nome do Doador",
            "Telefone",
            "Data da Doação",
            "Tipo",
            "Comprovante PIX",
            "Observação",
          ],
        ],
        body: items
          .filter((item) => item.donated)
          .map(
            (
              item
            ): [string, string, string, string, string, string, string] => [
              item.name || "",
              item.donorName || "",
              item.donorPhone || "",
              item.donationDate || "",
              item.donationType || "",
              item.donationType === "PIX" && item.pixFile
                ? "Ver comprovante"
                : "",
              item.donorObs || "",
            ]
          ),
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
        columnStyles: {
          5: { cellWidth: 35 },
        },
        didDrawCell: function (data: CellHookData) {
          if (
            data.section === "body" &&
            data.column.index === 5 &&
            data.row.index < items.filter((item) => item.donated).length
          ) {
            const item = items.filter((item) => item.donated)[data.row.index];

            if (item.donationType === "PIX" && item.pixFile) {
              let fileType = "PNG";

              if (typeof item.pixFile === "string") {
                if (
                  item.pixFile.startsWith("data:image/jpeg") ||
                  item.pixFile.startsWith("data:image/jpg")
                ) {
                  fileType = "JPEG";
                } else if (item.pixFile.startsWith("data:image/png")) {
                  fileType = "PNG";
                }
              }

              const cellWidth = data.cell.width;
              const cellHeight = data.cell.height;
              const imgWidth = 25;
              const imgHeight = 25;
              const x = data.cell.x + (cellWidth - imgWidth) / 2;
              const y = data.cell.y + (cellHeight - imgHeight) / 2;

              try {
                doc.addImage(item.pixFile, fileType, x, y, imgWidth, imgHeight);
              } catch (e) {
                console.error("Erro ao adicionar imagem:", e);
                // Escreve texto alternativo em caso de erro
                doc.setFontSize(8);
                doc.text(
                  "Erro ao carregar",
                  data.cell.x + 2,
                  data.cell.y + cellHeight / 2
                );
              }
            }
          }
        },
      });

      doc.save(
        `relatorio-doacoes-${now.getFullYear()}-${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}.pdf`
      );
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !items.some((item) => item.donated)}
      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
    >
      {loading ? "Gerando PDF..." : "Baixar Relatório PDF"}
    </button>
  );
}
