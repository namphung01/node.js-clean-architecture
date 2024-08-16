import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: 'Date',
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const CommentModel = mongoose.model('Comment', CommentSchema);

CommentModel.ensureIndexes((err) => {
  if (err) {
    return err;
  }
  return true;
});

export default CommentModel;
