import findAll from '../../application/use_cases/category/findAll';
import countAll from '../../application/use_cases/category/countAll';
import addCategory from '../../application/use_cases/category/add';
import findById from '../../application/use_cases/category/findById';
import updateById from '../../application/use_cases/category/updateById';
import deleteCategory from '../../application/use_cases/category/deleteΒyId';

export default function categoryController(
  categoryDbRepository,
  categoryDbRepositoryImpl,
  cachingClient,
  categoryCachingRepository,
  categoryCachingRepositoryImpl
) {
  const dbRepository = categoryDbRepository(categoryDbRepositoryImpl());
  const cachingRepository = categoryCachingRepository(
    categoryCachingRepositoryImpl()(cachingClient)
  );

  // Fetch all the category of the logged in user
  const fetchAllCategories = (req, res, next) => {
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
      .then((category) => {
        response.category = category;
        const cachingOptions = {
          key: 'category_',
          expireTimeSec: 30,
          data: JSON.stringify(category)
        };
        // cache the result to redis
        cachingRepository.setCache(cachingOptions);
        return countAll(params, dbRepository);
      })
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return res.json(response);
      })
      .catch((error) => next(error));
  };

  const fetchCategoryById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      .then((category) => {
        if (!category) {
          throw new Error(`No category found with id: ${req.params.id}`);
        }
        res.json(category);
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
      .then((category) => {
        const cachingOptions = {
          key: 'category_',
          expireTimeSec: 30,
          data: JSON.stringify(category)
        };
        // cache the result to redis
        cachingRepository.setCache(cachingOptions);
        return res.json('category added');
      })
      .catch((error) => next(error));
  };

  const deleteCategoryById = (req, res, next) => {
    deleteCategory(req.params.id, dbRepository)
      .then(() => res.json('category sucessfully deleted!'))
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
      .then((message) => res.json(message))
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
