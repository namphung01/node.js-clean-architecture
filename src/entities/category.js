export default function category({
  title,
  createdAt,
  isPublished = false,
  userId
}) {
  return {
    getTitle: () => title,
    getCreatedAt: () => createdAt,
    isPublished: () => isPublished,
    getUserId: () => userId
  };
}
