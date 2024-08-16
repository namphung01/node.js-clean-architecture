import wallet from '../../../src/entities/wallet';

export default function updateById({
  id,
  name,
  balance,
  createdAt,
  walletRepository
}) {
  // validate
  if (!name) {
    throw new Error('name fields are mandatory');
  }
  const updatedWallet = wallet({
    name,
    balance,
    createdAt
  });

  return walletRepository.findById(id).then((foundWallet) => {
    if (!foundWallet) {
      throw new Error(`No wallet found with id: ${id}`);
    }
    return walletRepository.updateById(id, updatedWallet);
  });
}
