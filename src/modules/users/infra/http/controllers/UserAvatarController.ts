import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@users/services/UpdateUserAvatarService';

interface ISafeResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
  password?: string;
}

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      fileName: request.file.filename,
    })

    const safeResponse:ISafeResponse = user;

    return response.json(safeResponse);
  }
}
