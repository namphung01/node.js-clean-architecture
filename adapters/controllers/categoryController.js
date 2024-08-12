import findAll from '../../application/use_cases/category/findAll';
import addCategory from '../../application/use_cases/category/add';
import findById from '../../application/use_cases/category/findById';
import updateById from '../../application/use_cases/category/updateById';
import deleteCategory from '../../application/use_cases/category/deleteΒyId';
import ResponseService from '../../frameworks/webserver/middlewares/responseService';

export default function categoryController(
  categoryDbRepository,
  categoryDbRepositoryImpl
) {
  const dbRepository = categoryDbRepository(categoryDbRepositoryImpl());

  const fetchAllCategories = (req, res, next) => {
    const params = {};
    const response = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    params.userId = req.user.id;

    findAll(params, dbRepository)
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

  const fetchCategoryById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      // eslint-disable-next-line no-shadow
      .then((category) => {
        if (!category) {
          throw new Error(`No category found with id: ${req.params.id}`);
        }
        return ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: category
        });
      })
      .catch((error) => next(error));
  };

  const addNewCategory = (req, res, next) => {
    const { title } = req.body;

    addCategory({
      title,
      userId: req.user.id,
      categoryRepository: dbRepository
    })
      // eslint-disable-next-line no-shadow
      .then((category) =>
        // const cachingOptions = {
        //   key: 'category_',
        //   expireTimeSec: 30,
        //   data: JSON.stringify(category)
        // };
        // // cache the result to redis
        // cachingRepository.setCache(cachingOptions);
        // return res.json('category added');
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: category
        })
      )
      .catch((error) => next(error));
  };

  const deleteCategoryById = (req, res, next) => {
    deleteCategory(req.params.id, dbRepository)
      .then(() =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: ''
        })
      )
      .catch((error) => next(error));
  };

  const updateCategoryById = (req, res, next) => {
    const { title, isPublished } = req.body;

    updateById({
      id: req.params.id,
      title,
      userId: req.user.id,
      isPublished,
      categoryRepository: dbRepository
    })
      // eslint-disable-next-line no-shadow
      .then((category) =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: category
        })
      )
      .catch((error) => next(error));
  };

  return {
    fetchAllCategories,
    addNewCategory,
    fetchCategoryById,
    updateCategoryById,
    deleteCategoryById
  };
}
