"use client";

import { jsPDF } from "jspdf";
import { Product } from "@/types/product";

export async function generateProductPDF(product: Product): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Brand Colors
  const brandOrange = [234, 88, 12] as [number, number, number]; // #EA580C
  const darkGray = [30, 30, 30] as [number, number, number];
  const lightGray = [120, 120, 120] as [number, number, number];

  // Header Section with Brand Line
  doc.setFillColor(...brandOrange);
  doc.rect(0, 0, pageWidth, 8, "F");

  yPos = 25;

  // Company Info
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text("ASTER MEDICINES PVT LTD", margin, yPos);
  doc.setFontSize(8);
  doc.text("WHO-GMP Certified Pharmaceutical Manufacturer", margin, yPos + 5);
  doc.text("Bihar, India", margin, yPos + 9);

  // Product Spec Sheet Title
  yPos = 50;
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("PRODUCT SPECIFICATION", margin, yPos);

  // Orange underline
  doc.setDrawColor(...brandOrange);
  doc.setLineWidth(1);
  doc.line(margin, yPos + 3, margin + 85, yPos + 3);

  // Product Name
  yPos = 70;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  const nameLines = doc.splitTextToSize(product.name, contentWidth);
  doc.text(nameLines, margin, yPos);
  yPos += nameLines.length * 8 + 5;

  // Category Badge
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...brandOrange);
  doc.text(`Category: ${product.category}`, margin, yPos);
  yPos += 15;

  // Separator Line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Helper function for sections
  const addSection = (title: string, content: string | undefined, icon?: string) => {
    if (!content) return;
    
    // Check if we need a new page
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandOrange);
    doc.text(title.toUpperCase(), margin, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    const lines = doc.splitTextToSize(content, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 5 + 10;
  };

  // Main Description
  addSection("Description", product.detailedDescription || product.description);

  // Composition
  addSection("Composition", product.composition);

  // Indications
  addSection("Indications & Usage", product.indications);

  // Dosage
  addSection("Dosage & Administration", product.dosageInstructions || product.dosage);

  // Side Effects
  addSection("Side Effects", product.sideEffects);

  // Precautions
  addSection("Precautions & Warnings", product.precautions);

  // Features Section
  if (product.features && product.features.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandOrange);
    doc.text("KEY FEATURES", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    
    product.features
      .filter(f => !f.toLowerCase().includes("price"))
      .forEach((feature) => {
        doc.text(`• ${feature}`, margin + 2, yPos);
        yPos += 6;
      });
    yPos += 5;
  }

  // Certifications Box
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }

  const certifications = [];
  if (product.isQualityAssured) certifications.push("Quality Assured");
  if (product.isGmpCertified) certifications.push("GMP Certified");
  if (product.isWhoApproved) certifications.push("WHO Approved");

  if (certifications.length > 0) {
    yPos += 5;
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "F");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...lightGray);
    doc.text("CERTIFICATIONS", margin + 5, yPos + 8);
    
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text(certifications.join("  •  "), margin + 5, yPos + 17);
    yPos += 35;
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text("Aster Medicines Pvt Ltd | www.astermedicines.com", margin, footerY);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  })}`, pageWidth - margin - 45, footerY);

  // Document ID
  doc.setFontSize(7);
  doc.text(`Doc ID: AM-${product.id}-${Date.now().toString(36).toUpperCase()}`, margin, footerY + 4);

  // Save the PDF
  const fileName = `${product.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-specification.pdf`;
  doc.save(fileName);
}
