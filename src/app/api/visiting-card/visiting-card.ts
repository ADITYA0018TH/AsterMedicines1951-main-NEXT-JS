import logo from "./aster-logo.json";
import { jsPDF } from "jspdf";

const width = 90;
const height = 51;
const blue = "#0D3659";
const green = "#3B885C";
const white = "#FFFFFF";
const phone = "+91 99340 06655";
const email = "astermedicinespvtltd@gmail.com";
const website = "astermedicines.com";

type Path = { op: "m" | "l" | "c" | "h"; c?: number[] }[];

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

const contactIcons: Path[] = [
  [
    { op: "m", c: [-0.85, -0.9] },
    { op: "c", c: [-1.25, -0.55, -0.3, 0.95, 0.67, 1.02] },
    { op: "l", c: [1.02, 0.66] },
    { op: "l", c: [0.52, 0.22] },
    { op: "l", c: [0.13, 0.48] },
    { op: "c", c: [-0.18, 0.25, -0.43, -0.05, -0.53, -0.28] },
    { op: "l", c: [-0.29, -0.58] },
    { op: "l", c: [-0.63, -1.03] },
    { op: "h" },
  ],
  [
    { op: "m", c: [-0.94, 0.62] },
    { op: "l", c: [-0.94, -0.62] },
    { op: "l", c: [0.94, -0.62] },
    { op: "l", c: [0.94, 0.62] },
    { op: "h" },
    { op: "m", c: [-0.94, -0.62] },
    { op: "l", c: [0, 0.08] },
    { op: "l", c: [0.94, -0.62] },
  ],
  [
    { op: "m", c: [0, 1.03] },
    { op: "c", c: [-0.42, 0.49, -0.8, 0.02, -0.8, -0.28] },
    { op: "c", c: [-0.8, -1.37, 0.8, -1.37, 0.8, -0.28] },
    { op: "c", c: [0.8, 0.02, 0.42, 0.49, 0, 1.03] },
    { op: "h" },
  ],
];

function drawContactIcon(pdf: jsPDF, x: number, y: number, row: number) {
  pdf.setFillColor(green).circle(x, y, 1.8, "F");
  pdf.setDrawColor(white).setLineWidth(0.18);
  if (row === 3) {
    pdf.circle(x, y, 0.98, "S");
    pdf.ellipse(x, y, 0.48, 0.98, "S");
    pdf.line(x - 0.98, y, x + 0.98, y);
    return;
  }

  pdf.path(contactIcons[row].map(({ op, c }) => ({
    op,
    c: c?.map((value, index) => value + (index % 2 === 0 ? x : y)),
  })));
  pdf.stroke();
  if (row === 2) {
    pdf.setFillColor(white).circle(x, y - 0.31, 0.22, "F");
  }
}

function drawFront(pdf: jsPDF) {
  drawLogo(pdf, 5.5, 4.2, 29);
  pdf.setFont("helvetica", "bold").setFontSize(12.1).setTextColor(blue);
  pdf.text("Mr. Rupesh Anand", 42.4, 30.3, { align: "right" });
  pdf.setFont("helvetica", "normal").setFontSize(8.6).setTextColor(green);
  pdf.text("Managing Director", 42.4, 34.4, { align: "right" });

  [22, 26.8, 31.6, 40.3].forEach((y, row) => drawContactIcon(pdf, 49.1, y, row));
  pdf.setFontSize(6.4).setTextColor("#141414");
  pdf.textWithLink(phone, 52.5, 22.85, { url: "tel:+919934006655" });
  pdf.textWithLink(email, 52.5, 27.65, { url: `mailto:${email}` });
  pdf.text(["North of Janta Hotel, 1st Floor,", "Govind Mitra Road,", "Patna, Bihar - 800004"], 52.5, 31.9);
  pdf.textWithLink(website, 52.5, 41.15, { url: `https://${website}` });

  pdf.setFillColor(blue).rect(0, 48.4, 45.6, 2.6, "F");
  pdf.setFillColor(green).rect(45.6, 48.4, 44.4, 2.6, "F");
  pdf.setFillColor(white);
  pdf.lines([[1.1, 0], [-2, 2.6], [-1.1, 0]], 45.6, 48.4, [1, 1], "F", true);
}

function drawBack(pdf: jsPDF) {
  pdf.setFillColor(blue).rect(0, 0, width, height, "F");
  drawLogo(pdf, 28.6, 7, 33, true);
  pdf.setFont("helvetica", "bold").setFontSize(17.4).setTextColor(white);
  pdf.text(["ASTER MEDICINES", "PRIVATE LIMITED"], width / 2, 30, {
    align: "center",
    lineHeightFactor: 1.04,
  });
  pdf.setDrawColor(white).setLineWidth(0.23).line(19.4, 38.6, 70.6, 38.6);
  pdf.setFont("helvetica", "normal").setFontSize(9.5);
  pdf.text("Quality Healthcare Solutions", width / 2, 43, { align: "center" });
}

export function createVisitingCard() {
  const pdf = new jsPDF({ unit: "mm", format: [width, height], orientation: "landscape", compress: true });
  pdf.setProperties({ title: "Rupesh Anand | Aster Medicines Visiting Card" });
  const drawSide = (draw: (document: jsPDF) => void) => {
    pdf.saveGraphicsState();
    pdf.roundedRect(0, 0, width, height, 4, 4, null).clip().discardPath();
    draw(pdf);
    pdf.restoreGraphicsState();
  };
  drawSide(drawFront);
  pdf.addPage();
  drawSide(drawBack);
  return pdf.output("arraybuffer");
}
