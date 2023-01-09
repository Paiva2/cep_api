const cep = document.querySelector("#cep-field");
const findBtn = document.querySelector("#find-button");
const sendForm = document.querySelector("#child-container");
const formResult = document.querySelector("#form");
const searchResult = document.querySelector(".result-materials");
const iconBefore = document.querySelector(".icon-map");
const iconAfter = document.querySelector(".icon-map-on");
const formCep = document.querySelector("#form-cep");

var cepValueFilter = {
  mask: "00000-000",
};
var mask = IMask(cep, cepValueFilter);

function errorMsg() {
  Swal.fire("CEP inválido!", "", "error");
}

sendForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cep.value.length < 9) {
    errorMsg();
    sendForm.reset();
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Instabilidade nos servidores!");
      } else {
        return response.json();
      }
    })
    .then((response) => {
      const resultData = [
        response.cep,
        response.logradouro,
        response.bairro,
        response.localidade,
        response.uf,
        response.ddd,
      ];
      for (let i = 0; i < resultData.length; i++) {
        if (resultData[i] === undefined) {
          errorMsg();
          sendForm.reset();
          return;
        }
      }

      switchStylesAfter();
      createList(resultData);
    })
    .catch((error) => {
      console.log(error);
    });
});

function createList(resultData) {
  for (let i = 0; i < resultData.length; i++) {
    const li = document.createElement("li");
    formResult.appendChild(li);
    if (resultData[i] == resultData[0]) {
      li.innerHTML = `<b>CEP:</b>&nbsp;${resultData[i]}`;
    }
    if (resultData[i] == resultData[1]) {
      li.innerHTML = `<b>Rua:</b>&nbsp;${resultData[i]}`;
    }
    if (resultData[i] == resultData[2]) {
      li.innerHTML = `<b>Bairro:</b>&nbsp;${resultData[i]}`;
    }
    if (resultData[i] == resultData[3]) {
      li.innerHTML = `<b>Estado:</b>&nbsp;${resultData[i]}`;
    }
    if (resultData[i] == resultData[4]) {
      li.innerHTML = `<b>UF:</b>&nbsp;${resultData[i]}`;
    }
    if (resultData[i] == resultData[5]) {
      li.innerHTML = `<b>DDD:</b>&nbsp;${resultData[i]}`;
    }
  }
}

document.addEventListener("click", (e) => {
  if (e.target.className === "reset-btn") {
    document.querySelector("#form").reset();
    initialStyles();
  }
});

function switchStylesAfter() {
  searchResult.style.display = "flex";
  iconBefore.style.display = "none";
  iconAfter.style.display = "flex";
  formCep.style.display = "flex";
  sendForm.style.display = "none";
}

function initialStyles() {
  searchResult.style.display = "none";
  iconBefore.style.display = "flex";
  iconAfter.style.display = "none";
  formCep.style.display = "none";
  sendForm.style.display = "flex";

  formResult.innerHTML = "";
  cep.value = "";
  sendForm.reset();
  cep.focus();
  mask.updateValue();
}
