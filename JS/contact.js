// Coordenadas de la tienda (Ultimate Kits)
const business = [40.45306, -3.68835]; // Madrid

// Crea el mapa y lo centra en la ubicación de la tienda
const map = L.map('map').setView(business, 1);

// Capa base del mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

// Marcador de la tienda con su nombre
L.marker(business).addTo(map).bindPopup('Ultimate Kits');

// --- Calcula la ruta desde la ubicación del usuario ---
function ok(pos) {
  const p = [pos.coords.latitude, pos.coords.longitude]; // Coordenadas del usuario
  // Dibuja la ruta entre el usuario y la tienda
  L.Routing.control({
    waypoints: [
      L.latLng(p[0], p[1]),
      L.latLng(business[0], business[1])
    ],
    show: false,          // Oculta el panel lateral
    addWaypoints: false   // Evita que el usuario agregue puntos intermedios
  }).addTo(map);
  document.getElementById('routeStatus').textContent = 'Ruta calculada correctamente.';
}

// Mensaje si no se puede acceder a la ubicación
function err() {
  document.getElementById('routeStatus').textContent =
    'No se pudo obtener tu ubicación. Permite el acceso al GPS.';
}

// Comprueba si el navegador puede obtener la ubicación
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(ok, err);
} else {
  err();
}
