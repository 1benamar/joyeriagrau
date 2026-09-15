<?php
/**
 * Recibe los formularios de la web (newsletter y cita previa) y los envía por correo
 * a la joyería. Responde siempre en JSON: {"ok": true} o {"ok": false, "error": "...", "campos": [...]}.
 *
 * Requisitos: PHP 7.4 o superior con la función mail() habilitada (activa por defecto en Hostinger).
 */
declare(strict_types=1);

const DESTINO = 'hola@joieriagrau.com';
const TIENDAS = ['barcelona' => 'Barcelona', 'lloret' => 'Lloret de Mar', 'sabadell' => 'Sabadell', 'blanes' => 'Blanes', 'online' => 'Compra online'];
const SERVICIOS = ['joyas' => 'Joyas', 'personalizadas' => 'Joyas personalizadas', 'compromiso' => 'Anillos de compromiso y alianzas', 'relojes' => 'Relojes', 'tecnico' => 'Servicio técnico de relojería', 'preowned' => 'Pre-owned', 'otras' => 'Otras consultas'];
const FRANJAS = ['manana' => 'Mañana', 'tarde' => 'Tarde'];
const INTERESES = ['joyeria' => 'Joyería', 'relojeria' => 'Relojería', 'compromiso' => 'Compromiso', 'pre-owned' => 'Pre-owned'];

date_default_timezone_set('Europe/Madrid');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Texto de una línea, sin saltos (evita inyección de cabeceras) y con longitud máxima */
function linea(string $clave, int $max = 200): string
{
    $valor = isset($_POST[$clave]) && is_string($_POST[$clave]) ? $_POST[$clave] : '';
    $valor = trim(preg_replace('/[\r\n\t]+/', ' ', $valor) ?? '');
    return mb_substr($valor, 0, $max);
}

function texto(string $clave, int $max = 2000): string
{
    $valor = isset($_POST[$clave]) && is_string($_POST[$clave]) ? $_POST[$clave] : '';
    return mb_substr(trim(str_replace("\r", '', $valor)), 0, $max);
}

function opcion(string $clave, array $permitidas): string
{
    $valor = linea($clave, 40);
    return array_key_exists($valor, $permitidas) ? $valor : '';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'error' => 'metodo']);
}

// Solo se aceptan envíos desde la propia web
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origen !== '' && parse_url($origen, PHP_URL_HOST) !== preg_replace('/:\d+$/', '', $host)) {
    responder(403, ['ok' => false, 'error' => 'origen']);
}

// Campo trampa para bots: si viene relleno se responde como si todo hubiera ido bien
if (linea('web') !== '') {
    responder(200, ['ok' => true]);
}

$tipo = linea('tipo', 20);
$email = linea('email', 160);
$campos = [];
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $campos[] = 'email';
}
if (linea('consent', 5) !== '1') {
    $campos[] = 'consent';
}

$fecha = date('d/m/Y H:i');
if ($tipo === 'newsletter') {
    if ($campos) {
        responder(422, ['ok' => false, 'error' => 'validacion', 'campos' => $campos]);
    }
    $intereses = [];
    foreach ((array) ($_POST['intereses'] ?? []) as $interes) {
        if (is_string($interes) && isset(INTERESES[$interes])) {
            $intereses[] = INTERESES[$interes];
        }
    }
    $tienda = opcion('tienda', TIENDAS);
    $asunto = 'Nueva suscripción a La Carta de Grau';
    $cuerpo = "Nueva suscripción a la newsletter desde la web.\n\n"
        . 'Correo: ' . $email . "\n"
        . 'Nombre: ' . (linea('nombre', 80) ?: '—') . "\n"
        . 'Intereses: ' . ($intereses ? implode(', ', $intereses) : '—') . "\n"
        . 'Boutique preferida: ' . ($tienda ? TIENDAS[$tienda] : '—') . "\n"
        . 'Formulario: ' . (linea('origen', 40) ?: '—') . "\n"
        . 'Consentimiento: aceptado el ' . $fecha . "\n";
} elseif ($tipo === 'cita') {
    $tienda = opcion('tienda', TIENDAS);
    $nombre = linea('nombre', 80);
    $telefono = linea('telefono', 30);
    if ($tienda === '' || $tienda === 'online') {
        $campos[] = 'tienda';
    }
    if ($nombre === '') {
        $campos[] = 'nombre';
    }
    if (strlen(preg_replace('/\D/', '', $telefono) ?? '') < 9) {
        $campos[] = 'telefono';
    }
    if ($campos) {
        responder(422, ['ok' => false, 'error' => 'validacion', 'campos' => $campos]);
    }
    $servicio = opcion('servicio', SERVICIOS);
    $franja = opcion('franja', FRANJAS);
    $dia = linea('fecha', 10);
    $marcaTiempo = preg_match('/^\d{4}-\d{2}-\d{2}$/', $dia) ? strtotime($dia) : false;
    $diaValido = $marcaTiempo !== false ? date('d/m/Y', $marcaTiempo) : '';
    $asunto = 'Solicitud de cita en ' . TIENDAS[$tienda] . ' · ' . $nombre;
    $cuerpo = "Nueva solicitud de cita desde la web.\n\n"
        . 'Joyería: ' . TIENDAS[$tienda] . "\n"
        . 'Motivo: ' . ($servicio ? SERVICIOS[$servicio] : 'Sin especificar') . "\n"
        . 'Fecha preferida: ' . ($diaValido ?: 'Sin especificar') . "\n"
        . 'Franja horaria: ' . ($franja ? FRANJAS[$franja] : 'Indiferente') . "\n"
        . 'Producto: ' . (linea('producto', 240) ?: '—') . "\n\n"
        . 'Nombre: ' . trim($nombre . ' ' . linea('apellidos', 120)) . "\n"
        . 'Correo: ' . $email . "\n"
        . 'Teléfono: ' . $telefono . "\n\n"
        . "Mensaje:\n" . (texto('mensaje') ?: '—') . "\n\n"
        . 'Consentimiento de privacidad: aceptado el ' . $fecha . "\n";
} else {
    responder(400, ['ok' => false, 'error' => 'tipo']);
}

$dominio = preg_replace(['/:\d+$/', '/^www\./'], '', $host) ?: 'joieriagrau.com';
$cabeceras = implode("\r\n", [
    'From: Web Joyería Grau <no-reply@' . $dominio . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$asuntoCodificado = '=?UTF-8?B?' . base64_encode($asunto) . '?=';

if (!mail(DESTINO, $asuntoCodificado, $cuerpo, $cabeceras)) {
    responder(500, ['ok' => false, 'error' => 'envio']);
}

responder(200, ['ok' => true]);
