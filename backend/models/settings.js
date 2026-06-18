import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const Setting = mongoose.model("Setting", settingsSchema);
export default Setting;
