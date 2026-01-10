import { z } from "zod";

export const donationSchema = z.object({
  itemId: z.string().min(1),
  donorName: z.string().min(3).max(100),
  donorPhone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/),
  donorObs: z.string().max(500).optional(),
  donationType: z.enum(["Item", "PIX"]),
  pixFile: z.string().optional(),
});
