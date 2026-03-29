import type { WorkshopSession } from './content-types';

export function getSessionLabel(session: WorkshopSession): string {
  if (session.status === 'cancelled') {
    return 'Session Cancelled';
  }

  if (session.status === 'full' || session.spotsAvailable <= 0) {
    return 'Registration Full';
  }

  return 'Register Now';
}

export function isSessionRegisterable(session: WorkshopSession): boolean {
  return session.status === 'open' && session.spotsAvailable > 0;
}
