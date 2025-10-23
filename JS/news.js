// --- Carga de noticias desde un archivo externo (JSON o XML) ---
// Esta función se encarga de leer las noticias desde un archivo JSON o XML
// y mostrarlas dentro del contenedor que le digamos (por defecto, #news)
export async function loadNews(selector = '#news') {

  // Buscamos el elemento donde vamos a mostrar las noticias
  const el = document.querySelector(selector);
  el.innerHTML = '<div class="news-item">Cargando noticias…</div>'; // Mensaje temporal

  // Intentamos primero cargar las noticias desde un archivo JSON
  try {
    const res = await fetch('./VIEWS/noticias.json', { cache: 'no-store' }); // Leemos el JSON
    if (!res.ok) throw new Error('No JSON'); // Si hay error, pasamos al siguiente intento
    const data = await res.json(); // Convertimos la respuesta a formato JSON
    render(el, data.noticias); // Mostramos las noticias en pantalla
    return; // Terminamos aquí si salió bien
  } catch (e) {
    /* Si falla el JSON, seguimos al siguiente intento (XML) */
  }

  // Si el JSON no existe o falla, probamos con un archivo XML
  try {
    const res2 = await fetch('./VIEWS/noticias.xml', { cache: 'no-store' });
    const text = await res2.text(); // Leemos el texto del XML
    const xml = new DOMParser().parseFromString(text, 'application/xml'); // Lo convertimos a un objeto XML

    // Extraemos la información de cada <item> dentro del XML
    const items = Array.from(xml.querySelectorAll('item')).map(n => ({
      titulo: n.querySelector('title')?.textContent || 'Sin título',
      fecha: n.querySelector('pubDate')?.textContent || '',
      resumen: n.querySelector('description')?.textContent || '',
      url: n.querySelector('link')?.textContent || '#'
    }));

    render(el, items); // Mostramos las noticias obtenidas
    return;
  } catch (e) {
    /* Si tampoco hay XML, pasamos al último paso (noticias de ejemplo) */
  }

  // Si no hay JSON ni XML, mostramos noticias estáticas de ejemplo
  render(el, [
    { titulo: 'Nike is Back in Latin America', fecha: '2025-10-10', resumen: 'FootyHeadlines: Regreso de Nike a LATAM.', url: 'https://www.footyheadlines.com/2025/10/nike-is-back-in-latin-america.html' },
    { titulo: 'DFB 2026 Home Kit', fecha: '2025-02-12', resumen: 'Primera info de la local de Alemania 2026.', url: 'https://www.footyheadlines.com/2025/02/dfb-2026-home-kit.html' },
    { titulo: 'Germany 2026 Jacket', fecha: '2025-10-05', resumen: 'Chaqueta Alemania 2026 filtrada.', url: 'https://www.footyheadlines.com/2025/10/germany-2026-jacket.html' },
    { titulo: 'Adidas 2026 Ball Set', fecha: '2025-09-21', resumen: 'Set de balones Adidas 2026.', url: 'https://www.footyheadlines.com/2025/09/adidas-2026-ball-set.html' }
  ]);
}

// --- Función auxiliar para formatear la fecha ---
// Convierte una fecha en formato texto a un formato más legible (día, mes, año)
function formatDate(str) {
  const d = new Date(str);
  return isNaN(d)
    ? (str || '') // Si no es una fecha válida, devuelve el texto original
    : d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

// --- Función auxiliar para evitar errores con caracteres especiales ---
// Evita que símbolos como < o & rompan el HTML (seguridad básica)
function esc(s = '') {
  return s.replace(/[&<>"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[m]));
}

// --- Función para mostrar las noticias en pantalla ---
// Recibe el elemento donde irán las noticias y la lista de noticias
function render(host, items) {
  host.innerHTML = ''; // Limpiamos el contenedor antes de agregar nuevas noticias

  // Recorremos cada noticia y la agregamos al HTML
  items.forEach(x => {
    const a = document.createElement('article'); // Creamos un elemento <article>
    a.className = 'news-item'; // Le damos la clase CSS

    // Definimos su contenido HTML
    a.innerHTML = `
      <h3><a target="_blank" rel="noopener" href="${esc(x.url)}">${esc(x.titulo)}</a></h3>
      <time datetime="${esc(x.fecha)}">${formatDate(x.fecha)}</time>
      <p class="lead">${esc(x.resumen)}</p>
      <div class="news-actions">
        <a class="btn" href="${esc(x.url)}" target="_blank" rel="noopener">Leer en la fuente</a>
      </div>
    `;

    // Lo agregamos dentro del contenedor principal
    host.appendChild(a);
  });
}
