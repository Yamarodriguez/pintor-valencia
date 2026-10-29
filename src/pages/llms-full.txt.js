/* /llms-full.txt: el texto de las páginas principales en Markdown, para
   que un asistente de IA lo lea de una vez sin rastrear el HTML. Las
   páginas por municipio no entran: repiten la de su servicio. */
import site from '../data/site.json';
import { SERVICIOS } from '../utils/negocio.js';

const modulos = import.meta.glob('../content/pages/*.json', { eager: true });
const PAGINAS = Object.fromEntries(
  Object.values(modulos).map((m) => m.default ?? m).map((p) => [p.url, p])
);

const PRINCIPALES = [
  '/', '/precio/', '/cuanto-cobra-un-pintor/', '/empresa/', '/servicios-pintura/',
  ...SERVICIOS.map((s) => s.url),
  '/pintores-de-fachadas/', '/escayolista/', '/pladur/',
];

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', '#39': "'", '#8211': '–', '#8217': '’' };

/* HTML de WordPress a Markdown sencillo: encabezados, listas, celdas y
   párrafos. Imágenes, formularios y scripts se descartan. */
function aMarkdown(html) {
  return html
    .replace(/<(script|style|form|figure|noscript)[\s\S]*?<\/\1>/gi, '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(Math.max(2, +n))} ${t}\n\n`)
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<\/tr>|<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|ul|ol|table)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#?\w+);/g, (m, e) => ENTIDADES[e] ?? m)
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function seccion(url) {
  const p = PAGINAS[url];
  if (!p) return null;
  const faq = (p.faq ?? []).map((f) => `### ${f.pregunta}\n\n${aMarkdown(f.respuesta)}`).join('\n\n');
  return [
    `# ${p.h1 || p.titulo}`,
    `URL: ${site.dominio}${url}`,
    p.entradilla && aMarkdown(p.entradilla),
    aMarkdown(p.html ?? ''),
    faq && `## Preguntas frecuentes\n\n${faq}`,
  ].filter(Boolean).join('\n\n');
}

/* Las páginas heredadas de WordPress comparten muchos bloques de plantilla
   (listas de servicios, «Empresa de pintores...»). Cada bloque sale solo la
   primera vez: sin esto el archivo pasaba de 500 KB, casi todo repetido. */
function sinRepetidos(secciones) {
  const vistos = new Set();
  return secciones.map((s) => s.split('\n\n').filter((bloque) => {
    if (bloque.length < 40 || bloque.startsWith('URL: ') || /^# /.test(bloque)) return true;
    if (vistos.has(bloque)) return false;
    vistos.add(bloque);
    return true;
  }).join('\n\n'));
}

export function GET() {
  const texto = [
    `# ${site.nombre} — texto completo\n\n> Páginas principales de ${site.dominio}. Índice resumido: ${site.dominio}/llms.txt`,
    ...sinRepetidos([...new Set(PRINCIPALES)].map(seccion).filter(Boolean)),
  ].join('\n\n---\n\n');

  return new Response(texto + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
