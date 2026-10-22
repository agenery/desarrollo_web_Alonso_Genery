const seccionComentarios = document.getElementById("comentarios");
const urlComentarios = seccionComentarios.getAttribute("data-url");
const listaComentarios = document.getElementById("lista-comentarios");
const sinComentarios = document.getElementById("sin-comentarios");

const validateNombre = (nombre) => {
  if (!nombre) return false;
  let largo = nombre.trim().length;
  return largo >= 3 && largo <= 50;
};

const validateTexto = (texto) => {
  if (!texto) return false;
  let largo = texto.trim().length;
  return largo >= 5 && largo <= 300;
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

const mostrarListaComentarios = (comentarios) => {
  listaComentarios.innerHTML = "";
  sinComentarios.hidden = comentarios.length > 0;

  for (const comentario of comentarios) {
    let item = document.createElement("li");

    let encabezado = document.createElement("strong");
    encabezado.innerText = comentario.nombre;

    let fecha = document.createElement("small");
    fecha.innerText = " (" + comentario.fecha + ")";

    let texto = document.createElement("p");
    texto.innerText = comentario.texto;

    item.appendChild(encabezado);
    item.appendChild(fecha);
    item.appendChild(texto);
    listaComentarios.appendChild(item);
  }
};

const cargarComentarios = () => {
  fetch(urlComentarios)
    .then((response) => {
      if (!response.ok) {
        throw new Error("La respuesta del servidor no fue correcta");
      }
      return response.json();
    })
    .then((respuesta) => {
      mostrarListaComentarios(respuesta["data"]);
    })
    .catch((error) => {
      console.error("Error al cargar los comentarios:", error);
    });
};

const agregarComentario = () => {
  let myForm = document.forms["comentarioForm"];
  let nombre = myForm["nombre"].value;
  let texto = myForm["texto"].value;

  let invalidInputs = [];
  if (!validateNombre(nombre)) invalidInputs.push("Nombre (entre 3 y 50 caracteres)");
  if (!validateTexto(texto)) invalidInputs.push("Comentario (entre 5 y 300 caracteres)");

  if (invalidInputs.length > 0) {
    mostrarCaja("Los siguientes campos son inválidos:", invalidInputs, true);
    return;
  }

  fetch(urlComentarios, { method: "POST", body: new FormData(myForm) })
    .then((response) => response.json())
    .then((respuesta) => {
      if (respuesta["status"] === "ok") {
        myForm.reset();
        mostrarCaja("¡Comentario agregado con éxito!", [], false);
        cargarComentarios();
      } else {
        mostrarCaja("El servidor no aceptó el comentario:", respuesta["errors"], true);
      }
    })
    .catch((error) => {
      console.error("Error al enviar el comentario:", error);
      mostrarCaja("No se pudo enviar el comentario. Intenta nuevamente.", [], true);
    });
};

document.getElementById("submit-btn").addEventListener("click", agregarComentario);
cargarComentarios();