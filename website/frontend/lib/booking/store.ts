import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import { appendGuestEvent } from '@/lib/guest-events/store';

import {
  bookingEmailCaptureSchema,
  bookingRecordSchema,
  waiverAcknowledgementSchema,
  type BookingEmailCapture,
  type BookingRecord,
  type WaiverAcknowledgement,
} from '@/lib/content/stay-types';

function recordFileName(id: string): string {
  return `${id}.json`;
}

function nowId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getWaiverPath(id: string): string {
  return getDataPath('bookings', 'waivers', recordFileName(id));
}

function getBookingPath(id: string): string {
  return getDataPath('bookings', recordFileName(id));
}

function getEmailCapturePath(id: string): string {
  return getDataPath('email-captures', recordFileName(id));
}

export async function saveWaiverAcknowledgement(payload: Omit<WaiverAcknowledgement, 'id' | 'acknowledgedAt'> & { id?: string; acknowledgedAt?: string }): Promise<WaiverAcknowledgement> {
  const record = waiverAcknowledgementSchema.parse({
    ...payload,
    id: payload.id ?? nowId('waiver'),
    acknowledgedAt: payload.acknowledgedAt ?? new Date().toISOString(),
  });

  await writeJsonFile(getWaiverPath(record.id), record);
  return record;
}

export async function createWaiverAcknowledgement(payload: Omit<WaiverAcknowledgement, 'id' | 'acknowledgedAt'> & { id?: string; acknowledgedAt?: string }) {
  return saveWaiverAcknowledgement(payload);
}

export async function readWaiverById(waiverId: string): Promise<WaiverAcknowledgement | null> {
  const value = await readJsonFile<unknown>(getWaiverPath(waiverId), null);
  const parsed = waiverAcknowledgementSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function createPendingBooking(payload: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: BookingRecord['status'] }): Promise<BookingRecord> {
  const record = bookingRecordSchema.parse({
    ...payload,
    id: payload.id ?? nowId('booking'),
    createdAt: payload.createdAt ?? new Date().toISOString(),
    status: payload.status ?? 'pending',
  });

  await writeJsonFile(getBookingPath(record.id), record);
  await appendGuestEvent({
    guestEmail: record.guestEmail,
    eventType: 'booking',
    eventRef: record.id,
    occurredAt: record.createdAt,
    tags: [record.status, record.unitId],
    metadata: {
      unitId: record.unitId,
      status: record.status,
    },
  });
  return record;
}

export async function createRedirectIntent(payload: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: BookingRecord['status'] }) {
  return createPendingBooking(payload);
}

export async function getBookingRecord(bookingId: string): Promise<BookingRecord | null> {
  const value = await readJsonFile<unknown>(getBookingPath(bookingId), null);
  const parsed = bookingRecordSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function readBookingById(bookingId: string): Promise<BookingRecord | null> {
  return getBookingRecord(bookingId);
}

export async function saveBookingRecord(record: BookingRecord): Promise<BookingRecord> {
  const parsed = bookingRecordSchema.parse(record);
  await writeJsonFile(getBookingPath(parsed.id), parsed);
  return parsed;
}

export async function listBookings(): Promise<BookingRecord[]> {
  const directory = getDataPath('bookings');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: BookingRecord[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = bookingRecordSchema.safeParse(payload);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return [...records].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listBookingRecords(): Promise<BookingRecord[]> {
  return listBookings();
}

export async function saveBookingEmailCapture(payload: Omit<BookingEmailCapture, 'id' | 'renderedAt'> & { id?: string; renderedAt?: string }): Promise<BookingEmailCapture> {
  const capture = bookingEmailCaptureSchema.parse({
    ...payload,
    id: payload.id ?? nowId('email_capture'),
    renderedAt: payload.renderedAt ?? new Date().toISOString(),
  });

  await writeJsonFile(getEmailCapturePath(capture.id), capture);
  return capture;
}

export async function storeEmailCapture(payload: Omit<BookingEmailCapture, 'id' | 'renderedAt'> & { id?: string; renderedAt?: string }) {
  return saveBookingEmailCapture(payload);
}
