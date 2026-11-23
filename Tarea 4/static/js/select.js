const updateComunas = () => {
    let regionSelect = document.getElementById("select-region");
    let comunaSelect = document.getElementById("select-comuna");

    let selectedRegionId = regionSelect.value;

    for (let option of comunaSelect.options) {
        if (option.value === "") {
            option.style.display = "block";
            continue;
        }

        if (option.getAttribute("data-region-id") === selectedRegionId) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
    }

    comunaSelect.value = "";
};

const selectRegion = document.getElementById("select-region");
if (selectRegion) {
    selectRegion.addEventListener("change", updateComunas);

    window.onload = () => {
        updateComunas();
    };
}