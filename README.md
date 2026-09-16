# Joyería Grau · web

Web estática (HTML, CSS y JavaScript sin dependencias) con catálogo de productos, fichas,
páginas de marca, blog, páginas legales y formularios de newsletter y cita previa.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `*.html`, `blog/*.html` | Páginas generadas. **No se editan a mano**: se regeneran con el build. |
| `styles.css`, `main.js`, `catalogo.js` | Estilos, interacciones generales y catálogo (listado, filtros y ficha). |
| `assets/img`, `assets/docs` | Imágenes (con versiones `-640` y `-1280` para `srcset`) y PDF de la guía de tallas. |
| `data/` | Catálogo generado: `catalogo.json`, una ficha por producto en `productos/` y una selección por marca en `marcas/`. |
| `api/formulario.php` | Recibe los formularios y los envía por correo a hola@joieriagrau.com. |
| `tools/sitio/` | Generador de páginas: plantilla, páginas y contenido del blog e informativas. |
| `tools/catalogo/` | Scripts que copian el catálogo de joieriagrau.com (ver su `LEEME.md`). |
| `.htaccess`, `robots.txt`, `sitemap.xml`, `404.html` | Configuración del servidor y SEO. |

## Comandos (Node.js 18 o superior)

```bash
node tools/sitio/construir.js
```

Genera todas las páginas, `sitemap.xml` y `robots.txt`. Antes de escribir comprueba que no haya
enlaces rotos, anclas inexistentes, enlaces al catálogo sin productos, imágenes sin `alt`, ids
duplicados ni páginas sin un único `h1`; si encuentra un error, no escribe nada y lo indica.

```bash
node tools/preview-server.js
```

Sirve la web en http://localhost:8765 para revisarla (sin PHP: los formularios mostrarán su mensaje de error).

## Dónde se cambia cada cosa

- Teléfono, email, redes, tiendas, horarios, menú y menús desplegables: `tools/sitio/lib/config.js`.
- Portada (capítulos a pantalla completa, colecciones, relojería y taller): `tools/sitio/paginas/inicio.js`.
- Animaciones e interacciones (capítulos, menú desplegable, colecciones en horizontal, cursor, desplazamiento suave): `main.js`.
  Todas respetan la preferencia de movimiento reducido del sistema.
- Cabecera, pie y bloques comunes: `tools/sitio/lib/plantilla.js` y `tools/sitio/lib/bloques.js`.
- Textos de cada página: `tools/sitio/paginas/`.
- Artículos del blog y páginas legales: `tools/sitio/contenido/`.

Después de cualquier cambio, vuelve a ejecutar el build.

## Publicación en Hostinger

Sube todo excepto la carpeta `tools/` (el `.htaccess` la bloquea igualmente si se sube).
Los formularios necesitan PHP con `mail()` habilitado, que Hostinger tiene activo por defecto.
Cuando el certificado SSL esté instalado, activa la redirección a HTTPS al final del `.htaccess`.
