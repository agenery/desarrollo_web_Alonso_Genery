const NOTA_MINIMA = 1;
const NOTA_MAXIMA = 7;

const inputBuscador = document.getElementById("input-buscador");
const formBuscador = document.getElementById("form-buscador");
const mensajeBuscador = document.getElementById("mensaje-buscador");
const contenedorResultados = document.getElementById("contenedor-resultados");
const cuerpoResultados = document.getElementById("resultados");

const mostrarMensaje = (texto) => {
  mensajeBuscador.innerText = texto;
};

const mostrarCaja = (mensaje, lista, esError) => {
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");

  validationMessageElem.innerText = mensaje;
  validationListElem.innerHTML = "";
  for (const elemento of lista) {
    let listElement = document.createElement("li");
    listElement.innerText = elemento;
    validationListElem.append(listElement);
  }

  if (esError) {
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";
  } else {
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";
  }
  validationBox.hidden = false;
};

const ocultarCaja = () => {
  document.getElementById("val-box").hidden = true;
};

const resaltarTexto = (texto, buscado) => {
  let contenedor = document.createElement("span");
  let textoMinuscula = texto.toLowerCase();
  let buscadoMinuscula = buscado.toLowerCase();

  let inicio = 0;
  let posicion = textoMinuscula.indexOf(buscadoMinuscula);
  while (posicion !== -1) {
    contenedor.append(texto.substring(inicio, posicion));

    let marca = document.createElement("mark");
    marca.innerText = texto.substring(posicion, posicion + buscado.length);
    contenedor.append(marca);

    inicio = posicion + buscado.length;
    posicion = textoMinuscula.indexOf(buscadoMinuscula, inicio);
  }
  contenedor.append(texto.substring(inicio));
  return contenedor;
};

const validarNota = (valor) => {
  if (valor === "") return false;
  let numero = Number(valor);
  return Number.isInteger(numero) && numero >= NOTA_MINIMA && numero <= NOTA_MAXIMA;
};

const mostrarNota = (celdaNota, nota, cantidad) => {
  celdaNota.innerHTML = "";
  celdaNota.append(nota);
  if (Number(cantidad) > 0) {
    let detalle = document.createElement("small");
    detalle.className = "cantidad-notas";
    detalle.innerText = cantidad === "1" ? "(1 nota)" : `(${cantidad} notas)`;
    celdaNota.append(detalle);
  }
};

const mostrarBotonEvaluar = (celdaEvaluar, avistamientoId, celdaNota) => {
  celdaEvaluar.innerHTML = "";
  let botonEvaluar = document.createElement("button");
  botonEvaluar.type = "button";
  botonEvaluar.className = "boton";
  botonEvaluar.innerText = "Evaluar";
  botonEvaluar.addEventListener("click", () =>
    mostrarSelectorNota(celdaEvaluar, avistamientoId, celdaNota)
  );
  celdaEvaluar.append(botonEvaluar);
};

const mostrarSelectorNota = (celdaEvaluar, avistamientoId, celdaNota) => {
  celdaEvaluar.innerHTML = "";

  let selector = document.createElement("select");
  selector.className = "selector-nota";
  selector.setAttribute("aria-label", "Nota del avistamiento");

  let opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.innerText = "Nota";
  selector.append(opcionInicial);

  for (let i = NOTA_MINIMA; i <= NOTA_MAXIMA; i++) {
    let opcion = document.createElement("option");
    opcion.value = i;
    opcion.innerText = i;
    selector.append(opcion);
  }

  let botonGuardar = document.createElement("button");
  botonGuardar.type = "button";
  botonGuardar.className = "boton";
  botonGuardar.innerText = "Guardar";
  botonGuardar.addEventListener("click", () =>
    enviarNota(selector.value, avistamientoId, celdaEvaluar, celdaNota, botonGuardar)
  );

  let botonCancelar = document.createElement("button");
  botonCancelar.type = "button";
  botonCancelar.className = "boton boton-secundario";
  botonCancelar.innerText = "Cancelar";
  botonCancelar.addEventListener("click", () =>
    mostrarBotonEvaluar(celdaEvaluar, avistamientoId, celdaNota)
  );

  celdaEvaluar.append(selector, botonGuardar, botonCancelar);
  selector.focus();
};

const enviarNota = (valor, avistamientoId, celdaEvaluar, celdaNota, botonGuardar) => {
  if (!validarNota(valor)) {
    mostrarCaja("Nota inválida:", [`Seleccione una nota entera entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`], true);
    return;
  }

  let datos = new FormData();
  datos.append("avistamiento_id", avistamientoId);
  datos.append("nota", valor);

  botonGuardar.disabled = true;

  fetch(`${window.origin}/api/nota`, { method: "POST", body: datos })
    .then((response) => response.json())
    .then((respuesta) => {
      if (respuesta["status"] === "ok") {
        mostrarNota(celdaNota, respuesta["nota"], respuesta["cantidad"]);
        mostrarBotonEvaluar(celdaEvaluar, avistamientoId, celdaNota);
        mostrarCaja(`¡Nota ${valor} agregada con éxito! Nuevo promedio: ${respuesta["nota"]}`, [], false);
      } else {
        botonGuardar.disabled = false;
        mostrarCaja("El servidor no aceptó la nota:", respuesta["errors"], true);
      }
    })
    .catch((error) => {
      console.error("Error al enviar la nota:", error);
      botonGuardar.disabled = false;
      mostrarCaja("No se pudo enviar la nota. Intenta nuevamente.", [], true);
    });
};

const crearCelda = (contenido) => {
  let celda = document.createElement("td");
  celda.append(contenido);
  return celda;
};

const limpiarResultados = () => {
  cuerpoResultados.innerHTML = "";
  contenedorResultados.hidden = true;
};

const mostrarResultados = (resultados, buscado) => {
  limpiarResultados();

  if (resultados.length === 0) {
    mostrarMensaje(`No se encontraron avistamientos cuyo ave, voluntario o comuna contenga "${buscado}".`);
    return;
  }

  mostrarMensaje(
    resultados.length === 1
      ? "Se encontró 1 avistamiento."
      : `Se encontraron ${resultados.length} avistamientos.`
  );

  for (const av of resultados) {
    let fila = document.createElement("tr");

    let celdaNota = document.createElement("td");
    celdaNota.className = "celda-nota";
    mostrarNota(celdaNota, av["nota"], av["cantidad"]);

    let celdaEvaluar = document.createElement("td");
    mostrarBotonEvaluar(celdaEvaluar, av["id"], celdaNota);

    fila.append(
      crearCelda(resaltarTexto(av["voluntario"], buscado)),
      crearCelda(av["fecha"]),
      crearCelda(resaltarTexto(av["ave"], buscado)),
      crearCelda(resaltarTexto(av["comuna"], buscado)),
      celdaNota,
      celdaEvaluar
    );
    cuerpoResultados.append(fila);
  }
  contenedorResultados.hidden = false;
};

const buscarAvistamientos = () => {
  let buscado = inputBuscador.value.trim();
  ocultarCaja();

  if (buscado === "") {
    limpiarResultados();
    mostrarMensaje("Comienza a escribir para ver los avistamientos.");
    return;
  }

  let url = `${window.origin}/api/buscar?texto=${encodeURIComponent(buscado)}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta del servidor no fue correcta");
      }
      return response.json();
    })
    .then((respuesta) => {
      if (inputBuscador.value.trim() !== buscado) return;
      mostrarResultados(respuesta["data"], buscado);
    })
    .catch((error) => {
      console.error("Error al buscar avistamientos:", error);
      mostrarMensaje("Ocurrió un error al buscar. Intenta nuevamente.");
    });
};

inputBuscador.addEventListener("input", buscarAvistamientos);

formBuscador.addEventListener("submit", (event) => {
  event.preventDefault();
  buscarAvistamientos();
});
