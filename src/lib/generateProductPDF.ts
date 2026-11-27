"use client";

import { jsPDF } from "jspdf";
import { Product } from "@/types/product";
import asterLogo from "@/app/api/visiting-card/aster-logo.json";

const COMPANY_CONTACT = {
  name: "ASTER MEDICINES PVT. LTD.",
  cin: "U24230BR2008PTC013937",
  office: "North of Janta Hotel, 1st Floor, Govind Mitra Road, Patna - 800004",
  factory: "Plot No. E/4, Industrial Area, Hajipur, Vaishali, Bihar - 844102",
  phone: "+91 9934006655",
  email: "accounts@astermedicines.com",
  web: "www.astermedicines.com",
  // Specification sheet par pehle se yahi alag email / order desk number use hote the
  sheetEmail: "contact@astermedicines.com",
  orderDesk: "+91 7061452180",
};

/**
 * Draw crisp vector Aster Medicines logo using traced artwork paths.
 */
function drawVectorLogo(
  doc: jsPDF,
  x: number,
  y: number,
  widthMm: number,
  reversed = false
) {
  const palette: Record<"gold" | "swoosh" | "letters" | "tagline", string> = {
    gold: "#FFCD0A",
    swoosh: reversed ? "#FFFFFF" : "#332D99",
    letters: reversed ? "#FFFFFF" : "#04267F",
    tagline: reversed ? "#CBD5E1" : "#646466",
  };
  const scale = widthMm / 903;
  const artwork = asterLogo as Record<"gold" | "swoosh" | "letters" | "tagline", number[][][]>;
  for (const layer of ["gold", "swoosh", "letters", "tagline"] as const) {
    doc.setFillColor(palette[layer]);
    for (const contour of artwork[layer]) {
      if (!contour.length) continue;
      doc.moveTo(x + contour[0][0] * scale, y + contour[0][1] * scale);
      for (let i = 1; i < contour.length; i++) {
        doc.lineTo(x + contour[i][0] * scale, y + contour[i][1] * scale);
      }
      doc.close();
    }
    doc.fillEvenOdd();
  }
}

/**
 * Detect boilerplate fallback text generated when optional DB fields are empty.
 */
function isGenericPlaceholder(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return (
    !lower ||
    lower.includes("available on request") ||
    lower.includes("please consult healthcare professional") ||
    lower.includes("consult your healthcare provider for potential") ||
    lower.includes("contact for availability")
  );
}

/**
 * Wrap text to at most maxLines, adding an ellipsis cleanly if truncated.
 */
function fitLines(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const lines: string[] = doc.splitTextToSize(text, maxWidth);
  if (lines.length <= maxLines) return lines;
  const clipped = lines.slice(0, maxLines);
  const last = clipped[maxLines - 1].replace(/[,;:\s]+$/, "");
  clipped[maxLines - 1] = last.length > 3 ? `${last.slice(0, -1)}…` : `${last}…`;
  return clipped;
}

/**
 * Extract clean formulation strength / dosage while ignoring raw inventory stock strings.
 */
function extractCleanDosage(rawDosage: string | undefined, productName: string): string {
  const decoded = decodeHtmlEntities(rawDosage);
  if (
    !decoded ||
    decoded.toLowerCase().includes("available") ||
    decoded.toLowerCase().includes("unit") ||
    decoded.toLowerCase().includes("contact for")
  ) {
    const strengthMatch = productName.match(/(\d+(?:\.\d+)?\s*(?:gm|g|mg|mcg|ml|%)\b(?:\s*(?:\/|\+)\s*\d+(?:\.\d+)?\s*(?:gm|g|mg|mcg|ml|%))?)/i);
    return strengthMatch ? strengthMatch[0] : "Standard Strength";
  }
  return decoded;
}

/**
 * Clean and decode HTML entities and stray tags
 */
export function decodeHtmlEntities(text: string | undefined | null): string {
  if (!text) return "";
  let decoded = String(text);
  for (let i = 0; i < 2; i++) {
    decoded = decoded
      .replace(/&amp;#x2F;/gi, "/")
      .replace(/&#x2F;/gi, "/")
      .replace(/&#47;/gi, "/")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&nbsp;/gi, " ");
  }
  return decoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export interface LoadedImage {
  dataUrl: string;
  format: "JPEG" | "PNG";
  width: number;
  height: number;
  aspectRatio: number; // width / height
}

/**
 * Load any image URL (local /uploads/... or remote Cloudinary) into a format jsPDF accepts
 */
export async function loadImageAsDataUrl(
  url: string,
  timeoutMs: number = 5000,
  maxDim: number = 1200,
  quality: number = 0.92
): Promise<LoadedImage | null> {
  if (!url) return null;

  // Already a base64 string
  if (url.startsWith("data:image/")) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 500;
        const h = img.naturalHeight || 500;
        resolve({
          dataUrl: url,
          format: url.includes("png") ? "PNG" : "JPEG",
          width: w,
          height: h,
          aspectRatio: w / (h || 1),
        });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  // Handle relative URLs
  let fullUrl = url;
  if (typeof window !== "undefined" && url.startsWith("/")) {
    fullUrl = `${window.location.origin}${url}`;
  }

  const loadViaCanvas = (): Promise<LoadedImage | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const naturalW = img.naturalWidth || img.width || 600;
          const naturalH = img.naturalHeight || img.height || 600;

          let w = naturalW;
          let h = naturalH;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }

          // Clean pure white background to prevent dark backgrounds on transparent PNGs/WebPs
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);

          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve({
            dataUrl,
            format: "JPEG",
            width: w,
            height: h,
            aspectRatio: w / (h || 1),
          });
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = fullUrl;
    });
  };

  const loadViaFetch = async (): Promise<LoadedImage | null> => {
    try {
      const res = await fetch(fullUrl, { mode: "cors" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          if (!base64) return resolve(null);
          const img = new Image();
          img.onload = () => {
            const w = img.naturalWidth || 500;
            const h = img.naturalHeight || 500;
            resolve({
              dataUrl: base64,
              format: blob.type.includes("png") ? "PNG" : "JPEG",
              width: w,
              height: h,
              aspectRatio: w / (h || 1),
            });
          };
          img.onerror = () => resolve(null);
          img.src = base64;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), timeoutMs)
  );

  return Promise.race([
    loadViaCanvas().then((res) => res || loadViaFetch()),
    timeoutPromise,
  ]);
}

/**
 * Draw image contained within a bounding box while preserving aspect ratio
 */
function drawImageContained(
  doc: jsPDF,
  img: LoadedImage,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
) {
  const boxAspect = boxW / boxH;
  let drawW = boxW;
  let drawH = boxH;

  if (img.aspectRatio > boxAspect) {
    drawW = boxW;
    drawH = boxW / img.aspectRatio;
  } else {
    drawH = boxH;
    drawW = boxH * img.aspectRatio;
  }

  const drawX = boxX + (boxW - drawW) / 2;
  const drawY = boxY + (boxH - drawH) / 2;

  doc.addImage(img.dataUrl, img.format, drawX, drawY, drawW, drawH);
}

// ==========================================================================
// DESIGN SYSTEM (colours logo se liye gaye hain)
// ==========================================================================
type RGB = [number, number, number];

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;
const CW = PAGE_W - M * 2; // 182mm
const RIGHT = PAGE_W - M;

const C = {
  navy: [4, 38, 127] as RGB, // logo navy
  navyDeep: [3, 22, 74] as RGB,
  indigo: [51, 45, 153] as RGB, // logo swoosh
  gold: [255, 205, 10] as RGB, // logo gold
  goldSoft: [255, 247, 214] as RGB,
  ink: [22, 28, 45] as RGB,
  body: [55, 65, 86] as RGB,
  muted: [108, 117, 138] as RGB,
  rule: [224, 228, 239] as RGB,
  paper: [246, 247, 252] as RGB,
  white: [255, 255, 255] as RGB,
  onNavy: [196, 207, 240] as RGB,
  green: [4, 120, 87] as RGB,
  amber: [217, 119, 6] as RGB,
  amberInk: [146, 64, 14] as RGB,
  amberSoft: [255, 246, 230] as RGB,
};

/** Har therapeutic category ka apna accent colour (sab white text ke saath readable). */
const ACCENTS: RGB[] = [
  [51, 45, 153],
  [0, 121, 140],
  [176, 48, 92],
  [4, 120, 87],
  [180, 83, 9],
  [29, 95, 184],
  [124, 58, 160],
  [157, 56, 42],
];

/** Colour ko white ki taraf halka karo (amount 0..1). */
function tint(c: RGB, amount: number): RGB {
  return c.map((v) => Math.round(v + (255 - v) * amount)) as RGB;
}

function box(doc: jsPDF, x: number, y: number, w: number, h: number, color: RGB, r = 0) {
  doc.setFillColor(...color);
  if (r) doc.roundedRect(x, y, w, h, r, r, "F");
  else doc.rect(x, y, w, h, "F");
}

function hline(doc: jsPDF, x1: number, x2: number, y: number, color: RGB = C.rule, width = 0.25) {
  doc.setDrawColor(...color);
  doc.setLineWidth(width);
  doc.line(x1, y, x2, y);
}

function type(
  doc: jsPDF,
  size: number,
  color: RGB,
  style: "normal" | "bold" | "italic" | "bolditalic" = "normal",
  font: "helvetica" | "times" = "helvetica"
) {
  doc.setFont(font, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
}

/**
 * Letter-spaced text with correct left / center / right alignment.
 * Graphics state save/restore keeps the spacing from leaking into later text.
 */
function tracked(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  charSpace = 0.35,
  align: "left" | "center" | "right" = "left"
) {
  const w = doc.getTextWidth(text) + Math.max(0, text.length - 1) * charSpace;
  const drawX = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
  doc.saveGraphicsState();
  doc.text(text, drawX, y, { charSpace });
  doc.restoreGraphicsState();
}

/** Single line, ellipsised so that it always stays inside maxWidth (tracking included). */
function oneLine(doc: jsPDF, text: string, maxWidth: number, charSpace = 0): string {
  const width = (s: string) => doc.getTextWidth(s) + s.length * charSpace;
  if (width(text) <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && width(`${cut}…`) > maxWidth) cut = cut.slice(0, -1);
  return `${cut.trimEnd()}…`;
}

/** Smooth vertical gradient made of thin strips. */
function gradient(doc: jsPDF, y: number, h: number, from: RGB, to: RGB, steps = 90) {
  const step = h / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const c = from.map((v, k) => Math.round(v + (to[k] - v) * t)) as RGB;
    box(doc, 0, y + i * step, PAGE_W, step + 0.25, c);
  }
}

/** Image frame (white card) with optional caption; falls back to a branded placeholder. */
function imageCard(
  doc: jsPDF,
  img: LoadedImage | null,
  x: number,
  y: number,
  w: number,
  h: number,
  caption: string,
  accent: RGB
) {
  box(doc, x, y, w, h, C.white, 3);
  if (img) {
    drawImageContained(doc, img, x + 3, y + 3, w - 6, h - 11);
  } else {
    doc.setFillColor(...tint(accent, 0.9));
    doc.circle(x + w / 2, y + h / 2 - 9, 11, "F");
    type(doc, 24, accent, "bold", "times");
    doc.text("A", x + w / 2, y + h / 2 - 5.2, { align: "center" });
    type(doc, 8, C.navy, "bold");
    doc.text("ASTER MEDICINES", x + w / 2, y + h / 2 + 8, { align: "center" });
    type(doc, 7, C.muted);
    doc.text("Product image not available", x + w / 2, y + h / 2 + 12.5, { align: "center" });
  }
  type(doc, 5.8, C.muted, "bold");
  tracked(doc, caption, x + w / 2, y + h - 3.4, 0.4, "center");
}

/** Section heading: accent bar + tracked caps. Returns the first body baseline. */
function heading(doc: jsPDF, title: string, x: number, y: number, accent: RGB) {
  box(doc, x, y, 6, 1.1, accent);
  type(doc, 8, C.navy, "bold");
  tracked(doc, title.toUpperCase(), x, y + 5.4, 0.35);
  return y + 10.4;
}

/** Return a real value, or "" when the field is only stock / boilerplate text. */
function realText(text: string): string {
  const lower = text.toLowerCase();
  const isStock = /\d+\s*units?\b/.test(lower) && lower.includes("available");
  return isGenericPlaceholder(text) || isStock ? "" : text;
}

function cleanFeatures(product: Product): string[] {
  return (product.features || [])
    .map((f) => decodeHtmlEntities(f))
    .filter((f) => f && !/^(price|category)\s*:/i.test(f) && !f.toLowerCase().includes("price"));
}

function productRef(product: Product): string {
  return (product.id ? String(product.id) : "ASTER")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase();
}

// ==========================================================================
// SINGLE PRODUCT SPECIFICATION SHEET (content poora flow hota hai, kuch cut nahi)
// ==========================================================================
async function drawProductSheet(doc: jsPDF, product: Product) {
  const firstPage = doc.getNumberOfPages();
  const accent = C.indigo;
  const BOTTOM = 275;

  const name = decodeHtmlEntities(product.name);
  const category = decodeHtmlEntities(product.category) || "Pharmaceutical Formulation";
  const rawDosage = decodeHtmlEntities(product.dosage);
  const dosage =
    !rawDosage || /available|unit|contact for/i.test(rawDosage)
      ? extractCleanDosage(rawDosage, name).replace("Standard Strength", "As directed by physician")
      : rawDosage;

  const composition = decodeHtmlEntities(product.composition);
  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const indications = decodeHtmlEntities(product.indications);
  const dosageInstructions = realText(
    decodeHtmlEntities(product.dosageInstructions || product.dosage)
  );
  const precautions = decodeHtmlEntities(product.precautions);
  const sideEffects = decodeHtmlEntities(product.sideEffects);
  const storage =
    decodeHtmlEntities(product.storageConditions) ||
    "Store below 25°C in a dry place. Protect from light.";
  const shelfLife = decodeHtmlEntities(product.shelfLife) || "24 - 36 Months from MFG Date";
  const dateFormatted = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const loadedResult = await Promise.allSettled(
    (product.images || []).slice(0, 4).map((url) => loadImageAsDataUrl(url, 4500))
  );
  const loaded = loadedResult.map((r) => (r.status === "fulfilled" ? r.value : null));
  const primaryImage = loaded[0] || null;
  const gallery = loaded.slice(1).filter((i): i is LoadedImage => i !== null);

  const drawHeader = (first: boolean) => {
    const h = first ? 34 : 23;
    box(doc, 0, 0, PAGE_W, h, C.navyDeep);
    box(doc, 0, h, PAGE_W, 1.2, C.gold);
    drawVectorLogo(doc, M, first ? 8 : 5.5, first ? 34 : 24, true);

    if (first) {
      type(doc, 15, C.white, "normal", "times");
      doc.text("Product Specification", RIGHT, 13, { align: "right" });
      type(doc, 6.5, C.gold, "bold");
      tracked(doc, "GMP CERTIFIED PHARMACEUTICAL MANUFACTURER", RIGHT, 19, 0.4, "right");
      type(doc, 7, C.onNavy);
      doc.text(`Doc Ref: AM-${productRef(product)}   |   ${dateFormatted}`, RIGHT, 25, {
        align: "right",
      });
    } else {
      type(doc, 8.5, C.white, "bold");
      doc.text(oneLine(doc, name, 120), RIGHT, 11, { align: "right" });
      type(doc, 6.8, C.onNavy);
      doc.text(`Product Specification  |  Doc Ref: AM-${productRef(product)}`, RIGHT, 16, {
        align: "right",
      });
    }
  };

  let y = 0;
  const newPage = () => {
    doc.addPage();
    drawHeader(false);
    y = 31;
  };
  const ensure = (needed: number) => {
    if (y + needed > BOTTOM) newPage();
  };

  drawHeader(true);

  // ---- Title block ----
  type(doc, 7, accent, "bold");
  tracked(doc, oneLine(doc, category.toUpperCase(), CW, 0.6), M, 44, 0.6);

  type(doc, 24, C.navy, "bold", "times");
  let nameLines: string[] = doc.splitTextToSize(name, CW);
  if (nameLines.length > 1) {
    doc.setFontSize(19);
    nameLines = doc.splitTextToSize(name, CW);
  }
  const titleStep = nameLines.length > 1 ? 7.6 : 9;
  doc.text(nameLines, M, 53.5, { lineHeightFactor: titleStep / (doc.getFontSize() * 0.3528) });
  y = 53.5 + (nameLines.length - 1) * titleStep + 4;
  box(doc, M, y, 16, 1.2, C.gold);

  // Quality badges
  const badges = ["GMP Certified", "Quality Assured"];
  if (product.isWhoApproved) badges.push("WHO Approved");
  let bx = RIGHT;
  for (let i = badges.length - 1; i >= 0; i--) {
    type(doc, 6.5, C.green, "bold");
    const w = doc.getTextWidth(badges[i]) + 9;
    bx -= w;
    box(doc, bx, y - 2.2, w, 5.4, tint(C.green, 0.91), 2.7);
    doc.setFillColor(...C.green);
    doc.circle(bx + 3.1, y + 0.5, 0.75, "F");
    doc.text(badges[i], bx + 5.4, y + 1.4);
    bx -= 2.5;
  }
  y += 7;

  // ---- Hero: image + key facts ----
  const facts = [
    { label: "DOSAGE / STRENGTH", val: dosage },
    { label: "THERAPEUTIC CATEGORY", val: category },
    { label: "STORAGE CONDITION", val: storage },
    { label: "SHELF LIFE / EXPIRY", val: shelfLife },
  ];
  const heroY = y;
  const imgW = 104;
  const factX = M + imgW + 5;
  const factW = CW - imgW - 5;

  type(doc, 8.6, C.white, "bold");
  const factLines: string[][] = facts.map((f) => doc.splitTextToSize(f.val, factW - 12));
  const factsH = factLines.reduce((sum, l) => sum + 12.5 + l.length * 3.9, 6);
  const heroH = Math.max(88, factsH);

  box(doc, M, heroY, imgW, heroH, tint(accent, 0.91), 4);
  imageCard(doc, primaryImage, M + 4, heroY + 4, imgW - 8, heroH - 8, "PRODUCT VIEW", accent);

  box(doc, factX, heroY, factW, heroH, C.navy, 4);
  const spare = (heroH - factsH) / facts.length;
  let fy = heroY + 3;
  facts.forEach((f, i) => {
    type(doc, 6, C.gold, "bold");
    tracked(doc, f.label, factX + 6, fy + 6, 0.45);
    type(doc, 8.6, C.white, "bold");
    doc.text(factLines[i], factX + 6, fy + 11.5, { lineHeightFactor: 1.28 });
    fy += 12.5 + factLines[i].length * 3.9 + spare;
    if (i < facts.length - 1) hline(doc, factX + 6, factX + factW - 6, fy - 0.5, [40, 72, 156]);
  });
  y = heroY + heroH + 8;

  // ---- Flowing content ----
  const section = (title: string, text: string) => {
    if (!text) return;
    type(doc, 8.4, C.body);
    const lines: string[] = doc.splitTextToSize(text, CW);
    ensure(10.4 + Math.min(lines.length, 3) * 4.4);
    y = heading(doc, title, M, y, accent);
    for (const line of lines) {
      if (y > BOTTOM) {
        newPage();
        y = heading(doc, `${title} (contd.)`, M, y, accent);
      }
      type(doc, 8.4, C.body);
      doc.text(line, M, y);
      y += 4.4;
    }
    y += 3.5;
  };

  /** Tinted callout; lambi text agle page par continue hoti hai. */
  const callout = (title: string, text: string, bar: RGB, ink: RGB, fill: RGB) => {
    if (!text) return;
    type(doc, 8.4, C.ink);
    let rest: string[] = doc.splitTextToSize(text, CW - 14);
    let heading_ = title;
    while (rest.length) {
      ensure(12 + Math.min(rest.length, 3) * 4.4);
      const fit = Math.max(1, Math.floor((BOTTOM - y - 12) / 4.4));
      const chunk = rest.slice(0, fit);
      rest = rest.slice(fit);
      const h = 12 + chunk.length * 4.4;
      box(doc, M, y, CW, h, fill, 2.5);
      box(doc, M, y + 2.5, 1.6, h - 5, bar);
      type(doc, 7.4, ink, "bold");
      tracked(doc, heading_, M + 7, y + 6.5, 0.35);
      type(doc, 8.4, C.ink);
      chunk.forEach((line, i) => doc.text(line, M + 7, y + 12 + i * 4.4));
      y += h + 6;
      heading_ = `${title} (CONTD.)`;
    }
  };

  callout("ACTIVE PHARMACEUTICAL COMPOSITION", composition, accent, accent, tint(accent, 0.93));
  section("Product Overview & Clinical Profile", description);
  section("Therapeutic Indications & Clinical Usage", indications);
  section("Dosage & Administration Guidelines", dosageInstructions);
  callout("PRECAUTIONS & WARNINGS", precautions, C.amber, C.amberInk, C.amberSoft);
  section("Adverse Reactions & Clinical Safety Profile", sideEffects);

  const features = cleanFeatures(product);
  if (features.length) {
    const colW = (CW - 6) / 2;
    ensure(22);
    y = heading(doc, "Key Formulation Features", M, y, accent);
    for (let i = 0; i < features.length; i += 2) {
      type(doc, 8, C.ink);
      const row: string[][] = features
        .slice(i, i + 2)
        .map((f) => doc.splitTextToSize(f, colW - 6));
      const rowH = Math.max(...row.map((l) => l.length)) * 4.1 + 1.4;
      ensure(rowH);
      row.forEach((lines, k) => {
        const x = M + k * (colW + 6);
        box(doc, x, y - 2.3, 2, 2, C.gold, 0.5);
        type(doc, 8, C.ink);
        doc.text(lines, x + 5, y, { lineHeightFactor: 1.4 });
      });
      y += rowH;
    }
    y += 4;
  }

  if (gallery.length) {
    ensure(62);
    y = heading(doc, "Product & Packaging Gallery", M, y, accent) - 3;
    const w = (CW - 8) / 3;
    box(doc, M, y, CW, 52, tint(accent, 0.91), 4);
    const used = gallery.length * (w - 4) + (gallery.length - 1) * 4;
    gallery.forEach((img, i) => {
      const x = M + (CW - used) / 2 + i * w;
      imageCard(doc, img, x, y + 3, w - 4, 46, `VIEW ${i + 2}`, accent);
    });
    y += 59;
  }

  // ---- Quality statement + order desk ----
  type(doc, 7.6, C.body);
  const certLines: string[] = doc.splitTextToSize(
    "Aster Medicines Pvt. Ltd. certifies that this drug formulation complies with current Good Manufacturing Practices (cGMP) and pharmacopoeial specifications (IP/BP/USP). Every batch undergoes mandatory physical, chemical, and microbiological assay testing prior to clinical distribution.",
    CW - 14
  );
  const qaH = 17 + certLines.length * 4;
  ensure(qaH + 5 + 27);

  box(doc, M, y, CW, qaH, tint(C.green, 0.93), 2.5);
  box(doc, M, y + 2.5, 1.6, qaH - 5, C.green);
  type(doc, 7.4, C.green, "bold");
  tracked(doc, "MANUFACTURED UNDER STRICT SCHEDULE M / GMP COMPLIANCE", M + 7, y + 6.5, 0.35);
  type(doc, 7.6, C.body);
  certLines.forEach((l, i) => doc.text(l, M + 7, y + 11.8 + i * 4));
  type(doc, 7, C.navy, "bold");
  doc.text(
    "Certified Quality Assurance Division · Aster Medicines Pvt. Ltd.",
    M + 7,
    y + qaH - 3.5
  );
  y += qaH + 5;

  box(doc, M, y, CW, 27, C.navy, 3);
  type(doc, 7.4, C.gold, "bold");
  tracked(doc, "COMMERCIAL ENQUIRIES & INSTITUTIONAL SUPPLY", M + 7, y + 7.5, 0.4);
  type(doc, 13, C.white, "bold");
  doc.text(COMPANY_CONTACT.orderDesk, M + 7, y + 15.5);
  type(doc, 7.4, C.onNavy);
  doc.text("Institutional Order Desk", M + 7, y + 21);
  type(doc, 7.6, C.white);
  doc.text(COMPANY_CONTACT.sheetEmail, RIGHT - 7, y + 11, { align: "right" });
  doc.text(COMPANY_CONTACT.web, RIGHT - 7, y + 16, { align: "right" });
  type(doc, 7, C.onNavy);
  doc.text("Govind Mitra Road, Patna - 800004, Bihar, India", RIGHT - 7, y + 21, {
    align: "right",
  });

  // ---- Footer ----
  const lastPage = doc.getNumberOfPages();
  for (let i = firstPage; i <= lastPage; i++) {
    doc.setPage(i);
    hline(doc, M, RIGHT, 283);
    type(doc, 6.8, C.muted);
    doc.text(
      "Aster Medicines Pvt. Ltd. · Official Specification Sheet · www.astermedicines.com",
      M,
      288.5
    );
    type(doc, 6.8, C.navy, "bold");
    doc.text(`Sheet ${i - firstPage + 1} of ${lastPage - firstPage + 1}`, RIGHT, 288.5, {
      align: "right",
    });
  }
}

// ==========================================================================
// CATALOGUE
// ==========================================================================
function drawCatalogueRunningHeader(doc: jsPDF, rightTitle: string, rightSub: string, accent: RGB) {
  box(doc, 0, 0, PAGE_W, 2.2, C.navy);
  box(doc, 0, 0, 62, 2.2, C.gold);
  drawVectorLogo(doc, M, 6, 22, false);

  type(doc, 6.8, accent, "bold");
  tracked(doc, oneLine(doc, rightTitle, 100, 0.4), RIGHT, 10.8, 0.4, "right");
  type(doc, 6.4, C.muted);
  doc.text(rightSub, RIGHT, 15.2, { align: "right" });
  hline(doc, M, RIGHT, 19.5);
}

function drawCatalogueCover(
  doc: jsPDF,
  productCount: number,
  categories: string[],
  issueDate: string
) {
  gradient(doc, 0, PAGE_H, C.navy, C.navyDeep);

  // Concentric rings (right edge se bahar nikalte hue)
  const rings: [number, RGB, number][] = [
    [82, [24, 58, 148], 0.4],
    [68, [51, 45, 153], 7],
    [52, [30, 66, 160], 0.4],
    [40, C.gold, 1.4],
  ];
  rings.forEach(([r, color, width]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(width);
    doc.circle(214, 114, r, "S");
  });

  box(doc, 0, 0, PAGE_W, 3, C.gold);
  drawVectorLogo(doc, M + 2, 17, 52, true);

  type(doc, 7.2, C.white, "bold");
  tracked(doc, "ESTABLISHED 1982  ·  INDIA", RIGHT, 22, 0.45, "right");
  type(doc, 7.2, C.gold, "bold");
  tracked(doc, "WHO-GMP & ISO 9001:2015 CERTIFIED", RIGHT, 27.5, 0.3, "right");
  type(doc, 6.8, C.onNavy);
  doc.text(`CIN: ${COMPANY_CONTACT.cin}`, RIGHT, 33, { align: "right" });

  const x = M + 2;
  box(doc, x, 72, 18, 1.4, C.gold);
  type(doc, 8.2, C.gold, "bold");
  tracked(doc, "ASTER MEDICINES PRIVATE LIMITED", x, 82, 0.65);

  type(doc, 58, C.white, "normal", "times");
  doc.text("Product", x - 1, 106);
  type(doc, 58, C.gold, "italic", "times");
  doc.text("Catalogue", x - 1, 127);

  type(doc, 11, C.onNavy);
  const lead: string[] = doc.splitTextToSize(
    "Comprehensive Formulary of Sterile Parenteral Injections, Critical Care & General Pharmaceutical Formulations.",
    112
  );
  doc.text(lead, x, 141, { lineHeightFactor: 1.5 });

  // Metrics card
  const bandY = 164;
  box(doc, M, bandY, CW, 29, C.white, 4);
  const metrics = [
    { val: String(productCount), label: "ACTIVE FORMULATIONS" },
    { val: String(categories.length), label: "THERAPEUTIC CATEGORIES" },
    { val: "GMP / ISO", label: "MANUFACTURING STANDARD" },
  ];
  const mw = CW / 3;
  metrics.forEach((m, i) => {
    const cx = M + i * mw + mw / 2;
    if (i) {
      doc.setDrawColor(...C.rule);
      doc.setLineWidth(0.3);
      doc.line(M + i * mw, bandY + 6, M + i * mw, bandY + 23);
    }
    type(doc, 23, C.navy, "bold", "times");
    doc.text(m.val, cx, bandY + 15, { align: "center" });
    type(doc, 6.3, C.muted, "bold");
    tracked(doc, m.label, cx, bandY + 22, 0.45, "center");
  });

  // Therapeutic scope, colour coded
  type(doc, 6.6, C.gold, "bold");
  tracked(doc, "THERAPEUTIC SCOPE", x, 205, 0.5);
  const max = 8;
  const shown = categories.length > max ? categories.slice(0, max - 1) : categories;
  const labels = shown.map((c, i) => ({ text: c, color: tint(ACCENTS[i % ACCENTS.length], 0.45) }));
  if (categories.length > max) {
    labels.push({ text: `+${categories.length - shown.length} more categories`, color: C.gold });
  }
  labels.forEach((l, i) => {
    const lx = x + (i % 2) * 90;
    const ly = 213 + Math.floor(i / 2) * 6.4;
    box(doc, lx, ly - 2.4, 2.6, 2.6, l.color, 0.6);
    type(doc, 8, C.white);
    doc.text(oneLine(doc, l.text, 80), lx + 5.5, ly);
  });

  // Footer directory
  const fy = 242;
  hline(doc, M, RIGHT, fy, [45, 76, 160], 0.3);
  type(doc, 6.4, C.gold, "bold");
  tracked(doc, "CORPORATE & MANUFACTURING", x, fy + 9, 0.4);
  tracked(doc, "INSTITUTIONAL ENQUIRIES", RIGHT - 2, fy + 9, 0.4, "right");

  type(doc, 7.4, C.white);
  const office: string[] = doc.splitTextToSize(`Regd. Office: ${COMPANY_CONTACT.office}`, 96);
  doc.text(office, x, fy + 16, { lineHeightFactor: 1.4 });
  const plant: string[] = doc.splitTextToSize(
    `Manufacturing Plant: ${COMPANY_CONTACT.factory}`,
    96
  );
  doc.text(plant, x, fy + 18.5 + office.length * 4, { lineHeightFactor: 1.4 });

  type(doc, 12, C.white, "bold");
  doc.text(COMPANY_CONTACT.phone, RIGHT - 2, fy + 17, { align: "right" });
  type(doc, 7.6, C.onNavy);
  doc.text(COMPANY_CONTACT.email, RIGHT - 2, fy + 23, { align: "right" });
  doc.textWithLink(COMPANY_CONTACT.web, RIGHT - 2 - doc.getTextWidth(COMPANY_CONTACT.web), fy + 28, {
    url: `https://${COMPANY_CONTACT.web}`,
  });

  box(doc, 0, PAGE_H - 11, PAGE_W, 11, C.gold);
  type(doc, 7, C.navyDeep, "bold");
  tracked(doc, `EDITION: ${issueDate.toUpperCase()}`, PAGE_W / 2, PAGE_H - 4.3, 0.6, "center");
}

function drawCatalogueBackCover(doc: jsPDF) {
  gradient(doc, 0, PAGE_H, C.navyDeep, C.navy);
  doc.setDrawColor(...C.indigo);
  doc.setLineWidth(8);
  doc.circle(-6, 292, 62, "S");
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(1.4);
  doc.circle(-6, 292, 44, "S");

  const mid = PAGE_W / 2;
  drawVectorLogo(doc, mid - 35, 52, 70, true);
  type(doc, 30, C.white, "normal", "times");
  doc.text("Let's work together", mid, 125, { align: "center" });
  box(doc, mid - 9, 133, 18, 1.4, C.gold);
  type(doc, 9.5, C.onNavy);
  doc.text("Institutional supply and product enquiries", mid, 144, { align: "center" });

  type(doc, 22, C.gold, "bold");
  doc.text(COMPANY_CONTACT.phone, mid, 164, { align: "center" });
  type(doc, 10, C.white);
  doc.text(COMPANY_CONTACT.email, mid, 174, { align: "center" });
  doc.text(COMPANY_CONTACT.web, mid, 181, { align: "center" });

  type(doc, 7.6, C.onNavy);
  doc.text(`Regd. Office: ${COMPANY_CONTACT.office}`, mid, 204, { align: "center" });
  doc.text(`Manufacturing Plant: ${COMPANY_CONTACT.factory}`, mid, 210, { align: "center" });
  doc.text(`CIN: ${COMPANY_CONTACT.cin}`, mid, 216, { align: "center" });
}

/** One page per product. */
async function drawCatalogueProductPage(
  doc: jsPDF,
  product: Product,
  accent: RGB,
  categoryIndex: number
) {
  const name = decodeHtmlEntities(product.name);
  const category = decodeHtmlEntities(product.category) || "Pharmaceutical Formulation";
  const dosage = extractCleanDosage(product.dosage, name);
  const rawComposition = decodeHtmlEntities(product.composition);
  const composition = isGenericPlaceholder(rawComposition)
    ? "Detailed active ingredient formula available upon request / printed on product packaging."
    : rawComposition;
  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const rawIndications = decodeHtmlEntities(product.indications);
  const indications = isGenericPlaceholder(rawIndications)
    ? "For therapeutic use as directed by a registered medical practitioner."
    : rawIndications;
  const dosageText = realText(decodeHtmlEntities(product.dosageInstructions || product.dosage));
  const precautions = decodeHtmlEntities(product.precautions);
  const rawSideEffects = decodeHtmlEntities(product.sideEffects);
  const sideEffects = isGenericPlaceholder(rawSideEffects) ? "" : rawSideEffects;
  const storage = decodeHtmlEntities(product.storageConditions) || "Store below 25°C, dry place";
  const shelfLife = decodeHtmlEntities(product.shelfLife) || "24 - 36 Months";

  const loadedResults = await Promise.allSettled(
    (product.images || []).slice(0, 2).map((url) => loadImageAsDataUrl(url, 4500, 850, 0.86))
  );
  const images = loadedResults
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((img): img is LoadedImage => img !== null);

  drawCatalogueRunningHeader(doc, category.toUpperCase(), `REF: AM-${productRef(product)}`, accent);

  // Thumb tab: har category ka tab alag height par, page palatte hue section dikhta hai
  box(doc, PAGE_W - 4.5, 26 + (categoryIndex % 9) * 27, 7, 23, accent, 1.8);

  // ---- Title ----
  type(doc, 23, C.navy, "bold", "times");
  let nameLines: string[] = doc.splitTextToSize(name, CW);
  if (nameLines.length > 1) {
    doc.setFontSize(18);
    nameLines = fitLines(doc, name, CW, 2);
  }
  const step = nameLines.length > 1 ? 7.2 : 8;
  doc.text(nameLines, M, 30.5, { lineHeightFactor: step / (doc.getFontSize() * 0.3528) });
  let y = 30.5 + (nameLines.length - 1) * step + 3.8;
  box(doc, M, y, 16, 1.2, C.gold);

  const badges = ["GMP Certified", "Quality Assured"];
  if (product.isWhoApproved) badges.push("WHO Approved");
  let bx = RIGHT;
  for (let i = badges.length - 1; i >= 0; i--) {
    type(doc, 6.4, C.green, "bold");
    const w = doc.getTextWidth(badges[i]) + 8.5;
    bx -= w;
    box(doc, bx, y - 1.4, w, 5, tint(C.green, 0.91), 2.5);
    doc.setFillColor(...C.green);
    doc.circle(bx + 3, y + 1.1, 0.7, "F");
    doc.text(badges[i], bx + 5.2, y + 1.95);
    bx -= 2;
  }
  y += 6.5;

  // ---- Gallery ----
  const galleryH = nameLines.length > 1 ? 70 : 76;
  box(doc, M, y, CW, galleryH, tint(accent, 0.9), 4);
  const cardY = y + 3.5;
  const cardH = galleryH - 7;
  if (images.length >= 2) {
    const w = (CW - 10.5) / 2;
    imageCard(doc, images[0], M + 3.5, cardY, w, cardH, "PRIMARY PRESENTATION", accent);
    imageCard(doc, images[1], M + 7 + w, cardY, w, cardH, "PACKAGING DETAIL", accent);
  } else {
    const w = 120;
    imageCard(
      doc,
      images[0] || null,
      M + (CW - w) / 2,
      cardY,
      w,
      cardH,
      "PRODUCT PRESENTATION",
      accent
    );
  }
  y += galleryH + 3.5;

  // ---- Spec strip ----
  const specs = [
    { label: "STRENGTH / PACK", val: dosage },
    { label: "THERAPEUTIC CLASS", val: category },
    { label: "SHELF LIFE", val: shelfLife },
    { label: "STORAGE", val: storage },
  ];
  box(doc, M, y, CW, 19, C.navy, 3);
  const sw = CW / 4;
  specs.forEach((s, i) => {
    const sx = M + i * sw;
    if (i) {
      doc.setDrawColor(40, 72, 156);
      doc.setLineWidth(0.25);
      doc.line(sx, y + 4, sx, y + 15);
    }
    type(doc, 5.9, C.gold, "bold");
    tracked(doc, s.label, sx + 4, y + 6, 0.4);
    type(doc, 7.8, C.white, "bold");
    doc.text(fitLines(doc, s.val, sw - 7, 2), sx + 4, y + 11, { lineHeightFactor: 1.22 });
  });
  y += 23;

  // ---- Composition ----
  type(doc, 8.4, C.ink);
  const compLines = fitLines(doc, composition, CW - 12, 3);
  const compH = 10 + compLines.length * 4.1;
  box(doc, M, y, CW, compH, tint(accent, 0.93), 2.5);
  box(doc, M, y + 2.5, 1.6, compH - 5, accent);
  type(doc, 6.5, accent, "bold");
  tracked(doc, "ACTIVE PHARMACEUTICAL COMPOSITION", M + 6, y + 5.6, 0.4);
  type(doc, 8.4, C.ink);
  doc.text(compLines, M + 6, y + 10.6, { lineHeightFactor: 1.38 });
  y += compH + 4.5;

  // ---- Overview ----
  if (description) {
    y = heading(doc, "Product Overview", M, y, accent) - 0.6;
    type(doc, 8.1, C.body);
    const lines = fitLines(doc, description, CW, 4);
    doc.text(lines, M, y, { lineHeightFactor: 1.4 });
    y += lines.length * 4 + 1.5;
  }

  // ---- Two column clinical grid ----
  const MAX_Y = 262;
  const LH = 3.9;
  const gap = 8;
  const colW = (CW - gap) / 2;
  const rx = M + colW + gap;

  /** Lines that still fit below a heading placed at `top`. */
  const room = (top: number) => Math.floor((MAX_Y - top - 10.4) / LH) + 1;

  const column = (title: string, text: string, x: number, top: number, maxLines: number) => {
    if (!text || maxLines < 1) return top;
    const by = heading(doc, title, x, top, accent) - 0.6;
    type(doc, 7.8, C.body);
    const lines = fitLines(doc, text, colW, maxLines);
    doc.text(lines, x, by, { lineHeightFactor: LH / (7.8 * 0.3528) });
    return by + lines.length * LH + 1.5;
  };

  // Right column pehle: safety information ko sabse zyada jagah milti hai
  let rightY = y;
  if (precautions) {
    type(doc, 7.6, C.ink);
    const fit = Math.floor((MAX_Y - rightY - 11) / LH);
    if (fit >= 1) {
      const lines = fitLines(doc, precautions, colW - 9, fit);
      const h = 10 + lines.length * LH;
      box(doc, rx, rightY, colW, h, C.amberSoft, 2.5);
      box(doc, rx, rightY + 2.5, 1.4, h - 5, C.amber);
      type(doc, 6.8, C.amberInk, "bold");
      tracked(doc, "PRECAUTIONS & WARNINGS", rx + 5, rightY + 5.6, 0.35);
      type(doc, 7.6, C.ink);
      doc.text(lines, rx + 5, rightY + 10.4, { lineHeightFactor: LH / (7.6 * 0.3528) });
      rightY += h + 3.5;
    }
  }
  rightY = column("Safety & Adverse Effects", sideEffects, rx, rightY, room(rightY));

  const features = cleanFeatures(product).slice(0, 4);
  if (features.length && rightY + 15 < MAX_Y) {
    rightY = heading(doc, "Formulation Highlights", rx, rightY, accent) - 0.6;
    for (const f of features) {
      if (rightY > MAX_Y) break;
      box(doc, rx, rightY - 2.1, 1.8, 1.8, C.gold, 0.4);
      type(doc, 7.6, C.ink);
      doc.text(oneLine(doc, f, colW - 6), rx + 4.4, rightY);
      rightY += 4.4;
    }
  }

  // Left column: dosage ke liye jagah reserve karke indications
  let leftY = column(
    "Indications & Usage",
    indications,
    M,
    y,
    room(y) - (dosageText ? 6 : 0)
  );
  leftY = column("Dosage & Administration", dosageText, M, leftY, room(leftY));

  // ---- Quality & supply strip ----
  const ay = 266;
  box(doc, M, ay, CW, 13.5, C.paper, 2.5);
  box(doc, M, ay + 2.5, 1.4, 8.5, C.green);
  type(doc, 6.3, C.green, "bold");
  tracked(doc, "QUALITY COMPLIANCE", M + 5, ay + 5.2, 0.35);
  type(doc, 6.8, C.body);
  doc.text(
    "Manufactured under Schedule M & WHO-GMP norms. Batch CoA provided on supply.",
    M + 5,
    ay + 9.8
  );
  type(doc, 6.3, C.navy, "bold");
  tracked(doc, "INSTITUTIONAL & PCD DESK", RIGHT - 4, ay + 5.2, 0.35, "right");
  type(doc, 6.8, C.body);
  doc.text(`${COMPANY_CONTACT.phone}  ·  ${COMPANY_CONTACT.email}`, RIGHT - 4, ay + 9.8, {
    align: "right",
  });
}

export async function generateProductPDF(product: Product): Promise<void> {
  const doc = new jsPDF({ compress: true });
  await drawProductSheet(doc, product);
  const cleanFileName = `${(product.slug || product.name)
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}-specification.pdf`;
  doc.save(cleanFileName);
}

export async function generateProductCatalogue(
  products: Product[],
  onProgress: (current: number, total: number) => void
): Promise<void> {
  if (!products.length) throw new Error("No products available");

  const categoryOf = (p: Product) => decodeHtmlEntities(p.category) || "General Formulations";
  const sorted = [...products].sort(
    (a, b) =>
      categoryOf(a).localeCompare(categoryOf(b)) ||
      decodeHtmlEntities(a.name).localeCompare(decodeHtmlEntities(b.name))
  );
  const categories = Array.from(new Set(sorted.map(categoryOf)));
  const accentOf = (cat: string) => ACCENTS[categories.indexOf(cat) % ACCENTS.length];

  const issueDate = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: "Aster Medicines Product Catalogue",
    subject: "Pharmaceutical Product Formulary & Specifications",
    author: "Aster Medicines Pvt. Ltd.",
  });

  drawCatalogueCover(doc, sorted.length, categories, issueDate);

  // ---- Product index (2 columns) ----
  interface IndexEntry {
    page: number;
    numX: number;
    y: number;
    linkX: number;
    linkW: number;
    height: number;
    leaderX: number;
    leaderY: number;
  }
  const entries: IndexEntry[] = [];
  const colGap = 9;
  const colW = (CW - colGap) / 2;
  const colX = [M, M + colW + colGap];
  const MAX_Y = 275;
  const TOP_FIRST = 50;
  const TOP_NEXT = 36;

  let col = 0;
  let y = 0;
  let indexPages = 0;
  let previousCategory = "";

  const startIndexPage = () => {
    doc.addPage();
    indexPages += 1;
    drawCatalogueRunningHeader(
      doc,
      "PRODUCT INDEX",
      indexPages > 1 ? "Formulary Directory (contd.)" : "Formulary Directory",
      C.navy
    );
    if (indexPages === 1) {
      type(doc, 28, C.navy, "normal", "times");
      doc.text("Product Index", M, 33);
      box(doc, M, 37.5, 16, 1.2, C.gold);
      type(doc, 8, C.muted);
      doc.text(
        `${sorted.length} Formulations  ·  ${categories.length} Categories`,
        RIGHT,
        33,
        { align: "right" }
      );
      y = TOP_FIRST;
    } else {
      type(doc, 15, C.navy, "normal", "times");
      doc.text("Product Index (Continued)", M, 28.5);
      y = TOP_NEXT;
    }
    col = 0;
  };

  const categoryHeader = (cat: string, continued: boolean) => {
    const x = colX[col];
    const accent = accentOf(cat);
    type(doc, 6.8, C.white, "bold");
    const label = `${cat.toUpperCase()}${continued ? " (CONTD.)" : ""}`;
    const lines: string[] = doc.splitTextToSize(label, colW - 17);
    const h = lines.length * 3.5 + 3.4;
    box(doc, x, y - 4, colW, h, accent, 1.6);
    lines.forEach((l, i) => tracked(doc, l, x + 3.5, y + 0.1 + i * 3.5, 0.25));
    const count = sorted.filter((p) => categoryOf(p) === cat).length;
    doc.text(String(count), x + colW - 3.5, y + 0.1, { align: "right" });
    y += h + 2.6;
  };

  startIndexPage();

  for (const product of sorted) {
    const category = categoryOf(product);
    type(doc, 8.2, C.ink);
    const lines: string[] = doc.splitTextToSize(decodeHtmlEntities(product.name), colW - 13);
    const itemH = lines.length * 3.7 + 2.6;
    let isNew = category !== previousCategory;

    if (y + (isNew ? 13 : 0) + itemH > MAX_Y) {
      if (col === 0) {
        col = 1;
        y = indexPages === 1 ? TOP_FIRST : TOP_NEXT;
      } else {
        startIndexPage();
      }
      // naye column / page par category header dobara
      categoryHeader(category, !isNew);
      isNew = false;
    } else if (isNew) {
      if (y > (indexPages === 1 ? TOP_FIRST : TOP_NEXT)) y += 2;
      categoryHeader(category, false);
    }
    previousCategory = category;

    const x = colX[col];
    type(doc, 8.2, C.ink);
    doc.text(lines, x + 1.5, y, { lineHeightFactor: 1.28 });
    const leaderY = y + (lines.length - 1) * 3.7;
    entries.push({
      page: doc.getNumberOfPages(),
      numX: x + colW - 1.5,
      y: leaderY,
      linkX: x,
      linkW: colW,
      height: itemH,
      leaderX: x + 1.5 + doc.getTextWidth(lines[lines.length - 1]) + 1.8,
      leaderY,
    });
    y += itemH;
  }

  // ---- Product pages ----
  for (const [index, product] of sorted.entries()) {
    onProgress(index + 1, sorted.length);
    doc.addPage();
    const destination = doc.getNumberOfPages();
    const category = categoryOf(product);
    await drawCatalogueProductPage(doc, product, accentOf(category), categories.indexOf(category));

    const e = entries[index];
    doc.setPage(e.page);
    type(doc, 8.2, C.navy, "bold");
    doc.text(String(destination), e.numX, e.y, { align: "right" });
    const leaderEnd = e.numX - doc.getTextWidth(String(destination)) - 1.8;
    if (leaderEnd - e.leaderX > 3) {
      doc.setLineDashPattern([0.2, 1.1], 0);
      hline(doc, e.leaderX, leaderEnd, e.leaderY, [170, 178, 200], 0.25);
      doc.setLineDashPattern([], 0);
    }
    const first = e.y - (e.height - 2.6 - 3.7);
    doc.link(e.linkX, first - 3.2, e.linkW, e.height, { pageNumber: destination });
    doc.setPage(doc.getNumberOfPages());
  }

  // ---- Footer on interior pages ----
  const lastInterior = doc.getNumberOfPages();
  const totalPages = lastInterior + 1; // back cover
  for (let p = 2; p <= lastInterior; p++) {
    doc.setPage(p);
    hline(doc, M, RIGHT, 283.5);
    type(doc, 6.6, C.muted);
    doc.text(
      `Aster Medicines Pvt. Ltd.  ·  WHO-GMP Certified  ·  ${COMPANY_CONTACT.web}  ·  ${COMPANY_CONTACT.phone}`,
      M,
      289.3
    );
    box(doc, RIGHT - 20, 285.7, 20, 5.4, C.navy, 2.7);
    type(doc, 6.8, C.white, "bold");
    doc.text(`${p} / ${totalPages}`, RIGHT - 10, 289.4, { align: "center" });
  }

  doc.setPage(lastInterior);
  doc.addPage();
  drawCatalogueBackCover(doc);

  doc.save("Aster-Product-Catalogue.pdf");
}