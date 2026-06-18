import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  desktopImage: { type: String, required: true },
  mobileImage: { type: String, required: true },
  link: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
