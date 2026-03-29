import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

import { applyTransition, toggleMaintenance, createTransition } from './state-machine';
import {
  depositEventSchema,
  inspectionEvidenceSchema,
  quoteRequestSchema,
  rentalBookingSchema,
  type DepositEvent,
  type InspectionEvidence,
  type QuoteRequest,
  type RentalBooking,
  type RentalBookingState,
} from './types';

// Path helpers
function getQuoteRequestPath(id: string): string {
  return getDataPath('rental-quotes', `${id}.json`);
}

function getRentalBookingPath(id: string): string {
  return getDataPath('rental-bookings', `${id}.json`);
}

function getInspectionPath(id: string): string {
  return getDataPath('rental-inspections', `${id}.json`);
}

function getDepositEventPath(id: string): string {
  return getDataPath('rental-deposits', `${id}.json`);
}

// ID generators
function generateQuoteId(): string {
  return `quote_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateBookingId(): string {
  return `rental_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateInspectionId(): string {
  return `inspection_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateDepositEventId(): string {
  return `deposit_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

// Quote Request Operations

export async function createQuoteRequest(
  payload: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>
): Promise<QuoteRequest> {
  const request = quoteRequestSchema.parse({
    ...payload,
    id: generateQuoteId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  });

  await writeJsonFile(getQuoteRequestPath(request.id), request);
  return request;
}

export async function getQuoteRequest(id: string): Promise<QuoteRequest | null> {
  const data = await readJsonFile<unknown>(getQuoteRequestPath(id), null);
  if (!data) return null;

  const parsed = quoteRequestSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function updateQuoteRequest(
  id: string,
  updates: Partial<QuoteRequest>
): Promise<QuoteRequest | null> {
  const existing = await getQuoteRequest(id);
  if (!existing) return null;

  const updated = quoteRequestSchema.parse({
    ...existing,
    ...updates,
  });

  await writeJsonFile(getQuoteRequestPath(id), updated);
  return updated;
}

export async function listQuoteRequests(): Promise<QuoteRequest[]> {
  const directory = getDataPath('rental-quotes');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: QuoteRequest[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = quoteRequestSchema.safeParse(data);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Rental Booking Operations

export async function createRentalBooking(
  payload: Omit<RentalBooking, 'id' | 'state' | 'stateHistory' | 'createdAt' | 'updatedAt'>
): Promise<RentalBooking> {
  const now = new Date().toISOString();
  const initialTransition = createTransition(null, 'quoted', 'system', 'Booking created from approved quote');

  const booking = rentalBookingSchema.parse({
    ...payload,
    id: generateBookingId(),
    state: 'quoted',
    stateHistory: [initialTransition],
    createdAt: now,
    updatedAt: now,
    maintenanceFlag: false,
  });

  await writeJsonFile(getRentalBookingPath(booking.id), booking);
  return booking;
}

export async function getRentalBooking(id: string): Promise<RentalBooking | null> {
  const data = await readJsonFile<unknown>(getRentalBookingPath(id), null);
  if (!data) return null;

  const parsed = rentalBookingSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listRentalBookings(): Promise<RentalBooking[]> {
  const directory = getDataPath('rental-bookings');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: RentalBooking[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = rentalBookingSchema.safeParse(data);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listActiveRentalBookings(): Promise<RentalBooking[]> {
  const all = await listRentalBookings();
  const activeStates: RentalBookingState[] = ['quoted', 'reserved', 'delivered', 'active', 'returned', 'inspected'];
  return all.filter((b) => activeStates.includes(b.state));
}

export async function transitionBookingState(
  id: string,
  toState: RentalBookingState,
  operatorId: string,
  notes?: string
): Promise<RentalBooking> {
  const booking = await getRentalBooking(id);
  if (!booking) {
    throw new Error(`Rental booking not found: ${id}`);
  }

  const result = applyTransition(booking, toState, operatorId, notes);
  if (!result.success || !result.booking) {
    throw new Error(result.error || 'State transition failed');
  }

  await writeJsonFile(getRentalBookingPath(id), result.booking);
  return result.booking;
}

export async function setMaintenanceFlag(
  id: string,
  enable: boolean,
  operatorId: string,
  reason?: string
): Promise<RentalBooking> {
  const booking = await getRentalBooking(id);
  if (!booking) {
    throw new Error(`Rental booking not found: ${id}`);
  }

  const result = toggleMaintenance(booking, enable, operatorId, reason);
  if (!result.success || !result.booking) {
    throw new Error(result.error || 'Maintenance flag update failed');
  }

  await writeJsonFile(getRentalBookingPath(id), result.booking);
  return result.booking;
}

export async function updateRentalBooking(
  id: string,
  updates: Partial<RentalBooking>
): Promise<RentalBooking | null> {
  const existing = await getRentalBooking(id);
  if (!existing) return null;

  const updated = rentalBookingSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getRentalBookingPath(id), updated);
  return updated;
}

// Inspection Evidence Operations

export async function createInspectionEvidence(
  payload: Omit<InspectionEvidence, 'id' | 'capturedAt'>
): Promise<InspectionEvidence> {
  const evidence = inspectionEvidenceSchema.parse({
    ...payload,
    id: generateInspectionId(),
    capturedAt: new Date().toISOString(),
  });

  await writeJsonFile(getInspectionPath(evidence.id), evidence);

  // Link inspection to booking
  const booking = await getRentalBooking(evidence.bookingId);
  if (booking) {
    const updateField = evidence.type === 'checkout' ? 'checkoutInspectionId' : 'checkinInspectionId';
    await updateRentalBooking(booking.id, { [updateField]: evidence.id });
  }

  return evidence;
}

export async function getInspectionEvidence(id: string): Promise<InspectionEvidence | null> {
  const data = await readJsonFile<unknown>(getInspectionPath(id), null);
  if (!data) return null;

  const parsed = inspectionEvidenceSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listInspectionsByBooking(bookingId: string): Promise<InspectionEvidence[]> {
  const directory = getDataPath('rental-inspections');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: InspectionEvidence[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = inspectionEvidenceSchema.safeParse(data);
    if (parsed.success && parsed.data.bookingId === bookingId) {
      records.push(parsed.data);
    }
  }

  return records.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
}

// Deposit Event Operations

export async function createDepositEvent(
  payload: Omit<DepositEvent, 'id' | 'occurredAt'>
): Promise<DepositEvent> {
  const event = depositEventSchema.parse({
    ...payload,
    id: generateDepositEventId(),
    occurredAt: new Date().toISOString(),
  });

  await writeJsonFile(getDepositEventPath(event.id), event);
  return event;
}

export async function listDepositEventsByBooking(bookingId: string): Promise<DepositEvent[]> {
  const directory = getDataPath('rental-deposits');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: DepositEvent[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = depositEventSchema.safeParse(data);
    if (parsed.success && parsed.data.bookingId === bookingId) {
      records.push(parsed.data);
    }
  }

  return records.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

// Utility: Calculate rental pricing
export function calculateRentalPricing(
  dailyRate: number,
  totalDays: number,
  deliveryFee: number,
  depositAmount: number,
  taxRate: number = 0.0825 // Brewster County default
): {
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  depositAmount: number;
  totalAmount: number;
} {
  const subtotal = dailyRate * totalDays;
  const taxableAmount = subtotal + deliveryFee;
  const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
  const totalAmount = subtotal + deliveryFee + taxAmount;

  return {
    subtotal,
    deliveryFee,
    taxAmount,
    depositAmount,
    totalAmount,
  };
}

// Utility: Get day count between dates
export function getRentalDayCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}
