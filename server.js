const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = 'mongodb://localhost:27017/esp32_led_control';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const deviceStateSchema = new mongoose.Schema({
  deviceId: { type: String, default: 'esp32_main' },
  fan: { type: String, enum: ['on', 'off'], default: 'off' },
  light: { type: String, enum: ['on', 'off'], default: 'off' },
  lastUpdated: { type: Date, default: Date.now }
});

const DeviceState = mongoose.model('DeviceState', deviceStateSchema);

const initializeDefaultState = async () => {
  const existingState = await DeviceState.findOne({ deviceId: 'esp32_main' });
  if (!existingState) {
    await DeviceState.create({
      deviceId: 'esp32_main',
      fan: 'off',
      light: 'off'
    });
  }
};

initializeDefaultState();

app.get('/api/get-state', async (req, res) => {
  try {
    const deviceState = await DeviceState.findOne({ deviceId: 'esp32_main' });
    res.json({
      fan: deviceState.fan,
      light: deviceState.light
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching device state' });
  }
});

app.post('/api/set-state', async (req, res) => {
  try {
    const { fan, light } = req.body;
    
    await DeviceState.findOneAndUpdate(
      { deviceId: 'esp32_main' }, 
      { fan, light, lastUpdated: new Date() },
      { new: true }
    );
    
    res.json({ message: 'Device state updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating device state' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});