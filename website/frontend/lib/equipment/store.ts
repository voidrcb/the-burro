import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

import { equipmentReservationSchema, type EquipmentReservation } from './types';

function reservationPath(id: string): string {
  return getDataPath('equipment-reservations', `${id}.json`);
}

function overlaps(left: EquipmentReservation, right: Pick<EquipmentReservation, 'startDate' | 'endDate' | 'assetId' | 'status'>) {
  if (left.assetId !== right.assetId) {
    return false;
  }
  if (left.status === 'cancelled' || right.status === 'cancelled') {
    return false;
  }

  return !(left.endDate < right.startDate || left.startDate > right.endDate);
}

export async function listEquipmentReservations(): Promise<EquipmentReservation[]> {
  const directory = getDataPath('equipment-reservations');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json') && entry !== 'schema.json');
  const records: EquipmentReservation[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = equipmentReservationSchema.safeParse(payload);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createEquipmentReservation(payload: Omit<EquipmentReservation, 'id' | 'createdAt'>) {
  const existing = await listEquipmentReservations();
  const candidate = equipmentReservationSchema.parse({
    ...payload,
    id: `equipment_reservation_${randomUUID()}`,
    createdAt: new Date().toISOString(),
  });

  if (existing.some((record) => overlaps(record, candidate))) {
    throw new Error('Reservation dates overlap an existing active reservation.');
  }

  await writeJsonFile(reservationPath(candidate.id), candidate);
  return candidate;
}

export async function cancelEquipmentReservation(id: string) {
  const record = await readJsonFile<unknown>(reservationPath(id), null);
  const parsed = equipmentReservationSchema.safeParse(record);
  if (!parsed.success) {
    throw new Error('Equipment reservation not found.');
  }

  const nextRecord: EquipmentReservation = {
    ...parsed.data,
    status: 'cancelled',
  };
  await writeJsonFile(reservationPath(nextRecord.id), nextRecord);
  return nextRecord;
}
