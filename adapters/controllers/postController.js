import findAll from '../../application/use_cases/post/findAll';
import addPost from '../../application/use_cases/post/add';
import findById from '../../application/use_cases/post/findById';
import updateById from '../../application/use_cases/post/updateById';
import deletePost from '../../application/use_cases/post/deleteΒyId';
import ResponseService from '../../frameworks/webserver/middlewares/responseService';

export default function postController(
  postDbRepository,
  postDbRepositoryImpl,
) {
  const dbRepository = postDbRepository(postDbRepositoryImpl());

  // Fetch all the posts of the logged in user
  const fetchAllPosts = (req, res, next) => {
    const params = {};
    const response = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    // and current logged in user
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    params.userId = req.user.id;

    findAll(params, dbRepository)
      // .then((posts) => {
      //   response.posts = posts;
      //   const cachingOptions = {
      //     key: 'posts_',
      //     expireTimeSec: 30,
      //     data: JSON.stringify(posts)
      //   };
      //   // cache the result to redis
      //   cachingRepository.setCache(cachingOptions);
      //   return countAll(params, dbRepository);
      // })
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: response
        });
      })
      .catch((error) => next(error));
  };

  const fetchPostById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      .then((post) => {
        if (!post) {
          throw new Error(`No post found with id: ${req.params.id}`);
        }
        return ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: post
        });
      })
      .catch((error) => next(error));
  };

  const addNewPost = (req, res, next) => {
    const { title, description, content } = req.body;

    addPost({
      title,
      description,
      content,
      userId: req.user.id,
      postRepository: dbRepository
    })
      .then((post) =>
        // const cachingOptions = {
        //   key: 'posts_',
        //   expireTimeSec: 30,
        //   data: JSON.stringify(post)
        // };
        // // cache the result to redis
        // cachingRepository.setCache(cachingOptions);
        // return res.json('post added');
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: post
        })
      )
      .catch((error) => next(error));
  };

  const deletePostById = (req, res, next) => {
    deletePost(req.params.id, dbRepository)
      .then(() =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success')
        })
      )
      .catch((error) => next(error));
  };

  const updatePostById = (req, res, next) => {
    const { title, description, isPublished } = req.body;

    updateById({
      id: req.params.id,
      title,
      description,
      userId: req.user.id,
      isPublished,
      postRepository: dbRepository
    })
      .then((post) =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: post
        })
      )
      .catch((error) => next(error));
  };

  return {
    fetchAllPosts,
    addNewPost,
    fetchPostById,
    updatePostById,
    deletePostById
  };
}
