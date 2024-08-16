import mongoose from 'mongoose';
// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;
const WalletSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  balance: {
    type: Number,
    default: false
  },
  createdAt: {
    type: 'Date',
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

WalletSchema.index({ userId: 1, title: 1 });
WalletSchema.index({ userId: 1, createdAt: 1 });
WalletSchema.index({ userId: 1, isPublished: 1 });

const WalletModel = mongoose.model('Wallet', WalletSchema);

WalletModel.ensureIndexes((err) => {
  if (err) {
    return err;
  }
  return true;
});

export default WalletModel;
