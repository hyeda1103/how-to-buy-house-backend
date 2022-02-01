import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;
