import WalletModel from '../models/wallet';

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function walletRepositoryMongoDB() {
  const findAll = (params) =>
    WalletModel.find(omit(params, 'page', 'perPage'))
      .populate('userId', 'username email')
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    WalletModel.countDocuments(omit(params, 'page', 'perPage'));

  const findById = (id) =>
    WalletModel.findById(id).populate('userId', 'username email');

  const add = (walletEntity) => {
    const newWallet = new WalletModel({
      name: walletEntity.getName(),
      balance: walletEntity.getBalance(),
      createdAt: new Date(),
      userId: walletEntity.getUserId()
    });

    return newWallet.save();
  };

  const updateById = (id, walletEntity) => {
    const updatedWallet = {
      name: walletEntity.getName()
    };

    // Lấy giá trị balance mới từ walletEntity để tính toán sự thay đổi
    const balanceChange = walletEntity.getBalance();

    return WalletModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedWallet, $inc: { balance: balanceChange } },
      { new: true }
    );
  };

  const deleteById = (id) => WalletModel.findByIdAndRemove(id);

  return {
    findAll,
    countAll,
    findById,
    add,
    updateById,
    deleteById
  };
}
