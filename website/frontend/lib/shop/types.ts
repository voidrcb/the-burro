import { z } from 'zod';

export const shopCategorySchema = z.enum(['prints', 'giftables', 'print-on-demand', 'tiles', 'pottery', 'apparel']);
export const shippingProfileSchema = z.enum(['pickup-only', 'parcel', 'print-on-demand']);
export const productStatusSchema = z.enum(['available', 'sold-out', 'coming-soon', 'private']);

export const shopImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
});

export const shopProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: shopCategorySchema,
  price: z.object({
    amount: z.number().nonnegative(),
    currency: z.literal('USD'),
  }),
  images: z.array(shopImageSchema).min(1),
  story: z.string(),
  shippingProfile: shippingProfileSchema,
  status: productStatusSchema,
  inventory: z.object({
    available: z.number().int().nonnegative(),
  }).optional(),
  featured: z.boolean().optional(),
  badge: z.string().optional(),
  leadTimeNote: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    price: z.number().nonnegative(),
  })).optional(),
});

export const shopOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string().optional(),
  title: z.string().optional(),
  quantity: z.number().int().positive(),
  priceAtOrder: z.number().nonnegative(),
});

export const shippingAddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2),
  zip: z.string().min(5),
});

export const shopOrderSchema = z.object({
  id: z.string(),
  guestEmail: z.string().email(),
  guestName: z.string().min(1),
  items: z.array(shopOrderItemSchema).min(1),
  shippingAddress: shippingAddressSchema.optional(),
  shippingProfile: shippingProfileSchema,
  status: z.enum(['pending', 'confirmed', 'shipped', 'completed', 'cancelled']),
  createdAt: z.string(),
  confirmedAt: z.string().optional(),
  pickupWindow: z.string().optional(),
  notes: z.string().optional(),
  subtotalAmount: z.number().nonnegative(),
});

export const shopOrderEmailCaptureSchema = z.object({
  id: z.string(),
  template: z.literal('shop-order-confirmation'),
  recipient: z.string().email(),
  subject: z.string(),
  renderedAt: z.string(),
  orderId: z.string(),
  payload: z.record(z.unknown()),
});

export type ShopCategory = z.infer<typeof shopCategorySchema>;
export type ShippingProfile = z.infer<typeof shippingProfileSchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type ShopProduct = z.infer<typeof shopProductSchema>;
export type ShopOrder = z.infer<typeof shopOrderSchema>;
export type ShopOrderItem = z.infer<typeof shopOrderItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type ShopOrderEmailCapture = z.infer<typeof shopOrderEmailCaptureSchema>;
export type ShopCartItem = {
  productId: string;
  slug: string;
  title: string;
  quantity: number;
  priceAtOrder: number;
  shippingProfile: ShippingProfile;
  status: ProductStatus;
};
