import Setting from '../models/settings.js';

const INITIAL_DEFAULTS = {
  fabricMaterials: "Crafted from premium quality materials selected for durability and comfort. Each piece undergoes rigorous quality checks before reaching you.",
  sizeModel: "Our model is 6'1\" and wearing a size M. The fit is true to size — we recommend ordering your usual size.",
  fitConstruction: "Relaxed fit with structured shoulders for a clean silhouette. Designed to layer or wear standalone.",
  shippingReturns: "Free shipping on orders over ₹2,000. Rs. 150 shipping fee otherwise. Returns accepted within 14 days of delivery in original condition.",
  shippingFee: "150",
  shippingThreshold: "2000"
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    // Populate missing defaults
    let updated = false;
    for (const [key, defaultValue] of Object.entries(INITIAL_DEFAULTS)) {
      if (settingsMap[key] === undefined) {
        const newSetting = new Setting({ key, value: defaultValue });
        await newSetting.save();
        settingsMap[key] = defaultValue;
        updated = true;
      }
    }

    res.status(200).json({ success: true, data: settingsMap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching settings', error: error.message });
  }
};

export const saveSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings object' });
    }

    const saved = {};
    for (const [key, value] of Object.entries(settings)) {
      let setting = await Setting.findOne({ key });
      if (setting) {
        setting.value = String(value);
        await setting.save();
      } else {
        setting = new Setting({ key, value: String(value) });
        await setting.save();
      }
      saved[key] = setting.value;
    }

    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving settings', error: error.message });
  }
};
