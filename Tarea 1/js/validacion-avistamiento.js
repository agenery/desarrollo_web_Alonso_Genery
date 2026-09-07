const validateSelect = (select) => {
  if (!select) return false;
  return true;
};

const validateOtroTipoAve = (tipoAve, otroTipoAve) => {
  // Solo es obligatorio si se eligió "Otra"
  if (tipoAve !== "Otra") return true;
  if (!otroTipoAve) return false;
  return otroTipoAve.trim().length >= 3;
};

const validateNombreAve = (nombre) => {
  if (!nombre) return false;
  return nombre.trim().length >= 3;
};

const validateLugar = (lugar) => {
  if (!lugar) return false;
  return lugar.trim().length >= 3;
};

const validateHora = (hora) => {
  if (!hora) return false;
  // Formato HH:MM, con horas entre 00-23 y minutos entre 00-59
  let re = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
  return re.test(hora);
};

const validateAnio = (año) => {
  if (!año) return false;
  // Verifica que tenga 4 dígitos
  let re = /^[0-9]{4}$/;
  return re.test(año);
};

const validateMes = (mes) => {
  if (!mes) return false;
  // Mes entre 01 y 12
  let re = /^(0[1-9]|1[0-2])$/;
  return re.test(mes);
};

const validateDia = (dia, mes, año) => {
  if (!dia) return false;

  let re = /^[0-9]{1,2}$/;
  if (!re.test(dia)) return false;

  const diaNum = Number(dia);
  const mesNum = Number(mes);
  const anioNum = Number(año);

  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let maxDias = diasPorMes[mesNum - 1];

  if (!maxDias) return false; // El mes no era válido, no se puede calcular el máximo

  return diaNum >= 1 && diaNum <= maxDias;
};

const validateArchivo = (files) => {
  if (!files || files.length !== 1) return false;

  const archivo = files[0];
  const familiaArchivo = archivo.type.split("/")[0];

  return familiaArchivo === "image" || familiaArchivo === "video";
};

// Muestra/oculta el campo "otro tipo de ave" según la opción elegida en el select
const actualizarOtroTipoAve = () => {
  const selectTipoAve = document.getElementById("select-tipo-ave");
  const contenedorOtro = document.getElementById("otro-tipo-ave-contenedor");
  const inputOtro = document.getElementById("otro-tipo-ave");

  if (selectTipoAve.value === "Otra") {
    contenedorOtro.hidden = false;
  } else {
    contenedorOtro.hidden = true;
    inputOtro.value = "";
  }
};

const validateRangoFecha = (dia, mes, año) => {
  if (!dia || !mes || !año) return false;

  const fechaIngresada = new Date(Number(año), Number(mes) - 1, Number(dia));
  
  // Obtener la fecha de hoy al final del día (23:59:59)
  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);

  // Obtener la fecha de hace exactamente un año atrás al inicio del día (00:00:00)
  const haceUnAnio = new Date();
  haceUnAnio.setFullYear(hoy.getFullYear() - 1);
  haceUnAnio.setHours(0, 0, 0, 0);

  // Validar si la fecha está dentro de ese rango
  return fechaIngresada >= haceUnAnio && fechaIngresada <= hoy;
};

const validateForm = () => {
  let myForm = document.forms["avistamientoForm"];
  let tipoAve = myForm["select-tipo-ave"].value;
  let otroTipoAve = myForm["otro-tipo-ave"].value;
  let nombreAve = myForm["nombre-ave"].value;
  let lugar = myForm["lugar"].value;
  let dia = myForm["dia"].value;
  let mes = myForm["mes"].value;
  let año = myForm["año"].value;
  let hora = myForm["hora"].value;
  let archivos = myForm["archivo"].files;

  // Variables auxiliares de validación
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // Lógica de validación
  if (!validateSelect(tipoAve)) setInvalidInput("Tipo de ave");
  if (!validateOtroTipoAve(tipoAve, otroTipoAve)) setInvalidInput("Especificación del tipo de ave");
  if (!validateNombreAve(nombreAve)) setInvalidInput("Nombre del ave");
  if (!validateLugar(lugar)) setInvalidInput("Lugar");
  if (!validateAnio(año)) setInvalidInput("Año (debe ser 2025 o 2026)");
  if (!validateMes(mes)) setInvalidInput("Mes (debe ser entre 01 y 12)");
  if (!validateDia(dia, mes, año)) setInvalidInput("Día (fuera de rango para el mes indicado)");
  if (!validateHora(hora)) setInvalidInput("Hora (formato HH:MM, 00-23 y 00-59)");
  if (!validateArchivo(archivos)) setInvalidInput("Foto o video");
  if (validateAnio(año) && validateMes(mes) && validateDia(dia, mes, año)) {
    if (!validateRangoFecha(dia, mes, año)) {
      setInvalidInput("La fecha del avistamiento debe estar entre hoy y un año atrás");
    }
  }

  // Finalmente mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");

  if (!isValid) {
    validationListElem.textContent = "";
    for (const input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    validationBox.hidden = false;
  } else {
    myForm.reset();
    actualizarOtroTipoAve();
    myForm.style.display = "none";

    validationMessageElem.innerText = "¡Gracias por registrar tu avistamiento! Tu aporte ayuda a mantener actualizado el registro de aves de Chile.";
    validationListElem.textContent = "";

    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    let verListadoButton = document.createElement("button");
    verListadoButton.innerText = "Ver Listado de Avistamientos";
    verListadoButton.style.marginLeft = "10px";
    verListadoButton.addEventListener("click", () => {
      window.location.href = "listado-avistamiento.html";
    });

    validationListElem.appendChild(backButton);
    validationListElem.appendChild(verListadoButton);

    validationBox.hidden = false;
  }
};

document.getElementById("select-tipo-ave").addEventListener("change", actualizarOtroTipoAve);

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);