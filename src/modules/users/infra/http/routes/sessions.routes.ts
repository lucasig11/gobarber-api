import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@users/services/AuthenticateUserService';

interface ISafeResponse {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = container.resolve(AuthenticateUserService);

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  const safeResponse:ISafeResponse = user;
  delete safeResponse.password;

  return response.json({ safeResponse, token });
});

export default sessionsRouter;
