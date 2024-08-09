export default function post({
  title,
  description,
  content,
  createdAt,
  isPublished = false,
  userId
}) {
  return {
    getTitle: () => title,
    getDescription: () => description,
    getContent: () => content,
    getCreatedAt: () => createdAt,
    isPublished: () => isPublished,
    getUserId: () => userId
  };
}
