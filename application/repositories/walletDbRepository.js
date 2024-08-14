export default function walletRepository(repository) {
  const findAll = (params) => repository.findAll(params);
  const countAll = (params) => repository.countAll(params);
  const findById = (id) => repository.findById(id);
  const add = (wallet) => repository.add(wallet);
  const updateById = (id, wallet) => repository.updateById(id, wallet);
  const deleteById = (id) => repository.deleteById(id);

  return {
    findAll,
    countAll,
    findById,
    add,
    updateById,
    deleteById
  };
}
