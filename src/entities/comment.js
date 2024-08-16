export default function commentEntity(
    {
        content,
        postId,
        userId,
        createdAt,
        isDeleted = false
    }
    ) {
        const getContent = () => content;
        const getCreatedAt = () => createdAt;
        const getPostId = () => postId;
        const getUserId = () => userId;
        const isDeleteds = () => isDeleted;

        return {
            getContent,
            getCreatedAt,
            getPostId,
            getUserId,
            isDeleteds
        };
};