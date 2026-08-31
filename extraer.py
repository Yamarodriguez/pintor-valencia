#!/usr/bin/env python3
"""Extrae el export WXR de pintor-valencia.com a src/content/pages/*.json.

Adaptado del extraer.py de robothumanoide. Diferencias de esta web:

  - Son 118 paginas, no 4: el mapa de destinos se deriva del propio XML
    en vez de escribirse a mano.
  - El cuerpo SI viene completo en content:encoded (incluida la imagen
    principal), asi que el hero se saca de ahi y no de _elementor_data.
  - Elementor pinta cada servicio como  h2 + <a><img></a> + p + <a>CTA</a>.
    Rachas de esas se convierten en rejilla de tarjetas.
  - Hay 1.341 titulares que terminan en '?': van a acordeon <details>
    nativo y alimentan el FAQPage de schema.org.
  - 114 paginas traen un iframe de Google Maps: se conserva diferido.
  - Restos de Contact Form 7 (<form>, <input>, <textarea>): se eliminan,
    el formulario lo pone el componente ContactForm.astro.
"""
import json, re, html, unicodedata
from pathlib import Path
import xml.etree.ElementTree as ET

NS = {'wp': 'http://wordpress.org/export/1.2/',
      'content': 'http://purl.org/rss/1.0/modules/content/'}

SRC = '/mnt/user-data/uploads/pintor-valencia/pintorvalencia.WordPress.2026-08-31.xml'
RAIZ = Path('/home/claude/pintor-valencia')
OUT = RAIZ / 'src/content/pages'
OUT.mkdir(parents=True, exist_ok=True)

DOMINIO = 'https://pintor-valencia.com'
# El slug de la portada en WordPress. Se sirve en la raiz.
SLUG_HOME = 'pintor-valencia'


# --------------------------------------------------------------------
# Limpieza
# --------------------------------------------------------------------

def limpiar(h):
    """Deja HTML valido y con rutas relativas, sin restos del editor."""
    # URLs absolutas -> relativas (regla: las rutas de uploads no se tocan)
    h = re.sub(r'https?://(?:www\.)?pintor-valencia\.com', '', h)
    # Restos de Contact Form 7: el formulario lo pone el componente
    h = re.sub(r'<form\b.*?</form>', '', h, flags=re.S | re.I)
    h = re.sub(r'</?(?:input|textarea|label|button)\b[^>]*>', '', h, flags=re.I)
    # Estilos en linea que Elementor dejaba pegados al texto
    h = re.sub(r'\s+style="[^"]*"', '', h)
    h = re.sub(r'\s+(?:data-[\w-]+|tabindex|dir)="[^"]*"', '', h)
    # Espacios: Elementor mete tabuladores a mansalva
    h = re.sub(r'[ \t]*\n[ \t]*', '\n', h)
    h = re.sub(r'\n{3,}', '\n\n', h)
    h = re.sub(r'[ \t]{2,}', ' ', h)
    # Carga diferida
    h = re.sub(r'<img\b(?![^>]*\bloading=)', '<img loading="lazy" decoding="async"', h)
    h = re.sub(r'<iframe\b(?![^>]*\bloading=)', '<iframe loading="lazy"', h)
    # Restos vacios que deja Contact Form 7 al quitarle el formulario
    h = re.sub(r'<p\b[^>]*\brole="status"[^>]*>\s*</p>', '', h, flags=re.I)
    h = re.sub(r'<(p|ul|ol|div|span)\b[^>]*>\s*</\1>', '', h, flags=re.I)
    h = re.sub(r'<a\b[^>]*>\s*</a>', '', h)
    return h.strip()


def texto(fragmento):
    return html.unescape(re.sub(r'<[^>]+>', ' ', fragmento)).replace('\xa0', ' ').strip()


def limpio(fragmento):
    return re.sub(r'\s+', ' ', texto(fragmento)).strip()


# --------------------------------------------------------------------
# Troceado en bloques de primer nivel
# --------------------------------------------------------------------

# Un <a> que solo envuelve una imagen es un bloque de imagen, no de texto.
ENLACE_IMG = re.compile(r'<a\b[^>]*>\s*<img\b[^>]*/?>\s*</a>', re.S | re.I)
BLOQUE = re.compile(
    r'<a\b[^>]*>\s*<img\b[^>]*/?>\s*</a>'          # imagen enlazada
    r'|<img\b[^>]*/?>'                              # imagen suelta
    r'|<iframe\b[^>]*>.*?</iframe>'                 # mapa
    r'|<(h1|h2|h3|h4|p|ul|ol|table|a|figure)\b[^>]*>.*?</\1>',
    re.S | re.I)


def tipo_de(fragmento):
    if ENLACE_IMG.fullmatch(fragmento.strip()) or fragmento.lstrip().startswith('<img'):
        return 'img'
    if fragmento.lstrip().lower().startswith('<iframe'):
        return 'mapa'
    m = re.match(r'<(\w+)', fragmento.strip())
    return m.group(1).lower() if m else 'otro'


def trocear(h):
    bloques, pos = [], 0
    for m in BLOQUE.finditer(h):
        if m.start() > pos and h[pos:m.start()].strip():
            bloques.append(('otro', h[pos:m.start()].strip()))
        bloques.append((tipo_de(m.group(0)), m.group(0)))
        pos = m.end()
    if h[pos:].strip():
        bloques.append(('otro', h[pos:].strip()))
    return bloques


# --------------------------------------------------------------------
# Reconstruccion de lo que Elementor pintaba
# --------------------------------------------------------------------

def _a_h3(fragmento):
    return re.sub(r'<(/?)h2\b([^>]*)>', r'<\1h3\2>', fragmento)


def _figura(fragmento):
    """La imagen (enlazada o no) se envuelve en <figure> semantico."""
    return f'<figure>{fragmento}</figure>'


def es_pregunta(fragmento):
    return limpio(fragmento).endswith('?')


def reconstruir(bloques):
    """Rachas [h2 + imagen + p (+ enlace)] -> rejilla de tarjetas.
    Titulares con '?' seguidos de texto -> acordeon <details>."""
    salida, i = [], 0
    while i < len(bloques):

        # --- rejilla de tarjetas ---
        tarjetas, j = [], i
        while j + 2 < len(bloques):
            if bloques[j][0] not in ('h2', 'h3'):
                break
            if es_pregunta(bloques[j][1]):
                break
            if bloques[j + 1][0] != 'img' or bloques[j + 2][0] != 'p':
                break
            titular, imagen, parrafo = bloques[j][1], bloques[j + 1][1], bloques[j + 2][1]
            k = j + 3
            enlace = ''
            if k < len(bloques) and bloques[k][0] == 'a' and limpio(bloques[k][1]):
                pildora = re.sub(r'<a\b', '<a class="pildora"', bloques[k][1], count=1)
                enlace = f'<p class="tarjeta__cta">{pildora}</p>'
                k += 1
            tarjetas.append(
                f'<article class="tarjeta">{_figura(imagen)}'
                f'<div class="tarjeta__texto">{_a_h3(titular)}{parrafo}{enlace}</div>'
                f'</article>')
            j = k
        if len(tarjetas) >= 2:
            salida.append(('rejilla', f'<div class="rejilla">{"".join(tarjetas)}</div>'))
            i = j
            continue

        # --- acordeon de preguntas ---
        preguntas, j = [], i
        while j + 1 < len(bloques) and bloques[j][0] in ('h2', 'h3', 'h4'):
            if not es_pregunta(bloques[j][1]):
                break
            cuerpo, k = [], j + 1
            while k < len(bloques) and bloques[k][0] in ('p', 'ul', 'ol'):
                cuerpo.append(bloques[k][1])
                k += 1
            if not cuerpo:
                break
            preguntas.append(
                f'<details class="pregunta">'
                f'<summary>{html.escape(limpio(bloques[j][1]))}</summary>'
                f'<div class="pregunta__resp">{"".join(cuerpo)}</div></details>')
            j = k
        if len(preguntas) >= 3:
            salida.append(('acordeon', f'<div class="acordeon">{"".join(preguntas)}</div>'))
            i = j
            continue

        # --- racha de enlaces sueltos -> fila de pildoras ---
        # Elementor los pintaba como botones; en HTML plano quedaban
        # como una pila de <a> sin formato.
        j = i
        while j < len(bloques) and bloques[j][0] == 'a' and limpio(bloques[j][1]):
            j += 1
        if j - i >= 3:
            pildoras = ''.join(
                re.sub(r'<a\b', '<a class="pildora"', c, count=1)
                for _, c in bloques[i:j])
            salida.append(('enlaces', f'<nav class="enlaces">{pildoras}</nav>'))
            i = j
            continue

        # --- imagen suelta -> figure ---
        if bloques[i][0] == 'img':
            salida.append(('figure', _figura(bloques[i][1])))
            i += 1
            continue

        salida.append(bloques[i])
        i += 1
    return salida


def _fusionar(bloques):
    """Agrupa los bloques de texto contiguos en un solo .prosa."""
    salida, acum = [], []
    for tipo, cont in bloques:
        if tipo in ('rejilla', 'acordeon', 'figure', 'mapa', 'enlaces'):
            if acum:
                salida.append(('prosa', ''.join(acum)))
                acum = []
            salida.append((tipo, cont))
        else:
            acum.append(cont)
    if acum:
        salida.append(('prosa', ''.join(acum)))
    return salida


def envolver_secciones(bloques):
    """Cada h2 abre una seccion. Se alterna el fondo."""
    partes, buffer, n = [], [], 0

    def cerrar():
        nonlocal buffer, n
        if not buffer:
            return
        # Una seccion que solo tiene un titular vacio no aporta nada
        if all(not limpio(c) and t not in ('img', 'figure', 'mapa', 'rejilla', 'enlaces')
               for t, c in buffer):
            buffer = []
            return
        n += 1
        fondo = ' seccion--alt' if n % 2 == 0 else ''
        cuerpo = ''.join(
            c if t in ('rejilla', 'acordeon', 'figure', 'mapa', 'enlaces')
            else f'<div class="prosa">{c}</div>'
            for t, c in _fusionar(buffer))
        partes.append(f'<section class="seccion{fondo}">'
                      f'<div class="contenedor">{cuerpo}</div></section>')
        buffer = []

    for tipo, cont in bloques:
        if tipo == 'h2':
            cerrar()
        buffer.append((tipo, cont))
    cerrar()
    return '\n'.join(partes)


def extraer_faq(bloques):
    faqs = []
    for tipo, cont in bloques:
        if tipo != 'acordeon':
            continue
        for m in re.finditer(
                r'<summary>(.*?)</summary>\s*<div[^>]*>(.*?)</details>', cont, re.S):
            p = html.unescape(limpio(m.group(1)))
            r = limpio(m.group(2))
            if p and len(r) > 40:
                faqs.append({'pregunta': p, 'respuesta': r})
    return faqs


# --------------------------------------------------------------------
# Recorrido del export
# --------------------------------------------------------------------

canal = ET.parse(SRC).getroot().find('channel')
resumen, fallos = [], []

for item in canal.findall('item'):
    if item.findtext('wp:post_type', namespaces=NS) != 'page':
        continue
    if item.findtext('wp:status', namespaces=NS) != 'publish':
        continue

    slug = item.findtext('wp:post_name', namespaces=NS)
    fichero = 'home' if slug == SLUG_HOME else slug
    url = '/' if slug == SLUG_HOME else f'/{slug}/'

    meta = {pm.findtext('wp:meta_key', namespaces=NS):
            (pm.findtext('wp:meta_value', namespaces=NS) or '')
            for pm in item.findall('wp:postmeta', NS)}

    crudo = limpiar(item.findtext('content:encoded', namespaces=NS) or '')

    # --- H1: se saca del cuerpo, lo pinta el layout ---
    h1 = ''
    m = re.search(r'<h1\b[^>]*>(.*?)</h1>', crudo, re.S)
    if m:
        h1 = limpio(m.group(1))
        crudo = crudo.replace(m.group(0), '', 1).lstrip()

    bloques = trocear(crudo)

    # --- hero: primera imagen del cuerpo, si va antes que el primer parrafo ---
    hero = None
    for pos, (tipo, cont) in enumerate(bloques[:3]):
        if tipo == 'img':
            src = re.search(r'src="([^"]+)"', cont)
            if src:
                hero = src.group(1)
                bloques.pop(pos)
            break

    bloques = reconstruir(bloques)

    # --- entradilla y CTA de cabecera ---
    entradilla, cta = '', None
    while bloques and bloques[0][0] in ('h2', 'h3') and not limpio(bloques[0][1]):
        bloques.pop(0)
    if bloques and bloques[0][0] in ('h2', 'h3'):
        entradilla = limpio(bloques[0][1])
        bloques.pop(0)
    if bloques and bloques[0][0] in ('h3', 'p') and not entradilla:
        entradilla = limpio(bloques[0][1])
        bloques.pop(0)
    for pos, (tipo, cont) in enumerate(bloques[:3]):
        if tipo == 'a':
            m = re.match(r'<a href="([^"]+)"[^>]*>(.*?)</a>', cont, re.S)
            if m and limpio(m.group(2)):
                cta = {'url': m.group(1), 'texto': limpio(m.group(2))}
                bloques.pop(pos)
            break

    faq = extraer_faq(bloques)

    # Contacto y presupuesto no traen H1 en el cuerpo: se usa el titulo
    if not h1:
        h1 = (item.findtext('title') or '').strip()

    datos = {
        'titulo': item.findtext('title'),
        'url': url,
        'slug': slug,
        'h1': h1,
        'entradilla': entradilla,
        'cta': cta,
        'hero': hero,
        'metaTitulo': meta.get('_yoast_wpseo_title', ''),
        'metaDescripcion': meta.get('_yoast_wpseo_metadesc', ''),
        'focusKeyword': meta.get('_yoast_wpseo_focuskw', ''),
        'imagenPrincipal': hero,
        'faq': faq,
        'botones': {},
        'html': envolver_secciones(bloques),
    }
    # noindex: lo que ya venia marcado en Yoast y, ademas, las paginas
    # que llegan vacias del export (las legales). Se quita borrando la
    # clave del JSON cuando se les escriba el contenido.
    if (meta.get('_yoast_wpseo_meta-robots-noindex') == '1'
            or not datos['html'].strip()):
        datos['noindex'] = True

    (OUT / f'{fichero}.json').write_text(
        json.dumps(datos, ensure_ascii=False, indent=2), encoding='utf-8')

    resumen.append((fichero, datos['html'].count('class="rejilla"'),
                    datos['html'].count('class="tarjeta"'),
                    datos['html'].count('<details'), len(faq),
                    datos['html'].count('<section')))

# --------------------------------------------------------------------
# Informe y comprobaciones
# --------------------------------------------------------------------

resumen.sort()
print(f'{len(resumen)} paginas escritas en {OUT}\n')
print(f'{"pagina":<32}{"rejillas":>9}{"tarjetas":>9}{"details":>8}{"faq":>5}{"secc":>6}')
for r in resumen[:12]:
    print(f'{r[0]:<32}{r[1]:>9}{r[2]:>9}{r[3]:>8}{r[4]:>5}{r[5]:>6}')
print(f'  ... y {len(resumen) - 12} mas')

tot = lambda i: sum(r[i] for r in resumen)
print(f'\nTotales: {tot(1)} rejillas, {tot(2)} tarjetas, '
      f'{tot(3)} preguntas en acordeon, {tot(5)} secciones')
print(f'Paginas sin ninguna seccion: '
      f'{[r[0] for r in resumen if r[5] == 0] or "ninguna"}')
print(f'Paginas sin FAQ: {sum(1 for r in resumen if r[4] == 0)}')

print('\nComprobaciones:')
malos = []
for f in sorted(OUT.glob('*.json')):
    d = json.loads(f.read_text(encoding='utf-8'))
    for mal, msg in [('pintor-valencia.com', 'URL absoluta'),
                     ('<h1', 'H1 en el cuerpo'),
                     ('<form', 'formulario de CF7'),
                     ('style="', 'estilo en linea')]:
        if mal in d['html']:
            malos.append(f'{f.name}: {msg}')
    if not d['h1']:
        malos.append(f'{f.name}: sin H1')
    if not d['metaTitulo']:
        malos.append(f'{f.name}: sin metaTitulo de Yoast')
if malos:
    print('  AVISOS:')
    for m in malos:
        print(f'    - {m}')
else:
    print('  OK - limpio, sin H1 duplicado, sin URLs absolutas, sin restos de CF7')
