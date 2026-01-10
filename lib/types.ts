// types.ts - Interface unificada para DonationItem

export interface DonationItem {
  id: string;
  itemId: string;
  name: string;
  category: string;
  day: string;
  meal: string;
  donated: boolean;
  // Campos opcionais para compatibilidade com localStorage/data antigo
  donorName?: string;
  donorPhone?: string;
  donorObs?: string;
  donationDate?: string;
  donationType?: string;
  pixFile?: string;
  // Relacionamento com doacao (quando vem da API)
  donation?: {
    donorName: string;
    donorPhone: string;
    donorObs?: string;
    donationType: string;
    donationDate: string;
    pixReceipt?: {
      fileUrl: string;
    };
  };
}

// Funcao helper para acessar dados do doador de forma unificada
export function getDonorName(item: DonationItem): string {
  return item.donation?.donorName || item.donorName || "";
}

export function getDonorPhone(item: DonationItem): string {
  return item.donation?.donorPhone || item.donorPhone || "";
}

export function getDonorObs(item: DonationItem): string {
  return item.donation?.donorObs || item.donorObs || "";
}

export function getDonationType(item: DonationItem): string {
  return item.donation?.donationType || item.donationType || "";
}

export function getDonationDate(item: DonationItem): string {
  return item.donation?.donationDate || item.donationDate || "";
}

export function getPixFile(item: DonationItem): string {
  return item.donation?.pixReceipt?.fileUrl || item.pixFile || "";
}
