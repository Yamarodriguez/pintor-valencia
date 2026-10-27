// Sustituye las cifras de precio propias, contradictorias entre páginas, por una única
// referencia de precios medios del mercado en Valencia (sin fecha).
// Fuente de los rangos: analisis/PRECIOS-REFERENCIA-COMPETENCIA.md
// Uso: node scripts/precios-mercado.mjs        (en seco: recuento y ejemplos)
//      node scripts/precios-mercado.mjs --aplicar
// Se puede ejecutar dos veces: la segunda pasada da 0 cambios.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/pages';
const APLICAR = process.argv.includes('--aplicar');
const FAMILIAS_CIUDAD = /^(escayolista|pladur|fachadas)-/;

// Bloque de precios de las páginas de pintor (portada, /precio/ y ciudades): ~10 €/m² de vivienda.
const REGLAS_HTML = [
  // El original lleva espacios duros (U+00A0) en algunas cifras: \s los cubre.
  ['€/m² de vivienda', /oscila entre 6[.,]0\s+a\s+10,5 euros por metro cuadrado/g,'oscila entre 8 y 12 euros por metro cuadrado de vivienda'],
  ['60 m²: rango', /300 y 900 euros/g, '500 y 700 euros'],
  ['90 m²: rango', /450 y 1\.400 euros/g, '700 y 1.100 euros'],
  ['100 m²: rango', /entre\s+<b>700\s*<\/b><strong>y 1\.400 euros/g, 'entre <strong>800 y 1.200 euros'],
  ['100 m²: título', /100 m2\. 1200 euros/g, '100 m2. 1.000 euros'],
  ['100 m²: media', /Precio medio 1200 euros/g, 'Precio medio 1.000 euros'],
  ['120 m²: rango', /900 y 1\.900 euros/g, '950 y 1.450 euros'],
  ['120 m²: título', /120 m2\. 1500 euros/g, '120 m2. 1.200 euros'],
  ['120 m²: media', /Precio medio 1500 euros/g, 'Precio medio 1.200 euros'],
  ['hora', /es de <strong>20 €<\/strong>, aunque puede oscilar entre <strong>15 € y 40 €<\/strong>/g,
    'es de <strong>25 €</strong>, aunque puede oscilar entre <strong>20 € y 30 €</strong>'],
  ['nota del bloque', /Estos precios son solo orientativos, y pueden variar, Por eso,/g,
    'Son precios medios orientativos del mercado, IVA no incluido, y pueden variar. Por eso,'],
  ['nota sin fecha', /Precios orientativos 2026, /g, 'Precios medios orientativos del mercado, '],
  ['/precio/: intro', /estas son nuestras tarifas orientativas/g, 'estos son los precios medios orientativos del mercado'],
  ['alisado: texto', /entre <strong>7 € y 14 € por m²/g, 'entre <strong>12 € y 20 € por m²'],
];

// Cifras sueltas en párrafos y FAQ: se localiza la frase y dentro de ella se cambian solo
// las cifras, en orden (así da igual que haya <strong> o espacios duros en medio).
const REGLAS_TEXTO = [
  ['/precio/: €/m²', /por metro cuadrado, que suele oscilar entre 5 y 15 euros/g, [['5 y 15', '8 y 12']]],
  ['/precio/: hora', /precio pintor por hora puede oscilar entre 15 y 30 euros/g, [['15 y 30', '20 y 30']]],
  ['/precio/: medias', /9,5 euros por metro cuadrado[\s\S]{0,80}?570 euros[\s\S]{0,80}?855 euros[\s\S]{0,80}?950 euros[\s\S]{0,80}?1\.140 euros/g,
    [['9,5 euros', '10 euros'], ['570 euros', '600 euros'], ['855 euros', '900 euros'], ['950 euros', '1.000 euros'], ['1.140 euros', '1.200 euros']]],
  ['/precio/: gotelé', /alisar una pared con gotelé puede costar entre 10 y 20 euros/g, [['10 y 20', '12 y 20']]],
  ['gotelé: texto', /(entre|de) (<strong>)?8 € (y|a) 15 € por m²/g, [['8 €', '12 €'], ['15 €', '20 €']]],
  ['lacado: texto', /(entre|de) (<strong>)?60 € (y|a) 120 € por hoja/g, [['60 €', '80 €'], ['120 €', '200 €']]],
  ['paredes: texto', /de 6 € a 12 € por m²/g, [['6 €', '8 €']]],
  ['portada: interior', /Desde\s+(<strong>)?6€ a 12€ por m²/g, [['6€', '8€']]],
  ['portada: fachadas', /Entre\s+(<strong>)?8€ y 15€ por m²/g, [['8€', '10€'], ['15€', '20€']]],
  ['portada: alisado', /Desde\s+(<strong>)?10€ a 20€ por m²/g, [['10€', '12€']]],
  ['portada: lacado', /Desde\s+(<strong>)?60€ a 150€ por puerta/g, [['60€', '80€'], ['150€', '200€']]],
];
const aplicaTexto = (texto, slug) => {
  for (const [regla, re, pares] of REGLAS_TEXTO) {
    texto = texto.replace(re, m => {
      let nuevo = m;
      for (const [viejo, cifra] of pares) nuevo = nuevo.replace(viejo, cifra);
      if (nuevo !== m) anota(regla, slug, m, nuevo);
      return nuevo;
    });
  }
  return texto;
};

// Tablas de tarifas de las páginas de servicio: etiqueta -> valor de referencia.
const TARIFAS = {
  'Pintor por hora': '20 – 30 €/h',
  'Pintor por día': '100 – 200 €',
  'Pintar por m² (paredes)': '8 – 12 €/m²',
  'Pintar por m²': '8 – 12 €/m²',
  'Paredes por m²': '8 – 12 €/m²',
  'Pintar una habitación': '120 – 250 €',
  'Pintar un piso de 60–70 m²': '500 – 850 €',
  'Piso completo (60–70 m²)': '500 – 850 €',
  'Piso de 60 m² completo': '500 – 700 €',
  'Piso de 70 m² completo': '550 – 850 €',
  'Quitar gotelé y alisar': '12 – 20 €/m²',
  'Quitar gotelé y alisar por m²': '12 – 20 €/m²',
  'Alisar por m²': '12 – 20 €/m²',
  'Alisar + pintar por m²': '20 – 30 €/m²',
  'Puerta lacada': '80 – 200 €/hoja',
  'Estuco veneciano por m²': '30 – 70 €/m²',
};
// En /baratos/ las tarifas van «desde»: el mínimo de la referencia.
const TARIFAS_DESDE = {
  'Pintar por m²': 'desde 8 €/m²',
  'Pintor por día': 'desde 100 €',
  'Pintar un piso': 'desde 500 €',
};

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, c => '\\' + c);
const recuento = {};
const ejemplos = {};
const anota = (regla, slug, antes, despues) => {
  recuento[regla] = (recuento[regla] || 0) + 1;
  (ejemplos[regla] ??= []).length < 5 && ejemplos[regla].push(`${slug}: «${antes.slice(0, 70)}» → «${despues.slice(0, 70)}»`);
};

let ficheros = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const ruta = path.join(DIR, f);
  const original = fs.readFileSync(ruta, 'utf8');
  const j = JSON.parse(original);
  let html = j.html || '';
  for (const [regla, re, rep] of REGLAS_HTML) {
    html = html.replace(re, m => {
      anota(regla, j.slug, m, rep);
      return rep;
    });
  }
  let faqCambiada = false;
  if (!FAMILIAS_CIUDAD.test(f)) {
    html = aplicaTexto(html, j.slug);
    for (const q of j.faq || []) {
      const r = aplicaTexto(q.respuesta, j.slug);
      if (r !== q.respuesta) { q.respuesta = r; faqCambiada = true; }
    }
    const tabla = j.slug === 'baratos' ? TARIFAS_DESDE : TARIFAS;
    for (const [etiqueta, valor] of Object.entries(tabla)) {
      const re = new RegExp(`(<li><span>${esc(etiqueta)}</span><span>)([^<]*)(</span></li>)`, 'g');
      html = html.replace(re, (m, a, viejo, c) => {
        if (viejo === valor) return m;
        anota(`tarifa: ${etiqueta}`, j.slug, viejo, valor);
        return a + valor + c;
      });
    }
  }
  if (html !== (j.html || '') || faqCambiada) {
    j.html = html;
    ficheros++;
    if (APLICAR) fs.writeFileSync(ruta, JSON.stringify(j, null, 2) + (original.endsWith('\n') ? '\n' : ''));
  }
}

console.log(APLICAR ? 'APLICADO' : 'EN SECO (añade --aplicar para escribir)');
console.log(`Ficheros que cambian: ${ficheros}`);
for (const [r, n] of Object.entries(recuento)) {
  console.log(`\n${n} × ${r}`);
  for (const e of ejemplos[r]) console.log('   ' + e);
}
