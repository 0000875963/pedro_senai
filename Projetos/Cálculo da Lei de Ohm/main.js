var form = document.querySelector("form");
var opcoes = document.querySelector(".opcoes");
var input_opcoes = document.querySelectorAll('input[type="radio"]');
var campos = document.querySelectorAll(".campo");
var resposta = document.querySelector("h3");
var data = {};

opcoes.addEventListener("change", (e) => {
    e.preventDefault()
    for(i=0;i<input_opcoes.length;i++) {
        if(input_opcoes[i].id != e.target.id){
            input_opcoes[i].checked = false;
        }

        campos[i].style.display = "none"
        campos[i].children[1].value = ""
        campos[i].children[2].selectedIndex = 2
        data = {"tensao": undefined, "corrente": undefined, "resistencia": undefined};
        resposta.innerText = ""
        if(campos[i].children[1].id.split("_")[0] != e.target.id.split("_")[0]){
            campos[i].style.display = "block";
            form.submit_btn.style.display = "block";
        }
    }

})

campos.forEach((campo) => {
    var select = campo.children[2];
    var input = campo.children[1];

    select.addEventListener("change", (e) => {
        e.preventDefault();

        if(input.placeholder.split(" ")[2].includes("volts")){
            input.placeholder = `${input.placeholder.split(" ")[0]} em Volts`
        } else if(input.placeholder.split(" ")[2].includes("amperes")) {
            input.placeholder = `${input.placeholder.split(" ")[0]} em Amperes`
        } else if(input.placeholder.split(" ")[2].includes("ohms")) {
            input.placeholder = `${input.placeholder.split(" ")[0]} em Ohms`
        }

        var nomeUnidade = select.value.split("_")[0];
        var placeholder = input.placeholder.split(" ");
        var unidade = placeholder[2];

        placeholder.pop();
        placeholder.push(nomeUnidade+unidade);
        placeholder = placeholder.join(" ");

        if(select.value.split("_")[1] != 0){
            switch (input.placeholder.split(" ")[2]) {
                case "Volts":
                    placeholder = placeholder.replace("V", "v");
                    break;
                case "Amperes":
                    placeholder = placeholder.replace("A", "a");
                    break;
                case "Ohms":
                    placeholder = placeholder.replace("O", "o");
                    break;
                default:
                    break;
            }
            
        }

        input.placeholder = placeholder;
        
        var grandeza = select.id.split("_")[1];
        var expoente = select.value.split("_")[1];
        var conversao;
        var grandezaF;

            if(campo.children[1].value != ""){
                conversao = campo.children[1].value * Math.pow(10, expoente);
            }
            
            switch (grandeza) {
                case "tensao":
                    grandezaF = "Tensão"
                    break;
                case "corrente":
                    grandezaF = "Corrente"
                    break;
                case "resistencia":
                    grandezaF = "Resistência"
                    break;
            
                default:
                    break;
            }
            data[grandeza] = [select[select.selectedIndex].text, select.value, conversao, grandezaF];
    }) 
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    var opcao;
    var res;
    var isReversed;
    var grandezas = ["tensao", "corrente", "resistencia"];
    var grandezasF = []
    var uMedida = [];
    var expoente = [];
    var values = [];
    var hasData= [];
    var j=0;

    for(i=0;i<grandezas.length;i++){
        if(data[grandezas[i]] != undefined){
            grandezasF.push(data[grandezas[i]][3])
            uMedida.push(data[grandezas[i]][0]);
            expoente.push(data[grandezas[i]][1].split("_")[1]);
            values.push(data[grandezas[i]][2]);
            hasData.push(grandezas[i]);
        }
    }

    for(i=0;i<campos.length;i++){
        if(campos[i].children[1].value != ''){
            if(hasData[j] == campos[i].children[1].name){
                j++;
            } else {
                values.push(campos[i].children[1].value);
                uMedida.push(campos[i].children[2][campos[i].children[2].selectedIndex].text);
                values.reverse()
                isReversed = true;
            }
        }
        
        
        if(input_opcoes[i].checked){
            opcao = input_opcoes[i].id.split("_")[0];
        }
        if(i+1==campos.length){
            calc();
        }
    }
    
    function calc(){
        var conversao;
        var grandezasRes = ["Tensão", "Corrente", "Resistência"];
        var uRes;
        var k = 0;

        for(i=0;i<grandezas.length;i++){
            if(grandezasF[k] == grandezasRes[i]){
                k++;  
            } else {
                grandezasF.push(grandezasRes[i])
            }
        }
        switch (opcao) {
            case "tensao":
                var pos = grandezasF.indexOf("Tensão")
                grandezasF.splice(pos, 1);
                grandezasF.unshift("Tensão")

                if(hasData[0] != true){
                    uMedida.push("A")
                }
                if(hasData[1] != true){
                    uMedida.push("Ω")
                }
                res = values[0] * values[1];
                uRes = "V"
                break;
            case "corrente":
                var pos = grandezasF.indexOf("Corrente")
                grandezasF.splice(pos, 1);
                grandezasF.unshift("Corrente")
                if(hasData[0] != true){
                    uMedida.push("V")
                }
                if(hasData[1] != true){
                    uMedida.push("Ω")
                }
                res = values[0] / values[1];
                uRes = "A"     
                break;
            case "resistencia":
                var pos = grandezasF.indexOf("Resistência")
                grandezasF.splice(pos, 1);
                grandezasF.unshift("Resistência")
                if(hasData[0] != true){
                    uMedida.push("V")
                } 
                if(hasData[1] != true){
                    uMedida.push("A")
                }
                res = values[0] / values[1];
                uRes = "Ω"    
                break;
            default:
                break;
        }
        if(isReversed == true){
            values.reverse();
        }
        for(i=0;i<grandezas.length;i++){
            if(hasData[i] != undefined){
                conversao = values[i] / Math.pow(10, expoente[i]);
                values[i] = conversao;
            }
        }
        if(res < 1){
            if(res > 0.01){
                res = res.toFixed(2);
            }
        }
        resposta.innerText = `A ${grandezasF[0]} de um circuito com uma ${grandezasF[1]} de ${values[0]+uMedida[0]} e uma ${grandezasF[2]} de ${values[1]+uMedida[1]} é ${res}${uRes}`
    }

})