"use client";

import { jsPDF } from "jspdf";
import { Product } from "@/types/product";
import { LOGO_BASE64 } from "./logoBase64";
import asterLogo from "@/app/api/visiting-card/aster-logo.json";

const COMPANY_CONTACT = {
  name: "ASTER MEDICINES PVT. LTD.",
  cin: "U24230BR2008PTC013937",
  office: "North of Janta Hotel, 1st Floor, Govind Mitra Road, Patna - 800004",
  factory: "Plot No. E/4, Industrial Area, Hajipur, Vaishali, Bihar - 844102",
  phone: "+91 9934006655",
  email: "accounts@astermedicines.com",
  web: "www.astermedicines.com",
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

/**
 * Main PDF Generation function for Aster Medicines Specification Sheets
 */
async function drawProductSheet(doc: jsPDF, product: Product) {
  const firstPage = doc.getNumberOfPages();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Colors
  const brandOrange: [number, number, number] = [234, 88, 12]; // #EA580C
  const brandNavy: [number, number, number] = [15, 23, 42]; // #0F172A
  const textDark: [number, number, number] = [30, 41, 59]; // #1E293B
  const textBody: [number, number, number] = [51, 65, 85]; // #334155
  const textMuted: [number, number, number] = [100, 116, 139]; // #64748B
  const borderLight: [number, number, number] = [226, 232, 240]; // #E2E8F0
  const borderCard: [number, number, number] = [203, 213, 225]; // #CBD5E1
  const bgCard: [number, number, number] = [248, 250, 252]; // #F8FAFC
  const brandGreen: [number, number, number] = [5, 150, 105]; // #059669

  // Sanitize & Decode strings
  const name = decodeHtmlEntities(product.name);
  const category = decodeHtmlEntities(product.category) || "Pharmaceutical Formulation";

  // Smartly format dosage/strength (avoiding "100 units available" stock mixup)
  let dosage = decodeHtmlEntities(product.dosage);
  if (!dosage || dosage.toLowerCase().includes("available") || dosage.toLowerCase().includes("unit")) {
    const strengthMatch = name.match(/(\d+(?:\.\d+)?\s*(?:gm|g|mg|mcg|ml|%)\b)/i);
    if (strengthMatch) {
      dosage = strengthMatch[0];
    } else {
      dosage = "As directed by physician";
    }
  }

  const composition = decodeHtmlEntities(product.composition);
  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const indications = decodeHtmlEntities(product.indications);
  const dosageInstructions = decodeHtmlEntities(product.dosageInstructions || product.dosage);
  const precautions = decodeHtmlEntities(product.precautions);
  const sideEffects = decodeHtmlEntities(product.sideEffects);
  const storage = decodeHtmlEntities(product.storageConditions) || "Store below 25°C in a dry place. Protect from light.";
  const shelfLife = decodeHtmlEntities(product.shelfLife) || "24 - 36 Months from MFG Date";

  const productCode = (product.id ? String(product.id) : "ASTER").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  const dateFormatted = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Pre-load images concurrently
  const imagePromises: Promise<LoadedImage | null>[] = [];
  if (product.images && product.images.length > 0) {
    for (let i = 0; i < Math.min(product.images.length, 4); i++) {
      imagePromises.push(loadImageAsDataUrl(product.images[i], 4500));
    }
  }

  const loadedImagesResult = await Promise.allSettled(imagePromises);
  const loadedImages: (LoadedImage | null)[] = loadedImagesResult.map((r) =>
    r.status === "fulfilled" ? r.value : null
  );

  const primaryImage = loadedImages[0] || null;
  const secondaryImages = loadedImages.slice(1).filter((img): img is LoadedImage => img !== null);

  // Helper: Draw Unified Header on any page
  const drawHeader = (pageNumber: number) => {
    // Top Brand Accent Stripe
    doc.setFillColor(...brandOrange);
    doc.rect(0, 0, pageWidth, 3.5, "F");
    doc.setFillColor(...brandNavy);
    doc.rect(0, 3.5, pageWidth, 0.8, "F");

    // Company Logo
    try {
      doc.addImage(LOGO_BASE64, "PNG", margin, 7.5, 36, 21);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...brandOrange);
      doc.text("ASTER MEDICINES", margin, 18);
    }

    // Company Header Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...brandNavy);
    doc.text("ASTER MEDICINES PVT. LTD.", 54, 12.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...brandOrange);
    doc.text("GMP CERTIFIED PHARMACEUTICAL MANUFACTURER", 54, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.text("Govind Mitra Road, Patna - 800004, Bihar, India", 54, 21);
    doc.text("Web: www.astermedicines.com · Email: contact@astermedicines.com", 54, 25);

    // Specification Sheet Meta Box (Right aligned)
    const metaBoxW = 58;
    const metaBoxX = pageWidth - margin - metaBoxW;
    doc.setFillColor(...bgCard);
    doc.setDrawColor(...borderLight);
    doc.roundedRect(metaBoxX, 7.5, metaBoxW, 20, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...brandOrange);
    doc.text("PRODUCT SPECIFICATION", metaBoxX + 4, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...textMuted);
    doc.text(pageNumber === 1 ? "OFFICIAL TECHNICAL DATA SHEET" : "TECHNICAL SPECIFICATIONS", metaBoxX + 4, 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...brandNavy);
    doc.text(`DOC REF: AM-${productCode}`, metaBoxX + 4, 20);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    doc.text(`DATE: ${dateFormatted}`, metaBoxX + 4, 24);

    // Header divider line
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.line(margin, 30.5, pageWidth - margin, 30.5);
  };

  // Helper for Section Titles
  const drawSectionHeader = (title: string, y: number) => {
    doc.setFillColor(...brandOrange);
    doc.rect(margin, y, 2.2, 4.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...brandNavy);
    doc.text(title.toUpperCase(), margin + 4.5, y + 3.4);

    return y + 6.5;
  };

  // ==========================================
  // PAGE 1: HERO SHOWCASE & PRIMARY SPECS
  // ==========================================
  drawHeader(1);

  // Hero Card Container (Two Columns)
  const heroY = 34;
  const heroH = 82;
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, heroY, contentWidth, heroH, 3, 3, "FD");

  // --- Left Column: Framed Product Image ---
  const imgFrameX = margin + 4;
  const imgFrameY = heroY + 4;
  const imgFrameW = 68;
  const imgFrameH = heroH - 8; // 74mm

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderCard);
  doc.setLineWidth(0.3);
  doc.roundedRect(imgFrameX, imgFrameY, imgFrameW, imgFrameH, 2, 2, "FD");

  if (primaryImage) {
    drawImageContained(doc, primaryImage, imgFrameX + 3, imgFrameY + 3, imgFrameW - 6, imgFrameH - 10);
    // Micro caption
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...textMuted);
    doc.text("APPROVED PACKAGING & PRODUCT VIEW", imgFrameX + imgFrameW / 2, imgFrameY + imgFrameH - 3, {
      align: "center",
    });
  } else {
    // Fallback card
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...brandOrange);
    doc.text("ASTER MEDICINES", imgFrameX + imgFrameW / 2, imgFrameY + 32, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text("Standard Formulation Packaging", imgFrameX + imgFrameW / 2, imgFrameY + 40, { align: "center" });
    doc.text("Pharmaceutical Grade Product", imgFrameX + imgFrameW / 2, imgFrameY + 46, { align: "center" });
  }

  // --- Right Column: Product Title & Quick Specs ---
  const detailsX = margin + 76;
  const detailsW = contentWidth - 80; // 102mm

  // 1. Category Pill Badge
  let rightY = heroY + 4;
  const catText = category.toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  const catWidth = Math.min(doc.getTextWidth(catText) + 8, detailsW);
  doc.setFillColor(255, 247, 237); // #FFF7ED
  doc.setDrawColor(254, 215, 170); // #FED7AA
  doc.setLineWidth(0.3);
  doc.roundedRect(detailsX, rightY, catWidth, 5.2, 1.5, 1.5, "FD");
  doc.setTextColor(194, 65, 12); // #C2410C
  doc.text(catText, detailsX + 4, rightY + 3.6);

  // 2. Product Name Title
  rightY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...brandNavy);
  const nameLines = doc.splitTextToSize(name, detailsW);
  doc.text(nameLines, detailsX, rightY + 3.5);
  rightY += nameLines.length * 4.8 + 2.5;

  // 3. Verification Badges Strip (with crisp vector dots instead of glitched unicode)
  const badgeLabels = ["GMP Certified", "Quality Assured"];
  if (product.isWhoApproved) badgeLabels.push("WHO Approved");

  let badgeX = detailsX;
  badgeLabels.forEach((label) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    const textW = doc.getTextWidth(label);
    const pillW = textW + 9;
    const pillH = 4.8;

    doc.setFillColor(236, 253, 245); // #ECFDF5
    doc.setDrawColor(167, 243, 208); // #A7F3D0
    doc.setLineWidth(0.3);
    doc.roundedRect(badgeX, rightY, pillW, pillH, 1.4, 1.4, "FD");

    // Clean green dot indicator
    doc.setFillColor(...brandGreen);
    doc.circle(badgeX + 2.8, rightY + pillH / 2, 0.75, "F");

    // Badge label
    doc.setTextColor(...brandGreen);
    doc.text(label, badgeX + 4.8, rightY + 3.4);

    badgeX += pillW + 3.5;
  });

  rightY += 8;

  // 4. Quick Specifications 4-Row Card
  const specTableH = 32;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(detailsX, rightY, detailsW, specTableH, 2, 2, "FD");

  const specRows = [
    { label: "Dosage / Strength:", val: dosage },
    { label: "Therapeutic Category:", val: category },
    { label: "Storage Condition:", val: storage },
    { label: "Shelf Life / Expiry:", val: shelfLife },
  ];

  let specRowY = rightY + 4.5;
  specRows.forEach((row, idx) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.text(row.label, detailsX + 3.5, specRowY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...textDark);
    const valText = doc.splitTextToSize(row.val, detailsW - 40);
    doc.text(valText[0] || "", detailsX + 38, specRowY);

    if (idx < specRows.length - 1) {
      doc.setDrawColor(241, 245, 249);
      doc.line(detailsX + 3.5, specRowY + 2.5, detailsX + detailsW - 3.5, specRowY + 2.5);
    }
    specRowY += 7.2;
  });

  // --- Highlights 4-Metrics Ribbon ---
  const ribbonY = heroY + heroH + 4;
  const ribbonH = 11.5;
  const cardW = (contentWidth - 9) / 4; // ~43.25mm

  const metricCards = [
    { title: "FORMULATION", subtitle: "Pharmacopoeial Grade" },
    { title: "ADMINISTRATION", subtitle: "I.V. / I.M. Injection / Oral" },
    { title: "PACKAGING", subtitle: "Sterile Unit Pack" },
    { title: "ASSURANCE", subtitle: "Batch Tested & Certified" },
  ];

  metricCards.forEach((c, idx) => {
    const cardX = margin + idx * (cardW + 3);
    doc.setFillColor(...bgCard);
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, ribbonY, cardW, ribbonH, 2, 2, "FD");

    // Top Orange Mini Accent
    doc.setFillColor(...brandOrange);
    doc.rect(cardX + 2, ribbonY, cardW - 4, 0.7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...brandOrange);
    doc.text(c.title, cardX + 3, ribbonY + 4.4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...textDark);
    doc.text(c.subtitle, cardX + 3, ribbonY + 8.4);
  });

  // --- Clinical Sections Flow on Page 1 ---
  let curY = ribbonY + ribbonH + 6;

  // Section 1: Active Composition Card
  if (composition) {
    curY = drawSectionHeader("Active Pharmaceutical Composition", curY);
    const compLines = doc.splitTextToSize(composition, contentWidth - 8);
    const compCardH = Math.max(compLines.length * 3.8 + 7, 13);

    doc.setFillColor(241, 245, 249); // #F1F5F9
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, curY, contentWidth, compCardH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...brandOrange);
    doc.text("FORMULA / ACTIVE INGREDIENTS:", margin + 4, curY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...textDark);
    doc.text(compLines, margin + 4, curY + 9);

    curY += compCardH + 5.5;
  }

  // Section 2: Product Overview & Description
  if (description) {
    curY = drawSectionHeader("Product Overview & Clinical Profile", curY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...textBody);
    const descLines = doc.splitTextToSize(description, contentWidth);
    doc.text(descLines, margin, curY);
    curY += descLines.length * 3.8 + 5.5;
  }

  // Section 3: Indications & Therapeutic Usage
  if (indications && curY < 235) {
    curY = drawSectionHeader("Therapeutic Indications & Clinical Usage", curY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...textBody);
    const indLines = doc.splitTextToSize(indications, contentWidth);
    doc.text(indLines, margin, curY);
    curY += indLines.length * 3.8 + 5.5;
  }

  // Section 4: Dosage & Administration Guidelines
  if (dosageInstructions && curY < 255) {
    curY = drawSectionHeader("Dosage & Administration Guidelines", curY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...textBody);
    const doseLines = doc.splitTextToSize(dosageInstructions, contentWidth);
    doc.text(doseLines, margin, curY);
    curY += doseLines.length * 3.8 + 5.5;
  }

  // ==========================================
  // PAGE 2: GALLERY, SAFETY, CERTIFICATION & CONTACT
  // ==========================================
  doc.addPage();
  drawHeader(2);

  let page2Y = 35;

  // --- Uploaded Images Gallery Strip ---
  if (secondaryImages.length > 0) {
    page2Y = drawSectionHeader("Approved Packaging & Product Gallery", page2Y);

    const galleryCount = Math.min(secondaryImages.length, 3);
    const galGap = 4;
    const galCardW = (contentWidth - galGap * (galleryCount - 1)) / galleryCount;
    const galCardH = 44;

    for (let i = 0; i < galleryCount; i++) {
      const gImg = secondaryImages[i];
      const gX = margin + i * (galCardW + galGap);

      // Card frame
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...borderCard);
      doc.setLineWidth(0.3);
      doc.roundedRect(gX, page2Y, galCardW, galCardH, 2, 2, "FD");

      // Draw image
      drawImageContained(doc, gImg, gX + 2, page2Y + 2, galCardW - 4, galCardH - 8);

      // Micro caption
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(...textMuted);
      doc.text(`View ${i + 2}: Packaging & Detail`, gX + galCardW / 2, page2Y + galCardH - 2.5, {
        align: "center",
      });
    }

    page2Y += galCardH + 6;
  }

  // Safety & Warnings Alert Box
  if (precautions) {
    const alertBoxW = contentWidth;
    const precLines = doc.splitTextToSize(precautions, alertBoxW - 14);
    const alertBoxH = Math.max(precLines.length * 3.8 + 10, 18);

    doc.setFillColor(255, 251, 235); // #FFFBEB (amber-50)
    doc.setDrawColor(253, 230, 138); // #FDE68A
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, page2Y, alertBoxW, alertBoxH, 2, 2, "FD");

    // Left Amber Accent Stripe
    doc.setFillColor(217, 119, 6); // #D97706
    doc.rect(margin, page2Y, 2.5, alertBoxH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(180, 83, 9); // #B45309
    doc.text("PRESCRIPTION SCHEDULE H1 & SAFETY PRECAUTIONS", margin + 6, page2Y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...textDark);
    doc.text(precLines, margin + 6, page2Y + 9.5);

    page2Y += alertBoxH + 5.5;
  }

  // Adverse Reactions / Side Effects
  if (sideEffects) {
    page2Y = drawSectionHeader("Adverse Reactions & Clinical Safety Profile", page2Y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...textBody);
    const sideLines = doc.splitTextToSize(sideEffects, contentWidth);
    doc.text(sideLines, margin, page2Y);
    page2Y += sideLines.length * 3.8 + 5.5;
  }

  // Key Product Features & Formulation Advantages
  if (product.features && product.features.length > 0) {
    page2Y = drawSectionHeader("Key Formulation Features & Highlights", page2Y);

    const validFeatures = product.features
      .filter((f) => !f.toLowerCase().includes("price"))
      .map((f) => decodeHtmlEntities(f));

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.4);
    doc.setTextColor(...textDark);

    // Two column bullet layout
    const colW = (contentWidth - 6) / 2;
    validFeatures.forEach((feat, idx) => {
      const isRightCol = idx % 2 === 1;
      const fX = isRightCol ? margin + colW + 6 : margin;
      const fY = page2Y + Math.floor(idx / 2) * 4.8;

      doc.setFillColor(...brandGreen);
      doc.circle(fX + 1.5, fY - 1, 0.75, "F");
      doc.text(feat, fX + 4.5, fY);
    });

    page2Y += Math.ceil(validFeatures.length / 2) * 4.8 + 6;
  }

  // Quality Assurance Statement Box
  const qaCardH = 25;
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, page2Y, contentWidth, qaCardH, 2.5, 2.5, "FD");

  // Left Green Accent Stripe
  doc.setFillColor(...brandGreen);
  doc.rect(margin, page2Y, 2.5, qaCardH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(...brandGreen);
  doc.text("MANUFACTURED UNDER STRICT SCHEDULE M / GMP COMPLIANCE", margin + 6, page2Y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.0);
  doc.setTextColor(...textDark);
  const certText =
    "Aster Medicines Pvt. Ltd. certifies that this drug formulation complies with current Good Manufacturing Practices (cGMP) and pharmacopoeial specifications (IP/BP/USP). Every batch undergoes mandatory physical, chemical, and microbiological assay testing prior to clinical distribution.";
  const certLines = doc.splitTextToSize(certText, contentWidth - 12);
  doc.text(certLines, margin + 6, page2Y + 9.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...brandNavy);
  doc.text("Certified Quality Assurance Division · Aster Medicines Pvt. Ltd.", margin + 6, page2Y + 21);

  page2Y += qaCardH + 5;

  // Commercial & Order Desk Information Card
  const commCardH = 23;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderCard);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, page2Y, contentWidth, commCardH, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(...brandOrange);
  doc.text("COMMERCIAL INQUIRIES & INSTITUTIONAL SUPPLY", margin + 6, page2Y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.0);
  doc.setTextColor(...textDark);
  doc.text("Company: Aster Medicines Private Limited", margin + 6, page2Y + 9.5);
  doc.text("Corporate Office: Govind Mitra Road, Patna - 800004, Bihar, India", margin + 6, page2Y + 14);
  doc.text("Institutional Order Desk: +91 7061452180 · Email: contact@astermedicines.com · Web: www.astermedicines.com", margin + 6, page2Y + 18.5);

  // ==========================================
  // FOOTER ON ALL PAGES (CLEAN & NON-OVERLAPPING)
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = firstPage; i <= totalPages; i++) {
    doc.setPage(i);

    const footerY = pageHeight - 11;
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...textMuted);
    doc.text(
      "Aster Medicines Pvt. Ltd. · Official Specification Sheet · www.astermedicines.com",
      margin,
      footerY + 1
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Sheet ${i - firstPage + 1} of ${totalPages - firstPage + 1}`, pageWidth - margin, footerY + 1, { align: "right" });
  }

}

const CAT_PAGE_W = 210;
const CAT_PAGE_H = 297;
const CAT_MARGIN = 16;
const CAT_CONTENT_W = CAT_PAGE_W - CAT_MARGIN * 2; // 178mm

const CAT_COLORS = {
  orange: [234, 88, 12] as [number, number, number],       // #EA580C brand accent stripe
  orangeInk: [194, 65, 12] as [number, number, number],    // #C2410C burnt orange
  orangeSoft: [255, 247, 237] as [number, number, number], // #FFF7ED subtle warm badge
  orangeBorder: [254, 215, 170] as [number, number, number], // #FED7AA faint pill border
  navy: [15, 23, 42] as [number, number, number],          // #0F172A deep executive navy
  navyMid: [30, 41, 59] as [number, number, number],       // #1E293B dark slate
  body: [51, 65, 85] as [number, number, number],          // #334155 editorial body copy
  muted: [100, 116, 139] as [number, number, number],      // #64748B captions & metadata
  subtle: [148, 163, 184] as [number, number, number],     // #94A3B8 faint captions
  rule: [226, 232, 240] as [number, number, number],       // #E2E8F0 crisp hairlines
  ruleCard: [203, 213, 225] as [number, number, number],   // #CBD5E1 clean frame hairlines
  surface: [248, 250, 252] as [number, number, number],    // #F8FAFC neutral tint
  cream: [250, 250, 248] as [number, number, number],      // #FAFAF8 warm paper tint
  green: [4, 120, 87] as [number, number, number],         // #047857 medical emerald
  amberInk: [146, 64, 14] as [number, number, number],     // #92400E clinical caution ink
  amberBar: [217, 119, 6] as [number, number, number],     // #D97706 caution bar
  amberSoft: [255, 251, 235] as [number, number, number],  // #FFFBEB subtle caution wash
};

/**
 * Draw text with letter-spacing while honoring accurate left / center / right alignment.
 * (jsPDF computes right/center alignment before applying charSpace.)
 */
function drawTrackedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options: { align?: "left" | "center" | "right"; charSpace?: number } = {}
) {
  const cs = options.charSpace ?? 0;
  const align = options.align ?? "left";
  if (!cs || align === "left") {
    doc.text(text, x, y, options);
    return;
  }
  const totalW = doc.getTextWidth(text) + Math.max(0, text.length - 1) * cs;
  const drawX = align === "right" ? x - totalW : x - totalW / 2;
  doc.text(text, drawX, y, { charSpace: cs });
}

/**
 * Draw consistent running header on interior catalogue pages (Index & Product pages).
 */
function drawCatalogueRunningHeader(doc: jsPDF, rightTitle: string, rightSub: string) {
  // Subtle top brand accent bar
  doc.setFillColor(...CAT_COLORS.orange);
  doc.rect(0, 0, CAT_PAGE_W, 2.0, "F");

  // Crisp vector Aster logo
  drawVectorLogo(doc, CAT_MARGIN, 5.6, 21.5, false);

  // Vertical hairline separator
  doc.setDrawColor(...CAT_COLORS.ruleCard);
  doc.setLineWidth(0.25);
  doc.line(40.5, 6.8, 40.5, 15.6);

  // Brand label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...CAT_COLORS.navy);
  doc.text(COMPANY_CONTACT.name, 43.5, 10.6, { charSpace: 0.3 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...CAT_COLORS.muted);
  doc.text("Product Formulary & Catalogue", 43.5, 14.5);

  // Right-aligned locator
  const rightX = CAT_PAGE_W - CAT_MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...CAT_COLORS.orangeInk);
  const clippedRight = fitLines(doc, rightTitle, 52, 1)[0] || rightTitle;
  drawTrackedText(doc, clippedRight, rightX, 10.6, { align: "right", charSpace: 0.15 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.setTextColor(...CAT_COLORS.muted);
  doc.text(rightSub, rightX, 14.5, { align: "right" });

  // Clean bottom hairline divider
  doc.setDrawColor(...CAT_COLORS.rule);
  doc.setLineWidth(0.25);
  doc.line(CAT_MARGIN, 19.5, rightX, 19.5);
}

/**
 * Draw the Executive Brochure Cover Page (Page 1 of the Catalogue).
 */
function drawCatalogueCover(
  doc: jsPDF,
  productCount: number,
  categories: string[],
  issueDate: string
) {
  // Top Cream Header Panel (y = 0..76mm)
  doc.setFillColor(...CAT_COLORS.cream);
  doc.rect(0, 0, CAT_PAGE_W, 76, "F");

  // Top Orange Trim Strip
  doc.setFillColor(...CAT_COLORS.orange);
  doc.rect(0, 0, CAT_PAGE_W, 3.0, "F");

  // Full-color Vector Logo
  drawVectorLogo(doc, CAT_MARGIN, 20, 48, false);

  // Top-right corporate metadata
  const rightX = CAT_PAGE_W - CAT_MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...CAT_COLORS.navyMid);
  drawTrackedText(doc, "ESTABLISHED 1982  ·  INDIA", rightX, 26, { align: "right", charSpace: 0.45 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...CAT_COLORS.orangeInk);
  drawTrackedText(doc, "WHO-GMP & ISO 9001:2015 CERTIFIED", rightX, 31.2, { align: "right", charSpace: 0.3 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...CAT_COLORS.muted);
  doc.text(`CIN: ${COMPANY_CONTACT.cin}`, rightX, 36.2, { align: "right" });

  // Gold hairline accent separating white panel & navy ground
  doc.setFillColor(255, 205, 10);
  doc.rect(0, 75.3, CAT_PAGE_W, 0.7, "F");

  // Deep Navy Main Field (y = 76..297mm)
  doc.setFillColor(...CAT_COLORS.navy);
  doc.rect(0, 76, CAT_PAGE_W, 221, "F");

  // Subtle decorative Aster crescent arcs on top-right of dark canvas (clipped gracefully at page edge)
  doc.setFillColor(21, 32, 56);
  doc.ellipse(202, 134, 64, 78, "F");
  doc.setFillColor(26, 40, 70);
  doc.ellipse(207, 132, 56, 68, "F");
  doc.setFillColor(...CAT_COLORS.navy);
  doc.ellipse(213, 130, 52, 63, "F");
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.35);
  doc.ellipse(214, 130, 51, 62, "S");

  // Warm accent bar & company kicker
  doc.setFillColor(...CAT_COLORS.orange);
  doc.rect(CAT_MARGIN, 104, 14, 1.0, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(253, 186, 116); // soft orange gold
  doc.text("ASTER MEDICINES PRIVATE LIMITED", CAT_MARGIN, 111.5, { charSpace: 0.65 });

  // Display Serif Cover Title
  doc.setFont("times", "normal");
  doc.setFontSize(44);
  doc.setTextColor(255, 255, 255);
  doc.text("Product", CAT_MARGIN - 0.5, 133);
  doc.text("Catalogue", CAT_MARGIN - 0.5, 150);

  // Editorial Lead Paragraph
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Comprehensive Formulary of Sterile Parenteral Injections, Critical Care & General Pharmaceutical Formulations.",
    CAT_MARGIN,
    165,
    { maxWidth: 126, lineHeightFactor: 1.45 }
  );

  // Portfolio Overview Metrics Band
  const bandY = 191;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(CAT_MARGIN, bandY, rightX, bandY);
  doc.line(CAT_MARGIN, bandY + 24, rightX, bandY + 24);

  const metrics = [
    { val: String(productCount), label: "ACTIVE FORMULATIONS", accent: true },
    { val: String(categories.length), label: "THERAPEUTIC CATEGORIES", accent: false },
    { val: "GMP / ISO", label: "MANUFACTURING STANDARD", accent: false },
  ];

  const mColW = CAT_CONTENT_W / 3;
  metrics.forEach((m, idx) => {
    const mx = CAT_MARGIN + idx * mColW;
    if (idx > 0) {
      doc.setDrawColor(51, 65, 85);
      doc.line(mx - 4, bandY + 4, mx - 4, bandY + 20);
    }
    doc.setFont("times", "bold");
    doc.setFontSize(19);
    if (m.accent) {
      doc.setTextColor(255, 205, 10);
    } else {
      doc.setTextColor(255, 255, 255);
    }
    doc.text(m.val, mx, bandY + 11.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(m.label, mx, bandY + 17.5, { charSpace: 0.4 });
  });

  // Categories Preview List
  const shownCats = categories.slice(0, 6);
  const catPreview =
    shownCats.join("   ·   ") +
    (categories.length > 6 ? `   ·   +${categories.length - 6} More` : "");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`THERAPEUTIC SCOPE:  ${catPreview}`, CAT_MARGIN, bandY + 32.5, {
    maxWidth: CAT_CONTENT_W,
    lineHeightFactor: 1.45,
  });

  // Cover Footer Directory
  const cFootY = 248;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(CAT_MARGIN, cFootY, rightX, cFootY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4);
  doc.setTextColor(253, 186, 116);
  doc.text("CORPORATE & MANUFACTURING", CAT_MARGIN, cFootY + 7.5, { charSpace: 0.4 });
  drawTrackedText(doc, "INSTITUTIONAL ENQUIRIES", rightX, cFootY + 7.5, { align: "right", charSpace: 0.4 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`Regd. Office: ${COMPANY_CONTACT.office}`, CAT_MARGIN, cFootY + 13.5, { maxWidth: 102 });
  doc.text(`Manufacturing Plant: ${COMPANY_CONTACT.factory}`, CAT_MARGIN, cFootY + 22, { maxWidth: 102 });

  doc.setTextColor(255, 255, 255);
  doc.textWithLink(COMPANY_CONTACT.web, rightX, cFootY + 13.5, {
    align: "right",
    url: `https://${COMPANY_CONTACT.web}`,
  });
  doc.setTextColor(203, 213, 225);
  doc.text(`${COMPANY_CONTACT.email}  ·  ${COMPANY_CONTACT.phone}`, rightX, cFootY + 18.8, {
    align: "right",
  });
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(`Edition: ${issueDate}`, rightX, cFootY + 24.5, { align: "right" });
}

/**
 * Clean 1-Page-Per-Product layout for the full Aster Medicines Product Catalogue.
 * Editorial Swiss-medical design featuring company header, up to 2 crisp product photos, and zero box clutter.
 */
async function drawCatalogueProductPage(doc: jsPDF, product: Product) {
  // Sanitize & Decode strings
  const name = decodeHtmlEntities(product.name);
  const category = decodeHtmlEntities(product.category) || "Pharmaceutical Formulation";
  const dosage = extractCleanDosage(product.dosage, name);
  const rawComposition = decodeHtmlEntities(product.composition);
  const hasRealComposition = !isGenericPlaceholder(rawComposition);
  const composition = hasRealComposition
    ? rawComposition
    : "Detailed active ingredient formula available upon request / printed on product packaging.";

  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const rawIndications = decodeHtmlEntities(product.indications);
  const rawDosageInstr = decodeHtmlEntities(product.dosageInstructions || product.dosage);
  const rawPrecautions = decodeHtmlEntities(product.precautions);
  const rawSideEffects = decodeHtmlEntities(product.sideEffects);

  const storage =
    decodeHtmlEntities(product.storageConditions) || "Store below 25°C, dry place";
  const shelfLife =
    decodeHtmlEntities(product.shelfLife) || "24 - 36 Months";

  const productCode = (product.id ? String(product.id) : "ASTER")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase();

  // Load up to 2 images sized cleanly for 300-DPI A4 catalogue cards (850px maxDim keeps multi-page file light & fast)
  const imageUrls = (product.images || []).slice(0, 2);
  const loadedResults = await Promise.allSettled(
    imageUrls.map((url) => loadImageAsDataUrl(url, 4500, 850, 0.86))
  );
  const images = loadedResults
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((img): img is LoadedImage => img !== null);

  // ==========================================
  // 1. RUNNING HEADER
  // ==========================================
  drawCatalogueRunningHeader(doc, category.toUpperCase(), `REF: AM-${productCode}`);

  // ==========================================
  // 2. CATEGORY KICKER, BADGES & DISPLAY TITLE
  // ==========================================
  let curY = 25;

  // Quiet compliance indicators (right-aligned, crisp emerald dot + clean text)
  const badgeLabels = ["GMP Certified", "Quality Assured"];
  if (product.isWhoApproved) badgeLabels.push("WHO Approved");

  let badgeRightX = CAT_PAGE_W - CAT_MARGIN;
  for (let i = badgeLabels.length - 1; i >= 0; i--) {
    const label = badgeLabels[i];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    const labelW = doc.getTextWidth(label);
    const itemX = badgeRightX - labelW;

    doc.setTextColor(...CAT_COLORS.green);
    doc.text(label, itemX, curY + 3.4);

    doc.setFillColor(...CAT_COLORS.green);
    doc.circle(itemX - 2.2, curY + 2.4, 0.75, "F");

    badgeRightX = itemX - 6.5;
  }

  // Soft category badge on the left
  const maxCatW = Math.max(badgeRightX - CAT_MARGIN - 4, 52);
  const catText = category.toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  const catFits = fitLines(doc, catText, maxCatW - 7, 1)[0] || catText;
  const catWidth = Math.min(doc.getTextWidth(catFits) + 7, maxCatW);
  doc.setFillColor(...CAT_COLORS.orangeSoft);
  doc.setDrawColor(...CAT_COLORS.orangeBorder);
  doc.setLineWidth(0.2);
  doc.roundedRect(CAT_MARGIN, curY, catWidth, 4.9, 1.3, 1.3, "FD");
  doc.setTextColor(...CAT_COLORS.orangeInk);
  doc.text(catFits, CAT_MARGIN + 3.5, curY + 3.4);

  curY += 10.5;

  // Editorial Serif Product Title (adaptive sizing for 1 vs 2 lines)
  doc.setFont("times", "bold");
  let titleSize = 18.5;
  doc.setFontSize(titleSize);
  let nameLines: string[] = doc.splitTextToSize(name, CAT_CONTENT_W);
  if (nameLines.length > 1) {
    titleSize = 15.5;
    doc.setFontSize(titleSize);
    nameLines = fitLines(doc, name, CAT_CONTENT_W, 2);
  }
  doc.setTextColor(...CAT_COLORS.navy);
  doc.text(nameLines, CAT_MARGIN - 0.3, curY);
  const titleLineH = titleSize >= 18 ? 6.2 : 5.4;
  curY += (nameLines.length - 1) * titleLineH + 5.2;

  // ==========================================
  // 3. TWO-PICTURE CLEAN GALLERY SHOWCASE
  // ==========================================
  const frameH = nameLines.length > 1 ? 68 : 72;
  const rightEdge = CAT_PAGE_W - CAT_MARGIN;

  const drawGalleryFrame = (
    fX: number,
    fY: number,
    fW: number,
    fH: number,
    img: LoadedImage | null,
    caption: string
  ) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...CAT_COLORS.ruleCard);
    doc.setLineWidth(0.25);
    doc.roundedRect(fX, fY, fW, fH, 2.2, 2.2, "FD");

    if (img) {
      drawImageContained(doc, img, fX + 2, fY + 2, fW - 4, fH - 10);
    } else {
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...CAT_COLORS.orangeInk);
      doc.text("ASTER MEDICINES", fX + fW / 2, fY + fH / 2 - 4, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.4);
      doc.setTextColor(...CAT_COLORS.muted);
      doc.text("Pharmaceutical Grade Packaging", fX + fW / 2, fY + fH / 2 + 2.5, { align: "center" });
    }

    // Museum-mat bottom hairline & centered micro-caption
    const lineY = fY + fH - 6.8;
    doc.setDrawColor(...CAT_COLORS.rule);
    doc.setLineWidth(0.2);
    doc.line(fX + 6, lineY, fX + fW - 6, lineY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.8);
    doc.setTextColor(...CAT_COLORS.muted);
    drawTrackedText(doc, caption, fX + fW / 2, fY + fH - 2.5, { align: "center", charSpace: 0.3 });
  };

  if (images.length >= 2) {
    const gap = 6;
    const frameW = (CAT_CONTENT_W - gap) / 2; // 86mm each
    drawGalleryFrame(CAT_MARGIN, curY, frameW, frameH, images[0], "01  ·  PRIMARY PRESENTATION");
    drawGalleryFrame(CAT_MARGIN + frameW + gap, curY, frameW, frameH, images[1], "02  ·  PACKAGING DETAIL");
  } else if (images.length === 1) {
    const frameW = 122;
    const fX = CAT_MARGIN + (CAT_CONTENT_W - frameW) / 2;
    drawGalleryFrame(fX, curY, frameW, frameH, images[0], "01  ·  PRODUCT PRESENTATION");
  } else {
    const frameW = 122;
    const fX = CAT_MARGIN + (CAT_CONTENT_W - frameW) / 2;
    drawGalleryFrame(fX, curY, frameW, frameH, null, "PHARMACEUTICAL SPECIFICATION");
  }

  curY += frameH + 5;

  // ==========================================
  // 4. CLEAN 4-COLUMN RULED SPEC TABLE
  // ==========================================
  const specH = 16;
  doc.setFillColor(...CAT_COLORS.cream);
  doc.rect(CAT_MARGIN, curY, CAT_CONTENT_W, specH, "F");

  doc.setDrawColor(...CAT_COLORS.rule);
  doc.setLineWidth(0.25);
  doc.line(CAT_MARGIN, curY, rightEdge, curY);
  doc.line(CAT_MARGIN, curY + specH, rightEdge, curY + specH);

  const specCols = [
    { label: "STRENGTH / PACK", val: dosage },
    { label: "THERAPEUTIC CLASS", val: category },
    { label: "SHELF LIFE", val: shelfLife },
    { label: "STORAGE CONDITION", val: storage },
  ];
  const specColW = CAT_CONTENT_W / 4; // 44.5mm each

  specCols.forEach((col, idx) => {
    const cx = CAT_MARGIN + idx * specColW;
    if (idx > 0) {
      doc.setDrawColor(...CAT_COLORS.rule);
      doc.setLineWidth(0.2);
      doc.line(cx, curY + 3, cx, curY + specH - 3);
    }
    const padX = idx === 0 ? 2.5 : 3.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.9);
    doc.setTextColor(...CAT_COLORS.orangeInk);
    doc.text(col.label, cx + padX, curY + 5, { charSpace: 0.25 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.6);
    doc.setTextColor(...CAT_COLORS.navy);
    const valLines = fitLines(doc, col.val, specColW - padX - 2.5, 2);
    doc.text(valLines, cx + padX, curY + 9.6, { lineHeightFactor: 1.18 });
  });

  curY += specH + 6.5;

  // Helper for crisp architectural section headings (baseline at y+2.8, content begins cleanly at y+7.4 -> ~2mm clear air)
  const drawEditorialHeading = (title: string, x: number, y: number) => {
    doc.setFillColor(...CAT_COLORS.orange);
    doc.rect(x, y, 1.8, 3.3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.7);
    doc.setTextColor(...CAT_COLORS.navy);
    doc.text(title.toUpperCase(), x + 3.8, y + 2.8, { charSpace: 0.3 });
    return y + 7.4;
  };

  // ==========================================
  // 5. ACTIVE COMPOSITION HIGHLIGHT BAND
  // ==========================================
  if (hasRealComposition) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    const compLines = fitLines(doc, composition, CAT_CONTENT_W - 10, 3);
    const compBandH = Math.max(compLines.length * 4.2 + 9.5, 14.5);

    doc.setFillColor(...CAT_COLORS.surface);
    doc.rect(CAT_MARGIN, curY, CAT_CONTENT_W, compBandH, "F");
    doc.setFillColor(...CAT_COLORS.orange);
    doc.rect(CAT_MARGIN, curY, 1.5, compBandH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.6);
    doc.setTextColor(...CAT_COLORS.orangeInk);
    doc.text("ACTIVE PHARMACEUTICAL COMPOSITION", CAT_MARGIN + 4.5, curY + 4.8, { charSpace: 0.3 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(...CAT_COLORS.navy);
    doc.text(compLines, CAT_MARGIN + 4.5, curY + 9.8, { lineHeightFactor: 1.38 });

    curY += compBandH + 6;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.7);
    doc.setTextColor(...CAT_COLORS.orangeInk);
    doc.text("ACTIVE COMPOSITION:", CAT_MARGIN, curY + 2.5, { charSpace: 0.25 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(...CAT_COLORS.muted);
    doc.text(composition, CAT_MARGIN + 34, curY + 2.5);
    curY += 7.5;
  }

  // ==========================================
  // 6. PRODUCT OVERVIEW
  // ==========================================
  if (description && curY < 210) {
    curY = drawEditorialHeading("Product Overview & Clinical Profile", CAT_MARGIN, curY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.3);
    doc.setTextColor(...CAT_COLORS.body);
    const descLines = fitLines(doc, description, CAT_CONTENT_W, 4);
    doc.text(descLines, CAT_MARGIN, curY, { lineHeightFactor: 1.42 });
    curY += descLines.length * 4.2 + 3;

    doc.setDrawColor(...CAT_COLORS.rule);
    doc.setLineWidth(0.2);
    doc.line(CAT_MARGIN, curY, rightEdge, curY);
    curY += 5.5;
  }

  // ==========================================
  // 7. CLEAN 2-COLUMN CLINICAL GRID
  // ==========================================
  const gridColGap = 8;
  const colW = (CAT_CONTENT_W - gridColGap) / 2; // 85mm
  const leftX = CAT_MARGIN;
  const rightX = CAT_MARGIN + colW + gridColGap;
  const dividerX = CAT_MARGIN + colW + gridColGap / 2;
  const maxGridY = 254;
  const gridStartY = curY;

  let leftY = curY;
  let rightY = curY;

  const cleanIndications = isGenericPlaceholder(rawIndications)
    ? "For therapeutic use as directed by a registered medical practitioner."
    : rawIndications;

  if (cleanIndications && leftY + 15 < maxGridY) {
    leftY = drawEditorialHeading("Indications & Usage", leftX, leftY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.9);
    doc.setTextColor(...CAT_COLORS.body);
    const indLines = fitLines(doc, cleanIndications, colW, 5);
    doc.text(indLines, leftX, leftY, { lineHeightFactor: 1.42 });
    leftY += indLines.length * 4.0 + 5;
  }

  if (rawDosageInstr && leftY + 15 < maxGridY) {
    leftY = drawEditorialHeading("Dosage & Administration", leftX, leftY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.9);
    doc.setTextColor(...CAT_COLORS.body);
    const doseLines = fitLines(doc, rawDosageInstr, colW, 4);
    doc.text(doseLines, leftX, leftY, { lineHeightFactor: 1.42 });
    leftY += doseLines.length * 4.0 + 4;
  }

  // Clean filtered highlights (excluding redundant Price / Category tags)
  const validFeatures = (product.features || [])
    .map((f) => decodeHtmlEntities(f))
    .filter(
      (f) =>
        f &&
        !f.toLowerCase().startsWith("price:") &&
        !f.toLowerCase().startsWith("category:")
    )
    .slice(0, 6);

  if (rawPrecautions && rightY + 18 < maxGridY) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    const precLines = fitLines(doc, rawPrecautions, colW - 8, 5);
    const alertH = Math.max(precLines.length * 3.85 + 9.5, 16.5);

    doc.setFillColor(...CAT_COLORS.amberSoft);
    doc.rect(rightX, rightY, colW, alertH, "F");

    doc.setFillColor(...CAT_COLORS.amberBar);
    doc.rect(rightX, rightY, 1.3, alertH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...CAT_COLORS.amberInk);
    doc.text("PRECAUTIONS & WARNINGS", rightX + 4, rightY + 4.8, { charSpace: 0.3 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...CAT_COLORS.navyMid);
    doc.text(precLines, rightX + 4, rightY + 9.4, { lineHeightFactor: 1.38 });

    rightY += alertH + 5.5;
  }

  if (rawSideEffects && !isGenericPlaceholder(rawSideEffects) && rightY + 15 < maxGridY) {
    rightY = drawEditorialHeading("Safety & Adverse Effects", rightX, rightY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.9);
    doc.setTextColor(...CAT_COLORS.body);
    const sideLines = fitLines(doc, rawSideEffects, colW, 4);
    doc.text(sideLines, rightX, rightY, { lineHeightFactor: 1.42 });
    rightY += sideLines.length * 4.0 + 4.5;
  }

  if (validFeatures.length > 0 && rightY + 14 < maxGridY) {
    rightY = drawEditorialHeading("Formulation Highlights", rightX, rightY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.7);
    doc.setTextColor(...CAT_COLORS.navyMid);
    for (const feat of validFeatures.slice(0, 4)) {
      if (rightY + 4.5 > maxGridY) break;
      doc.setFillColor(...CAT_COLORS.green);
      doc.circle(rightX + 1.5, rightY - 1, 0.75, "F");
      doc.text(fitLines(doc, feat, colW - 5, 1)[0] || feat, rightX + 4.4, rightY);
      rightY += 4.6;
    }
  }

  // Draw crisp vertical center rule spanning the actual grid height
  const gridEndY = Math.max(leftY, rightY) - 1;
  if (gridEndY > gridStartY + 8) {
    doc.setDrawColor(...CAT_COLORS.rule);
    doc.setLineWidth(0.2);
    doc.line(dividerX, gridStartY, dividerX, Math.min(gridEndY, maxGridY));
  }

  // ==========================================
  // 8. QUIET QUALITY & SUPPLY ANCHOR STRIP (y = 257..273mm)
  // ==========================================
  const anchorY = 258;
  const anchorH = 14.5;
  doc.setFillColor(...CAT_COLORS.cream);
  doc.rect(CAT_MARGIN, anchorY, CAT_CONTENT_W, anchorH, "F");

  doc.setDrawColor(...CAT_COLORS.rule);
  doc.setLineWidth(0.22);
  doc.line(CAT_MARGIN, anchorY, rightEdge, anchorY);
  doc.line(CAT_MARGIN, anchorY + anchorH, rightEdge, anchorY + anchorH);

  doc.setFillColor(...CAT_COLORS.green);
  doc.rect(CAT_MARGIN, anchorY, 1.4, anchorH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4);
  doc.setTextColor(...CAT_COLORS.green);
  doc.text("QUALITY COMPLIANCE", CAT_MARGIN + 4, anchorY + 4.8, { charSpace: 0.3 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.0);
  doc.setTextColor(...CAT_COLORS.body);
  doc.text(
    "Manufactured under Schedule M & WHO-GMP norms. Batch CoA provided on supply.",
    CAT_MARGIN + 4,
    anchorY + 9.8
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4);
  doc.setTextColor(...CAT_COLORS.orangeInk);
  drawTrackedText(doc, "INSTITUTIONAL & PCD DESK", rightEdge - 3, anchorY + 4.8, {
    align: "right",
    charSpace: 0.3,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.0);
  doc.setTextColor(...CAT_COLORS.navy);
  doc.text(
    `${COMPANY_CONTACT.phone}  ·  ${COMPANY_CONTACT.email}`,
    rightEdge - 3,
    anchorY + 9.8,
    { align: "right" }
  );
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

  const sorted = [...products].sort(
    (a, b) =>
      decodeHtmlEntities(a.category).localeCompare(decodeHtmlEntities(b.category)) ||
      decodeHtmlEntities(a.name).localeCompare(decodeHtmlEntities(b.name))
  );

  const uniqueCategories = Array.from(
    new Set(sorted.map((p) => decodeHtmlEntities(p.category) || "General Formulations"))
  );

  const issueDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: "Aster Medicines Product Catalogue",
    subject: "Pharmaceutical Product Formulary & Specifications",
    author: "Aster Medicines Pvt. Ltd.",
  });

  // ==========================================
  // PAGE 1: ARCHITECTURAL BROCHURE COVER
  // ==========================================
  drawCatalogueCover(doc, sorted.length, uniqueCategories, issueDate);

  // ==========================================
  // PAGE 2+: 2-COLUMN ORGANIZED PRODUCT INDEX
  // ==========================================
  interface IndexEntry {
    page: number;
    numX: number;
    y: number;
    linkX: number;
    linkW: number;
    height: number;
  }

  const entries: IndexEntry[] = [];
  const idxColGap = 8;
  const idxColW = (CAT_CONTENT_W - idxColGap) / 2; // 85mm
  const idxColX = [CAT_MARGIN, CAT_MARGIN + idxColW + idxColGap];
  const idxMaxY = 272;

  let col = 0;
  let y = 999; // forces initial Index page creation
  let previousCategory = "";
  let indexPagesCount = 0;

  const startNewIndexPage = (continued: boolean) => {
    doc.addPage();
    indexPagesCount += 1;
    drawCatalogueRunningHeader(
      doc,
      "PRODUCT INDEX",
      continued ? "FORMULARY DIRECTORY (CONTD.)" : "FORMULARY DIRECTORY"
    );

    if (!continued) {
      doc.setFont("times", "normal");
      doc.setFontSize(22);
      doc.setTextColor(...CAT_COLORS.navy);
      doc.text("Product Index", CAT_MARGIN - 0.3, 31.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      doc.setTextColor(...CAT_COLORS.muted);
      doc.text(
        `${sorted.length} Formulations  ·  ${uniqueCategories.length} Categories`,
        CAT_PAGE_W - CAT_MARGIN,
        31.5,
        { align: "right" }
      );

      doc.setDrawColor(...CAT_COLORS.rule);
      doc.setLineWidth(0.25);
      doc.line(CAT_MARGIN, 36.5, CAT_PAGE_W - CAT_MARGIN, 36.5);
      y = 43.5;
    } else {
      doc.setFont("times", "normal");
      doc.setFontSize(16);
      doc.setTextColor(...CAT_COLORS.navy);
      doc.text("Product Index (Continued)", CAT_MARGIN - 0.3, 29.5);

      doc.setDrawColor(...CAT_COLORS.rule);
      doc.setLineWidth(0.25);
      doc.line(CAT_MARGIN, 33.5, CAT_PAGE_W - CAT_MARGIN, 33.5);
      y = 40;
    }

    col = 0;
    previousCategory = "";
  };

  const advanceColumnOrPage = (categoryToRepeat?: string) => {
    if (col === 0) {
      col = 1;
      y = indexPagesCount === 1 ? 43.5 : 40;
      previousCategory = categoryToRepeat ? "" : previousCategory;
    } else {
      startNewIndexPage(true);
    }
  };

  const drawCategoryHeaderInIndex = (catLabel: string) => {
    const cx = idxColX[col];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.1);
    const catLines: string[] = doc.splitTextToSize(catLabel.toUpperCase(), idxColW - 4);
    const h = catLines.length * 3.4 + 3.5;

    doc.setFillColor(...CAT_COLORS.orange);
    doc.rect(cx, y - 2.4, 1.5, 2.8, "F");

    doc.setTextColor(...CAT_COLORS.orangeInk);
    doc.text(catLines, cx + 3.4, y, { charSpace: 0.3 });

    const ruleY = y + (catLines.length - 1) * 3.4 + 2.0;
    doc.setDrawColor(...CAT_COLORS.rule);
    doc.setLineWidth(0.2);
    doc.line(cx, ruleY, cx + idxColW, ruleY);

    y += h + 2.2;
  };

  for (const product of sorted) {
    const category = decodeHtmlEntities(product.category) || "General Formulations";
    const prodName = decodeHtmlEntities(product.name);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.3);
    const lines: string[] = doc.splitTextToSize(prodName, idxColW - 12);
    const itemHeight = lines.length * 3.7 + 2.6;

    const needsCatHeader = category !== previousCategory;
    const neededHeight = (needsCatHeader ? 12 : 0) + itemHeight;

    if (y > idxMaxY || y + neededHeight > idxMaxY) {
      if (indexPagesCount === 0) {
        startNewIndexPage(false);
      } else {
        advanceColumnOrPage();
      }
    }

    if (category !== previousCategory) {
      if (y > (indexPagesCount === 1 && col <= 1 ? 46 : 42)) {
        y += 2.2;
      }
      drawCategoryHeaderInIndex(category);
      previousCategory = category;
    }

    const cx = idxColX[col];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.3);
    doc.setTextColor(...CAT_COLORS.navyMid);
    doc.text(lines, cx + 1, y, { lineHeightFactor: 1.25 });

    // Subtle hairline separator under each item
    const sepY = y + (lines.length - 1) * 3.7 + 2.0;
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.15);
    doc.line(cx + 1, sepY, cx + idxColW, sepY);

    entries.push({
      page: doc.getNumberOfPages(),
      numX: cx + idxColW,
      y,
      linkX: cx,
      linkW: idxColW,
      height: itemHeight,
    });

    y += itemHeight;
  }

  // Subtle divider between column 1 and column 2 on every Index page
  const indexStartPage = 2;
  const indexEndPage = doc.getNumberOfPages();
  for (let p = indexStartPage; p <= indexEndPage; p++) {
    doc.setPage(p);
    const colTop = p === indexStartPage ? 42 : 38;
    doc.setDrawColor(...CAT_COLORS.rule);
    doc.setLineWidth(0.2);
    doc.line(CAT_MARGIN + idxColW + idxColGap / 2, colTop, CAT_MARGIN + idxColW + idxColGap / 2, idxMaxY);
  }

  doc.setPage(indexEndPage);

  // ==========================================
  // PRODUCT PAGES: 1 PAGE PER PRODUCT WITH 2 IMAGES
  // ==========================================
  for (const [index, product] of sorted.entries()) {
    onProgress(index + 1, sorted.length);
    doc.addPage();
    const destination = doc.getNumberOfPages();
    await drawCatalogueProductPage(doc, product);

    const entry = entries[index];
    doc.setPage(entry.page);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.2);
    doc.setTextColor(...CAT_COLORS.navy);
    doc.text(String(destination), entry.numX, entry.y, { align: "right" });
    doc.link(entry.linkX, entry.y - 3.2, entry.linkW, entry.height, {
      pageNumber: destination,
    });
    doc.setPage(doc.getNumberOfPages());
  }

  // ==========================================
  // UNIFIED RUNNING FOOTER ACROSS INTERIOR PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    const footerY = CAT_PAGE_H - 12;

    doc.setDrawColor(...CAT_COLORS.rule);
    doc.setLineWidth(0.25);
    doc.line(CAT_MARGIN, footerY - 3.5, CAT_PAGE_W - CAT_MARGIN, footerY - 3.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...CAT_COLORS.muted);
    doc.text(
      `Aster Medicines Pvt. Ltd.  ·  WHO-GMP Certified  ·  ${COMPANY_CONTACT.web}  ·  ${COMPANY_CONTACT.phone}`,
      CAT_MARGIN,
      footerY + 0.5
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.9);
    doc.setTextColor(...CAT_COLORS.navy);
    doc.text(`Page ${p} of ${totalPages}`, CAT_PAGE_W - CAT_MARGIN, footerY + 0.5, {
      align: "right",
    });
  }

  doc.save("Aster-Product-Catalogue.pdf");
}
