import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUser',  () => {

  it('should update user\'s avatar', async () => {
    const UsersRepository = new FakeUsersRepository();
    const StorageProvider = new FakeStorageProvider();
    const UpdateAvatar = new UpdateUserAvatarService(UsersRepository, StorageProvider);

    const user = await UsersRepository.create({
      name: "Lucas",
      email: "teste@teste.com",
      password: "1234"
    });

    await UpdateAvatar.execute({
      fileName: 'avatar.jpg',
      user_id: user.id
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should throw error if user is not authenticated', async () => {
    const UsersRepository = new FakeUsersRepository();
    const StorageProvider = new FakeStorageProvider();
    const UpdateAvatar = new UpdateUserAvatarService(UsersRepository, StorageProvider);

    expect(async () => {
      await UpdateAvatar.execute({
        fileName: 'avatar.jpg',
        user_id: '13'
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should delete previous avatar if user had one', async () => {
    const UsersRepository = new FakeUsersRepository();
    const StorageProvider = new FakeStorageProvider();
    const UpdateAvatar = new UpdateUserAvatarService(UsersRepository, StorageProvider);

    const deleteFile = jest.spyOn(StorageProvider, 'deleteFile');

    const user = await UsersRepository.create({
      name: "Lucas",
      email: "teste@teste.com",
      password: "1234"
    });

    await UpdateAvatar.execute({
      fileName: 'avatar.jpg',
      user_id: user.id
    });

    await UpdateAvatar.execute({
      fileName: 'avatar2.jpg',
      user_id: user.id
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  })
})
