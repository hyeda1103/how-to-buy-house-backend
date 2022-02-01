import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, '포스트가 있어야 합니다'],
  },
  user: {
    type: Object,
    required: [true, '사용자가 있어야 합니다'],
  },
  description: {
    type: String,
    required: [true, '댓글이 있어야 합니다'],
  },
}, {
  timestamps: true,
});

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;
