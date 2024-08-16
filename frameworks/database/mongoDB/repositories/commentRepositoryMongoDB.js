import CommentModel from '../models/comment';

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function commentRepositoryMongoDB() {
    const findAll = (params) =>
        CommentModel.find(omit(params, 'page', 'perPage'))
            .skip(params.perPage * params.page - params.perPage)
            .limit(params.perPage);

    const countAll = (params) =>
        CommentModel.countDocuments(omit(params, 'page', 'perPage'));

    const findById = (id) => CommentModel.findById(id);

    const add = (commentEntity) => {
        const newComment = new CommentModel(
            {
                content: commentEntity.content,
                postId: commentEntity.postId,
                userId: commentEntity.userId,
                createAt: new Date(),
                isDeleted: false
            }
        );

        return newComment.save();
    };

    const updateById = (id, commentEntity) => {
        const updatedComment = {
            content: commentEntity.getContent(),
            isDeleted: commentEntity.isDeleted()
        };

        return CommentModel.findOneAndUpdate(
            { _id: id },
            { $set: updatedComment },
            { new: true }
        );
    };

    const deleteById = (id) => {
        const updatedComment = {
            isDeleted: true
        };

        return CommentModel.findOneAndUpdate(
            { _id: id },
            { $set: updatedComment },
            { new: true }
        );
    };

    return {
        findAll,
        countAll,
        findById,
        add,
        updateById,
        deleteById
    }
}