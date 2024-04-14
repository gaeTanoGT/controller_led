var slider = document.getElementById("slider");
var p = document.getElementById("value");
var immagini = document.querySelectorAll('a');
var connessione = document.getElementById("connessione");
var messaggio, sendMessaggio, time;
var wasArmadioChecked = true;

//aggiorna label al cambiare del valore dello slider
slider.oninput = function () {
    carica();
}

//alla pressione del tasto onOff chiama la funzione inviaComandoOnOff()
document.getElementById("onOff").addEventListener("click", function () {
    inviaComandoOnOff();
});

//al rilascio dello slider invia messaggio
slider.onchange = function () {
    //location.href= Math.floor(slider.value / 2);
    inviaMessaggioAlNodeMCU("Lum=" + Math.floor(slider.value / 2));
}

/*
alla pressione del tasto onOffArmadio chiama la funzione inviaComandoOnOffArmadio()
document.getElementById("OnOffArmadio").addEventListener("click", function () {
    inviaComandoOnOffArmadio();
});*/

//alla pressione di un'immagine invia il colore selezionato al NodeMCU
immagini.forEach(function (immagine) {
    immagine.addEventListener('click', function () {
        console.log(immagine.id);
        inviaMessaggioAlNodeMCU(immagine.id);
    });
});


//aggiorno valore luminosita'
function carica() {
    p.innerHTML = "Luminosità: " + slider.value;
}

//manda messaggio onOff led
async function inviaComandoOnOff() {
    var comando;
    var armadio = document.getElementById("OnOffArmadio");
    if (document.getElementById("onOff").checked == true) {
        //armadio.checked = wasArmadioChecked;
        //armadio.disabled = false;
        //inviaComandoOnOffArmadio();

        comando = "ON";
    } else {
        //wasArmadioChecked = armadio.checked;
        //armadio.checked = false;
        //armadio.disabled = true;
        
        comando = "OFF";
    }
    
    inviaMessaggioAlNodeMCU(comando);
    
    await new Promise(r => setTimeout(r, 10));

    //inviaComandoOnOffArmadio();
}

/*
function inviaComandoOnOffArmadio() {
    var comando;
    if (document.getElementById("OnOffArmadio").checked == true) {
        comando = "Armadio=ON";
    } else {
        comando = "Armadio=OFF";
    }

    inviaMessaggioAlNodeMCU(comando);
}*/

//apertura webSocket con nodeMCU alla porta 80
var socket = new WebSocket("ws://192.168.1.7:80/");

socket.onopen = function (event) {
    console.log("connessione aperta in WebSocket");
    connessione.style.backgroundColor = "#09df3b";
};

//aperta quando il nodeMCU invia un messaggio di ack
socket.onmessage = function (event) {
    messaggio = event.data;
    console.log("Ricevuto in WebSocket: " + messaggio);

    if (messaggio == "ON" || messaggio == "OFF")
        document.getElementById("onOff").checked = (messaggio === "ON");
    else if (messaggio.substr(0, 3) == "Lum") {
        var valore = messaggio.substr(4, 5) * 2;
        slider.value = String(valore);
        carica();
    }/*
    else if (messaggio == "Armadio=ON" || messaggio == "Armadio=OFF")
        document.getElementById("OnOffArmadio").checked = (messaggio === "Armadio=ON");*/
};

socket.onclose = function (event) {
    console.log("Connessione terminata");
    connessione.style.backgroundColor = "#f83a3a";
};

function inviaMessaggioAlNodeMCU(messaggio) {
    console.log("Invio in WebSocket: " + messaggio);
    sendMessaggio = messaggio;

    socket.send(messaggio);

    if(messaggio.substr(0, 3) != "Lum"){
        time = 0;
        setTimeout(isAck, 10);
    }
}

function isAck(){
    if(time > 100){
        console.log("Tentativo ricezione ack fallito");
        //connessione.style.backgroundColor = "#f83a3a";
    } else if(messaggio != sendMessaggio){
        time++;
        setTimeout(isAck, 10);
    }
}