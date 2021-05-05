import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let createUser: CreateUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should throw error on e-mail collision', async () => {
    const userEmail = 'teste@teste.com';

    await createUser.execute({
      name: 'Lucas',
      email: userEmail,
      password: '1234',
    });

    await expect(
      createUser.execute({
        name: 'Lucas',
        email: userEmail,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
