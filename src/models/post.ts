import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, '제목은 필수항목입니다'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, '카테고리는 필수항목입니다'],
    default: 'All',
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isDisLiked: {
    type: Boolean,
    default: false,
  },
  viewCounts: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '작가는 필수항목입니다'],
  },
  description: {
    type: String,
    required: [true, '설명은 필수항목입니다'],
  },
  image: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2021/04/26/20/53/nature-6209977_960_720.jpg',
  },
}, {
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  timestamps: true,
});

const postModel = mongoose.model('Post', postSchema);

export default postModel;
