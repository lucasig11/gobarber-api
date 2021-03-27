import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let UsersRepository: FakeUsersRepository;
let StorageProvider: FakeStorageProvider;
let UpdateAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    UsersRepository = new FakeUsersRepository();
    StorageProvider = new FakeStorageProvider();
    UpdateAvatar = new UpdateUserAvatarService(
      UsersRepository,
      StorageProvider,
    );
  });

  it("should update user's avatar", async () => {
    const user = await UsersRepository.create({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '1234',
    });

    await UpdateAvatar.execute({
      fileName: 'avatar.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should throw error if user is not authenticated', async () => {
    await expect(
      UpdateAvatar.execute({
        fileName: 'avatar.jpg',
        user_id: '13',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete previous avatar if user had one', async () => {
    const deleteFile = jest.spyOn(StorageProvider, 'deleteFile');

    const user = await UsersRepository.create({
      name: 'Lucas',
      email: 'teste@teste.com',
      password: '1234',
    });

    await UpdateAvatar.execute({
      fileName: 'avatar.jpg',
      user_id: user.id,
    });

    await UpdateAvatar.execute({
      fileName: 'avatar2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
