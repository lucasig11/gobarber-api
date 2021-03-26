import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser',  () => {

  it('should be able to create a new user', async () => {
    const UsersRepository = new FakeUsersRepository();
    const HashProvider = new FakeHashProvider();

    const CreateUser = new CreateUserService(UsersRepository, HashProvider);

    const user = await CreateUser.execute({
      name: "Lucas",
      email: "teste@teste.com",
      password: "1234"
    });

    expect(user).toHaveProperty('id');
  });

  it('should throw error on e-mail collision', async () => {
    const UsersRepository = new FakeUsersRepository();
    const HashProvider = new FakeHashProvider();

    const CreateUser = new CreateUserService(UsersRepository, HashProvider);
    const userEmail = "teste@teste.com";

    await CreateUser.execute({
      name: "Lucas",
      email: userEmail,
      password: "1234"
    });

    await expect(CreateUser.execute({
      name: "Lucas",
      email: userEmail,
      password: "1234"
    })).rejects.toBeInstanceOf(AppError);
  });

})
