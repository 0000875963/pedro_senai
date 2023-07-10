function TypeOfConversion(type){
    var nType = document.getElementById(type);
    nType.checked = true;
    var oType = document.getElementById(type.split("_").reverse().join("_"));
    oType.checked = false;

    document.getElementById("number").value = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("numero_a_converter").style.display = "block";;
}

function check(){
    var n1 = document.getElementById("number");
    var n2 = n1.value.split('');
    var dot = n1.value.split(/[^.]/).filter(Boolean);
    var letters = n1.value.split(/[0-9.]/).filter(Boolean).map(Number);

    if(n1.value.includes(letters) == false){
        n2.pop();
    } else if(dot[0] != undefined && dot[0].length > 1 || dot.length > 1){
        n2.pop();
    } else if(document.getElementById("bin_dec").checked == true && n2[n1.value.length-1] !== "0" && n2[n1.value.length-1] !== "1" && n2[n1.value.length-1] !== "."){
        n2.pop();
    }
    
    n2 = n2.join('');
    n1.value = n2;
}

function keyboardInput(){
    window.addEventListener('keydown', (event) => {
        if(event.key == "Enter"){
            converter();
        } else {
            return;
        }
        event.preventDefault();
    }, true);
}

function converter(){
    if(document.getElementById("dec_bin").checked == true){
        DecToBin();
    } else {
        BinToDec();
    }
}

function DecToBin(){
    var n1 = document.getElementById("number");
    var result = document.getElementById("result");
    var inteiro = 0;
    var fracionario = 0;
    var deci = 0;
    var res = [];

    if(n1.value.includes(".")){
        inteiro = Math.trunc(n1.value);
        fracionario = n1.value-inteiro;
        while (inteiro > 1) {
            res.unshift(inteiro%2);
            inteiro = Math.floor(inteiro/2);
        }
        res.unshift(1);

        res.push(".");
        deci = fracionario*2;
        for(i=0;i<8;i++){
            if(deci>1) {
                res.push(1);
                deci=deci-1;
            } else {
                res.push(0);
            }
            deci=deci*2;
        }
        result.innerHTML = res.join('');
    } else {
        inteiro=n1.value*1
        while (inteiro > 1) {
            res.unshift(inteiro%2);
            inteiro = Math.floor(inteiro/2);
        }
        res.unshift(1);
        result.innerHTML = res.join('');
    }
}

function BinToDec(){
    var n1 = document.getElementById("number");
    var result = document.getElementById("result");
    var n2 = 0;
    var str1 = 0;
    var str2 = 0;
    var expo = n1.value.length - 1;

    if(n1.value.includes(".")){
        var dot = n1.value.split(".");
        var expo1 = dot[0].length - 1;
        var expo2 = -1;
        
        for(i=0;i<dot[0].length;i++){
            n2 = dot[0][i] * Math.pow(2, expo1);
            str1 += n2;
            expo1--;
        }
        for(i=0;i<dot[1].length;i++){
            n3 = dot[1][i] * Math.pow(2, expo2);
            str2 += n3;
            expo2--;
        }
        result.innerHTML = str1 + str2;
        return
    } else {
        for(i=0;i<n1.value.length;i++){
            n2 = n1.value[i] * Math.pow(2, expo);
            str1 += n2;
            expo--;
            result.innerHTML = str1;
        }
    }
}