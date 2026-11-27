"use client";

import { jsPDF } from "jspdf";
import { Product } from "@/types/product";
import { getProductPath } from "./productSlug";
import asterLogo from "@/app/api/visiting-card/aster-logo.json";

const COMPANY_CONTACT = {
  name: "ASTER MEDICINES PVT. LTD.",
  cin: "U24230BR2008PTC013937",
  office: "North of Janta Hotel, 1st Floor, Govind Mitra Road, Patna - 800004",
  factory: "Plot No. E/4, Industrial Area, Hajipur, Vaishali, Bihar - 844101",
  phone: "+91 7909071165",
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
function strengthAndPack(product: Product): string {
  const strength = product.strengthVariants?.join(", ") || product.dosage;
  return [strength, product.packagingOptions?.join(", ")].filter(Boolean).join(" / ") || "Details on request";
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
  const dosage = strengthAndPack(product);

  const composition = decodeHtmlEntities(product.composition);
  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const indications = decodeHtmlEntities(product.indications);
  const dosageInstructions = realText(
    decodeHtmlEntities(product.dosageInstructions)
  );
  const precautions = decodeHtmlEntities(product.precautions);
  const sideEffects = decodeHtmlEntities(product.sideEffects);
  const storage =
    decodeHtmlEntities(product.storageConditions) ||
    "Refer to product label";
  const shelfLife = decodeHtmlEntities(product.shelfLife) || "Refer to product label";
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
// CATALOGUE — INTERACTIVE CARTOONISH / COMIC-POP EDITION
// ==========================================================================
const SITE_ORIGIN = "https://www.astermedicines.com";

const TOON = {
  ink: [27, 27, 58] as RGB,         // Rich cartoon indigo-black ink outline
  paper: [255, 253, 243] as RGB,    // Sunny cream storybook paper
  dotGold: [253, 232, 165] as RGB,  // Soft pastel polka-dot
  dotBlue: [216, 236, 255] as RGB,  // Soft pastel sky polka-dot
  blue: [30, 64, 175] as RGB,       // Vibrant comic royal blue
  sun: [255, 217, 61] as RGB,       // Sunny comic yellow
  coral: [255, 119, 82] as RGB,     // Playful coral tangerine
  mint: [110, 231, 165] as RGB,     // Fresh cartoon mint green
  sky: [137, 207, 255] as RGB,      // Bubblegum sky blue
  butter: [254, 243, 152] as RGB,   // Butter yellow warning card
  lavender: [198, 174, 255] as RGB, // Playful pastel grape
};

/** Warm sunny paper filled with cheerful pastel Ben-Day / comic polka dots & corner sparkles. */
function drawComicPaper(doc: jsPDF, dotAccent: RGB = TOON.dotBlue) {
  box(doc, 0, 0, PAGE_W, PAGE_H, TOON.paper);
  const spacing = 11;
  for (let gy = 6; gy < PAGE_H; gy += spacing) {
    const offset = ((Math.round(gy / spacing) % 2) * spacing) / 2;
    for (let gx = 5 + offset; gx < PAGE_W; gx += spacing) {
      // Skip dense center dots cleanly or keep subtle pastel margins/dots
      const isEdge = gx < 22 || gx > PAGE_W - 22 || gy < 28 || gy > PAGE_H - 25;
      const dotColor: RGB = isEdge ? dotAccent : [249, 243, 224];
      doc.setFillColor(...dotColor);
      doc.circle(gx, gy, isEdge ? 1.15 : 0.75, "F");
    }
  }
}

/** Draw a crisp 4-point cartoon sparkle star with dark ink outline. */
function drawCartoonStar(doc: jsPDF, cx: number, cy: number, size: number, fill: RGB = TOON.sun) {
  const outer = size;
  const inner = size * 0.34;
  const pts: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? outer : inner;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  doc.setFillColor(...fill);
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.4);
  doc.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) doc.lineTo(pts[i][0], pts[i][1]);
  doc.close();
  doc.fillStroke();
}

/** Draw a 14-point jagged comic starburst seal with chunky shadow & outline. */
function drawComicStarburst(
  doc: jsPDF,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  fill: RGB,
  line1: string,
  line2?: string
) {
  const spikes = 14;
  const buildPoly = (ox: number, oy: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i * Math.PI) / spikes - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push([ox + Math.cos(a) * r, oy + Math.sin(a) * r]);
    }
    return pts;
  };

  // Shadow starburst
  const sh = buildPoly(cx + 1.2, cy + 1.4);
  doc.setFillColor(...TOON.ink);
  doc.moveTo(sh[0][0], sh[0][1]);
  for (let i = 1; i < sh.length; i++) doc.lineTo(sh[i][0], sh[i][1]);
  doc.close();
  doc.fill();

  // Main bright starburst
  const main = buildPoly(cx, cy);
  doc.setFillColor(...fill);
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.6);
  doc.moveTo(main[0][0], main[0][1]);
  for (let i = 1; i < main.length; i++) doc.lineTo(main[i][0], main[i][1]);
  doc.close();
  doc.fillStroke();

  type(doc, 6.2, TOON.ink, "bold");
  if (line2) {
    doc.text(line1, cx, cy - 0.8, { align: "center" });
    doc.text(line2, cx, cy + 3.4, { align: "center" });
  } else {
    doc.text(line1, cx, cy + 1.4, { align: "center" });
  }
}

/**
 * Draw an adorable smiling Cartoon Capsule Mascot (vertical two-tone pill buddy with glossy shine & sparkles).
 */
function drawCartoonCapsule(doc: jsPDF, cx: number, cy: number, scale = 1.0) {
  const w = 22 * scale;
  const h = 38 * scale;
  const r = w / 2;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const midY = cy;

  // Chubby cartoon drop shadow
  doc.setFillColor(...TOON.ink);
  doc.roundedRect(x + 2 * scale, y + 2.2 * scale, w, h, r, r, "F");

  // Full capsule silhouette in Sunny Yellow
  doc.setFillColor(...TOON.sun);
  doc.roundedRect(x, y, w, h, r, r, "F");

  // Top coral semicircle dome + upper straight band spanning cleanly to midY
  // (midY - (y + r) = h/2 - r > 0, so covering [midY, y + h - r] stays strictly on vertical walls)
  doc.setFillColor(...TOON.coral);
  doc.circle(cx, y + r, r, "F");
  doc.rect(x, y + r, w, h / 2 - r, "F");
  doc.setFillColor(...TOON.sun);
  doc.rect(x, midY, w, h / 2 - r, "F");

  // Seam divider line & thick outer capsule ink stroke
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.95 * scale);
  doc.line(x, midY, x + w, midY);
  doc.roundedRect(x, y, w, h, r, r, "S");

  // Smooth Glossy White Shine Highlight pill on top-left dome
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x + 3.2 * scale, y + 4.4 * scale, 2.4 * scale, 8.2 * scale, 1.2 * scale, 1.2 * scale, "F");

  // Cute Friendly Cartoon Eyes + Rosy Cheeks + Smile!
  const eyeY = midY + 4.8 * scale;
  const eyeOffset = 4.2 * scale;
  // Rosy cheeks
  doc.setFillColor(255, 162, 162);
  doc.ellipse(cx - 6.3 * scale, eyeY + 2.4 * scale, 1.8 * scale, 1.0 * scale, "F");
  doc.ellipse(cx + 6.3 * scale, eyeY + 2.4 * scale, 1.8 * scale, 1.0 * scale, "F");
  // Eyes
  doc.setFillColor(...TOON.ink);
  doc.circle(cx - eyeOffset, eyeY, 1.7 * scale, "F");
  doc.circle(cx + eyeOffset, eyeY, 1.7 * scale, "F");
  // Bright eye catchlights
  doc.setFillColor(255, 255, 255);
  doc.circle(cx - eyeOffset - 0.5 * scale, eyeY - 0.5 * scale, 0.65 * scale, "F");
  doc.circle(cx + eyeOffset - 0.5 * scale, eyeY - 0.5 * scale, 0.65 * scale, "F");
  // Happy smile arc
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.8 * scale);
  const sy = eyeY + 2.3 * scale;
  doc.moveTo(cx - 2.6 * scale, sy);
  doc.curveTo(
    cx - 1.3 * scale,
    sy + 2.6 * scale,
    cx + 1.3 * scale,
    sy + 2.6 * scale,
    cx + 2.6 * scale,
    sy
  );
  doc.stroke();

  // Floating cheerful sparkle stars around mascot
  drawCartoonStar(doc, cx - 15 * scale, cy - 15 * scale, 3.2 * scale, TOON.sun);
  drawCartoonStar(doc, cx + 15.5 * scale, cy - 10 * scale, 2.5 * scale, TOON.mint);
  drawCartoonStar(doc, cx + 14 * scale, cy + 14 * scale, 2.2 * scale, TOON.sky);
}

/** Bubbly Cartoon Card: chubby rounded corners, thick dark cartoon outline, solid offset shadow & glossy shine pill. */
function comicCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: RGB,
  opts: { border?: number; shadow?: number; r?: number; shine?: boolean } = {}
) {
  const bw = opts.border ?? 0.65;
  const sh = opts.shadow ?? 1.6;
  const r = opts.r ?? 5;

  if (sh > 0) {
    doc.setFillColor(...TOON.ink);
    doc.roundedRect(x + sh * 0.85, y + sh, w, h, r, r, "F");
  }

  doc.setFillColor(...fill);
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(bw);
  doc.roundedRect(x, y, w, h, r, r, "FD");

  // Classic cartoon glossy white bubble shine pill on top-left corner
  if (opts.shine && w > 18 && h > 9) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x + 2.8, y + 1.6, Math.min(8, w * 0.14), 1.3, 0.65, 0.65, "F");
  }
}

interface ComicRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Tactile 3D Glossy Cartoon Button Pill with thick bottom shadow lip & white shine highlight. */
function comicButton(
  doc: jsPDF,
  x: number,
  y: number,
  text: string,
  opts: {
    align?: "left" | "right";
    fill?: RGB;
    textColor?: RGB;
    fontSize?: number;
    height?: number;
    padX?: number;
    dotColor?: RGB;
    shadow?: number;
  } = {}
): ComicRect {
  const fontSize = opts.fontSize ?? 6.4;
  const h = opts.height ?? 5.8;
  const padX = opts.padX ?? 3.4;
  const dotSpace = opts.dotColor ? 3.2 : 0;

  type(doc, fontSize, opts.textColor ?? TOON.ink, "bold");
  const tw = doc.getTextWidth(text);
  const w = tw + padX * 2 + dotSpace;
  const drawX = opts.align === "right" ? x - w : x;
  const r = h / 2;

  comicCard(doc, drawX, y, w, h, opts.fill ?? C.white, {
    border: 0.5,
    shadow: opts.shadow ?? 1.0,
    r,
  });

  // Glossy white highlight streak along upper inner pill curve
  if (w > 12) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(drawX + r * 0.8, y + 0.9, Math.min(w * 0.28, 7), 0.85, 0.4, 0.4, "F");
  }

  if (opts.dotColor) {
    doc.setFillColor(...opts.dotColor);
    doc.setDrawColor(...TOON.ink);
    doc.setLineWidth(0.3);
    doc.circle(drawX + padX + 0.8, y + h / 2, 1.0, "FD");
  }

  type(doc, fontSize, opts.textColor ?? TOON.ink, "bold");
  doc.text(text, drawX + padX + dotSpace, y + h / 2 + fontSize * 0.13);

  return { x: drawX, y, w, h };
}

/** Chunky Cartoon Image Frame with double-circle pin accents and cheerful bottom label ribbon. */
function comicImageCard(
  doc: jsPDF,
  img: LoadedImage | null,
  x: number,
  y: number,
  w: number,
  h: number,
  caption: string,
  accent: RGB
) {
  comicCard(doc, x, y, w, h, C.white, { border: 0.6, shadow: 1.5, r: 4.5 });

  const footerH = 6.5;
  if (img) {
    drawImageContained(doc, img, x + 3, y + 2.5, w - 6, h - footerH - 4.5);
  } else {
    box(doc, x + w / 2 - 12, y + h / 2 - 15, 24, 16, TOON.sun, 5);
    doc.setDrawColor(...TOON.ink);
    doc.setLineWidth(0.55);
    doc.roundedRect(x + w / 2 - 12, y + h / 2 - 15, 24, 16, 5, 5, "S");
    type(doc, 18, TOON.ink, "bold");
    doc.text("Rx", x + w / 2, y + h / 2 - 4, { align: "center" });
    type(doc, 7.2, TOON.ink, "bold");
    doc.text("ASTER MEDICINES", x + w / 2, y + h / 2 + 8, { align: "center" });
    type(doc, 6.4, C.muted);
    doc.text("Official Product View", x + w / 2, y + h / 2 + 12.5, { align: "center" });
  }

  // Cheerful pill label pinned cleanly at bottom of comic frame
  const pillW = Math.min(w - 10, 56);
  const pillX = x + (w - pillW) / 2;
  const pillY = y + h - footerH - 0.8;
  doc.setFillColor(...TOON.ink);
  doc.roundedRect(pillX, pillY, pillW, 5.4, 2.7, 2.7, "F");
  doc.setFillColor(...accent);
  doc.circle(pillX + 3.2, pillY + 2.7, 1.1, "F");

  type(doc, 5.8, TOON.sun, "bold");
  doc.text(caption, pillX + pillW / 2 + 1.2, pillY + 3.7, { align: "center" });
}

/** Comic Top Navbar Card for interior catalogue pages. */
function drawCatalogueComicHeader(
  doc: jsPDF,
  rightTitle: string,
  rightSub: string,
  accent: RGB
) {
  box(doc, 0, 0, PAGE_W, 2.2, TOON.ink);
  box(doc, 0, 0, 62, 2.2, TOON.sun);

  const navY = 4.6;
  const navH = 14.0;
  comicCard(doc, M, navY, CW, navH, C.white, { border: 0.6, shadow: 1.5, r: 5.5, shine: true });

  drawVectorLogo(doc, M + 4.5, navY + 2.0, 19.5, false);

  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.45);
  doc.line(M + 26.8, navY + 2.6, M + 26.8, navY + navH - 2.6);

  type(doc, 6.8, accent, "bold");
  doc.text(oneLine(doc, rightTitle, 60), M + 29.8, navY + 6.2);
  type(doc, 6.2, TOON.ink, "bold");
  doc.text(oneLine(doc, rightSub, 60), M + 29.8, navY + 10.5);
}

interface CoverCategoryPillRect {
  cat: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function drawCatalogueCover(
  doc: jsPDF,
  productCount: number,
  categories: string[],
  issueDate: string
) {
  drawComicPaper(doc, TOON.dotGold);

  // 1. Comic Banner Ribbon at top
  box(doc, 0, 0, PAGE_W, 8.5, TOON.ink);
  type(doc, 6.8, TOON.sun, "bold");
  tracked(
    doc,
    "ASTER MEDICINES   *   WHO-GMP CERTIFIED   *   CARE FOR LIFE   *   EST. 1982",
    PAGE_W / 2,
    5.6,
    0.35,
    "center"
  );

  // 2. Cloud Masthead Card with Starburst Seal
  const topY = 13.5;
  comicCard(doc, M, topY, CW, 22, C.white, { border: 0.7, shadow: 1.8, r: 6, shine: true });
  drawVectorLogo(doc, M + 5.5, topY + 2.8, 30.5, false);

  // Cheerful 14-point Comic Starburst Seal
  drawComicStarburst(doc, RIGHT - 16, topY + 11, 13.5, 10.2, TOON.sun, "WHO-GMP", "CERTIFIED!");

  const edPill = comicButton(doc, RIGHT - 35, topY + 7.5, issueDate.toUpperCase(), {
    align: "right",
    fill: TOON.sky,
    textColor: TOON.ink,
    fontSize: 7.0,
    height: 6.4,
    padX: 3.8,
    shadow: 1.0,
  });
  void edPill;

  // 3. Vibrant Comic Hero Card with Mascot Buddy & Comic Lettering Shadow!
  const heroY = 41.5;
  const heroH = 95;
  comicCard(doc, M, heroY, CW, heroH, TOON.blue, { border: 0.85, shadow: 2.8, r: 8, shine: true });

  // Playful comic halftone circles accent inside top-right corner
  doc.setFillColor(44, 84, 200);
  doc.circle(RIGHT - 28, heroY + 42, 26, "F");
  doc.setFillColor(56, 102, 220);
  doc.circle(RIGHT - 28, heroY + 42, 19, "F");

  // Smiling Cartoon Capsule Buddy on right inside Hero Card!
  drawCartoonCapsule(doc, RIGHT - 28, heroY + 42, 1.05);

  const hx = M + 8;
  comicButton(doc, hx, heroY + 8.5, "ASTER MEDICINES PVT. LTD.", {
    fill: TOON.coral,
    textColor: C.white,
    fontSize: 7.0,
    height: 6.0,
    padX: 3.8,
    shadow: 1.1,
  });

  // Comic Headline with crisp cartoon ink drop-shadow layer!
  type(doc, 44, TOON.ink, "bold");
  doc.text("PRODUCT", hx + 1.0, heroY + 34.0);
  doc.text("CATALOGUE", hx + 1.0, heroY + 51.0);
  type(doc, 44, C.white, "bold");
  doc.text("PRODUCT", hx, heroY + 33);
  type(doc, 44, TOON.sun, "bold");
  doc.text("CATALOGUE", hx, heroY + 50);

  type(doc, 9.6, C.white, "bold");
  const lead: string[] = doc.splitTextToSize(
    "Illustrated & Interactive Formulary -- Parenteral Injections, Syrups & Critical Care!",
    114
  );
  doc.text(lead, hx, heroY + 61.5, { lineHeightFactor: 1.4 });

  // 3 Toy-Like Glossy Cartoon Interactive CTA Buttons
  const btnY = heroY + 78;
  const indexBtn = comicButton(doc, hx, btnY, "OPEN PRODUCT INDEX ->", {
    fill: TOON.sun,
    textColor: TOON.ink,
    fontSize: 7.4,
    height: 8.2,
    padX: 5.2,
    shadow: 1.4,
  });

  const webBtn = comicButton(doc, indexBtn.x + indexBtn.w + 4, btnY, "WEBSITE ->", {
    fill: C.white,
    textColor: TOON.ink,
    fontSize: 7.2,
    height: 8.2,
    padX: 4.8,
    shadow: 1.4,
  });

  const enquireBtn = comicButton(doc, webBtn.x + webBtn.w + 4, btnY, "BULK ORDER ->", {
    fill: TOON.mint,
    textColor: TOON.ink,
    fontSize: 7.2,
    height: 8.2,
    padX: 4.8,
    shadow: 1.4,
  });

  // 4. Three Bouncy Toy-Card Metrics (clickable -> Index)
  const mY = 143;
  const mH = 26;
  const mGap = 4.5;
  const mW = (CW - mGap * 2) / 3;
  const metrics = [
    { val: String(productCount), label: "ACTIVE PRODUCTS", bg: TOON.mint },
    { val: String(categories.length), label: "CATEGORIES", bg: TOON.sky },
    { val: "100% GMP", label: "QUALITY TESTED", bg: TOON.sun },
  ];

  metrics.forEach((m, i) => {
    const mx = M + i * (mW + mGap);
    comicCard(doc, mx, mY, mW, mH, m.bg, { border: 0.65, shadow: 1.8, r: 5.5, shine: true });
    type(doc, 21, TOON.ink, "bold");
    doc.text(m.val, mx + mW / 2, mY + 13.5, { align: "center" });
    type(doc, 6.4, TOON.ink, "bold");
    tracked(doc, m.label, mx + mW / 2, mY + 21, 0.35, "center");
  });
  const metricBox: ComicRect = { x: M, y: mY, w: CW, h: mH };

  // 5. Interactive Category Toybox Panel (auto-sized to wrap neatly around category pills)
  const catBoxY = 174.5;
  const maxPx = RIGHT - 5.5;
  const candyFills: RGB[] = [TOON.sun, TOON.mint, TOON.sky, TOON.butter, TOON.lavender, tint(TOON.coral, 0.45)];
  const pillSpecs: { cat: string; label: string; x: number; y: number }[] = [];
  let px = M + 5.5;
  let py = catBoxY + 12.2;
  const ph = 6.5;

  categories.slice(0, 12).forEach((cat) => {
    const label = oneLine(doc, cat.toUpperCase(), 68);
    type(doc, 6.4, TOON.ink, "bold");
    const pw = doc.getTextWidth(label) + 7.5;
    if (px + pw > maxPx) {
      px = M + 5.5;
      py += 8.6;
    }
    pillSpecs.push({ cat, label, x: px, y: py });
    px += pw + 3.2;
  });

  const catBoxH = Math.max(32, py + ph + 4.5 - catBoxY);
  comicCard(doc, M, catBoxY, CW, catBoxH, C.white, { border: 0.65, shadow: 1.8, r: 6 });
  doc.setFillColor(...TOON.lavender);
  doc.roundedRect(M + 0.3, catBoxY + 0.3, CW - 0.6, 8.2, 5.5, 5.5, "F");
  doc.rect(M + 0.3, catBoxY + 4.5, CW - 0.6, 4.2, "F");
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.5);
  doc.line(M, catBoxY + 8.7, RIGHT, catBoxY + 8.7);

  type(doc, 6.7, TOON.ink, "bold");
  tracked(doc, "PICK A CATEGORY TO JUMP RIGHT IN!", M + 5.5, catBoxY + 5.8, 0.4);

  const catPills: CoverCategoryPillRect[] = pillSpecs.map((sp, idx) => {
    const rect = comicButton(doc, sp.x, sp.y, sp.label, {
      fill: candyFills[idx % candyFills.length],
      textColor: TOON.ink,
      fontSize: 6.4,
      height: ph,
      padX: 3.4,
      shadow: 1.0,
    });
    return { cat: sp.cat, ...rect };
  });

  // 5b. Playful Cartoon Highlights Strip filling space above footer
  const stripY = catBoxY + catBoxH + 5.5;
  const stripH = Math.max(14, 232.5 - stripY);
  const badgesRow = [
    { title: "WHO-GMP PLANTS", sub: "Strict QC Batch Testing", fill: TOON.butter },
    { title: "HOSPITAL SUPPLY", sub: "Tender & Bulk Ready", fill: TOON.mint },
    { title: "PCD FRANCHISE", sub: "Pan-India Distribution", fill: TOON.sky },
  ];
  const bgGap = 4.5;
  const bgW = (CW - bgGap * 2) / 3;
  badgesRow.forEach((b, i) => {
    const bx = M + i * (bgW + bgGap);
    comicCard(doc, bx, stripY, bgW, stripH, b.fill, { border: 0.6, shadow: 1.5, r: 5, shine: true });
    type(doc, 7.6, TOON.ink, "bold");
    doc.text(b.title, bx + bgW / 2, stripY + stripH * 0.46, { align: "center" });
    type(doc, 6.4, C.body, "bold");
    doc.text(b.sub, bx + bgW / 2, stripY + stripH * 0.76, { align: "center" });
  });

  // 6. Friendly Rounded Contact Footer Box
  const dirY = 238;
  const dirH = 44;
  comicCard(doc, M, dirY, CW, dirH, C.white, { border: 0.65, shadow: 1.8, r: 6 });

  doc.setFillColor(...TOON.ink);
  doc.roundedRect(M + 0.3, dirY + 0.3, CW - 0.6, 7.6, 5.5, 5.5, "F");
  doc.rect(M + 0.3, dirY + 4, CW - 0.6, 4.0, "F");
  type(doc, 6.4, TOON.sun, "bold");
  doc.text("WHERE TO FIND US", M + 5.5, dirY + 5.3);
  doc.text("LET'S CHAT!", RIGHT - 5.5, dirY + 5.3, { align: "right" });

  type(doc, 7.3, TOON.ink, "bold");
  const office: string[] = doc.splitTextToSize(`Regd. Office: ${COMPANY_CONTACT.office}`, 92);
  doc.text(office, M + 5.5, dirY + 14.5, { lineHeightFactor: 1.35 });
  type(doc, 7.1, C.body);
  const plant: string[] = doc.splitTextToSize(`Factory: ${COMPANY_CONTACT.factory}`, 92);
  doc.text(plant, M + 5.5, dirY + 16.5 + office.length * 3.8, { lineHeightFactor: 1.35 });
  type(doc, 6.4, C.muted, "bold");
  doc.text(`CIN: ${COMPANY_CONTACT.cin}`, M + 5.5, dirY + 39.5);

  const phoneBtn = comicButton(doc, RIGHT - 5.5, dirY + 11.2, COMPANY_CONTACT.phone, {
    align: "right",
    fill: TOON.sun,
    textColor: TOON.ink,
    fontSize: 9.0,
    height: 7.4,
    padX: 4,
    shadow: 1.1,
  });
  doc.link(phoneBtn.x, phoneBtn.y, phoneBtn.w, phoneBtn.h, {
    url: `tel:${COMPANY_CONTACT.phone.replace(/[^\d+]/g, "")}`,
  });

  type(doc, 7.5, TOON.blue, "bold");
  doc.textWithLink(
    COMPANY_CONTACT.email,
    RIGHT - 5.5 - doc.getTextWidth(COMPANY_CONTACT.email),
    dirY + 25.5,
    { url: `mailto:${COMPANY_CONTACT.email}` }
  );
  doc.textWithLink(
    COMPANY_CONTACT.web,
    RIGHT - 5.5 - doc.getTextWidth(COMPANY_CONTACT.web),
    dirY + 31.5,
    { url: `https://${COMPANY_CONTACT.web}` }
  );

  type(doc, 6.6, TOON.ink, "bold");
  doc.text("ALL INDIA SUPPLY & PCD FRANCHISE", RIGHT - 5.5, dirY + 39.5, { align: "right" });

  return { indexBtn, webBtn, enquireBtn, metricBox, catPills };
}

function drawCatalogueBackCover(doc: jsPDF, indexPage: number) {
  drawComicPaper(doc, TOON.dotBlue);

  box(doc, 0, 0, PAGE_W, 8.5, TOON.ink);
  type(doc, 6.8, TOON.sun, "bold");
  tracked(doc, "ASTER MEDICINES   *   CARE FOR LIFE   *   EST. 1982", PAGE_W / 2, 5.6, 0.35, "center");

  const mid = PAGE_W / 2;
  comicCard(doc, mid - 34, 22, 68, 34, C.white, { border: 0.7, shadow: 2.0, r: 7, shine: true });
  drawVectorLogo(doc, mid - 26, 25.5, 52, false);

  const cardX = 20;
  const cardW = PAGE_W - 40;
  const cardY = 68;
  const cardH = 178;
  comicCard(doc, cardX, cardY, cardW, cardH, TOON.blue, { border: 0.85, shadow: 3.0, r: 9, shine: true });

  // Cheerful Cartoon Capsule Buddy cheering on Back Cover!
  drawCartoonCapsule(doc, mid, cardY + 29, 0.92);

  type(doc, 27, TOON.ink, "bold");
  doc.text("LET'S TEAM UP!", mid + 0.9, cardY + 64.9, { align: "center" });
  type(doc, 27, TOON.sun, "bold");
  doc.text("LET'S TEAM UP!", mid, cardY + 64, { align: "center" });

  type(doc, 9.4, C.white, "bold");
  doc.text("Institutional supply, third-party manufacturing & PCD enquiries!", mid, cardY + 75, {
    align: "center",
  });

  // Centered Call Pill
  const cText = `CALL  ${COMPANY_CONTACT.phone}`;
  type(doc, 10.5, TOON.ink, "bold");
  const cW = doc.getTextWidth(cText) + 14;
  const callBtn = comicButton(doc, mid - cW / 2, cardY + 84, cText, {
    fill: TOON.sun,
    textColor: TOON.ink,
    fontSize: 10.5,
    height: 10.5,
    padX: 7,
    shadow: 1.6,
  });
  doc.link(callBtn.x, callBtn.y, callBtn.w, callBtn.h, {
    url: `tel:${COMPANY_CONTACT.phone.replace(/[^\d+]/g, "")}`,
  });

  type(doc, 9.5, C.white, "bold");
  doc.textWithLink(
    COMPANY_CONTACT.email,
    mid - doc.getTextWidth(COMPANY_CONTACT.email) / 2,
    cardY + 106,
    { url: `mailto:${COMPANY_CONTACT.email}` }
  );
  type(doc, 9.5, TOON.sky, "bold");
  doc.textWithLink(
    COMPANY_CONTACT.web,
    mid - doc.getTextWidth(COMPANY_CONTACT.web) / 2,
    cardY + 113.5,
    { url: `https://${COMPANY_CONTACT.web}` }
  );

  // Evenly centered 3 bouncy interactive buttons
  const bY = cardY + 124;
  const labels3 = [
    { text: "GET A QUOTE ->", fill: TOON.mint, fs: 7.4, pad: 5, dest: { url: `${SITE_ORIGIN}/contact#contact-form` } },
    { text: "BACK TO INDEX", fill: C.white, fs: 7.2, pad: 5, dest: { pageNumber: indexPage } },
    { text: "COVER", fill: TOON.coral, fs: 7.2, pad: 5, dest: { pageNumber: 1 } },
  ];
  const widths3 = labels3.map((b) => {
    type(doc, b.fs, TOON.ink, "bold");
    return doc.getTextWidth(b.text) + b.pad * 2;
  });
  const totalBtnsW = widths3.reduce((s, w) => s + w, 0) + 4.5 * 2;
  let bxCursor = mid - totalBtnsW / 2;
  labels3.forEach((b, idx) => {
    const r = comicButton(doc, bxCursor, bY, b.text, {
      fill: b.fill,
      textColor: TOON.ink,
      fontSize: b.fs,
      height: 8.2,
      padX: b.pad,
      shadow: 1.4,
    });
    doc.link(r.x, r.y, r.w, r.h, b.dest);
    bxCursor += widths3[idx] + 4.5;
  });

  type(doc, 7.2, C.onNavy);
  doc.text(`Regd. Office: ${COMPANY_CONTACT.office}`, mid, cardY + 148, { align: "center" });
  doc.text(`Factory: ${COMPANY_CONTACT.factory}`, mid, cardY + 154.5, { align: "center" });
  type(doc, 6.8, TOON.sun, "bold");
  doc.text(`CIN: ${COMPANY_CONTACT.cin}`, mid, cardY + 163, { align: "center" });
}

/** Single-page Cartoonish Illustrated Product Sheet with 2 product images & interactive buttons. */
async function drawCatalogueProductPage(
  doc: jsPDF,
  product: Product,
  accent: RGB,
  categoryIndex: number,
  categoryStartPage: number
) {
  const name = decodeHtmlEntities(product.name);
  const category = decodeHtmlEntities(product.category) || "Pharmaceutical Formulation";
  const dosage = strengthAndPack(product);
  const rawComposition = decodeHtmlEntities(product.composition);
  const composition = isGenericPlaceholder(rawComposition)
    ? "Detailed active ingredient formula available upon request / printed on product packaging."
    : rawComposition;
  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const rawIndications = decodeHtmlEntities(product.indications);
  const indications = isGenericPlaceholder(rawIndications)
    ? "For therapeutic use as directed by a registered medical practitioner."
    : rawIndications;
  const dosageText = realText(decodeHtmlEntities(product.dosageInstructions));
  const precautions = decodeHtmlEntities(product.precautions);
  const rawSideEffects = decodeHtmlEntities(product.sideEffects);
  const sideEffects = isGenericPlaceholder(rawSideEffects) ? "" : rawSideEffects;
  const storage = decodeHtmlEntities(product.storageConditions) || "Refer to product label";
  const shelfLife = decodeHtmlEntities(product.shelfLife) || "Refer to product label";

  const productUrl = `${SITE_ORIGIN}${getProductPath(product)}`;
  const enquiryUrl = `${SITE_ORIGIN}/contact?product=${encodeURIComponent(name)}&request=enquiry#contact-form`;
  const sampleUrl = `${SITE_ORIGIN}/contact?product=${encodeURIComponent(name)}&request=sample#contact-form`;

  const loadedResults = await Promise.allSettled(
    (product.images || []).slice(0, 2).map((url) => loadImageAsDataUrl(url, 4500, 850, 0.86))
  );
  const images = loadedResults
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((img): img is LoadedImage => img !== null);

  drawComicPaper(doc, tint(accent, 0.72));
  drawCatalogueComicHeader(doc, category.toUpperCase(), `REF #AM-${productRef(product)}`, accent);

  // ---- Interactive Top Candy Pills Row ----
  let y = 23.2;
  const catPill = comicButton(doc, M, y, oneLine(doc, category.toUpperCase(), 68), {
    fill: tint(accent, 0.65),
    textColor: TOON.ink,
    fontSize: 6.2,
    height: 5.6,
    padX: 3.4,
    shadow: 0.9,
  });
  doc.link(catPill.x, catPill.y, catPill.w, catPill.h, { pageNumber: categoryStartPage });

  let rxCursor = RIGHT;
  const webPill = comicButton(doc, rxCursor, y, "LIVE PAGE ->", {
    align: "right",
    fill: TOON.sun,
    textColor: TOON.ink,
    fontSize: 6.1,
    height: 5.6,
    padX: 3.2,
    shadow: 0.9,
  });
  doc.link(webPill.x, webPill.y, webPill.w, webPill.h, { url: productUrl });
  rxCursor = webPill.x - 2.2;

  const badges = ["GMP CERTIFIED", "QUALITY ASSURED"];
  if (product.isWhoApproved) badges.push("WHO APPROVED");
  for (let i = badges.length - 1; i >= 0; i--) {
    const bp = comicButton(doc, rxCursor, y, badges[i], {
      align: "right",
      fill: i === 0 ? TOON.mint : TOON.sky,
      textColor: TOON.ink,
      dotColor: C.green,
      fontSize: 6.0,
      height: 5.6,
      padX: 2.8,
      shadow: 0.9,
    });
    rxCursor = bp.x - 2.2;
  }

  y += 12.6;

  // ---- Bouncy Bold Comic Product Headline (clickable -> live page) ----
  type(doc, 20, TOON.ink, "bold");
  let nameLines: string[] = doc.splitTextToSize(name, CW);
  if (nameLines.length > 1) {
    doc.setFontSize(16);
    nameLines = fitLines(doc, name, CW, 2);
  }
  const step = nameLines.length > 1 ? 6.4 : 7.4;
  doc.text(nameLines, M, y, { lineHeightFactor: step / (doc.getFontSize() * 0.3528) });
  doc.link(M, y - 5.5, CW, nameLines.length * step + 1, { url: productUrl });
  y += (nameLines.length - 1) * step + 2.8;

  // Cute comic pill underline dots
  box(doc, M, y, 22, 1.8, TOON.sun, 0.9);
  box(doc, M + 24, y, 8, 1.8, TOON.coral, 0.9);
  box(doc, M + 34, y, 4, 1.8, TOON.sky, 0.9);
  y += 4.2;

  // ---- Two-Picture Comic Gallery Showcase ----
  const galleryH = nameLines.length > 1 ? 64 : 69;
  comicCard(doc, M, y, CW, galleryH, tint(accent, 0.78), { border: 0.65, shadow: 1.8, r: 6.5 });
  // Cheerful cartoon sparkle stars in gallery corners!
  drawCartoonStar(doc, M + 4.5, y + 4.5, 2.2, TOON.sun);
  drawCartoonStar(doc, RIGHT - 4.5, y + 4.5, 2.2, TOON.mint);

  const cardY = y + 3.5;
  const cardH = galleryH - 7;

  if (images.length >= 2) {
    const w = (CW - 11.5) / 2;
    comicImageCard(doc, images[0], M + 3.5, cardY, w, cardH, "01 // PRODUCT SNAP!", accent);
    comicImageCard(doc, images[1], M + 8 + w, cardY, w, cardH, "02 // PACK VIEW!", accent);
    doc.link(M + 3.5, cardY, w, cardH, { url: productUrl });
    doc.link(M + 8 + w, cardY, w, cardH, { url: productUrl });
  } else {
    const w = 122;
    const cx = M + (CW - w) / 2;
    comicImageCard(doc, images[0] || null, cx, cardY, w, cardH, "01 // PRODUCT VIEW!", accent);
    doc.link(cx, cardY, w, cardH, { url: productUrl });
  }
  y += galleryH + 4.5;

  // ---- Playful Toy-Block 4-Column Specs Strip ----
  const specH = 19;
  const headH = 6.2;
  comicCard(doc, M, y, CW, specH, C.white, { border: 0.65, shadow: 1.8, r: 5 });

  // Rounded dark cartoon top strip
  doc.setFillColor(...TOON.ink);
  doc.roundedRect(M + 0.3, y + 0.3, CW - 0.6, headH, 4.5, 4.5, "F");
  doc.rect(M + 0.3, y + 3.0, CW - 0.6, headH - 3.0, "F");

  const specs = [
    { label: "STRENGTH / PACK", val: dosage },
    { label: "CATEGORY", val: category },
    { label: "SHELF LIFE", val: shelfLife },
    { label: "STORAGE", val: storage },
  ];
  const sw = CW / 4;

  specs.forEach((s, i) => {
    const sx = M + i * sw;
    if (i) {
      doc.setDrawColor(...TOON.ink);
      doc.setLineWidth(0.45);
      doc.line(sx, y + headH, sx, y + specH);
    }
    type(doc, 5.9, TOON.sun, "bold");
    doc.text(s.label, sx + 3.8, y + 4.4);

    type(doc, 7.6, TOON.ink, "bold");
    doc.text(fitLines(doc, s.val, sw - 6.5, 2), sx + 3.8, y + 10.8, { lineHeightFactor: 1.2 });
  });
  y += specH + 4.5;

  // ---- Active Composition Cartoon Callout Bubble (with cute top speech tag) ----
  type(doc, 8.2, TOON.ink, "bold");
  const compLines = fitLines(doc, composition, CW - 12, 3);
  const compH = 10.2 + compLines.length * 4.0;
  comicCard(doc, M, y, CW, compH, tint(accent, 0.84), { border: 0.6, shadow: 1.6, r: 5, shine: true });

  // Top speech-tag header pill on Composition card
  box(doc, M + 4.5, y + 1.8, 36, 4.8, TOON.ink, 2.4);
  type(doc, 5.8, TOON.sun, "bold");
  doc.text("ACTIVE FORMULA!", M + 22.5, y + 5.0, { align: "center" });

  type(doc, 8.2, TOON.ink);
  doc.text(compLines, M + 5, y + 10.6, { lineHeightFactor: 1.35 });
  y += compH + 4.2;

  // ---- Story / Overview Bubbly Card ----
  if (description) {
    type(doc, 8.0, C.body);
    const lines = fitLines(doc, description, CW - 9, 3);
    const ovH = 9.8 + lines.length * 3.85;
    comicCard(doc, M, y, CW, ovH, C.white, { border: 0.55, shadow: 1.5, r: 5 });
    box(doc, M + 4, y + 1.8, 28, 4.6, TOON.sky, 2.3);
    doc.setDrawColor(...TOON.ink);
    doc.setLineWidth(0.35);
    doc.roundedRect(M + 4, y + 1.8, 28, 4.6, 2.3, 2.3, "S");
    type(doc, 5.8, TOON.ink, "bold");
    doc.text("WHAT IT DOES", M + 18, y + 4.9, { align: "center" });
    type(doc, 8.0, TOON.ink);
    doc.text(lines, M + 4.5, y + 10.0, { lineHeightFactor: 1.38 });
    y += ovH + 4.2;
  }

  // ---- Two-Column Content-Fitted Cartoon Clinical Cards ----
  const MAX_Y = 259;
  const gap = 5.5;
  const colW = (CW - gap) / 2;
  const rx = M + colW + gap;
  const maxAvailH = Math.max(MAX_Y - y, 34);

  type(doc, 7.7, TOON.ink);
  const indLines = indications ? fitLines(doc, indications, colW - 8, 5) : [];
  const doseLines = dosageText ? fitLines(doc, dosageText, colW - 8, 4) : [];
  const leftNeeded =
    6 +
    (indLines.length ? 5 + indLines.length * 3.85 + 4 : 0) +
    (doseLines.length ? 5 + doseLines.length * 3.85 + 3 : 0);

  type(doc, 7.5, TOON.ink);
  const precLines = precautions ? fitLines(doc, precautions, colW - 9, 4) : [];
  const precH = precLines.length ? 10.5 + precLines.length * 3.75 : 0;

  const features = cleanFeatures(product).slice(0, 4);
  type(doc, 7.6, TOON.ink);
  const sideLines = sideEffects ? fitLines(doc, sideEffects, colW - 8, 3) : [];
  const secondRightNeeded =
    (sideLines.length ? 8.5 + sideLines.length * 3.8 + 4 : 0) +
    (features.length ? 8.5 + features.length * 4.4 : 0);

  const rightNeeded = (precH ? precH + 4 : 0) + (secondRightNeeded ? secondRightNeeded + 3 : 0);
  const matchedH = Math.min(maxAvailH, Math.max(leftNeeded, rightNeeded, 32));

  // Left Cloud Card: Indications & Dosage
  comicCard(doc, M, y, colW, matchedH, C.white, { border: 0.6, shadow: 1.6, r: 5 });
  let ly = y + 5.8;
  const maxLeftY = y + matchedH - 3.5;

  const drawLeftSection = (title: string, lines: string[]) => {
    if (!lines.length || ly + 8 > maxLeftY) return;
    doc.setFillColor(...accent);
    doc.setDrawColor(...TOON.ink);
    doc.setLineWidth(0.35);
    doc.circle(M + 5.2, ly - 0.9, 1.3, "FD");
    type(doc, 6.7, TOON.ink, "bold");
    doc.text(title.toUpperCase(), M + 8.2, ly);
    ly += 4.6;
    type(doc, 7.7, C.body);
    const cap = Math.max(1, Math.floor((maxLeftY - ly) / 3.85) + 1);
    const keep = lines.slice(0, cap);
    doc.text(keep, M + 4, ly, { lineHeightFactor: 1.38 });
    ly += keep.length * 3.85 + 4.5;
  };

  drawLeftSection("Indications & Usage", indLines);
  drawLeftSection("Dosage & How To Use", doseLines);

  // Fill any comfortable spare height at bottom of left card with cheerful comic supply perks
  if (ly + 11 <= maxLeftY) {
    ly += 1;
    doc.setFillColor(...TOON.sun);
    doc.setDrawColor(...TOON.ink);
    doc.setLineWidth(0.35);
    doc.circle(M + 5.2, ly - 0.9, 1.3, "FD");
    type(doc, 6.7, TOON.ink, "bold");
    doc.text("PACKAGING & AVAILABILITY", M + 8.2, ly);
    ly += 4.6;
    type(doc, 7.4, C.body);
    doc.text(`Strength: ${oneLine(doc, dosage, colW - 22)}`, M + 4, ly);
    ly += 4.2;
    if (ly + 3 <= maxLeftY) {
      doc.text("Hospital Supply  *  Bulk Order  *  PCD", M + 4, ly);
    }
  }

  // Right Column: Cartoon Caution Bubble Card + Highlights Card
  let ry = y;
  if (precLines.length && ry + precH <= y + matchedH) {
    comicCard(doc, rx, ry, colW, precH, TOON.butter, { border: 0.6, shadow: 1.6, r: 5, shine: true });
    // Cute coral "CARE NOTE!" pill badge
    box(doc, rx + 3.5, ry + 1.8, 28, 4.5, TOON.coral, 2.2);
    doc.setDrawColor(...TOON.ink);
    doc.setLineWidth(0.35);
    doc.roundedRect(rx + 3.5, ry + 1.8, 28, 4.5, 2.2, 2.2, "S");
    type(doc, 5.7, C.white, "bold");
    doc.text("!  CARE NOTE", rx + 17.5, ry + 4.8, { align: "center" });

    type(doc, 7.5, TOON.ink);
    doc.text(precLines, rx + 4, ry + 10.2, { lineHeightFactor: 1.35 });
    ry += precH + 4;
  }

  const remRightH = y + matchedH - ry;
  if (remRightH >= 13 && (sideLines.length || features.length)) {
    comicCard(doc, rx, ry, colW, remRightH, C.white, { border: 0.6, shadow: 1.6, r: 5 });
    let innerRy = ry + 5.6;
    const maxRightY = ry + remRightH - 2.5;

    if (sideLines.length && innerRy + 8 <= maxRightY) {
      doc.setFillColor(...TOON.coral);
      doc.setDrawColor(...TOON.ink);
      doc.setLineWidth(0.35);
      doc.circle(rx + 5.2, innerRy - 0.9, 1.3, "FD");
      type(doc, 6.6, TOON.ink, "bold");
      doc.text("SIDE EFFECTS & SAFETY", rx + 8.2, innerRy);
      innerRy += 4.5;
      type(doc, 7.6, C.body);
      const capS = Math.max(1, Math.floor((maxRightY - innerRy) / 3.8) + 1);
      const keepS = sideLines.slice(0, capS);
      doc.text(keepS, rx + 4, innerRy, { lineHeightFactor: 1.36 });
      innerRy += keepS.length * 3.8 + 4;
    }

    if (features.length && innerRy + 8 <= maxRightY) {
      doc.setFillColor(...TOON.sun);
      doc.setDrawColor(...TOON.ink);
      doc.setLineWidth(0.35);
      doc.circle(rx + 5.2, innerRy - 0.9, 1.3, "FD");
      type(doc, 6.6, TOON.ink, "bold");
      doc.text("HIGHLIGHTS", rx + 8.2, innerRy);
      innerRy += 4.8;
      for (const f of features) {
        if (innerRy > maxRightY) break;
        doc.setFillColor(...TOON.mint);
        doc.setDrawColor(...TOON.ink);
        doc.setLineWidth(0.35);
        doc.roundedRect(rx + 4, innerRy - 2.2, 2.3, 2.3, 0.7, 0.7, "FD");
        type(doc, 7.6, TOON.ink, "bold");
        doc.text(oneLine(doc, f, colW - 10), rx + 7.8, innerRy);
        innerRy += 4.3;
      }
    }
  }

  // ---- Bottom Interactive Cartoon CTA Strip ----
  const ay = 263.5;
  const ah = 14.5;
  comicCard(doc, M, ay, CW, ah, C.white, { border: 0.6, shadow: 1.6, r: 5.5, shine: true });

  box(doc, M + 3.5, ay + 2.4, 3.2, ah - 4.8, TOON.mint, 1.6);
  doc.setDrawColor(...TOON.ink);
  doc.setLineWidth(0.35);
  doc.roundedRect(M + 3.5, ay + 2.4, 3.2, ah - 4.8, 1.6, 1.6, "S");

  type(doc, 6.4, C.green, "bold");
  doc.text("WHO-GMP & SCHEDULE M CERTIFIED  *  BATCH COA READY", M + 9, ay + 5.5);

  type(doc, 6.9, TOON.ink, "bold");
  const phoneTxt = COMPANY_CONTACT.phone;
  const mailTxt = COMPANY_CONTACT.email;
  doc.textWithLink(phoneTxt, M + 9, ay + 10.6, {
    url: `tel:${phoneTxt.replace(/[^\d+]/g, "")}`,
  });
  const sepX = M + 9 + doc.getTextWidth(phoneTxt) + 2;
  doc.text("*", sepX, ay + 10.6);
  doc.textWithLink(mailTxt, sepX + 3.5, ay + 10.6, { url: `mailto:${mailTxt}` });

  const btnY2 = ay + 3.7;
  const enqBtn = comicButton(doc, RIGHT - 3.8, btnY2, "ORDER NOW ->", {
    align: "right",
    fill: TOON.sun,
    textColor: TOON.ink,
    fontSize: 6.4,
    height: 6.6,
    padX: 3.6,
    shadow: 1.0,
  });
  doc.link(enqBtn.x, enqBtn.y, enqBtn.w, enqBtn.h, { url: enquiryUrl });

  const smpBtn = comicButton(doc, enqBtn.x - 2.6, btnY2, "FREE SAMPLE", {
    align: "right",
    fill: TOON.sky,
    textColor: TOON.ink,
    fontSize: 6.2,
    height: 6.6,
    padX: 3.2,
    shadow: 1.0,
  });
  doc.link(smpBtn.x, smpBtn.y, smpBtn.w, smpBtn.h, { url: sampleUrl });
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
    title: "Aster Medicines — Illustrated Interactive Product Catalogue",
    subject: "Pharmaceutical Product Formulary & Specifications",
    author: "Aster Medicines Pvt. Ltd.",
  });

  // 1. Cartoonish Illustrated Cover
  const coverRefs = drawCatalogueCover(doc, sorted.length, categories, issueDate);

  // 2. Interactive 2-Column Cartoon Product Index
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
  const colGap = 7;
  const colW = (CW - colGap) / 2;
  const colX = [M, M + colW + colGap];
  const MAX_Y = 274;
  const TOP_FIRST = 56;
  const TOP_NEXT = 38;

  let col = 0;
  let y = 0;
  let indexPages = 0;
  let previousCategory = "";
  const indexQuickPillCoords: CoverCategoryPillRect[] = [];

  // Estimate per-category block height to balance Column 1 & Column 2 evenly!
  const categoryBlockHeight = new Map<string, number>();
  let totalListHeight = 0;
  for (const cat of categories) {
    const prods = sorted.filter((p) => categoryOf(p) === cat);
    let bh = 12; // category header + spacing
    for (const p of prods) {
      type(doc, 7.9, TOON.ink, "bold");
      const lns: string[] = doc.splitTextToSize(decodeHtmlEntities(p.name), colW - 19);
      bh += lns.length * 3.6 + 2.5;
    }
    categoryBlockHeight.set(cat, bh);
    totalListHeight += bh;
  }

  const drawIndexColumns = (topY: number) => {
    const colH = 278 - topY;
    comicCard(doc, colX[0], topY, colW, colH, C.white, { border: 0.65, shadow: 1.8, r: 5.5 });
    comicCard(doc, colX[1], topY, colW, colH, C.white, { border: 0.65, shadow: 1.8, r: 5.5 });
  };

  let curTopY = 58;
  const startIndexPage = () => {
    doc.addPage();
    indexPages += 1;
    drawComicPaper(doc, TOON.dotBlue);
    drawCatalogueComicHeader(
      doc,
      "PRODUCT INDEX",
      indexPages > 1 ? "Directory (Contd.)" : "Click Any Product To Jump!",
      TOON.blue
    );

    if (indexPages === 1) {
      type(doc, 22, TOON.ink, "bold");
      doc.text("PRODUCT INDEX", M, 28.5);
      type(doc, 7.6, TOON.blue, "bold");
      doc.text(
        `${sorted.length} Products  *  ${categories.length} Categories`,
        RIGHT,
        28.5,
        { align: "right" }
      );

      let qx = M;
      let qy = 33.0;
      const candyFills: RGB[] = [TOON.sun, TOON.mint, TOON.sky, TOON.butter, TOON.lavender, tint(TOON.coral, 0.45)];
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const label = oneLine(doc, cat.toUpperCase(), 38);
        type(doc, 5.7, TOON.ink, "bold");
        const pw = doc.getTextWidth(label) + 6;
        if (qx + pw > RIGHT) {
          qx = M;
          qy += 6.6;
        }
        const rect = comicButton(doc, qx, qy, label, {
          fill: candyFills[i % candyFills.length],
          textColor: TOON.ink,
          fontSize: 5.7,
          height: 5.2,
          padX: 2.6,
          shadow: 0.9,
        });
        indexQuickPillCoords.push({ cat, ...rect });
        qx += rect.w + 2.2;
      }

      const boxTop = qy + 8.5;
      drawIndexColumns(boxTop);
      curTopY = boxTop + 9.5;
      y = curTopY;
    } else {
      type(doc, 14, TOON.ink, "bold");
      doc.text("PRODUCT INDEX (CONTD.)", M, 27.5);
      drawIndexColumns(31);
      curTopY = 39.5;
      y = curTopY;
    }
    col = 0;
  };

  const categoryHeader = (cat: string, continued: boolean) => {
    const x = colX[col] + 3.5;
    const innerW = colW - 7;
    const accent = accentOf(cat);
    type(doc, 6.5, C.white, "bold");
    const label = `${cat.toUpperCase()}${continued ? " (CONTD.)" : ""}`;
    const lines: string[] = doc.splitTextToSize(label, innerW - 14);
    const h = lines.length * 3.4 + 3.6;

    comicCard(doc, x, y - 4, innerW, h, accent, { border: 0.45, shadow: 0.9, r: 2.5 });
    lines.forEach((l, i) => doc.text(l, x + 3, y + 0.1 + i * 3.4));
    const count = sorted.filter((p) => categoryOf(p) === cat).length;
    type(doc, 6.8, TOON.sun, "bold");
    doc.text(String(count), x + innerW - 3, y + 0.1, { align: "right" });
    y += h + 2.8;
  };

  startIndexPage();
  const availColH = MAX_Y - curTopY;
  const colSplitTargetY =
    indexPages === 1 && totalListHeight <= availColH * 1.85
      ? curTopY + totalListHeight * 0.52
      : MAX_Y;

  for (const product of sorted) {
    const category = categoryOf(product);
    const innerW = colW - 7;
    type(doc, 7.9, TOON.ink, "bold");
    const lines: string[] = doc.splitTextToSize(decodeHtmlEntities(product.name), innerW - 12);
    const itemH = lines.length * 3.6 + 2.5;
    let isNew = category !== previousCategory;
    const blockH = categoryBlockHeight.get(category) ?? 0;

    const shouldBalanceToCol2 =
      col === 0 &&
      isNew &&
      y > curTopY &&
      y + Math.min(blockH, 24) > colSplitTargetY;

    if (shouldBalanceToCol2 || y + (isNew ? 13 : 0) + itemH > MAX_Y) {
      if (col === 0) {
        col = 1;
        y = curTopY;
      } else {
        startIndexPage();
      }
      categoryHeader(category, !isNew);
      isNew = false;
    } else if (isNew) {
      if (y > curTopY) y += 2.2;
      categoryHeader(category, false);
    }
    previousCategory = category;

    const x = colX[col] + 3.5;
    type(doc, 7.9, TOON.ink);
    doc.text(lines, x + 1, y, { lineHeightFactor: 1.25 });
    const leaderY = y + (lines.length - 1) * 3.6;
    entries.push({
      page: doc.getNumberOfPages(),
      numX: x + innerW - 1,
      y: leaderY,
      linkX: colX[col] + 2,
      linkW: colW - 4,
      height: itemH,
      leaderX: x + 1 + doc.getTextWidth(lines[lines.length - 1]) + 1.6,
      leaderY,
    });
    y += itemH;
  }

  // Track destinations before product pages
  const categoryFirstPage = new Map<string, number>();
  const productDestinations: { product: Product; category: string; pageNumber: number }[] = [];

  let expectedPage = doc.getNumberOfPages() + 1;
  for (const p of sorted) {
    const c = categoryOf(p);
    if (!categoryFirstPage.has(c)) categoryFirstPage.set(c, expectedPage);
    expectedPage += 1;
  }

  // 3. Single-Page Cartoonish Product Sheets
  for (const [index, product] of sorted.entries()) {
    onProgress(index + 1, sorted.length);
    doc.addPage();
    const destination = doc.getNumberOfPages();
    const category = categoryOf(product);
    productDestinations.push({ product, category, pageNumber: destination });

    await drawCatalogueProductPage(
      doc,
      product,
      accentOf(category),
      categories.indexOf(category),
      categoryFirstPage.get(category) ?? 2
    );

    const e = entries[index];
    doc.setPage(e.page);
    type(doc, 8.0, TOON.blue, "bold");
    doc.text(String(destination), e.numX, e.y, { align: "right" });
    const leaderEnd = e.numX - doc.getTextWidth(String(destination)) - 1.6;
    if (leaderEnd - e.leaderX > 3) {
      doc.setLineDashPattern([0.5, 1.0], 0);
      hline(doc, e.leaderX, leaderEnd, e.leaderY, C.muted, 0.3);
      doc.setLineDashPattern([], 0);
    }
    const first = e.y - (e.height - 2.5 - 3.6);
    doc.link(e.linkX, first - 3.2, e.linkW, e.height, { pageNumber: destination });
    doc.setPage(doc.getNumberOfPages());
  }

  // 4. Closing Cartoon Page
  const lastInterior = doc.getNumberOfPages();
  doc.setPage(lastInterior);
  doc.addPage();
  const totalPages = doc.getNumberOfPages();
  drawCatalogueBackCover(doc, 2);

  // 5. Wire Cover & Index Quick-Jump Interactive Links
  doc.setPage(1);
  doc.link(coverRefs.indexBtn.x, coverRefs.indexBtn.y, coverRefs.indexBtn.w, coverRefs.indexBtn.h, { pageNumber: 2 });
  doc.link(coverRefs.webBtn.x, coverRefs.webBtn.y, coverRefs.webBtn.w, coverRefs.webBtn.h, { url: SITE_ORIGIN });
  doc.link(coverRefs.enquireBtn.x, coverRefs.enquireBtn.y, coverRefs.enquireBtn.w, coverRefs.enquireBtn.h, {
    url: `${SITE_ORIGIN}/contact#contact-form`,
  });
  doc.link(coverRefs.metricBox.x, coverRefs.metricBox.y, coverRefs.metricBox.w, coverRefs.metricBox.h, { pageNumber: 2 });
  for (const cp of coverRefs.catPills) {
    doc.link(cp.x, cp.y, cp.w, cp.h, { pageNumber: categoryFirstPage.get(cp.cat) ?? 2 });
  }

  doc.setPage(2);
  for (const qp of indexQuickPillCoords) {
    doc.link(qp.x, qp.y, qp.w, qp.h, { pageNumber: categoryFirstPage.get(qp.cat) ?? 2 });
  }

  // 6. Stamp Comic Header Nav Buttons + Running Footer Pill across Interior Pages (2..lastInterior)
  for (let p = 2; p <= lastInterior; p++) {
    doc.setPage(p);
    doc.link(M + 4, 5.5, 22, 12, { pageNumber: 1 });

    const navPillY = 8.6;
    let navX = RIGHT - 3.2;

    const contactBtn = comicButton(doc, navX, navPillY, "CONTACT", {
      align: "right",
      fill: TOON.mint,
      textColor: TOON.ink,
      fontSize: 5.7,
      height: 5.8,
      padX: 2.5,
      shadow: 0.85,
    });
    doc.link(contactBtn.x, contactBtn.y, contactBtn.w, contactBtn.h, { pageNumber: totalPages });
    navX = contactBtn.x - 1.8;

    const nextBtn = comicButton(doc, navX, navPillY, "NEXT >", {
      align: "right",
      fill: C.white,
      textColor: p < totalPages ? TOON.ink : C.muted,
      fontSize: 5.7,
      height: 5.8,
      padX: 2.4,
      shadow: 0.85,
    });
    doc.link(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, { pageNumber: Math.min(totalPages, p + 1) });
    navX = nextBtn.x - 1.8;

    const prevBtn = comicButton(doc, navX, navPillY, "< PREV", {
      align: "right",
      fill: C.white,
      textColor: TOON.ink,
      fontSize: 5.7,
      height: 5.8,
      padX: 2.4,
      shadow: 0.85,
    });
    doc.link(prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h, { pageNumber: Math.max(1, p - 1) });
    navX = prevBtn.x - 1.8;

    if (p !== 2) {
      const idxBtn = comicButton(doc, navX, navPillY, "INDEX", {
        align: "right",
        fill: TOON.sun,
        textColor: TOON.ink,
        fontSize: 5.7,
        height: 5.8,
        padX: 2.6,
        shadow: 0.85,
      });
      doc.link(idxBtn.x, idxBtn.y, idxBtn.w, idxBtn.h, { pageNumber: 2 });
      navX = idxBtn.x - 1.8;
    }

    const covBtn = comicButton(doc, navX, navPillY, "COVER", {
      align: "right",
      fill: TOON.sky,
      textColor: TOON.ink,
      fontSize: 5.7,
      height: 5.8,
      padX: 2.4,
      shadow: 0.85,
    });
    doc.link(covBtn.x, covBtn.y, covBtn.w, covBtn.h, { pageNumber: 1 });

    // Bouncy Running Footer Pill
    comicCard(doc, M, 282.5, CW, 8.6, C.white, { border: 0.5, shadow: 1.2, r: 4.3 });
    type(doc, 6.4, TOON.ink, "bold");
    const footLeft = "ASTER MEDICINES PVT. LTD.  *  WHO-GMP  *  ";
    doc.text(footLeft, M + 4.5, 287.8);
    const webX = M + 4.5 + doc.getTextWidth(footLeft);
    doc.setTextColor(...TOON.blue);
    doc.textWithLink(COMPANY_CONTACT.web, webX, 287.8, { url: SITE_ORIGIN });

    const pPill = comicButton(doc, RIGHT - 2.2, 283.9, `${p} / ${totalPages}`, {
      align: "right",
      fill: TOON.sun,
      textColor: TOON.ink,
      fontSize: 6.4,
      height: 5.6,
      padX: 3.4,
      shadow: 0.8,
    });
    doc.link(pPill.x, pPill.y, pPill.w, pPill.h, { pageNumber: 2 });
  }

  // 7. Collapsible PDF Sidebar Bookmarks Outline Tree
  try {
    doc.outline.add(null, "Cover Page — Aster Product Catalogue", { pageNumber: 1 });
    doc.outline.add(null, `Product Index (${sorted.length} Products)`, { pageNumber: 2 });
    const categoryNodes = new Map<string, ReturnType<typeof doc.outline.add>>();
    for (const item of productDestinations) {
      let catNode = categoryNodes.get(item.category);
      if (!catNode) {
        const count = sorted.filter((x) => categoryOf(x) === item.category).length;
        catNode = doc.outline.add(null, `${item.category} (${count})`, {
          pageNumber: categoryFirstPage.get(item.category) ?? item.pageNumber,
        });
        categoryNodes.set(item.category, catNode);
      }
      doc.outline.add(catNode, decodeHtmlEntities(item.product.name), {
        pageNumber: item.pageNumber,
      });
    }
    doc.outline.add(null, "Let's Team Up — Contact", { pageNumber: totalPages });
  } catch (outlineErr) {
    console.warn("Could not populate PDF sidebar outline:", outlineErr);
  }

  doc.save("Aster-Product-Catalogue.pdf");
}