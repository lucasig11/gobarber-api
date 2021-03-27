import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@users/services/UpdateProfileService';
import ShowProfileService from '@users/services/ShowProfileService';

interface ISafeResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
  password?: string;
}

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    const safeResponse: ISafeResponse = user;
    delete safeResponse.password;

    return response.json(safeResponse);
  }
}
