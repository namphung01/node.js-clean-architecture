import wallet from '../../../src/entities/wallet';

export default function addWallet({
  name,
  balance,
  createdAt,
  userId,
  walletRepository
}) {
  // TODO: add a proper validation (consider using @hapi/joi)
  if (!name) {
    throw new Error('Name fields cannot be empty');
  }

  const newWallet = wallet({
    name,
    balance,
    createdAt,
    userId
  });

  return walletRepository.add(newWallet);
}
