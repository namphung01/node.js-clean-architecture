export default function redisCategoryRepository(repository) {
  const setCache = (options) => repository.setCache(options);
  return {
    setCache
  };
}
