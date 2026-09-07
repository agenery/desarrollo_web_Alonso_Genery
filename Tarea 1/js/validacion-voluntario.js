const validateNombre = (nombre) => {
  if (!nombre) return false;
  let lengthValid = nombre.trim().length >= 3;
  return lengthValid;
};

const validateRut = (rut) => {
  if (!rut) return false;
  // Validación de longitud
  let lengthValid = rut.length >= 8 && rut.length <= 9;

  // Solo dígitos, con el último carácter siendo número o 'k'/'K'
  let re = /^[0-9]{7,8}[0-9kK]$/;
  let formatValid = re.test(rut);

  return lengthValid && formatValid;
};

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length >= 6;

  // Validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  return lengthValid && formatValid;
};

const validateTelefono = (telefono) => {
  if (!telefono) return false;
  // Validación de longitud
  let lengthValid = telefono.length === 9;

  // Solo dígitos, comenzando con 9
  let re = /^9[0-9]{8}$/;
  let formatValid = re.test(telefono);

  return lengthValid && formatValid;
};

const validateTelefonoAlt = (telefonoAlt) => {
  if (!telefonoAlt) return true; // Opcional, vacío es válido

  let lengthValid = telefonoAlt.length === 9;
  let re = /^9[0-9]{8}$/;
  let formatValid = re.test(telefonoAlt);

  return lengthValid && formatValid;
};

const validateDireccion = (direccion) => {
  if (!direccion) return true; // Opcional
  let lengthValid = direccion.trim().length >= 5;
  return lengthValid;
};

const validateSelect = (select) => {
  if (!select) return false;
  return true;
};

const validateForm = () => {
  let myForm = document.forms["voluntarioForm"];
  let nombre = myForm["nombre"].value;
  let rut = myForm["rut"].value;
  let email = myForm["email"].value;
  let telefono = myForm["telefono"].value;
  let telefonoAlt = myForm["telefono_alt"].value;
  let direccion = myForm["direccion"].value;
  let region = myForm["select-region"].value;
  let comuna = myForm["select-comuna"].value;

  // Variables auxiliares de validación
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // Lógica de validación
  if (!validateNombre(nombre)) setInvalidInput("Nombre completo");
  if (!validateRut(rut)) setInvalidInput("RUT");
  if (!validateEmail(email)) setInvalidInput("Correo electrónico");
  if (!validateTelefono(telefono)) setInvalidInput("Teléfono");
  if (!validateTelefonoAlt(telefonoAlt)) setInvalidInput("Teléfono alternativo");
  if (!validateDireccion(direccion)) setInvalidInput("Dirección");
  if (!validateSelect(region)) setInvalidInput("Región");
  if (!validateSelect(comuna)) setInvalidInput("Comuna");

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
    // Limpiar formulario y volver los selects a su estado por defecto
    myForm.reset();
    updateComunas();

    myForm.style.display = "none";

    validationMessageElem.innerText = "¡Registro exitoso! Gracias por registrarte como voluntario/a.";
    validationListElem.textContent = "";

    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    let continuarButton = document.createElement("button");
    continuarButton.innerText = "Continuar a Registrar Avistamiento";
    continuarButton.style.marginLeft = "10px";
    continuarButton.addEventListener("click", () => {
      window.location.href = "registro-avistamiento.html";
    });

    validationListElem.appendChild(backButton);
    validationListElem.appendChild(continuarButton);

    validationBox.hidden = false;
  }
};

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);