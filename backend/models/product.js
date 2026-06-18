import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String
  }],
  sizes: [{
    type: String,
    trim: true
  }],
  colors: [{
    type: String,
    trim: true
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  inventory: {
    type: Number,
    default: 0,
    min: 0
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    default: null
  },
  columnId: {
    type: String,
    default: null
  },
  subMenuItemId: {
    type: String,
    default: null
  },
  tag: {
    type: String,
    trim: true,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fabricMaterials: {
    type: String,
    trim: true,
    default: ""
  },
  sizeModel: {
    type: String,
    trim: true,
    default: ""
  },
  fitConstruction: {
    type: String,
    trim: true,
    default: ""
  },
  shippingReturns: {
    type: String,
    trim: true,
    default: ""
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;
