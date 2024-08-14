export default function deleteById(id, walletRepository) {
  return walletRepository.findById(id).then((wallet) => {
    if (!wallet) {
      throw new Error(`No wallet found with id: ${id}`);
    }
    return walletRepository.deleteById(id);
  });
}
