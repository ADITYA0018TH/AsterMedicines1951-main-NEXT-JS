import logo from "./aster-logo.json";
import { jsPDF } from "jspdf";

const width = 90;
const height = 51;
const navy = "#11254C";
const gold = "#FFCD0A";
const white = "#FFFFFF";
const phone = "+91 7909071165";
const email = "astermedicinespvtltd@gmail.com";
const website = "astermedicines.com";

// Vector outlines traced from the supplied Aster artwork, in its cropped pixel coordinates.
function drawLogo(pdf: jsPDF, x: number, y: number, size: number, reversed = false) {
  const colors = {
    gold: "#FFCD0A",
    swoosh: reversed ? white : "#332D99",
    letters: reversed ? white : "#04267F",
    tagline: reversed ? white : "#646466",
  };
  const scale = size / 903;
  for (const layer of Object.keys(colors) as (keyof typeof colors)[]) {
    pdf.setFillColor(colors[layer]);
    for (const contour of logo[layer]) {
      const points = contour.map(([px, py]) => [x + px * scale, y + py * scale]);
      pdf.moveTo(points[0][0], points[0][1]);
      for (const [px, py] of points.slice(1)) pdf.lineTo(px, py);
      pdf.close();
    }
    pdf.fillEvenOdd();
  }
}

function label(pdf: jsPDF, text: string, x: number, y: number) {
  pdf.setFont("helvetica", "bold").setFontSize(6.1).setTextColor("#425678");
  pdf.text(text, x, y, { charSpace: 0.37 });
}

function drawFront(pdf: jsPDF) {
  pdf.setFillColor("#FAFAF7").rect(0, 0, width, height, "F");
  drawLogo(pdf, 65, 5.5, 20);
  pdf.setFillColor(gold).rect(5.5, 7.2, 5, 0.8, "F");
  label(pdf, "MANAGING DIRECTOR", 12.2, 8.3);
  pdf.setFont("times", "normal").setFontSize(22).setTextColor(navy);
  pdf.text("Rupesh Anand", 5.2, 20.6);
  pdf.setDrawColor("#C8CFDA").setLineWidth(0.18).line(5.5, 25, 84.5, 25);

  label(pdf, "CONTACT", 5.5, 31);
  label(pdf, "REGISTERED OFFICE", 52.5, 31);
  pdf.setFont("helvetica", "normal").setFontSize(7.25).setTextColor(navy);
  pdf.textWithLink(phone, 5.5, 36.3, { url: "tel:+917909071165" });
  pdf.setTextColor("#184A88");
  pdf.textWithLink(email, 5.5, 40.9, { url: `mailto:${email}` });
  pdf.textWithLink(website, 5.5, 45.5, { url: `https://${website}` });
  pdf.setDrawColor("#7091B4").setLineWidth(0.12);
  pdf.line(5.5, 41.4, 5.5 + pdf.getTextWidth(email), 41.4);
  pdf.line(5.5, 46, 5.5 + pdf.getTextWidth(website), 46);
  pdf.setTextColor(navy);
  pdf.text(["North of Janta Hotel, 1st Floor", "Govind Mitra Road", "Patna, Bihar - 800004"], 52.5, 36.3, { lineHeightFactor: 1.8 });
}

function drawBack(pdf: jsPDF) {
  pdf.setFillColor(navy).rect(0, 0, width, height, "F");
  // An enlarged crescent echoes the curve of the Aster mark across the trim.
  pdf.setFillColor("#213D83").ellipse(93, 24, 33, 39, "F");
  pdf.setFillColor("#3458A2").ellipse(96, 22, 31, 36, "F");
  pdf.setFillColor(navy).ellipse(100, 19, 32, 35, "F");
  pdf.setDrawColor(gold).setLineWidth(0.25).ellipse(102, 19, 31, 35, "S");
  drawLogo(pdf, 5.5, 3.2, 18, true);
  pdf.setTextColor("#E0E6F2").setFont("helvetica", "normal").setFontSize(6.7);
  pdf.text("Quality Healthcare Solutions", 26, 10.6);
  pdf.setTextColor(white).setFont("times", "normal").setFontSize(18);
  pdf.text("Aster Medicines", 5.3, 20);
  pdf.setFont("helvetica", "bold").setFontSize(6.4);
  pdf.text("PRIVATE LIMITED", 5.7, 24, { charSpace: 0.45 });
  pdf.setFont("helvetica", "normal").setFontSize(7.6);
  pdf.text(["Manufacturer of parentals, oral liquid,", "Tablets & external preparation"], 5.7, 29, { lineHeightFactor: 1.2 });
  pdf.setTextColor(gold).setFont("helvetica", "bold").setFontSize(6.1);
  pdf.text("FACTORY", 5.7, 38, { charSpace: 0.38 });
  pdf.setTextColor(white).setFont("helvetica", "normal").setFontSize(7.25);
  pdf.text(["Plot No. E-4(Part), Phase II, Industrial Area,", "Hajipur-844101, Vaishali"], 5.7, 42.6, { lineHeightFactor: 1.35 });
}

export function createVisitingCard() {
  const pdf = new jsPDF({ unit: "mm", format: [width, height], orientation: "landscape", compress: true });
  pdf.setProperties({ title: "Rupesh Anand | Aster Medicines Visiting Card" });
  drawFront(pdf);
  pdf.addPage();
  drawBack(pdf);
  return pdf.output("arraybuffer");
}
