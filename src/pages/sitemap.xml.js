import site from '../data/site.json';

const modulos = import.meta.glob('../content/pages/*.json', { eager: true });

const urls = [...new Set(
  Object.values(modulos)
    .map((m) => m.default ?? m)
    .filter((p) => p.url && !p.noindex)
    .map((p) => p.url)
)].sort();

export function GET() {
  const hoy = new Date().toISOString().split('T')[0];
  const cuerpo = urls.map((u) => `  <url>
    <loc>${site.dominio}${u}</loc>
    <lastmod>${hoy}</lastmod>
  </url>`).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cuerpo}
</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
