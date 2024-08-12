import login from '../../application/use_cases/auth/login';
import ResponseService from '../../frameworks/webserver/middlewares/responseService';

export default function authController(
  userDbRepository,
  userDbRepositoryImpl,
  authServiceInterface,
  authServiceImpl
) {
  const dbRepository = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const loginUser = (req, res, next) => {
    const { email, password } = req.body;
    login(email, password, dbRepository, authService)
      .then((token) =>
        ResponseService.success(res, {
          // eslint-disable-next-line no-underscore-dangle
          message: res.__('login_success'),
          data: token
        })
      )
      .catch((err) => next(err));
  };
  return {
    loginUser
  };
}
