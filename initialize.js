const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/esp32_control', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define the schema and model
const LedStateSchema = new mongoose.Schema({
  led1: String, // "ON" or "OFF"
  led2: String  // "ON" or "OFF"
});
const LedState = mongoose.model('LedState', LedStateSchema);

// Insert default document
const initializeState = async () => {
  const existingState = await LedState.findOne({});
  if (!existingState) {
    const defaultState = new LedState({ led1: 'OFF', led2: 'OFF' });
    await defaultState.save();
    console.log('Default state added to database:', defaultState);
  } else {
    console.log('State already exists in database:', existingState);
  }
  mongoose.disconnect();
};

initializeState();
