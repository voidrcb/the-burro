import { z } from 'zod';

export const equipmentReservationSchema = z.object({
  id: z.string(),
  assetId: z.string(),
  reservedBy: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  purpose: z.string().min(1),
  status: z.enum(['tentative', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type EquipmentReservation = z.infer<typeof equipmentReservationSchema>;
