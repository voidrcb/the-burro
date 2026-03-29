import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { listShopProducts } from '@/lib/content/shop';
import { recordGuestEvent } from '@/lib/crm/events';
import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import {
  shopOrderEmailCaptureSchema,
  shopOrderSchema,
  shippingAddressSchema,
  type ShippingAddress,
  type ShopOrder,
} from '@/lib/shop/types';

function orderPath(id: string): string {
  return getDataPath('shop-orders', `${id}.json`);
}

function orderCapturePath(id: string): string {
  return getDataPath('email-captures', `${id}.json`);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createPendingShopOrder(payload: Omit<ShopOrder, 'id' | 'createdAt' | 'status' | 'guestEmail'> & { id?: string; createdAt?: string; status?: ShopOrder['status']; guestEmail: string; }) {
  const order = shopOrderSchema.parse({
    ...payload,
    id: payload.id ?? `shop_order_${randomUUID()}`,
    guestEmail: normalizeEmail(payload.guestEmail),
    createdAt: payload.createdAt ?? new Date().toISOString(),
    status: payload.status ?? 'pending',
  });

  await writeJsonFile(orderPath(order.id), order);
  return order;
}

export async function saveShopOrder(order: ShopOrder): Promise<ShopOrder> {
  const parsed = shopOrderSchema.parse({
    ...order,
    guestEmail: normalizeEmail(order.guestEmail),
  });
  await writeJsonFile(orderPath(parsed.id), parsed);
  return parsed;
}

export async function readShopOrderById(orderId: string): Promise<ShopOrder | null> {
  const payload = await readJsonFile<unknown>(orderPath(orderId), null);
  const parsed = shopOrderSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

export async function listShopOrders(): Promise<ShopOrder[]> {
  const directory = getDataPath('shop-orders');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const orders: ShopOrder[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = shopOrderSchema.safeParse(payload);
    if (parsed.success) {
      orders.push(parsed.data);
    }
  }

  return orders.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function storeShopOrderConfirmationCapture(payload: {
  orderId: string;
  recipient: string;
  guestName: string;
  shippingProfile: ShopOrder['shippingProfile'];
  itemCount: number;
  subtotalAmount: number;
}) {
  const capture = shopOrderEmailCaptureSchema.parse({
    id: `shop_order_capture_${randomUUID()}`,
    template: 'shop-order-confirmation',
    recipient: normalizeEmail(payload.recipient),
    subject: 'Big Bend Burro shop order captured',
    renderedAt: new Date().toISOString(),
    orderId: payload.orderId,
    payload,
  });

  await writeJsonFile(orderCapturePath(capture.id), capture);
  return capture;
}

export async function validateShopOrderInput(input: {
  guestEmail: string;
  items: Array<{ productSlug: string; quantity: number }>;
  shippingAddress?: ShippingAddress;
}) {
  const products = await listShopProducts();
  const productMap = new Map(products.map((product) => [product.slug, product]));
  const resolved = input.items.map((item) => {
    const product = productMap.get(item.productSlug);
    if (!product) {
      throw new Error(`Unknown product slug: ${item.productSlug}`);
    }
    if (product.status !== 'available') {
      throw new Error(`${product.title} is not currently available for purchase.`);
    }
    if ((product.inventory?.available ?? 1) < item.quantity) {
      throw new Error(`${product.title} does not have enough inventory for that quantity.`);
    }
    return { product, quantity: item.quantity };
  });

  const shippingProfiles = [...new Set(resolved.map((entry) => entry.product.shippingProfile))];
  if (shippingProfiles.length !== 1) {
    throw new Error('Orders support only one shipping profile. Remove conflicting items before checkout.');
  }

  const shippingProfile = shippingProfiles[0];
  if (!shippingProfile) {
    throw new Error('At least one purchasable item is required.');
  }

  let shippingAddress: ShippingAddress | undefined;
  if (shippingProfile === 'parcel' || shippingProfile === 'print-on-demand') {
    shippingAddress = shippingAddressSchema.parse(input.shippingAddress);
  }

  return {
    shippingProfile,
    shippingAddress,
    lineItems: resolved.map((entry) => ({
      product: entry.product,
      quantity: entry.quantity,
      priceAtOrder: entry.product.price.amount,
    })),
  };
}

export async function captureShopOrder(payload: {
  guestEmail: string;
  guestName: string;
  shippingAddress?: ShippingAddress;
  pickupWindow?: string;
  notes?: string;
  items: Array<{ productSlug: string; quantity: number }>;
}) {
  const normalizedEmail = normalizeEmail(payload.guestEmail);
  const validated = await validateShopOrderInput({
    guestEmail: normalizedEmail,
    items: payload.items,
    shippingAddress: payload.shippingAddress,
  });

  const pending = await createPendingShopOrder({
    guestEmail: normalizedEmail,
    guestName: payload.guestName,
    items: validated.lineItems.map((entry) => ({
      productId: entry.product.id,
      quantity: entry.quantity,
      priceAtOrder: entry.priceAtOrder,
    })),
    shippingAddress: validated.shippingAddress,
    shippingProfile: validated.shippingProfile,
    subtotalAmount: validated.lineItems.reduce((sum, entry) => sum + entry.priceAtOrder * entry.quantity, 0),
    pickupWindow: payload.pickupWindow,
    notes: payload.notes,
  });

  const confirmed = await saveShopOrder({
    ...pending,
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
  });

  await storeShopOrderConfirmationCapture({
    orderId: confirmed.id,
    recipient: confirmed.guestEmail,
    guestName: confirmed.guestName,
    shippingProfile: confirmed.shippingProfile,
    itemCount: confirmed.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalAmount: confirmed.subtotalAmount,
  });

  await recordGuestEvent({
    guestEmail: confirmed.guestEmail,
    eventType: 'purchase',
    eventRef: confirmed.id,
    metadata: {
      shippingProfile: confirmed.shippingProfile,
      subtotalAmount: confirmed.subtotalAmount,
      itemCount: confirmed.items.reduce((sum, item) => sum + item.quantity, 0),
    },
    tags: ['shop'],
  });

  return confirmed;
}

export async function getShopProductsByOrder(order: ShopOrder) {
  const products = await listShopProducts();
  const productMap = new Map(products.map((product) => [product.id, product]));
  return order.items.map((item) => ({
    item,
    product: productMap.get(item.productId) ?? null,
  }));
}
