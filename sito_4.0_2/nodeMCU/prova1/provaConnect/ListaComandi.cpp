#include "ListaComandi.h"

#include <IRremoteESP8266.h>
#include <IRsend.h>
#include "Arduino.h"

int lum;

const uint16_t kIrLed = 4;  // ESP8266 GPIO pin to use. Recommended: 4 (D2).
IRsend irsend(kIrLed);

void setupLuminosita(){
    for(int i = 0; i <= 50; i++){
        irsend.sendNEC(LUM_UP);
    }

    lum = 50;

    irsend.begin();
}

void setLuminosita(int newVal){
    if(newVal > lum){
        for(int i = lum; i <= newVal; i++){
            irsend.sendNEC(LUM_UP);
            delay(50);
        }       
    }else{
        for(int i = lum; i >= newVal; i--){
            irsend.sendNEC(LUM_DWN);
            delay(50);
            //Serial.println("GGG");
        } 
    }
}