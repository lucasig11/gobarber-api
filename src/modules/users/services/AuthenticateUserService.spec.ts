import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('Authenticate user',  () => {

  it('should be able to authenticate', async () => {
    const UsersRepository = new FakeUsersRepository();
    const HashProvider = new FakeHashProvider();

    const AuthenticateUser = new AuthenticateUserService(UsersRepository, HashProvider);
    const CreateUser = new CreateUserService(UsersRepository, HashProvider);

    await CreateUser.execute({
      name: "Lucas",
      email: "teste@teste.com",
      password: "12345"
    });

    const response = await AuthenticateUser.execute({
      email: "teste@teste.com",
      password: "12345"
    });

    expect(response).toHaveProperty('token')
  });

  it('should throw error on invalid user', async () => {
    const UsersRepository = new FakeUsersRepository();
    const HashProvider = new FakeHashProvider();

    const AuthenticateUser = new AuthenticateUserService(UsersRepository, HashProvider);

    await expect(AuthenticateUser.execute({
        email: "teste@teste.com",
        password: "12345"
      })).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error on password mismatch', async () => {
    const UsersRepository = new FakeUsersRepository();
    const HashProvider = new FakeHashProvider();

    const AuthenticateUser = new AuthenticateUserService(UsersRepository, HashProvider);
    const CreateUser = new CreateUserService(UsersRepository, HashProvider);

    await CreateUser.execute({
      name: "Lucas",
      email: "teste@teste.com",
      password: "54321"
    });

    await expect(AuthenticateUser.execute({
      email: "teste@teste.com",
      password: "12345"
    })).rejects.toBeInstanceOf(AppError);
  });

})
