import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  columns: [{
    heading: String,
    order: {
      type: Number,
      default: 0
    },
    items: [{
      label: String,
      link: String,
      order: {
        type: Number,
        default: 0
      }
    }]
  }],
  images: [{
    imageUrl: String,
    imageTitle: String,
    order: {
      type: Number,
      default: 0
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
