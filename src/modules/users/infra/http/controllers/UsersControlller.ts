import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@users/services/CreateUserService';

interface ISafeResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
  password?: string;
}

export default class UsersControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const safeResponse:ISafeResponse = user;
    delete safeResponse.password;

    return response.json(safeResponse);
  }
}
