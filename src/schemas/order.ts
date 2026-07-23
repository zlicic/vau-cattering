import { z } from 'zod';

export const orderSchema = z.object({
  name: z.string().min(2, 'Ime je obavezno'),
  address: z.string().min(5, 'Adresa je obavezna'),
  phone: z.string().min(6, 'Telefon je obavezan'),
  companyName: z.string().optional(),
  companyId: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
