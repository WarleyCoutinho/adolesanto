// types.ts

/* =======================
   MODELS
======================= */

export interface DonationItem {
  id: string;
  itemId: string;
  name: string;
  category: string;
  day: string;
  meal: string;
  donated: boolean;

  requiresQuantity: boolean;
  totalQuantity: number | null;
  donatedQuantity: number;
  unit: string | null;

  createdAt: Date;
  updatedAt: Date;

  donation?: Donation | null; // compatibilidade antiga
  donations?: Donation[];

  remainingQuantity?: number | null;
  percentageDonated?: number | null;
}

export interface Donation {
  id: string;
  donorName: string;
  donorPhone: string;
  donorObs: string | null;
  donationType: "Item" | "PIX";
  donationDate: Date;

  isPartialDonation: boolean;
  partialQuantity: number | null;

  createdAt: Date;
  updatedAt: Date;

  donationItemId: string;
  donationItem?: DonationItem;
  pixReceipt?: PixReceipt | null;
}

export interface PixReceipt {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  donationId: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  metadata: any;
  createdAt: Date;
}

/* =======================
   HELPERS (EXPORTADOS)
======================= */

export function getDonationType(item: DonationItem): string {
  if (!item.donations || item.donations.length === 0) {
    return "-";
  }

  const types = new Set(item.donations.map((d) => d.donationType));

  if (types.size === 1) {
    return Array.from(types)[0]; // "Item" ou "PIX"
  }

  return "Item / PIX";
}

export function getDonorName(item: DonationItem): string {
  if (item.donation) {
    return item.donation.donorName;
  }

  if (item.donations && item.donations.length > 0) {
    const donors = item.donations.map((d) => d.donorName);
    return donors.length === 1 ? donors[0] : donors.join(", ");
  }

  return "-";
}

export function getDonorPhone(item: DonationItem): string {
  return item.donations?.[0]?.donorPhone ?? "-";
}

export function getDonorObs(item: DonationItem): string {
  return item.donations?.[0]?.donorObs ?? "";
}

export function getDonationDate(item: DonationItem): Date | null {
  return item.donations?.[0]?.donationDate ?? null;
}

export function formatQuantity(quantity: number, unit: string | null): string {
  if (!unit) return quantity.toString();
  return quantity % 1 === 0
    ? `${quantity} ${unit}`
    : `${quantity.toFixed(1)} ${unit}`;
}

export function calculateProgress(item: DonationItem) {
  if (!item.requiresQuantity || !item.totalQuantity) {
    return {
      percentage: item.donated ? 100 : 0,
      remaining: 0,
      donated: 0,
      total: 0,
      isComplete: item.donated,
    };
  }

  const total = item.totalQuantity;
  const donated = item.donatedQuantity;
  const remaining = Math.max(0, total - donated);
  const percentage = Math.round((donated / total) * 100);

  return {
    percentage,
    remaining,
    donated,
    total,
    isComplete: donated >= total,
  };
}
