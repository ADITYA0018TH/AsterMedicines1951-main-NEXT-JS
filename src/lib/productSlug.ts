type ProductSlugInput = {
  id?: string | number;
  name: string;
  slug?: string | null;
};

const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;
const NUMERIC_ID_PATTERN = /^\d+$/;

export function normalizeProductRouteSegment(segment: string): string {
  if (!segment) {
    return "";
  }

  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    decoded = segment;
  }

  return decoded.trim().replace(/^\/+|\/+$/g, "");
}

export function slugifyProductName(name: string): string {
  if (!name) {
    return "product";
  }

  const normalizedName = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const slug = normalizedName
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "product";
}

function normalizeStoredSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductSlug(product: ProductSlugInput): string {
  if (product.slug) {
    const normalizedSlug = normalizeStoredSlug(product.slug);
    if (normalizedSlug) {
      return normalizedSlug;
    }
  }

  return slugifyProductName(product.name);
}

export function getLegacyProductSlug(
  name: string,
  id: string | number,
): string {
  return `${slugifyProductName(name)}-${String(id)}`;
}

export function getProductPath(product: ProductSlugInput): string {
  return `/products/${getProductSlug(product)}`;
}

export function extractIdentifierFromProductSegment(
  segment: string,
): string | null {
  const normalized = normalizeProductRouteSegment(segment);
  if (!normalized) {
    return null;
  }

  if (
    OBJECT_ID_PATTERN.test(normalized) ||
    NUMERIC_ID_PATTERN.test(normalized)
  ) {
    return normalized;
  }

  const parts = normalized.split("-");
  const lastPart = parts[parts.length - 1] || "";

  if (OBJECT_ID_PATTERN.test(lastPart) || NUMERIC_ID_PATTERN.test(lastPart)) {
    return lastPart;
  }

  return null;
}
