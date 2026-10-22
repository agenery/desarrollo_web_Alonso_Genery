const validateFiles = (files) => {
    if (!files || files.length === 0) return false;
    let lengthValid = files.length <= 3;
    let typeValid = true;

    for (const file of files) {
      let fileFamily = file.type.split("/")[0];
      typeValid &&= (fileFamily === "image" || fileFamily === "video");
    }
    return lengthValid && typeValid;
};

const validateDate = (dateString) => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return selectedDate <= today && selectedDate >= oneYearAgo;
};

const validateSelect = (select) => {
    if(!select) return false;
    return true;
};

const validateForm = () => {
    let myForm = document.forms["myForm"];
    let voluntario = myForm["voluntario_id"].value;
    let ave = myForm["ave_id"].value;
    let lugar = myForm["lugar"].value;
    let fechaHora = myForm["fecha_hora"].value;
    let archivos = myForm["archivos"].files;

    let invalidInputs = [];
    let isValid = true;

    const setInvalidInput = (inputName) => {
      invalidInputs.push(inputName);
      isValid = false;
    };

    if (!validateSelect(voluntario)) setInvalidInput("Voluntario");
    if (!validateSelect(ave)) setInvalidInput("Ave");
    if (lugar.trim().length === 0) setInvalidInput("Lugar");
    if (!validateDate(fechaHora)) setInvalidInput("Fecha (Debe estar entre hoy y un año atrás)");
    if (!validateFiles(archivos)) setInvalidInput("Archivos (Máximo 3, solo imágenes o videos)");

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