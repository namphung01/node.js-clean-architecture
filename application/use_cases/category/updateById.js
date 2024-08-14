import category from '../../../src/entities/category';

export default function updateById({
  id,
  title,
  createdAt,
  isPublished,
  userId,
  categoryRepository
}) {
  // validate
  if (!title) {
    throw new Error('title fields are mandatory');
  }
  const updatedCategory = category({
    title,
    createdAt,
    isPublished,
    userId
  });

  return categoryRepository.findById(id).then((foundCategory) => {
    if (!foundCategory) {
      throw new Error(`No category found with id: ${id}`);
    }
    return categoryRepository.updateById(id, updatedCategory);
  });
}
