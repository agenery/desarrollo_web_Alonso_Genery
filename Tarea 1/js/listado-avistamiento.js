// Estado actual del listado: filtro aplicado, criterio/orden de ordenamiento y página vigente.
const estadoListado = {
  filtroTipo: "",
  campoOrden: "fecha",
  ordenAscendente: false, // por defecto: fecha más reciente primero
  paginaActual: 1
};

const AVISTAMIENTOS_POR_PAGINA = 5;

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};

const obtenerDatosProcesados = () => {
  // 1. Filtrar por tipo de ave
  let datos = avistamientosEjemplo.filter(avistamiento => {
    if (estadoListado.filtroTipo === "") return true;
    return avistamiento.tipo === estadoListado.filtroTipo;
  });

  // 2. Ordenar según el campo y dirección vigentes
  datos.sort((a, b) => {
    let comparacion = 0;
    if (estadoListado.campoOrden === "fecha") {
      comparacion = a.fecha.localeCompare(b.fecha);
    } else if (estadoListado.campoOrden === "lugar") {
      comparacion = a.lugar.localeCompare(b.lugar);
    }
    return estadoListado.ordenAscendente ? comparacion : -comparacion;
  });

  return datos;
};

const renderizarTabla = () => {
  const datosProcesados = obtenerDatosProcesados();
  const tabla = document.getElementById("tabla-avistamientos");
  const mensajeSinResultados = document.getElementById("sin-resultados");

  tabla.innerHTML = "";

  if (datosProcesados.length === 0) {
    mensajeSinResultados.hidden = false;
  } else {
    mensajeSinResultados.hidden = true;
  }

  // Calcular límites de la página actual
  const totalPaginas = Math.max(1, Math.ceil(datosProcesados.length / AVISTAMIENTOS_POR_PAGINA));
  if (estadoListado.paginaActual > totalPaginas) {
    estadoListado.paginaActual = totalPaginas;
  }

  const inicio = (estadoListado.paginaActual - 1) * AVISTAMIENTOS_POR_PAGINA;
  const datosPagina = datosProcesados.slice(inicio, inicio + AVISTAMIENTOS_POR_PAGINA);

  datosPagina.forEach(avistamiento => {
    const fila = document.createElement("tr");

    const tipoMostrado = (avistamiento.tipo === "Otra" && avistamiento.tipoDetalle)
      ? `Otra (${avistamiento.tipoDetalle})`
      : avistamiento.tipo;

    fila.innerHTML = `
      <td><img src="${avistamiento.imagen}" alt="Imagen del avistamiento: ${avistamiento.nombre}" class="miniatura-ave"></td>
      <td>${tipoMostrado}</td>
      <td>${avistamiento.nombre}</td>
      <td>${avistamiento.lugar}</td>
      <td>${formatearFecha(avistamiento.fecha)}</td>
      <td>${avistamiento.hora}</td>
    `;

    tabla.appendChild(fila);
  });

  document.getElementById("indicador-pagina").textContent = `Página ${estadoListado.paginaActual} de ${totalPaginas}`;
  document.getElementById("pagina-anterior").disabled = estadoListado.paginaActual === 1;
  document.getElementById("pagina-siguiente").disabled = estadoListado.paginaActual === totalPaginas;
};

const actualizarTextoBotonesOrden = () => {
  const botonFecha = document.getElementById("orden-fecha");
  const botonLugar = document.getElementById("orden-lugar");

  const flecha = estadoListado.ordenAscendente ? "↑" : "↓";

  botonFecha.textContent = estadoListado.campoOrden === "fecha"
    ? `Ordenar por fecha ${flecha}`
    : "Ordenar por fecha";

  botonLugar.textContent = estadoListado.campoOrden === "lugar"
    ? `Ordenar por lugar ${flecha}`
    : "Ordenar por lugar";
};

const cambiarCampoOrden = (campo) => {
  if (estadoListado.campoOrden === campo) {
    // Si ya se está ordenando por este campo, invertir la dirección
    estadoListado.ordenAscendente = !estadoListado.ordenAscendente;
  } else {
    // Cambio de campo: se parte en orden descendente por defecto
    estadoListado.campoOrden = campo;
    estadoListado.ordenAscendente = false;
  }
  estadoListado.paginaActual = 1;
  actualizarTextoBotonesOrden();
  renderizarTabla();
};

document.getElementById("filtro-tipo").addEventListener("change", (evento) => {
  estadoListado.filtroTipo = evento.target.value;
  estadoListado.paginaActual = 1;
  renderizarTabla();
});

document.getElementById("orden-fecha").addEventListener("click", () => cambiarCampoOrden("fecha"));
document.getElementById("orden-lugar").addEventListener("click", () => cambiarCampoOrden("lugar"));

document.getElementById("pagina-anterior").addEventListener("click", () => {
  if (estadoListado.paginaActual > 1) {
    estadoListado.paginaActual--;
    renderizarTabla();
  }
});

document.getElementById("pagina-siguiente").addEventListener("click", () => {
  estadoListado.paginaActual++;
  renderizarTabla();
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarTextoBotonesOrden();
  renderizarTabla();
});