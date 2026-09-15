const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type OtpSession = {
  destination: string;
  code: string;
  expiresAt: number;
  attempts: number;
};

const sessions = new Map<string, OtpSession>();

function generateOtpCode(): string {
  const bytes = new Uint8Array(4);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const value = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  return String(value % 10 ** OTP_LENGTH).padStart(OTP_LENGTH, '0');
}

export type SendOtpResult = { ok: true; previewCode: string } | { ok: false; error: string };

export type VerifyOtpResult = { ok: true } | { ok: false; error: string };

export async function sendOtp(destination: string): Promise<SendOtpResult> {
  const normalized = destination.trim();
  if (!normalized) {
    return { ok: false, error: 'Enter a valid phone number.' };
  }

  const code = generateOtpCode();
  sessions.set(normalized, {
    destination: normalized,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });

  return { ok: true, previewCode: code };
}

export function verifyOtpCode(destination: string, code: string): VerifyOtpResult {
  const session = sessions.get(destination.trim());
  if (!session) {
    return { ok: false, error: 'No verification code was requested for this number.' };
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(destination);
    return { ok: false, error: 'That code has expired. Please request a new one.' };
  }

  if (session.attempts >= MAX_ATTEMPTS) {
    sessions.delete(destination);
    return { ok: false, error: 'Too many attempts. Please request a new code.' };
  }

  const entered = code.replace(/\D/g, '');
  if (entered.length !== OTP_LENGTH) {
    return { ok: false, error: 'Enter the 6-digit code.' };
  }

  session.attempts += 1;

  if (entered !== session.code) {
    const remaining = MAX_ATTEMPTS - session.attempts;
    if (remaining <= 0) {
      sessions.delete(destination);
      return { ok: false, error: 'Too many attempts. Please request a new code.' };
    }
    return {
      ok: false,
      error: `Incorrect code. ${remaining} ${remaining === 1 ? 'try' : 'tries'} left.`,
    };
  }

  sessions.delete(destination);
  return { ok: true };
}

export function clearOtpSessions(): void {
  sessions.clear();
}

export function peekOtpForTests(destination: string): string | null {
  return sessions.get(destination.trim())?.code ?? null;
}
