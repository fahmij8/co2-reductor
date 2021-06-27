#include <DHT.h>
#include <AntaresESP32MQTT.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#define ACCESSKEY "9634da50ff7abd7a:3bdb608765b907a4"
#define projectName "CO2Reductor"
#define deviceMQTTPub "sensorData"
#define deviceMQTTSub "pump"

const char* ssid = "BigYellow";
const char* password = "thethepooh71";

#define DHTTYPE DHT11

int pinRelay = 23;
int pinSoil = 36;
int valueSoil;
int pinDHT = 15;

DHT dht(pinDHT, DHTTYPE);
AntaresESP32MQTT antares(ACCESSKEY);

void callback(char topic[], byte payload[], unsigned int length) {
  antares.get(topic, payload, length);
  StaticJsonBuffer<256> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(antares.getPayload());

  if(root.containsKey("state")){
    int states = antares.getInt("state");
    if(states == 0){
      digitalWrite(pinRelay, HIGH);
    } else {
      digitalWrite(pinRelay, LOW);
    }
  }
}

void setup()
{
  // Open Serial
  Serial.begin(115200);
  antares.setDebug(true);
  // Connect to WiFi
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  antares.setMqttServer();
  antares.setCallback(callback);
  // Init Sensor & Actuator
  dht.begin();
  pinMode(pinRelay, OUTPUT);
  digitalWrite(pinRelay, HIGH);
}
void loop()
{
  antares.checkMqttConnection();
  delay(2000);
  // Read from Soil Moisture
  valueSoil= analogRead(pinSoil);
  // Read from DHT11
  float h = dht.readHumidity();
  float t = dht.readTemperature(); // Read temperature as Celsius (the default) 

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  float hic = dht.computeHeatIndex(t, h, false);  // Compute heat index in Celsius (isFahreheit = false)

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print(F(" Heat index: "));
  Serial.print(hic);
  Serial.println(F("°C "));
  antares.add("soilMoisture", valueSoil);
  antares.add("humidity", h);
  antares.add("tempC", t);
  antares.add("hiC", hic);
  antares.publish(projectName, deviceMQTTPub);
}
 
