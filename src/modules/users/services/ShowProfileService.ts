import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

interface ISafeResponse {
  id: string;
  name: string;
  password?: string;
  email: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<ISafeResponse> {
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User not found.', 401);
    }

    const safeResponse: ISafeResponse = user;

    delete safeResponse.password;

    return safeResponse;
  }
}
