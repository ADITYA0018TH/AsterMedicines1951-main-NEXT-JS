import { getAllProductsFull } from "@/lib/products";
import XLSX from "xlsx-js-style";

export async function GET() {
  const products = await getAllProductsFull();

  const headers = [
    "Product Name",
    "Category",
    "Composition",
    "Dosage / Strength",
    "Packaging",
    "Shelf Life",
    "Availability",
  ];

  const rows = products.map((product) => [
    product.name || "",
    product.category || "",
    product.composition || "",
    product.dosage || (product.strengthVariants && product.strengthVariants.join(", ")) || "",
    (product.packagingOptions && product.packagingOptions.join(", ")) || "",
    product.shelfLife || "",
    product.availability || "Available",
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths for clean readability
  ws["!cols"] = [
    { wch: 32 }, // Product Name
    { wch: 18 }, // Category
    { wch: 36 }, // Composition
    { wch: 20 }, // Dosage / Strength
    { wch: 22 }, // Packaging
    { wch: 14 }, // Shelf Life
    { wch: 16 }, // Availability
  ];

  // Professional header row styling
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
    fill: { fgColor: { rgb: "C2410C" } }, // Aster Orange-700
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "9A3412" } },
      bottom: { style: "medium", color: { rgb: "9A3412" } },
      left: { style: "thin", color: { rgb: "EA580C" } },
      right: { style: "thin", color: { rgb: "EA580C" } },
    },
  };

  for (let c = 0; c < headers.length; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle;
    }
  }

  // Row height for header
  ws["!rows"] = [{ hpt: 26 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Aster Product Catalogue");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="aster-medicines-products.xlsx"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
