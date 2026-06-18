import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  columnId: {
    type: String,
    required: true
  },
  subMenuItemId: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Highlight', highlightSchema);
