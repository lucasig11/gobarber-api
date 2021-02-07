import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import UsersRepository from '@users/infra/typeorm/repositories/UsersRepository'
import CreateUserService from '@users/services/CreateUserService';
import UpdateUserAvatarService from '@users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface SafeResponse {
  name: string,
  email: string,
}

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const usersRepository = new UsersRepository();

  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  const Response: SafeResponse = {
    name,
    email,
  }

  return response.json(Response);
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
  const usersRepository = new UsersRepository();

  const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

  const user = await updateUserAvatar.execute({
    user_id: request.user.id,
    fileName: request.file.filename,
  })

  // delete user.password;

  return response.json(user);
})

export default usersRouter;
