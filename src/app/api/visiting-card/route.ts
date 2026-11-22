import { createVisitingCard } from "./visiting-card";

export const dynamic = "force-dynamic";

const previewAgent = /facebookexternalhit|facebot|meta-externalagent|WhatsApp|LinkedInBot|Twitterbot|Slackbot|Discordbot|TelegramBot|SkypeUriPreview|TeamsPreview/i;
const url = "https://astermedicines.com/api/visiting-card";
const image = "https://astermedicines.com/visiting-card-og.png";
const title = "Rupesh Anand | Aster Medicines";
const description = "Download the visiting card for Rupesh Anand, Managing Director of Aster Medicines Private Limited.";
const preview = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>${title}</title>
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Aster Medicines visiting card for Rupesh Anand, Managing Director">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${image}">
</head><body><a href="${url}">Download the visiting card</a></body></html>`;

export function GET(request: Request) {
  const headers = { Vary: "User-Agent", "Cache-Control": "private, no-store" };
  if (previewAgent.test(request.headers.get("user-agent") ?? "")) {
    return new Response(preview, {
      headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
    });
  }
  return new Response(createVisitingCard(), {
    headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Aster_Medicines_Anand_Rupesh_VC.pdf"',
    },
  });
}
