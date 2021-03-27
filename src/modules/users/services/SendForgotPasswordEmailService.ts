import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string,
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    // Dependency injection
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const {token} = await this.userTokensRepository.generate(user.id)

    await this.mailProvider.sendMail({
      subject: 'Recuperação de senha.',
      to: {
        name: user.name,
        email: user.email,
      },
      templateData: {
        template: "Olá {{name}}, seu token é {{token}}",
        variables: {
          name: user.name,
          token: token,
        }
      }
    });
  }
}
