import { now } from 'mongoose';
import commentRepository from '../../application/repositories/commentDbRepository';
import commentRepositoryMongoDB from '../../frameworks/database/mongoDB/repositories/commentRepositoryMongoDB';
import ResponseService from '../../frameworks/webserver/middlewares/responseService';
import commentEntity from '../../src/entities/comment';

export default function commentController() {
  const repository = commentRepositoryMongoDB();

  const getAllComment = (req, res, next) => {
    const params = {};
    const response = {};

    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }

    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    params.userId = req.user.id;

    repository
      .findAll(params)
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return ResponseService.success(res, {
          message: res.__('success'),
          data: response
        });
      })
      .catch((error) => next(error));
  };

  const getCommentById = (req, res, next) => {
    repository
      .findById(req.params.id)
      .then((comment) => {
        if (!comment) {
          throw new Error(`No comment found with id: ${req.params.id}`);
        }
        return ResponseService.success(res, {
          message: res.__('success'),
          data: comment
        });
      })
      .catch((error) => next(error));
  };

  const addNewComment = (req, res, next) => {
    const { content, postId, userId } = req.body;

    const comment = {
      content,
      postId,
      userId,
      createAt: new Date(),
      isDeleted: false
    };

    repository
      .add(comment)
      .then((comment) =>
        ResponseService.success(res, {
          message: res.__('success'),
          data: comment
        })
      )
      .catch((error) => next(error));
  };

  const updateComment = (req, res, next) => {
    const { content, isDeleted } = req.body;
    repository
      .updateById(req.params.id, {
        content
      })
      .then((comment) =>
        ResponseService.success(res, {
          message: res.__('success'),
          data: comment
        })
      )
      .catch((error) => next(error));
  };

  const deleteComment = (req, res, next) => {
    repository
      .deleteById(req.params.id)
      .then((comment) =>
        ResponseService.success(res, {
          message: res.__('success'),
          data: comment
        })
      )
      .catch((error) => next(error));
  };

  return {
    getAllComment,
    getCommentById,
    addNewComment,
    updateComment,
    deleteComment
  };
}
