import mongoose from 'mongoose';

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  createdAt: {
    type: 'Date',
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

CategorySchema.index({ userId: 1, title: 1 });
CategorySchema.index({ userId: 1, createdAt: 1 });
CategorySchema.index({ userId: 1, isPublished: 1 });

const CategoryModel = mongoose.model('Category', CategorySchema);

CategoryModel.ensureIndexes((err) => {
  if (err) {
    return err;
  }
  return true;
});

export default CategoryModel;
