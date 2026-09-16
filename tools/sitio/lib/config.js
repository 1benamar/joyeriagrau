// Datos generales de la web: dominio, contacto, tiendas y navegación.
module.exports = {
  // Dominio público (se usa en canonical, Open Graph, sitemap y datos estructurados)
  url: "https://joieriagrau.com",
  nombre: "Joyería Grau",
  razonSocial: "Joieria Grau",
  imagenPorDefecto: { src: "assets/img/og-grau.jpg", width: 1200, height: 630 },

  telefono: { texto: "935 193 303", internacional: "+34 935 193 303", href: "+34935193303" },
  whatsapp: "34972364222",
  email: "hola@joieriagrau.com",
  horarioAtencion: "Lunes a sábado, de 10:00 a 20:00 h",
  sugerencias: "https://forms.gle/ZRt7PXa7kvU6q5Qw8",
  redes: [
    ["Instagram", "https://www.instagram.com/joieriagrau/"],
    ["Facebook", "https://es-es.facebook.com/joieriagrau/"],
    ["Pinterest", "https://www.pinterest.com/joieriagrau/"],
    ["TikTok", "https://www.tiktok.com/@joieriagrau"],
  ],

  tiendas: [
    {
      slug: "barcelona", nombre: "Barcelona", nota: "Distribuidor oficial Rolex",
      calle: "Avinguda Diagonal, 538", cp: "08006", ciudad: "Barcelona", provincia: "Barcelona",
      horario: "Lunes a sábado, de 11:00 a 20:00 h",
      horas: [["Mo,Tu,We,Th,Fr,Sa", "11:00", "20:00"]],
      telefono: "935 193 303", tel: "+34935193303", mapa: "https://goo.gl/maps/Z6WxXbZQNmudJMJ86",
      foto: ["tienda-barcelona.jpg", 900, 600], miniatura: "boutique-barcelona.jpg",
    },
    {
      slug: "lloret", nombre: "Lloret de Mar", nota: "Nuestra primera joyería, desde 1947",
      calle: "Carrer de Sant Romà, 22", cp: "17310", ciudad: "Lloret de Mar", provincia: "Girona",
      horario: "Lunes a sábado, de 10:00 a 13:30 h y de 16:30 a 20:00 h",
      horas: [["Mo,Tu,We,Th,Fr,Sa", "10:00", "13:30"], ["Mo,Tu,We,Th,Fr,Sa", "16:30", "20:00"]],
      telefono: "972 364 222", tel: "+34972364222", mapa: "https://goo.gl/maps/44UuukDzbcVEeRCd7",
      foto: ["tienda-lloret.jpg", 500, 333], miniatura: "boutique-lloret.jpg",
    },
    {
      slug: "sabadell", nombre: "Sabadell", nota: "Joyería y relojería",
      calle: "Passeig de Manresa, 41", cp: "08201", ciudad: "Sabadell", provincia: "Barcelona",
      horario: "Lunes, de 17:00 a 20:00 h<br>Martes a sábado, de 10:00 a 13:30 h y de 17:00 a 20:00 h",
      horas: [["Mo", "17:00", "20:00"], ["Tu,We,Th,Fr,Sa", "10:00", "13:30"], ["Tu,We,Th,Fr,Sa", "17:00", "20:00"]],
      telefono: "937 256 574", tel: "+34937256574", mapa: "https://goo.gl/maps/Aj171dMa1c7jZtro7",
      foto: ["tienda-sabadell.jpg", 500, 333], miniatura: "boutique-sabadell.jpg",
    },
    {
      slug: "blanes", nombre: "Blanes", nota: "Joyería y relojería",
      calle: "Carrer Ample, 32", cp: "17300", ciudad: "Blanes", provincia: "Girona",
      horario: "Lunes a sábado, de 10:00 a 13:00 h y de 17:00 a 20:00 h",
      horas: [["Mo,Tu,We,Th,Fr,Sa", "10:00", "13:00"], ["Mo,Tu,We,Th,Fr,Sa", "17:00", "20:00"]],
      telefono: "972 332 681", tel: "+34972332681", mapa: "https://goo.gl/maps/2Y41hmbwuuz14GYp7",
      foto: ["tienda-blanes.jpg", 500, 333], miniatura: "boutique-blanes.jpg",
    },
  ],

  navegacion: {
    izquierda: [["joyas.html", "Joyas"], ["relojes.html", "Relojes"], ["compromiso.html", "Compromiso"], ["marcas.html", "Marcas"]],
    derecha: [["pre-owned.html", "Pre-owned"], ["tiendas.html", "Tiendas"]],
  },

  // Menús desplegables de escritorio: columnas de enlaces y piezas destacadas con imagen
  menus: {
    "joyas.html": {
      enlace: "Descubrir la joyería Grau",
      columnas: [
        ["Por tipo de joya", [["catalogo.html?seccion=joyas&cat=anillos", "Anillos"], ["catalogo.html?seccion=joyas&cat=pendientes", "Pendientes"], ["catalogo.html?seccion=joyas&cat=collares", "Collares"], ["catalogo.html?seccion=joyas&cat=pulseras", "Pulseras"], ["catalogo.html?seccion=joyas&cat=charms", "Charms"], ["catalogo.html?seccion=joyas", "Todas las joyas"]]],
        ["Colecciones Grau", [["catalogo.html?seccion=joyas&coleccion=aura", "Aura"], ["catalogo.html?seccion=joyas&coleccion=halo", "Halo"], ["catalogo.html?seccion=joyas&coleccion=good-mood", "Good Mood"], ["catalogo.html?seccion=joyas&coleccion=my-essence", "My Essence"], ["cita.html?servicio=personalizadas", "Joyas personalizadas"]]],
        ["Firmas de joyería", [["catalogo.html?marca=messika", "Messika"], ["catalogo.html?marca=pomellato", "Pomellato"], ["catalogo.html?marca=damiani", "Damiani"], ["catalogo.html?marca=dinh-van", "Dinh Van"], ["catalogo.html?marca=roberto-coin", "Roberto Coin"], ["chopard.html", "Chopard"]]],
      ],
      destacados: [["joyas-hero-640.jpg", 640, 800, "Colección Aura", "Colección insignia desde 1994", "catalogo.html?seccion=joyas&coleccion=aura"]],
    },
    "relojes.html": {
      enlace: "Descubrir la relojería",
      columnas: [
        ["Distribuidor oficial", [["rolex.html", "Rolex"], ["tudor.html", "Tudor"], ["cartier.html", "Cartier"], ["cita.html?servicio=tecnico", "Servicio técnico oficial"]]],
        ["Firmas de relojería", [["catalogo.html?marca=omega", "Omega"], ["catalogo.html?marca=tag-heuer", "TAG Heuer"], ["chopard.html", "Chopard"], ["catalogo.html?marca=longines", "Longines"], ["catalogo.html?marca=hublot", "Hublot"], ["catalogo.html?marca=tissot", "Tissot"]]],
        ["Encuentra tu reloj", [["catalogo.html?seccion=relojes&para=hombre", "Relojes de hombre"], ["catalogo.html?seccion=relojes&para=mujer", "Relojes de mujer"], ["catalogo.html?seccion=relojes&tipo=automatico", "Automáticos"], ["pre-owned.html", "Grau Pre-owned"], ["catalogo.html?seccion=relojes", "Todos los relojes"]]],
      ],
      destacados: [["rolex-m-640.jpg", 640, 777, "Rolex", "Distribuidor oficial", "rolex.html"]],
    },
    "compromiso.html": {
      enlace: "Descubrir compromiso y boda",
      columnas: [
        ["Compromiso y boda", [["compromiso.html#anillos", "Anillos de compromiso"], ["compromiso.html#alianzas", "Alianzas de boda"], ["compromiso.html#estuche", "El estuche Grau"], ["cita.html?servicio=compromiso", "Pedir cita de compromiso"]]],
        ["El gran día", [["catalogo.html?seccion=joyas&cat=collares&ocasion=novia", "Collares de novia"], ["catalogo.html?seccion=joyas&cat=pendientes&ocasion=novia", "Pendientes de novia"], ["catalogo.html?cat=gemelos&ocasion=novia", "Gemelos de novio"], ["catalogo.html?seccion=relojes&ocasion=compromiso", "Relojes de compromiso"]]],
      ],
      destacados: [["comp-hero-640.jpg", 640, 800, "Anillos de compromiso", "Hechos a mano en nuestro taller", "compromiso.html#anillos"], ["comp-alianzas-640.jpg", 640, 800, "Alianzas de boda", "Oro de 18 k y platino", "compromiso.html#alianzas"]],
    },
    "marcas.html": {
      enlace: "Ver todas las marcas",
      columnas: [
        ["Relojería", [["rolex.html", "Rolex"], ["tudor.html", "Tudor"], ["cartier.html", "Cartier"], ["catalogo.html?marca=omega", "Omega"], ["catalogo.html?marca=tag-heuer", "TAG Heuer"], ["catalogo.html?marca=longines", "Longines"]]],
        ["Joyería", [["catalogo.html?marca=grau", "Grau"], ["catalogo.html?marca=messika", "Messika"], ["catalogo.html?marca=pomellato", "Pomellato"], ["catalogo.html?marca=damiani", "Damiani"], ["chopard.html", "Chopard"], ["catalogo.html?marca=roberto-coin", "Roberto Coin"]]],
        ["Accesorios", [["catalogo.html?marca=montblanc", "Montblanc"], ["catalogo.html?marca=deakin-francis", "Deakin & Francis"], ["catalogo.html?seccion=accesorios", "Todos los accesorios"]]],
      ],
      destacados: [["tienda-m-640.jpg", 640, 640, "Nuestras boutiques", "Las maisons, en persona", "tiendas.html"]],
    },
  },
};
