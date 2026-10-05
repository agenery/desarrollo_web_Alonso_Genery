const validateNombre = (nombre) => {
  if (!nombre) return false;
  return nombre.trim().length >= 3;
};

const validateEmail = (email) => {
  if (!email) return false;
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return re.test(email);
};

const validateTelefono = (telefono) => {
  if (!telefono) return false;
  let re = /^9[0-9]{8}$/;
  return re.test(telefono);
};

const validateSelect = (select) => {
  if (!select) return false;
  return true;
};

const validateForm = () => {
  let myForm = document.forms["myForm"];
  let nombre = myForm["nombre"].value;
  let email = myForm["email"].value;
  let telefono = myForm["phone"].value;
  let region = myForm["select-region"].value;
  let comuna = myForm["select-comuna"].value;

  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid = false;
  };

  if (!validateNombre(nombre)) setInvalidInput("Nombre");
  if (!validateEmail(email)) setInvalidInput("Email");
  if (!validateTelefono(telefono)) setInvalidInput("Teléfono");
  if (!validateSelect(region)) setInvalidInput("Región");
  if (!validateSelect(comuna)) setInvalidInput("Comuna");

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
    myForm.submit();
  }
};

const submitBtn = document.getElementById("submit-btn");
if (submitBtn) {
  submitBtn.addEventListener("click", validateForm);
}