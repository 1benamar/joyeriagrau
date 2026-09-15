# Actualizar el catálogo

El catálogo de la web (`data/catalogo.json`, `data/productos/` y `data/marcas/`) es una copia de los
productos de joieriagrau.com. Para actualizar precios, stock y productos nuevos, ejecuta estos pasos
en orden desde esta carpeta (necesita Node.js y curl):

```bash
node 1-descargar-sitemap.js
node 3-extraer-listados.js --todo
node 2-extraer-productos.js 4 --todo
node 4-generar-catalogo.js
```

- Los listados van antes que los productos porque, además de las categorías y selecciones, recogen
  las URLs de los productos más recientes, que el sitemap de la tienda todavía no incluye.
- El paso de productos tarda unos 45 minutos. Sin `--todo` solo descarga los productos nuevos.
- El número (`4`) es cuántas descargas se hacen a la vez; no conviene subirlo para no saturar la tienda.
- El paso 4 vacía y vuelve a crear `data/productos/` y `data/marcas/`, así no quedan fichas de productos retirados.
- Los datos intermedios se guardan en `_datos/`, que no hace falta subir al hosting.
- Después, ejecuta `node tools/sitio/construir.js` desde la raíz (comprueba que los enlaces al catálogo
  sigan teniendo productos y actualiza el sitemap) y sube a Hostinger `data/` y las páginas.
