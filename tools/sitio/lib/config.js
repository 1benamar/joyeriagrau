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
    derecha: [["pre-owned.html", "Pre-owned"], ["tiendas.html", "Tiendas"], ["newsletter.html", "Newsletter"]],
  },
};
