import findAll from '../../application/use_cases/wallet/findAll';
import addWallet from '../../application/use_cases/wallet/add';
import findById from '../../application/use_cases/wallet/findById';
import updateById from '../../application/use_cases/wallet/updateById';
import deleteWallet from '../../application/use_cases/wallet/deleteΒyId';
import ResponseService from '../../frameworks/webserver/middlewares/responseService';

export default function walletController(
  walletDbRepository,
  walletDbRepositoryImpl
) {
  const dbRepository = walletDbRepository(walletDbRepositoryImpl());

  const fetchAllWallets = (req, res, next) => {
    // wallet
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

  const fetchWalletById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      // eslint-disable-next-line no-shadow
      .then((wallet) => {
        if (!wallet) {
          throw new Error(`No wallet found with id: ${req.params.id}`);
        }
        return ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: wallet
        });
      })
      .catch((error) => next(error));
  };

  const addNewWallet = (req, res, next) => {
    const { name, userId } = req.body;

    addWallet({
      name,
      userId: userId ?? req.user.id,
      walletRepository: dbRepository
    })
      // eslint-disable-next-line no-shadow
      .then((wallet) =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: wallet
        })
      )
      .catch((error) => next(error));
  };

  const deleteWalletById = (req, res, next) => {
    deleteWallet(req.params.id, dbRepository)
      .then(() =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: ''
        })
      )
      .catch((error) => next(error));
  };

  const updateWalletById = (req, res, next) => {
    const { name, amount } = req.body;

    updateById({
      id: req.params.id,
      name,
      balance: amount,
      walletRepository: dbRepository
    })
      // eslint-disable-next-line no-shadow
      .then((wallet) =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('success'),
          data: wallet
        })
      )
      .catch((error) => next(error));
  };

  return {
    fetchAllWallets,
    addNewWallet,
    fetchWalletById,
    updateWalletById,
    deleteWalletById
  };
}
