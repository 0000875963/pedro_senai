var form = document.querySelector("form");
var inputs = document.querySelectorAll("input")
var resp = document.querySelector("h3");
var opcoes = document.querySelector("select");
var other_menu = document.querySelector("#other_menu");
var error_message = document.querySelector("#error_message");
var material = opcoes.options[0].text;
var resistividade = opcoes.options[0].value;

form.addEventListener("input", (e) => {
    error_message.innerText = "";
    for(i=0; i<inputs.length; i++){
        inputs[i].style.borderColor = "#FFF"
    }
    var dot = e.target.value.split(/[^.]/).filter(Boolean);
    var letters = e.target.value.split(/[0-9.]/).filter(Boolean).map(Number);
        
    if(!e.data.includes(letters)){
        e.target.value = e.target.value.slice(0, e.target.value.length-1)
    } else if(dot.length > 1 || dot[0].length > 1){
        e.target.value = e.target.value.slice(0, e.target.value.length-1)
    }
    console.log(dot)
})
opcoes.addEventListener("change", (e) => {
    var valor = opcoes.value;
    var texto = opcoes.options[opcoes.selectedIndex].text;

    form.material.value = "";
    form.resistividade.value = "";
    form.comprimento.value = "";
    form.secao_transversal.value = "";
    resp.innerText = "";

    material = texto;
    resistividade = valor;
    if(texto == "Outro"){
        other_menu.style.display = "flex";
    } else {
        other_menu.style.display = "none";
    }

    e.preventDefault();
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(other_menu.style.display == "flex"){
        material = form.material.value;
        resistividade = form.resistividade.value;
    }
    var comprimento = form.comprimento.value;
    var secao_transversal = form.secao_transversal.value;

    if(comprimento == ""){
        error_message.innerText = 'O campo "Comprimento" precisa ser preenchido!';
        form.comprimento.style.borderColor = "red"
        return
    } else if(secao_transversal == "") {
        error_message.innerText = 'O campo "Seção Transversal" precisa ser preenchido!';
        form.secao_transversal.style.borderColor = "red"
        return
    }

    var calculo = (resistividade * comprimento) / secao_transversal;
    resp.innerText = `A Resistência Elétrica de um condutor de ${material}, com uma Seção Transversal de ${secao_transversal}mm² e com um Comprimento de ${comprimento}m, é de ${calculo.toFixed(2)}Ω`;
});