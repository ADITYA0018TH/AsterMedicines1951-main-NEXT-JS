"use client";

import { jsPDF } from "jspdf";
import { Product } from "@/types/product";
import { LOGO_BASE64 } from "./logoBase64";

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
  timeoutMs: number = 5000
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

          // Limit canvas size to max 1200px to maintain crisp quality while keeping PDF fast
          const maxDim = 1200;
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

          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
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

/**
 * Compact 1-Page-Per-Product layout for the full Aster Medicines Product Catalogue.
 * Displays company header, up to 2 product images side-by-side, and structured clinical specs on a single A4 page.
 */
async function drawCatalogueProductPage(doc: jsPDF, product: Product, pageNumber: number) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Brand Colors
  const brandOrange: [number, number, number] = [234, 88, 12];
  const brandNavy: [number, number, number] = [15, 23, 42];
  const textDark: [number, number, number] = [30, 41, 59];
  const textBody: [number, number, number] = [51, 65, 85];
  const textMuted: [number, number, number] = [100, 116, 139];
  const borderLight: [number, number, number] = [226, 232, 240];
  const borderCard: [number, number, number] = [203, 213, 225];
  const bgCard: [number, number, number] = [248, 250, 252];
  const brandGreen: [number, number, number] = [5, 150, 105];

  // Sanitize & Decode strings
  const name = decodeHtmlEntities(product.name);
  const category = decodeHtmlEntities(product.category) || "Pharmaceutical Formulation";

  let dosage = decodeHtmlEntities(product.dosage);
  if (!dosage || dosage.toLowerCase().includes("available") || dosage.toLowerCase().includes("unit")) {
    const strengthMatch = name.match(/(\d+(?:\.\d+)?\s*(?:gm|g|mg|mcg|ml|%)\b)/i);
    dosage = strengthMatch ? strengthMatch[0] : "As directed by physician";
  }

  const composition = decodeHtmlEntities(product.composition);
  const description = decodeHtmlEntities(product.detailedDescription || product.description);
  const indications = decodeHtmlEntities(product.indications);
  const dosageInstructions = decodeHtmlEntities(product.dosageInstructions || product.dosage);
  const precautions = decodeHtmlEntities(product.precautions);
  const sideEffects = decodeHtmlEntities(product.sideEffects);
  const storage = decodeHtmlEntities(product.storageConditions) || "Store below 25°C, dry place";
  const shelfLife = decodeHtmlEntities(product.shelfLife) || "24 - 36 Months";

  const productCode = (product.id ? String(product.id) : "ASTER")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase();
  const dateFormatted = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Load up to 2 images for the product
  const imageUrls = (product.images || []).slice(0, 2);
  const loadedResults = await Promise.allSettled(
    imageUrls.map((url) => loadImageAsDataUrl(url, 4500))
  );
  const images = loadedResults
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((img): img is LoadedImage => img !== null);

  // ==========================================
  // 1. HEADER
  // ==========================================
  doc.setFillColor(...brandOrange);
  doc.rect(0, 0, pageWidth, 3.5, "F");
  doc.setFillColor(...brandNavy);
  doc.rect(0, 3.5, pageWidth, 0.8, "F");

  try {
    doc.addImage(LOGO_BASE64, "PNG", margin, 7.5, 36, 21);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...brandOrange);
    doc.text("ASTER MEDICINES", margin, 18);
  }

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

  const metaBoxW = 56;
  const metaBoxX = pageWidth - margin - metaBoxW;
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(metaBoxX, 7.5, metaBoxW, 20, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...brandOrange);
  doc.text("PRODUCT CATALOGUE", metaBoxX + 4, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...textMuted);
  doc.text("OFFICIAL PRODUCT SHEET", metaBoxX + 4, 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandNavy);
  doc.text(`DOC REF: AM-${productCode}`, metaBoxX + 4, 20);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text(`DATE: ${dateFormatted}`, metaBoxX + 4, 24);

  doc.setDrawColor(...borderLight);
  doc.line(margin, 30.5, pageWidth - margin, 30.5);

  // ==========================================
  // 2. CATEGORY, BADGES & PRODUCT TITLE
  // ==========================================
  let curY = 33.5;

  // Verification Badges (right-aligned so they never collide with category pill)
  const badgeLabels = ["GMP Certified", "Quality Assured"];
  if (product.isWhoApproved) badgeLabels.push("WHO Approved");

  let badgeRightX = pageWidth - margin;
  for (let i = badgeLabels.length - 1; i >= 0; i--) {
    const label = badgeLabels[i];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.3);
    const pillW = doc.getTextWidth(label) + 8.5;
    const pillH = 4.8;
    const pillX = badgeRightX - pillW;

    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.setLineWidth(0.3);
    doc.roundedRect(pillX, curY, pillW, pillH, 1.4, 1.4, "FD");

    doc.setFillColor(...brandGreen);
    doc.circle(pillX + 2.6, curY + pillH / 2, 0.7, "F");

    doc.setTextColor(...brandGreen);
    doc.text(label, pillX + 4.6, curY + 3.4);

    badgeRightX = pillX - 2.5;
  }

  // Category Pill on the left (clamped before badges)
  const maxCatW = Math.max(badgeRightX - margin - 4, 50);
  const catText = category.toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  const catFits = doc.splitTextToSize(catText, maxCatW - 8)[0] || catText;
  const catWidth = Math.min(doc.getTextWidth(catFits) + 8, maxCatW);
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(margin, curY, catWidth, 5, 1.5, 1.5, "FD");
  doc.setTextColor(194, 65, 12);
  doc.text(catFits, margin + 4, curY + 3.5);

  curY += 9.5;

  // Product Name Title (max 2 lines)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(...brandNavy);
  const nameLines = doc.splitTextToSize(name, contentWidth).slice(0, 2);
  doc.text(nameLines, margin, curY);
  curY += nameLines.length * 5.2 + 1.5;

  // ==========================================
  // 3. TWO-PICTURE PRODUCT SHOWCASE
  // ==========================================
  const showcaseH = 60;
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, curY, contentWidth, showcaseH, 3, 3, "FD");

  const frameY = curY + 4;
  const frameH = showcaseH - 8; // 52mm

  if (images.length >= 2) {
    const frameW = (contentWidth - 12) / 2; // 85mm each
    const labels = ["PRIMARY PACKAGING VIEW", "SECONDARY / DETAIL VIEW"];

    for (let i = 0; i < 2; i++) {
      const fX = margin + 4 + i * (frameW + 4);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...borderCard);
      doc.setLineWidth(0.3);
      doc.roundedRect(fX, frameY, frameW, frameH, 2, 2, "FD");

      drawImageContained(doc, images[i], fX + 3, frameY + 2.5, frameW - 6, frameH - 9);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.8);
      doc.setTextColor(...textMuted);
      doc.text(labels[i], fX + frameW / 2, frameY + frameH - 2.5, { align: "center" });
    }
  } else if (images.length === 1) {
    const frameW = 112;
    const fX = margin + (contentWidth - frameW) / 2;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...borderCard);
    doc.setLineWidth(0.3);
    doc.roundedRect(fX, frameY, frameW, frameH, 2, 2, "FD");

    drawImageContained(doc, images[0], fX + 4, frameY + 2.5, frameW - 8, frameH - 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.8);
    doc.setTextColor(...textMuted);
    doc.text("APPROVED PACKAGING & PRODUCT VIEW", fX + frameW / 2, frameY + frameH - 2.5, { align: "center" });
  } else {
    const frameW = 112;
    const fX = margin + (contentWidth - frameW) / 2;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(fX, frameY, frameW, frameH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...brandOrange);
    doc.text("ASTER MEDICINES", fX + frameW / 2, frameY + 23, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text("Pharmaceutical Grade Formulation", fX + frameW / 2, frameY + 30, { align: "center" });
  }

  curY += showcaseH + 3.5;

  // ==========================================
  // 4. QUICK SPECIFICATIONS 4-CARD RIBBON
  // ==========================================
  const ribbonH = 11.5;
  const cardW = (contentWidth - 9) / 4; // 43.25mm
  const metricCards = [
    { title: "DOSAGE / STRENGTH", val: dosage },
    { title: "CATEGORY", val: category },
    { title: "SHELF LIFE", val: shelfLife },
    { title: "STORAGE", val: storage },
  ];

  metricCards.forEach((c, idx) => {
    const cardX = margin + idx * (cardW + 3);
    doc.setFillColor(...bgCard);
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, curY, cardW, ribbonH, 2, 2, "FD");

    doc.setFillColor(...brandOrange);
    doc.rect(cardX + 2, curY, cardW - 4, 0.7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(...brandOrange);
    doc.text(c.title, cardX + 2.5, curY + 4.3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(...textDark);
    const valLine = doc.splitTextToSize(c.val, cardW - 5)[0] || c.val;
    doc.text(valLine, cardX + 2.5, curY + 8.5);
  });

  curY += ribbonH + 4.5;

  // Helper for section headers
  const drawSecTitle = (title: string, x: number, y: number) => {
    doc.setFillColor(...brandOrange);
    doc.rect(x, y, 2, 3.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...brandNavy);
    doc.text(title.toUpperCase(), x + 4, y + 3.1);
    return y + 5.8;
  };

  // ==========================================
  // 5. COMPOSITION & OVERVIEW (FULL WIDTH)
  // ==========================================
  if (composition) {
    curY = drawSecTitle("Active Pharmaceutical Composition", margin, curY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    const compLines = doc.splitTextToSize(composition, contentWidth - 8).slice(0, 3);
    const compH = Math.max(compLines.length * 3.6 + 5, 10);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, curY, contentWidth, compH, 1.8, 1.8, "FD");

    doc.setTextColor(...textDark);
    doc.text(compLines, margin + 4, curY + 4.2);
    curY += compH + 4;
  }

  if (description && curY < 215) {
    curY = drawSecTitle("Product Overview & Clinical Profile", margin, curY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.4);
    doc.setTextColor(...textBody);
    const descLines = doc.splitTextToSize(description, contentWidth).slice(0, 4);
    doc.text(descLines, margin, curY);
    curY += descLines.length * 3.6 + 4;
  }

  // ==========================================
  // 6. TWO-COLUMN CLINICAL & SAFETY GRID
  // ==========================================
  const colW = (contentWidth - 6) / 2; // 88mm
  const leftX = margin;
  const rightX = margin + colW + 6;
  const maxGridY = 256;

  let leftY = curY;
  let rightY = curY;

  if (indications && leftY + 14 < maxGridY) {
    leftY = drawSecTitle("Indications & Usage", leftX, leftY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...textBody);
    const indLines = doc.splitTextToSize(indications, colW).slice(0, 4);
    doc.text(indLines, leftX, leftY);
    leftY += indLines.length * 3.5 + 3.5;
  }

  if (dosageInstructions && leftY + 14 < maxGridY) {
    leftY = drawSecTitle("Dosage & Administration", leftX, leftY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...textBody);
    const doseLines = doc.splitTextToSize(dosageInstructions, colW).slice(0, 4);
    doc.text(doseLines, leftX, leftY);
    leftY += doseLines.length * 3.5 + 3.5;
  }

  if (precautions && rightY + 16 < maxGridY) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const precLines = doc.splitTextToSize(precautions, colW - 8).slice(0, 5);
    const alertH = Math.max(precLines.length * 3.4 + 8.5, 16);

    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.setLineWidth(0.3);
    doc.roundedRect(rightX, rightY, colW, alertH, 1.8, 1.8, "FD");

    doc.setFillColor(217, 119, 6);
    doc.rect(rightX, rightY, 2, alertH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(180, 83, 9);
    doc.text("PRECAUTIONS & WARNINGS", rightX + 4.5, rightY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.9);
    doc.setTextColor(...textDark);
    doc.text(precLines, rightX + 4.5, rightY + 8.5);

    rightY += alertH + 3.5;
  }

  if (sideEffects && rightY + 14 < maxGridY) {
    rightY = drawSecTitle("Safety & Side Effects", rightX, rightY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...textBody);
    const sideLines = doc.splitTextToSize(sideEffects, colW).slice(0, 3);
    doc.text(sideLines, rightX, rightY);
    rightY += sideLines.length * 3.5 + 3.5;
  }

  curY = Math.max(leftY, rightY) + 2;

  // ==========================================
  // 7. KEY FEATURES & COMPLIANCE STRIP
  // ==========================================
  const validFeatures = (product.features || [])
    .filter((f) => !f.toLowerCase().includes("price"))
    .map((f) => decodeHtmlEntities(f))
    .slice(0, 4);

  if (validFeatures.length > 0 && curY + 10 < 266) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...brandNavy);
    doc.text("KEY FEATURES:", margin, curY + 3);

    let featX = margin + 25;
    validFeatures.forEach((feat) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      const w = doc.getTextWidth(feat) + 6;
      if (featX + w <= pageWidth - margin) {
        doc.setFillColor(...brandGreen);
        doc.circle(featX + 1.5, curY + 2.1, 0.7, "F");
        doc.setTextColor(...textDark);
        doc.text(feat, featX + 3.5, curY + 3);
        featX += w + 3;
      }
    });
    curY += 7;
  }

  // Bottom GMP & Order Inquiry Strip (anchored cleanly above footer)
  const stripY = Math.max(curY + 1, 263);
  if (stripY <= 268) {
    const stripH = 14.5;
    doc.setFillColor(...bgCard);
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, stripY, contentWidth, stripH, 2, 2, "FD");

    doc.setFillColor(...brandGreen);
    doc.rect(margin, stripY, 2.2, stripH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...brandGreen);
    doc.text("SCHEDULE M / GMP COMPLIANT · BATCH TESTED & CERTIFIED", margin + 5, stripY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...textMuted);
    doc.text(
      "Institutional Orders & PCD Franchise: +91 7061452180 · contact@astermedicines.com · www.astermedicines.com",
      margin + 5,
      stripY + 10.5
    );
  }

  // ==========================================
  // 8. PAGE FOOTER
  // ==========================================
  const footerY = pageHeight - 11;
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...textMuted);
  doc.text(
    "Aster Medicines Pvt. Ltd. · Product Catalogue · www.astermedicines.com",
    margin,
    footerY + 1
  );

  doc.setFont("helvetica", "bold");
  doc.text(`Page ${pageNumber}`, pageWidth - margin, footerY + 1, { align: "right" });
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
  onProgress: (current: number, total: number) => void,
): Promise<void> {
  if (!products.length) throw new Error("No products available");

  const sorted = [...products].sort((a, b) =>
    decodeHtmlEntities(a.category).localeCompare(decodeHtmlEntities(b.category))
    || a.name.localeCompare(b.name)
  );
  const doc = new jsPDF({ compress: true });
  doc.setProperties({ title: "Aster Medicines Product Catalogue", author: "Aster Medicines Pvt. Ltd." });
  doc.addImage(LOGO_BASE64, "PNG", 16, 14, 44, 26);
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 58, 210, 239, "F");
  doc.setTextColor(255, 188, 114);
  doc.setFontSize(13);
  doc.text("ASTER MEDICINES PVT. LTD.", 18, 91);
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(44);
  doc.text(["Product", "Catalogue"], 16, 127);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(new Date().toLocaleDateString("en-IN", { dateStyle: "long" }), 18, 249);
  doc.text("www.astermedicines.com", 18, 260);

  const entries: { page: number; y: number; height: number }[] = [];
  let y = 300;
  let previousCategory = "";
  for (const product of sorted) {
    const category = decodeHtmlEntities(product.category) || "Products";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines: string[] = doc.splitTextToSize(decodeHtmlEntities(product.name), 157);
    const height = lines.length * 5 + 4;
    if (y + height + 13 > 277) {
      doc.addPage();
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(25);
      doc.text("Product index", 16, 26);
      previousCategory = "";
      y = 42;
    }
    if (category !== previousCategory) {
      doc.setTextColor(176, 68, 9);
      doc.setFontSize(10);
      doc.text(category, 16, y, { maxWidth: 178 });
      y += doc.getTextDimensions(category, { maxWidth: 178 }).h + 3;
      previousCategory = category;
    }
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(lines, 19, y);
    entries.push({ page: doc.getNumberOfPages(), y, height });
    y += height;
  }

  for (const [index, product] of sorted.entries()) {
    onProgress(index + 1, sorted.length);
    doc.addPage();
    const destination = doc.getNumberOfPages();
    await drawCatalogueProductPage(doc, product, destination);
    const entry = entries[index];
    doc.setPage(entry.page);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(String(destination), 193, entry.y, { align: "right" });
    doc.link(16, entry.y - 4, 180, entry.height, { pageNumber: destination });
    doc.setPage(doc.getNumberOfPages());
  }
  doc.save("Aster-Product-Catalogue.pdf");
}
