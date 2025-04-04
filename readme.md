# ESP32 Device Control System

A web-based control panel for ESP32 devices with:
- Voice command support
- MongoDB state persistence 
- REST API backend

##  Prerequisites

| Software       | Minimum Version | Download Link                          |
|----------------|-----------------|----------------------------------------|
| **Node.js**    | v16.x           | [Download Node.js](https://nodejs.org/) |
| **MongoDB**    | 6.0+            | [Download MongoDB](https://www.mongodb.com/try/download/community) |

##  Installation

### Install Dependencies
```bash
npm install
```

##  Database Setup

### 1. Start MongoDB
- **Windows Service:**
  - Install MongoDB as a service during setup
  - Runs automatically in background

- **Manual Start:**
  ```bash
  mongod --dbpath="C:\data\db"
  ```
### 2. Initialize Database
```bash
node initialize.js
```
Creates:
- Database: `esp32_control`
- Default state: 
  ```json
  {
    "fan": "off",
    "light": "off"
  }
  ```

## Running the Application

Start the development server:
```bash
node server.js
```
Access at: [http://localhost:3003](http://localhost:3003)

## Web Interface Features

| Feature        | Description                          |
|---------------|--------------------------------------|
| Device Toggle  | Switch Fan/Light ON/OFF              |
| State Saving   | Persist states to MongoDB            |
| Voice Control  | Hands-free command recognition       |

## Voice Commands

Supported phrases:
- `"Fan on"` / `"Fan off"`
- `"Light on"` / `"Light off"`
