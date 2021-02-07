import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';


interface IRequest {
  user_id: string,
  fileName: string,
}

export default class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ user_id, fileName}: IRequest): Promise<User>{

    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('You\'re not authenticated', 401);
    }

    if (user.avatar) {
      // Delete previous avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;

  }
}
