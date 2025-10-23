// Datos de la galería (imágenes y títulos)
const galleryData = [
  {src:'https://mundialfootballstore.com/wp-content/uploads/2024/07/6538ecf0-scaled.jpeg', title:'España Local Fan'},
  {src:'https://www.camisetafutboles.com/images/camisetases2526/Camiseta-Barcelona-1%C2%AA-Equipaci%C3%B3n-2526-Authentic-EB80087.jpg', title:'FC Barcelona Local Player'},
  {src:'https://acdn-us.mitiendanube.com/stores/003/675/491/products/camisa-real-madrid-retro-third-1415-ronaldo-7-torcedor-adidas-masculina-rosa-9-d77056e4859e67e8a817005884025401-1024-1024.jpeg', title:'Alternativa Real Madrid 14/15'},
  {src:'https://kmisetashd.es/12595-large_default/japon-edicion-especial-goku-blanca.jpg', title:'Edición Especial Japón'},
  {src:'https://zonacamisetas.com/cdn/shop/files/97552034.jpg?v=1753824752&width=2048', title:'Fan Local Aston Vila'},
  {src:'https://camisetasfutbolmania.com/43757-large_default/camiseta-futbol-manchester-city-edicion-dragon-version-jugador-2024-2025.jpg', title:'Camiseta Visitante Man City'},
  {src:'https://futbolcamis.es/wp-content/uploads/2023/07/9e490378-scaled.jpeg', title:'Camiseta Bayern Munich 97-98'},
  {src:'https://futbolcamis.es/wp-content/uploads/2024/04/img_0598-1-1-scaled.jpeg', title:'Edición Karol G '}
];

// Contenedor principal de la galería
const grid = document.getElementById('gallery');

// Recorremos el array y creamos las tarjetas
galleryData.forEach(item=>{
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="thumb"><img src="${item.src}" alt="${item.title}"></div>
    <div class="pad"><h3>${item.title}</h3></div>`;
  grid.appendChild(card);
});

// --- Modal (imagen ampliada) ---
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');

// Detecta clic en una imagen y la abre en el modal
grid.addEventListener('click', e => {
  const img = e.target.closest('img'); // Verifica que el clic sea sobre una imagen
  if(!img) return;
  modal.style.display = 'flex'; // Muestra el modal
  modalImg.src = img.src;       // Carga la imagen clicada
  modalImg.alt = img.alt;
});

// Cierra el modal al hacer clic fuera de la imagen
modal.addEventListener('click', () => modal.style.display = 'none');
