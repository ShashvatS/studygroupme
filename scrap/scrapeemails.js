let dropSelect = document.getElementById("1stcontact");
let options = dropSelect.getElementsByTagName("option");
let email = document.getElementById("1stContactEmail");

let text = "";

dropSelect.onchange = () => {
    text = text + email.value + '\n';
}