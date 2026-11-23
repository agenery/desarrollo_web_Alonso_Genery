const mostrarMensaje = (idContenedor, mensaje) => {
  document.getElementById(idContenedor).innerText = mensaje;
};

const cargarGrafico = (idContenedor, dibujar) => {
  let contenedor = document.getElementById(idContenedor);

  fetch(contenedor.getAttribute("data-url"))
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta del servidor no fue correcta");
      }
      return response.json();
    })
    .then((respuesta) => {
      let datos = respuesta["data"];
      if (datos.length === 0) {
        mostrarMensaje(idContenedor, "Aún no hay datos suficientes para mostrar este gráfico.");
        return;
      }
      dibujar(idContenedor, datos);
    })
    .catch((error) => {
      console.error("Error al cargar los datos:", error);
      mostrarMensaje(idContenedor, "No se pudieron cargar los datos del gráfico.");
    });
};

const dibujarGraficoDias = (idContenedor, datos) => {
  Highcharts.chart(idContenedor, {
    chart: { type: "line" },
    title: { text: "" },
    xAxis: { type: "category", title: { text: "Día" } },
    yAxis: { title: { text: "Cantidad de avistamientos" }, allowDecimals: false, min: 0 },
    legend: { enabled: false },
    series: [{ name: "Avistamientos", data: datos }]
  });
};

const dibujarGraficoTipos = (idContenedor, datos) => {
  Highcharts.chart(idContenedor, {
    chart: { type: "pie" },
    title: { text: "" },
    series: [{ name: "Avistamientos", data: datos }]
  });
};

const dibujarGraficoComunas = (idContenedor, datos) => {
  Highcharts.chart(idContenedor, {
    chart: { type: "column" },
    title: { text: "" },
    xAxis: { type: "category", title: { text: "Comuna" } },
    yAxis: { title: { text: "Voluntarios registrados" }, allowDecimals: false, min: 0 },
    legend: { enabled: false },
    series: [{ name: "Voluntarios", data: datos }]
  });
};

cargarGrafico("grafico-dias", dibujarGraficoDias);
cargarGrafico("grafico-tipos", dibujarGraficoTipos);
cargarGrafico("grafico-comunas", dibujarGraficoComunas);