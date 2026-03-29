type OperatorCredential = {
  username: string;
  password: string;
};

export const OPERATOR_SESSION_COOKIE = 'burro-operator-session';

type OperatorAuthConfig = {
  sessionSecret: string;
  operators: OperatorCredential[];
};

const textEncoder = new TextEncoder();

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualString(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export function getOperatorAuthConfig(): OperatorAuthConfig {
  return {
    sessionSecret: readRequiredEnv('OPERATOR_SESSION_SECRET'),
    operators: [
      {
        username: process.env.OPERATOR_USERNAME?.trim() || 'operator',
        password: readRequiredEnv('OPERATOR_PASSWORD'),
      },
      {
        username: 'chuck',
        password: readRequiredEnv('CHUCK_PASSWORD'),
      },
      {
        username: 'susan',
        password: readRequiredEnv('SUSAN_PASSWORD'),
      },
    ],
  };
}

export async function generateSessionToken(secret: string, date = new Date()): Promise<string> {
  const day = date.toISOString().slice(0, 10);
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(day));
  return toHex(signature);
}

export async function validateSessionToken(token: string, secret: string, date = new Date()): Promise<boolean> {
  const expected = await generateSessionToken(secret, date);
  return timingSafeEqualString(token, expected);
}
