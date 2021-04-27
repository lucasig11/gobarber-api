import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let AuthenticateUser: AuthenticateUserService;

describe('Authenticate user', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    AuthenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await fakeUsersRepository.create({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '12345',
    });

    const response = await AuthenticateUser.execute({
      email: 'teste@teste.com',
      password: '12345',
    });

    expect(response).toHaveProperty('token');
  });

  it('should throw error on invalid user', async () => {
    await expect(
      AuthenticateUser.execute({
        email: 'teste@teste.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw an error on password mismatch', async () => {
    await fakeUsersRepository.create({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '54321',
    });

    await expect(
      AuthenticateUser.execute({
        email: 'teste@teste.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
