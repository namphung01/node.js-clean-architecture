export default function commentRepository(repository) {
  const findAll = (params) => repository.findAll(params);
  const countAll = (params) => repository.countAll(params);
  const findById = (id) => repository.findById(id);
  const add = (comment) => repository.add(comment);
  const updateById = (id, comment) => repository.updateById(id, comment);
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
