import category from '../../../src/entities/category';

export default function addCategory({
  title,
  createdAt,
  isPublished,
  userId,
  categoryRepository
}) {
  // TODO: add a proper validation (consider using @hapi/joi)
  if (!title) {
    throw new Error('title fields cannot be empty');
  }

  const newCategory = category({
    title,
    createdAt,
    isPublished,
    userId
  });

  return categoryRepository.add(newCategory);
}
