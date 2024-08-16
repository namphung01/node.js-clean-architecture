export default function wallet({ name, balance, createdAt, userId }) {
  return {
    getName: () => name,
    getBalance: () => balance,
    getCreatedAt: () => createdAt,
    getUserId: () => userId
  };
}
