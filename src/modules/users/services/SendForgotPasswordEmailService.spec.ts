import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let usersRepository: FakeUsersRepository;
let mailProvider: FakeMailProvider;
let tokenRepository: FakeUserTokensRepository;
let recoverPasswordService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail',  () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    mailProvider = new FakeMailProvider();
    tokenRepository = new FakeUserTokensRepository();
    recoverPasswordService = new SendForgotPasswordEmailService(usersRepository, mailProvider, tokenRepository);
  });

  it('should be able to recover the password using the e-mail', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepository.create({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '123456',
    })

    await recoverPasswordService.execute({
      email: "teste@teste.com",
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should throw error on invalid e-mail', async () => {
    await expect(recoverPasswordService.execute({
      email: "teste@teste.com",
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a token for a valid forgotten password request', async () => {
    const generateToken = jest.spyOn(tokenRepository, 'generate');

    await usersRepository.create({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '123456',
    })

    await recoverPasswordService.execute({
      email: "teste@teste.com",
    });

    expect(generateToken).toHaveBeenCalled();
  })
})
