#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <TimeLib.h>
#include <FS.h>

#define MODE_SWITCH 1
#define MODE_SCHEDULE 2

#define RELAY_1 14
#define TIME_BETWEEN_REQUESTS 10000

const char *ssid = "Xiaomi";
const char *password = "Bm757935";

String url = "http://192.168.31.228:8080/api/v1/device";

uint32_t timestamp = millis();

int getMode(){
  File file = SPIFFS.open("/config.json", "r");

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, file);

  file.close();
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return 0;
  }

  int mode = doc["mode"]; // 1
  
  return mode;
}

int getState(){
  File file = SPIFFS.open("/config.json", "r");

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, file);

  file.close();
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return 0;
  }

  bool state = doc["state"]; // 1
  
  return state;
}

bool saveModeAndState(uint8_t mode, bool state){
  JsonDocument doc;

  doc["mode"] = mode;
  doc["state"] = state;

  File file = SPIFFS.open("/config.json", "w");

  serializeJson(doc, file);

  file.close();

  return true;
}

bool saveSwitchMode(bool state){return true;}

void setup() {
  Serial.begin(9600);
  while(!Serial);

  pinMode(RELAY_1, OUTPUT);
  digitalWrite(RELAY_1, LOW);

  SPIFFS.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
    Serial.print(F("[debug] : connecting to "));
    Serial.println(ssid);
    delay(250);
  }
  Serial.print(F("[debug] : connected to "));
  Serial.println(ssid);
}

void loop() {

  if((millis() - timestamp) > TIME_BETWEEN_REQUESTS){


    if(WiFi.status() != WL_CONNECTED){
      Serial.println(F("[error] : device not connected to WiFi network"));
      timestamp = millis();
      return;
    }

    WiFiClient client;
    HTTPClient http;

    Serial.print(F("[debug] : request init to "));
    Serial.println(url + "/" + WiFi.macAddress());

    if(!http.begin(client, url + "/" + WiFi.macAddress())){
      Serial.print(F("[error] : device couldn't connect to "));
      Serial.println(url + WiFi.macAddress());
      timestamp = millis();
      return;
    }

    uint8_t codeResponse = http.GET();

    if(codeResponse != HTTP_CODE_OK){
      Serial.print(F("[error] : server response is not 200"));
      http.end();
      timestamp = millis();
      return;
    }

    String body = http.getString();
    Serial.println(F("[debug] : body response to request"));
    Serial.println(body);

    JsonDocument doc;

    DeserializationError error = deserializeJson(doc, body);

    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      timestamp = millis();
      return;
    }


  int code = doc["code"]; // 200
  const char* message = doc["message"]; // "success"

  JsonObject data_0 = doc["data"][0];
  int data_0_mode = data_0["mode"]; // 1
  bool data_0_state = data_0["state"]; // true
  long data_0_timestamp = data_0["timestamp"]; // 1719851620

  if(!data_0_mode){
    timestamp = millis();
    return;
  }

  if(data_0_mode == MODE_SWITCH){
    bool data_0_state = data_0["state"]; // true
    long data_0_timestamp = data_0["timestamp"]; // 1719851620

    digitalWrite(RELAY_1, data_0_state);
    setTime(data_0_timestamp);
  }


   /* uint32_t serverTimestamp = doc["timestamp"];
    setTime(serverTimestamp);

    if(!doc["mode"]){
      timestamp = millis();
      return;
    }

    int mode = doc["mode"]; 

    if(mode == MODE_SWITCH){
      bool state = doc["state"];
      digitalWrite(RELAY_1, state);
      //saveModeAndState(MODE_SWITCH, state);

    } else if(mode == MODE_SCHEDULE){
      for (JsonObject schedule : doc["schedules"].as<JsonArray>()) {

        int schedule_days = schedule["days"]; // 255, 255, 255, 255, 255
        long schedule_startAt = schedule["startAt"]; // 555555, 555555, 555555, 555555, 555555
        long schedule_endAt = schedule["endAt"]; // 4566565, 4566565, 4566565, 4566565, 4566565

      }
    }*/

    

    timestamp = millis();
  }

}

