function verMas(boton) {
  const servicio = boton.parentElement;
  const caja = servicio.querySelector('.descripcion-larga');

  if (caja.classList.contains('show')) {
    caja.classList.remove('show');
    boton.textContent = 'ver más';
  } else {
    caja.classList.add('show');
    boton.textContent = 'ver menos';
  }
}
function mostrarModal(tipo) {
  const modal = document.getElementById("modal");
  const texto = document.getElementById("modal-texto");

  let contenido = "";

  switch (tipo) {
    case 'quienes':
      contenido = '<h2>¿Quiénes somos?</h2><p>Somos Constructora La Cima, una empresa dedicada a la construcción, remodelación y diseño de viviendas personalizadas.</p>';
      break;
    case 'mision':
      contenido = '<h2>Misión</h2><p>Proveer soluciones integrales en construcción.</p>'; +
                   '<h2>Visión</h2><p>Ser líderes a nivel nacional, innovando con responsabilidad ambiental.</p>';
      break;
    case 'contacto':
      contenido = '<h2>Contáctanos</h2><p>Dirección: Carrera 13 # 8-38<br>Tel: 3145676097<br>Email: lacimaconstructora2025@gmail.com</p>';
      break;
  }
    texto.innerHTML = contenido;
    modal.style.display = "block";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";

}