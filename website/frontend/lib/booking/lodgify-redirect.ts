import type { LodgingUnit } from '@/lib/content/stay-types';

type RedirectPayload = {
  unit: LodgingUnit;
  checkIn: string;
  checkOut: string;
  guestEmail: string;
  guestName: string;
  bookingRecordId?: string;
};

export function buildLodgifyRedirectUrl(payload: RedirectPayload): string {
  const base = 'https://checkout.lodgify.com/big-bend-burro-mvp';
  const url = new URL(base);
  url.searchParams.set('property', payload.unit.lodgifyPropertyId ?? payload.unit.id);
  url.searchParams.set('checkIn', payload.checkIn);
  url.searchParams.set('checkOut', payload.checkOut);
  url.searchParams.set('email', payload.guestEmail.trim().toLowerCase());
  url.searchParams.set('name', payload.guestName);
  if (payload.bookingRecordId) {
    url.searchParams.set('bookingRecordId', payload.bookingRecordId);
  }

  return url.toString();
}
