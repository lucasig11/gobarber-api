import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let usersRepository: FakeUsersRepository;
let tokenRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword',  () => {

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    tokenRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(usersRepository, tokenRepository, fakeHashProvider);
  });

  it('should be able to reset the password', async () => {

    const hashFunction = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await usersRepository.create({
      name: "Lucas",
      email: "teste@teste.com",
      password: "1234"
    });

    const {token} = await tokenRepository.generate(user.id);

    await resetPasswordService.execute({
      password: '123456',
      token,
    });

    const updatedUser = await usersRepository.findByID(user.id);

    expect(updatedUser?.password).toBe('123456');
    expect(hashFunction).toHaveBeenCalledWith('123456');
  });

  it('should throw error on invalid token', async () => {
    await expect(resetPasswordService.execute({
      password: '123456',
      token: 'invalidToken',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error on invalid user_id', async () => {

    const {token} = await tokenRepository.generate('invalid_user');

    await expect(resetPasswordService.execute({
      password: '123456',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });


  it('should not accept 2-hour old+ tokens', async () => {
    const user = await usersRepository.create({
      name: "Lucas",
      email: "teste@teste.com",
      password: "1234"
    });

    const {token} = await tokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.execute({
      password: '123456',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });
})
