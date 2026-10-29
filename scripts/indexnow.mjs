// Avisa por IndexNow (Bing, Yandex, Seznam...) de las URLs nuevas o cambiadas.
// Bing alimenta ChatGPT Search y Copilot: cuanto antes rastree, antes salen ahí los cambios.
//
// Se ejecuta al final de `npm run build`. Compara el sitemap recién generado con el
// publicado: como el despliegue aún no ha sucedido, el publicado es el anterior y la
// diferencia son justo las URLs que cambian. Los <lastmod> salen del último commit de
// cada página, así que no cambian si la página no cambia.
//
// Solo actúa en producción de Netlify (CONTEXT=production): en local y en las
// vistas previas no hace nada. Nunca rompe la build: cualquier fallo se avisa y sigue.
import fs from 'node:fs';

const DOMINIO = 'https://pintor-valencia.com';
// La clave es pública por diseño: el archivo public/<clave>.txt demuestra que el sitio es nuestro.
const CLAVE = '5f917121d34ab4143cf9fed6794c8b6c';

const leerSitemap = (xml) => new Map(
  [...xml.matchAll(/<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map((m) => [m[1], m[2] ?? ''])
);

async function main() {
  if (process.env.CONTEXT !== 'production') {
    console.log('[indexnow] no es producción: no se avisa');
    return;
  }
  const nuevo = leerSitemap(fs.readFileSync('dist/sitemap.xml', 'utf8'));
  const respuesta = await fetch(`${DOMINIO}/sitemap.xml`);
  if (!respuesta.ok) throw new Error(`sitemap publicado: HTTP ${respuesta.status}`);
  const publicado = leerSitemap(await respuesta.text());

  const urls = [...nuevo].filter(([url, fecha]) => publicado.get(url) !== fecha).map(([url]) => url);
  if (urls.length === 0) {
    console.log('[indexnow] ninguna URL nueva o cambiada');
    return;
  }
  const envio = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(DOMINIO).host,
      key: CLAVE,
      keyLocation: `${DOMINIO}/${CLAVE}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  console.log(`[indexnow] ${urls.length} URLs enviadas: HTTP ${envio.status}`);
}

main().catch((e) => console.warn(`[indexnow] no se pudo avisar: ${e.message}`));
