"use client";

import DownloadReportButton from "@/components/DownloadReportButton";
import { DonationItem, getDonorName } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<DonationItem[]>([]);
  const [selectedDay, setSelectedDay] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorObs, setDonorObs] = useState("");
  const [donationType, setDonationType] = useState("");
  const [pixFile, setPixFile] = useState("");
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carrega itens da API ao montar o componente
  useEffect(() => {
    loadItems();
  }, []);

  // Função para carregar itens da API
  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/donations");

      if (!response.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      alert("Erro ao carregar itens. Por favor, recarregue a página.");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (item: DonationItem) => {
    setSelectedItem(item);
    setDonorName("");
    setDonorPhone("");
    setDonorObs("");
    setDonationType("");
    setPixFile("");
    setConfirmAlert(false);
    setModalOpen(true);
  };

  const confirmDonation = async () => {
    if (
      !selectedItem ||
      !donorName.trim() ||
      !donorPhone.trim() ||
      !donationType
    ) {
      return;
    }

    if (donationType === "PIX" && !pixFile) {
      alert("Anexe o comprovante PIX");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItem.itemId,
          donorName,
          donorPhone,
          donorObs,
          donationType,
          pixFile: donationType === "PIX" ? pixFile : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar");
      }

      // Recarrega os itens da API
      await loadItems();

      setModalOpen(false);
      alert("Doação confirmada! 🙏");

      // Limpar campos
      setDonorName("");
      setDonorPhone("");
      setDonorObs("");
      setDonationType("");
      setPixFile("");
      setSelectedItem(null);
      setConfirmAlert(false);
    } catch (error) {
      console.error("Erro ao confirmar doação:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao processar doação"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande (máx 5MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Apenas imagens são permitidas");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPixFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const days = ["Todos", "Sexta-feira 06/02", "Sábado 07/02", "Domingo 08/02"];

  const filteredItems =
    selectedDay === "Todos"
      ? items
      : items.filter((item) => item.day === selectedDay);

  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = `${item.day} - ${item.meal}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, DonationItem[]>);

  const totalItems = items.length;
  const donatedItems = items.filter((item) => item.donated).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((donatedItems / totalItems) * 100) : 0;

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a8a] mx-auto mb-4" />
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-6 sm:pt-8 flex justify-end w-full">
        <DownloadReportButton items={items} />
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-40 right-20 w-80 h-80 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-100 rounded-full opacity-15 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative pt-8 sm:pt-12 pb-6 sm:pb-8 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto text-center w-full">
          <div className="inline-block mb-6 animate-fade-in">
            <div className="halo-effect">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#1e3a8a] mb-2 wing-decoration">
                Adolesanto
              </h1>
            </div>
            <p className="text-lg sm:text-2xl md:text-3xl text-[#d4af37] font-semibold italic">
              Santíssima Trindade
            </p>
          </div>

          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mb-3 font-medium">
            06, 07 e 08 de fevereiro
          </p>

          <div className="inline-block bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg">
            <p className="text-base sm:text-lg font-semibold">
              Organização das Refeições
            </p>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-slide-up">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border-2 sm:border-4 border-[#d4af37]/30">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-center text-[#1e3a8a] mb-4 sm:mb-6">
            Progresso das Doações
          </h2>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
              <span className="text-lg font-semibold text-gray-700">
                {donatedItems} de {totalItems} itens doados
              </span>
              <span className="text-3xl font-bold text-[#d4af37]">
                {progressPercentage}%
              </span>
            </div>

            <div className="relative h-8 sm:h-12 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#d4af37] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {progressPercentage === 100 && (
            <div className="text-center py-4 bg-gradient-to-r from-[#d4af37]/20 to-[#1e3a8a]/20 rounded-2xl border-2 border-[#d4af37]">
              <p className="text-2xl font-bold text-[#1e3a8a]">
                🎉 Meta alcançada! Obrigado a todos! 🙏
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Day Filter */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:scale-105 ${
                selectedDay === day
                  ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-xl"
                  : "bg-white text-[#1e3a8a] hover:bg-gray-50"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </section>

      {/* Donation Items */}
      <section className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8 pb-10 sm:pb-16">
        {Object.entries(groupedItems).map(([groupKey, groupItems]) => {
          const categoryDonated = groupItems.filter(
            (item) => item.donated
          ).length;
          const categoryTotal = groupItems.length;
          const categoryProgress =
            categoryTotal > 0
              ? Math.round((categoryDonated / categoryTotal) * 100)
              : 0;

          return (
            <div key={groupKey} className="mb-12 animate-slide-up">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-t-3xl p-6 shadow-xl">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  {groupKey}
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <div className="flex-1 h-2 sm:h-4 bg-white/30 rounded-full overflow-hidden w-full">
                    <div
                      className="h-full bg-[#d4af37] transition-all duration-500"
                      style={{ width: `${categoryProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {categoryProgress}%
                  </span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl sm:rounded-b-3xl shadow-xl p-3 sm:p-6 border-2 sm:border-4 border-t-0 border-[#1e3a8a]/20">
                <div className="grid gap-2 sm:gap-4">
                  {groupItems.map((item) => {
                    const itemDonorName = getDonorName(item);

                    return (
                      <div
                        key={item.id}
                        className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                          item.donated
                            ? "bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-md"
                            : "bg-white border-gray-200 hover:border-[#d4af37] hover:shadow-lg"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="flex-1">
                            <p
                              className={`text-lg font-semibold ${
                                item.donated
                                  ? "text-green-800"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.name}
                            </p>
                            {item.donated && itemDonorName && (
                              <p className="text-sm text-green-600 mt-1 font-medium">
                                ✓ Doado por: {itemDonorName}
                              </p>
                            )}
                          </div>

                          {!item.donated && (
                            <button
                              onClick={() => handleDonate(item)}
                              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#1e3a8a] text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            >
                              Doar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Contact Info */}
      <footer className="max-w-6xl mx-auto px-2 sm:px-4 py-8 sm:py-12 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border-2 sm:border-4 border-[#d4af37]/30">
          <h3 className="text-lg sm:text-2xl font-bold text-[#1e3a8a] mb-4 sm:mb-6">
            Colabore com este momento de comunhão
          </h3>

          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <p className="text-base sm:text-lg text-gray-700">
              <strong>📞 Contato (WhatsApp):</strong>
            </p>
            <p className="text-lg sm:text-xl font-semibold text-[#3b82f6]">
              (62) 99248-6492 | (62) 99248-6496
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <p className="text-base sm:text-lg text-gray-700">
              <strong>💰 PIX (Doações em dinheiro):</strong>
            </p>
            <p className="text-lg sm:text-xl font-semibold text-[#3b82f6]">
              (62) 99468-9297
            </p>
            <p className="text-gray-700">Banco: Neon Pagamentos S.A.</p>
            <p className="text-gray-700">Warley Coutinho Pereira dos Santos</p>
          </div>

          <div className="border-t border-[#d4af37]/30 pt-4 sm:pt-6">
            <p className="text-sm sm:text-lg italic text-gray-600">
              "Cada um contribua conforme o impulso do seu coração."
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              (2 Coríntios 9,7)
            </p>
          </div>
        </div>
      </footer>

      {/* Donation Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up border-4 border-[#d4af37] max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">
              Confirmar Doação
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              <strong>Item:</strong> {selectedItem.name}
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Seu nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1e3a8a] text-lg"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="(62) 99999-9999"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1e3a8a] text-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Tipo de doação <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="donationType"
                    value="Item"
                    checked={donationType === "Item"}
                    onChange={() => {
                      setDonationType("Item");
                      setPixFile("");
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-base">
                    Item físico: {selectedItem.name}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="donationType"
                    value="PIX"
                    checked={donationType === "PIX"}
                    onChange={() => setDonationType("PIX")}
                    className="w-4 h-4"
                  />
                  <span className="text-base">
                    Valor em PIX para compra do item
                  </span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Observação (opcional)
              </label>
              <textarea
                value={donorObs}
                onChange={(e) => setDonorObs(e.target.value)}
                placeholder="Alguma observação sobre a doação"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1e3a8a] text-lg resize-none"
                rows={3}
              />
            </div>
            {donationType === "PIX" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Comprovante PIX <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg"
                />
                {pixFile && (
                  <div className="mt-2">
                    <img
                      src={pixFile}
                      alt="Comprovante PIX"
                      className="max-h-32 rounded border"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Tamanho máximo: 5MB
                </p>
              </div>
            )}
            {!confirmAlert && (
              <div className="mb-4 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded">
                <strong>Atenção:</strong> Após confirmar, não será possível
                cancelar a doação. Tenha certeza antes de prosseguir.
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setDonorName("");
                  setDonorPhone("");
                  setDonorObs("");
                  setDonationType("");
                  setPixFile("");
                  setSelectedItem(null);
                  setConfirmAlert(false);
                }}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl transition-all duration-300"
                disabled={loading}
              >
                Cancelar
              </button>
              {!confirmAlert ? (
                <button
                  onClick={() => setConfirmAlert(true)}
                  disabled={
                    loading ||
                    !donorName.trim() ||
                    donorName.trim().length < 3 ||
                    !donorPhone.trim() ||
                    !donationType ||
                    (donationType === "PIX" && !pixFile)
                  }
                  className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                    donorName.trim().length >= 3 &&
                    donorPhone.trim() &&
                    donationType &&
                    (donationType === "PIX" ? pixFile : true) &&
                    !loading
                      ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#1e3a8a] text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Processando..." : "Confirmar"}
                </button>
              ) : (
                <button
                  onClick={confirmDonation}
                  disabled={loading}
                  className="flex-1 px-6 py-3 font-semibold rounded-xl bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : "Sim, estou ciente e quero doar"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
