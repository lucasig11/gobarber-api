import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      fileName: request.file.filename,
    });

    return response.status(204).json(classToClass(user));
  }
}
