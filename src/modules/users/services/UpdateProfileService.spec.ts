import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import User from '../infra/typeorm/entities/User';

let usersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;
let user: User;

describe('UpdateProfile', () => {
  beforeEach(async () => {
    usersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      usersRepository,
      fakeHashProvider,
    );

    user = await usersRepository.create({
      name: 'TestUser',
      email: 'test@test.com',
      password: '1234',
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
        name: 'newName',
        user_id: 'randomUserID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error on invalid old password', async () => {
    await expect(
      updateProfileService.execute({
        email: 'updated@teste.com',
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
});
