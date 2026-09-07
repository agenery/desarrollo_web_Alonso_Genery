const totalVoluntariosEjemplo = 128;
const totalAvistamientosEjemplo = 342;

const avistamientosPorTipoEjemplo = {
  "Rapaz": 40,
  "Acuática": 58,
  "Paseriforme": 96,
  "Zancuda": 34,
  "Marina": 47,
  "Nocturna": 21,
  "Otra": 46
};

const voluntariosPorRegionEjemplo = {
  "Metropolitana": 52,
  "Valparaíso": 24,
  "Biobío": 18,
  "Los Lagos": 14,
  "La Araucanía": 12,
  "Coquimbo": 8
};

// Dibuja un gráfico de barras simple usando divs.
const renderizarGraficoBarras = (idContenedor, datos) => {
  const contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = "";

  const etiquetas = Object.keys(datos);

  if (etiquetas.length === 0) {
    contenedor.innerHTML = "<p>Aún no hay datos suficientes para mostrar este gráfico.</p>";
    return;
  }

  const valorMaximo = Math.max(...Object.values(datos));

  etiquetas.forEach(etiqueta => {
    const cantidad = datos[etiqueta];
    const alturaPorcentaje = (cantidad / valorMaximo) * 100;

    const columna = document.createElement("div");
    columna.className = "barra-columna";

    const valor = document.createElement("span");
    valor.className = "barra-valor";
    valor.textContent = cantidad;

    const barra = document.createElement("div");
    barra.className = "barra";
    barra.style.height = `${alturaPorcentaje}%`;

    const etiquetaTexto = document.createElement("span");
    etiquetaTexto.className = "barra-etiqueta";
    etiquetaTexto.textContent = etiqueta;

    columna.appendChild(valor);
    columna.appendChild(barra);
    columna.appendChild(etiquetaTexto);
    contenedor.appendChild(columna);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contador-voluntarios").textContent = totalVoluntariosEjemplo;
  document.getElementById("contador-avistamientos").textContent = totalAvistamientosEjemplo;

  renderizarGraficoBarras("grafico-tipos", avistamientosPorTipoEjemplo);
  renderizarGraficoBarras("grafico-regiones", voluntariosPorRegionEjemplo);
});