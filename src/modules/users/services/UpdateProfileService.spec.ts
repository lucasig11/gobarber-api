import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import User from '../infra/typeorm/entities/User';

let usersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;
let fakeCacheProvider: FakeCacheProvider;
let user: User;
let user2: User;

describe('UpdateProfile', () => {
  beforeEach(async () => {
    usersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    updateProfileService = new UpdateProfileService(
      usersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    user = await usersRepository.create({
      name: 'TestUser',
      email: 'test@test.com',
      password: '1234',
    });

    user2 = await usersRepository.create({
      name: 'TestUser',
      email: 'test2@test.com',
      password: '5678',
    });
  });

  it('should be able to update the profile', async () => {
    const profile = await updateProfileService.execute({
      email: 'updated@teste.com',
      name: 'newName',
      user_id: user.id,
      password: 'newPassword',
      old_password: '1234',
    });

    expect(profile.name).toBe('newName');
    expect(profile.email).toBe('updated@teste.com');
  });

  it('should throw error on e-mail collision', async () => {
    await expect(
      updateProfileService.execute({
        email: user.email,
        name: 'TestUser2',
        user_id: user2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error on invalid user id', async () => {
    await expect(
      updateProfileService.execute({
        email: user.email,
        name: 'InvalidUserIDName',
        user_id: 'invalidID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error on invalid old password', async () => {
    await expect(
      updateProfileService.execute({
        email: user.email,
        name: 'newName',
        user_id: user.id,
        password: 'newPassword',
        old_password: 'invalid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error if missing old password', async () => {
    await expect(
      updateProfileService.execute({
        email: 'updated@teste.com',
        name: 'newName',
        user_id: user.id,
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update the password if we do not send a new one', async () => {
    const profile = await updateProfileService.execute({
      email: 'updated@teste.com',
      name: 'newName',
      user_id: user.id,
      old_password: user.password,
    });

    expect(profile.password).toBe('1234');
  });
});
