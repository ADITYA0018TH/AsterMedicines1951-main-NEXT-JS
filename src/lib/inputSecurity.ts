import mongoose from 'mongoose';

const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export function normalizeString(value: unknown, maxLength = 255): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(CONTROL_CHARS_REGEX, '')
    .trim()
    .slice(0, maxLength);
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"'`=/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

export function sanitizeTextForStorage(value: unknown, maxLength = 5000): string {
  return escapeHtml(normalizeString(value, maxLength));
}

export function sanitizeEmail(value: unknown): string {
  const normalized = normalizeString(value, 254).toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(normalized) ? normalized : '';
}

export function sanitizeSearchTerm(value: unknown, maxLength = 100): string {
  return normalizeString(value, maxLength);
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function toSafeInt(value: unknown, fallback: number, min: number, max: number): number {
  const asNumber = Number.parseInt(String(value ?? ''), 10);

  if (!Number.isFinite(asNumber)) {
    return fallback;
  }

  return Math.min(Math.max(asNumber, min), max);
}

export function toSafeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  return false;
}

export function sanitizeUrl(value: unknown, maxLength = 2048): string {
  const normalized = normalizeString(value, maxLength);
  if (!normalized) {
    return '';
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function sanitizeAssetPath(value: unknown, maxLength = 255): string {
  const normalized = normalizeString(value, maxLength);
  if (!normalized) {
    return '';
  }

  if (!normalized.startsWith('/')) {
    return '';
  }

  if (normalized.includes('..')) {
    return '';
  }

  return normalized;
}

export function sanitizeCloudinaryFolder(value: unknown): string {
  const normalized = normalizeString(value, 120);
  if (!normalized) {
    return 'aster-medicines/products';
  }

  if (!/^[a-zA-Z0-9_/-]+$/.test(normalized) || normalized.includes('..')) {
    return 'aster-medicines/products';
  }

  return normalized;
}

export function sanitizeFilenameBase(value: unknown, fallback = 'upload'): string {
  const normalized = normalizeString(value, 80);
  const safe = normalized.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-');
  return safe || fallback;
}

export function isValidObjectId(value: unknown): value is string {
  return typeof value === 'string' && mongoose.isValidObjectId(value);
}

export function sanitizeObjectIdArray(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const deduped = new Set<string>();

  for (const value of values) {
    if (isValidObjectId(value)) {
      deduped.add(value);
    }
  }

  return Array.from(deduped);
}

export function sanitizePath(value: unknown): string {
  const normalized = normalizeString(value, 512);
  if (!normalized) {
    return '/';
  }

  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return withLeadingSlash.slice(0, 512);
}

export function sanitizeIp(value: unknown): string {
  const normalized = normalizeString(value, 64);
  const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  const ipv6Pattern = /^[0-9a-fA-F:]+$/;

  if (ipv4Pattern.test(normalized) || ipv6Pattern.test(normalized)) {
    return normalized;
  }

  return '';
}
