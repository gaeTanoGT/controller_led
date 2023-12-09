#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

const char* ssid = "TIM-19445283";
const char* password = "bhszxPfdYtNHC5YwsO6CnRLw";

WebSocketsServer webSocket(80); // Crea un server WebSocket sulla porta 80

bool statoLed = false;
bool ledArmadio = true;
int luminosita = 50;  //0 - 50

void setup() {
  pinMode(2, OUTPUT);

  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.println("Connessione WiFi in corso...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nWiFi " + String(ssid) + " connesso!");
  Serial.println(WiFi.localIP());
  digitalWrite(2, statoLed);

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}

void gestisciMessaggio(uint8_t * payload, size_t length) {

  String messaggio = "";
  for (size_t i = 0; i < length; i++) {
    messaggio += (char)payload[i];
  }
  
  Serial.println("Messaggio WebSocket: " + messaggio);
  if (messaggio == "ON") {
    statoLed = false;
  } else if (messaggio == "OFF") {
    statoLed = true;
  } else if(messaggio.substring(0, 3) == "Lum") {
    luminosita = messaggio.substring(4,6).toInt();
  } else if(messaggio == "Armadio=ON") {
    ledArmadio = true;
  } else if(messaggio == "Armadio=OFF"){
    ledArmadio = false;
  }

  digitalWrite(2, statoLed);

  //do riscontro
  inviaInBroadcast(messaggio);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("Host %u disconnesso.\n", num);
      break;
    case WStype_CONNECTED:{
      Serial.printf("Cliente %u connesso.\n", num);
      String msg;
      if(statoLed){
        msg = "OFF";
      }
      else{
        msg = "ON";
      }

      webSocket.sendTXT(num, (uint8_t*)msg.c_str(), msg.length());
      if(ledArmadio){
        msg = "Armadio=ON";
      }
      else{
        msg = "Armadio=OFF";
      }
      webSocket.sendTXT(num, (uint8_t*)msg.c_str(), msg.length());

      msg = "Lum=" + String(luminosita);
      //Serial.println(msg);
      webSocket.sendTXT(num, (uint8_t*)msg.c_str(), msg.length());
      break;
    }
    case WStype_TEXT:
      gestisciMessaggio(payload, length);
      break;
  }
}

  //scorro tutti i client connessi per inviare il messaggio in broadcast
void inviaInBroadcast(String payload) {
  for (uint8_t i = 0; i < webSocket.connectedClients(); i++) {
    webSocket.sendTXT(i, (uint8_t*)payload.c_str(), payload.length());
  }
}
