import { createVisitingCard } from "./visiting-card";

export const dynamic = "force-static";

export function GET() {
  return new Response(createVisitingCard(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Rupesh-Anand-Visiting-Card.pdf"',
    },
  });
}
