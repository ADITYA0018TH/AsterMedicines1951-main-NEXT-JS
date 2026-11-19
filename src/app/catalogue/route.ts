import { getAllProductsFull } from "@/lib/products";

function csvCell(value: string) {
  const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}

export async function GET() {
  const products = await getAllProductsFull();
  const rows = [["Product", "Category", "Composition"], ...products.map(
    product => [product.name, product.category, product.composition || ""]
  )];
  return new Response("\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="aster-medicines-products.csv"',
    },
  });
}
