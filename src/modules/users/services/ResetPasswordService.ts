import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
// import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
// import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  password: string,
  token: string,
}

@injectable()
export default class ResetPasswordService {
  constructor(
    // Dependency injection
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private userTokensRepository: IUsersTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Invalid token.')
    }

    const user = await this.usersRepository.findByID(userToken.user_id);

    if (!user) {
      throw new AppError('User not found.')
    }


    if (differenceInHours(Date.now(), userToken.created_at) > 2) {
      throw new AppError('This token has expired.')
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}
