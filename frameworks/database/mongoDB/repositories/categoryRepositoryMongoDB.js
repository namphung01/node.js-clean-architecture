import CategoryModel from '../models/category';

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function categoryRepositoryMongoDB() {
  const findAll = (params) =>
    CategoryModel.find(omit(params, 'page', 'perPage'))
      .populate('userId', 'username email')
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    CategoryModel.countDocuments(omit(params, 'page', 'perPage'));

  const findById = (id) =>
    CategoryModel.findById(id).populate('userId', 'username email');

  const add = (categoryEntity) => {
    const newCategory = new CategoryModel({
      title: categoryEntity.getTitle(),
      createdAt: new Date(),
      isPublished: categoryEntity.isPublished(),
      userId: categoryEntity.getUserId()
    });

    return newCategory.save();
  };

  const updateById = (id, categoryEntity) => {
    const updatedCategory = {
      title: categoryEntity.getTitle(),
      isPublished: categoryEntity.isPublished()
    };

    return CategoryModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedCategory },
      { new: true }
    );
  };

  const deleteById = (id) => CategoryModel.findByIdAndRemove(id);

  return {
    findAll,
    countAll,
    findById,
    add,
    updateById,
    deleteById
  };
}
