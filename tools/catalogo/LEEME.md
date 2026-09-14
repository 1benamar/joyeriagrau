# Actualizar el catálogo

El catálogo de la web (`data/catalogo.json` y `data/productos/`) es una copia de los
productos de joieriagrau.com. Para actualizar precios, stock y productos nuevos,
ejecuta estos pasos en orden desde esta carpeta (necesita Node.js y curl):

```bash
node 1-descargar-sitemap.js
node 2-extraer-productos.js 4 --todo
node 3-extraer-listados.js --todo
node 4-generar-catalogo.js
```

- El paso 2 tarda unos 45 minutos. Sin `--todo` solo descarga los productos nuevos.
- El número (`4`) es cuántas descargas se hacen a la vez; no conviene subirlo para no
  saturar el servidor de la tienda.
- Los datos intermedios se guardan en `_datos/`, que no hace falta subir al hosting.
- Después, sube a Hostinger la carpeta `data/` actualizada.
