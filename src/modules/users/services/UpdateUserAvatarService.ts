import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string,
  fileName: string,
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, fileName}: IRequest): Promise<User>{
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('You\'re not authenticated', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const file = await this.storageProvider.saveFile(fileName);

    user.avatar = file;
    await this.usersRepository.save(user);

    return user;
  }
}
