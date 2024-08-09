export default function deleteById(id, categoryRepository) {
  return categoryRepository.findById(id).then((category) => {
    if (!category) {
      throw new Error(`No category found with id: ${id}`);
    }
    return categoryRepository.deleteById(id);
  });
}
