#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Credentials
const char* WIFI_SSID = "wfi_name";
const char* WIFI_PASSWORD = "wifi_password";

// Server Configuration
const char* SERVER_URL = "http://192.168.130.235:3003/api/get-state";
const char* SERVER_UPDATE_URL = "http://192.168.130.235:3003/api/set-state";

// Device Pin Definitions
const int FAN_PIN = 2;  // GPIO pin for Fan
const int LIGHT_PIN = 4;  // GPIO pin for Light

// JSON parsing buffer
StaticJsonDocument<200> jsonBuffer;

void setup() {
  Serial.begin(115200);
  
  pinMode(FAN_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  
  connectToWiFi();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    fetchAndUpdateDeviceStates();
  } else {
    connectToWiFi();
  }
  
  delay(5000);  // Check every 5 seconds
}

void connectToWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected to WiFi");
  Serial.println("IP address: " + WiFi.localIP().toString());
}

void fetchAndUpdateDeviceStates() {
  HTTPClient http;
  
  http.begin(SERVER_URL);
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    String payload = http.getString();
    DeserializationError error = deserializeJson(jsonBuffer, payload);
    
    if (!error) {
      const char* fanState = jsonBuffer["fan"];
      const char* lightState = jsonBuffer["light"];
      
      digitalWrite(FAN_PIN, strcmp(fanState, "on") == 0 ? HIGH : LOW);
      digitalWrite(LIGHT_PIN, strcmp(lightState, "on") == 0 ? HIGH : LOW);
      
      Serial.println("Device states updated");
    }
  } else {
    Serial.println("Error fetching device states");
  }
  
  http.end();
}

void sendDeviceStateUpdate(const String& fan, const String& light) {
  HTTPClient http;
  http.begin(SERVER_UPDATE_URL);
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"fan\":\"" + fan + "\",\"light\":\"" + light + "\"}";
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.println("Device state sent to server successfully");
  } else {
    Serial.println("Error sending device state");
  }
  
  http.end();
}
